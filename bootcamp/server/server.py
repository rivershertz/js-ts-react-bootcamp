"""Ticket API for the bootcamp.

Standard library only. Start it with:

    python server/server.py

Options (combine as you like):

    --port 8000            port to listen on
    --delay 1500           wait this many milliseconds before every response
    --fail tickets         answer 500 on /api/tickets (or: assignees)
    --bad-data             add one malformed ticket to the list
    --many 2000            replace the seed tickets with 2000 generated ones

Data lives in memory and resets every time the server restarts.
"""

import argparse
import json
import random
import re
import time
import uuid
from datetime import date, datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

STATUSES = ["open", "assigned", "blocked", "closed"]
PRIORITIES = ["low", "medium", "high", "urgent"]
SEED_PATH = Path(__file__).with_name("seed.json")


def load_seed():
    with SEED_PATH.open(encoding="utf-8") as f:
        return json.load(f)


def generate_tickets(count, assignees):
    rng = random.Random(42)
    tickets = []
    for i in range(count):
        status = rng.choice(STATUSES)
        ticket = {
            "id": f"t{i + 1}",
            "title": f"Generated ticket number {i + 1}",
            "description": "Generated for performance testing.",
            "priority": rng.choice(PRIORITIES),
            "status": status,
            "createdAt": f"2026-{rng.randint(1, 10):02d}-{rng.randint(1, 28):02d}T09:00:00Z",
            "dueDate": None if rng.random() < 0.3 else f"2026-{rng.randint(6, 12):02d}-{rng.randint(1, 28):02d}",
        }
        if status in ("assigned", "blocked"):
            ticket["assignee"] = rng.choice(assignees)["id"]
        if status == "blocked":
            ticket["blockedReason"] = "Waiting for another team"
        if status == "closed":
            ticket["closedAt"] = ticket["createdAt"][:8] + "28T12:00:00Z"
        tickets.append(ticket)
    return tickets


def validate(draft, assignee_ids):
    """Return a list of {field, message} errors; empty when the draft is valid."""
    errors = []
    if not isinstance(draft, dict):
        return [{"field": "body", "message": "Body must be a JSON object"}]
    title = draft.get("title")
    if not isinstance(title, str) or not title.strip():
        errors.append({"field": "title", "message": "Title is required"})
    if draft.get("priority") not in PRIORITIES:
        errors.append({"field": "priority", "message": f"Priority must be one of {', '.join(PRIORITIES)}"})
    status = draft.get("status", "open")
    if status not in STATUSES:
        errors.append({"field": "status", "message": f"Status must be one of {', '.join(STATUSES)}"})
    if status in ("assigned", "blocked") and draft.get("assignee") not in assignee_ids:
        errors.append({"field": "assignee", "message": "An assigned or blocked ticket needs a known assignee"})
    if status == "blocked" and not draft.get("blockedReason"):
        errors.append({"field": "blockedReason", "message": "A blocked ticket needs a reason"})
    due = draft.get("dueDate")
    if due is not None:
        try:
            date.fromisoformat(due)
        except (TypeError, ValueError):
            errors.append({"field": "dueDate", "message": "Due date must look like 2026-12-31"})
    return errors


def normalise(draft, existing=None):
    """Build a stored ticket from a valid draft, keeping only the fields its status allows."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    status = draft.get("status", "open")
    ticket = {
        "id": existing["id"] if existing else f"t-{uuid.uuid4().hex[:8]}",
        "title": draft["title"].strip(),
        "description": draft.get("description", ""),
        "priority": draft["priority"],
        "status": status,
        "createdAt": existing["createdAt"] if existing else now,
        "dueDate": draft.get("dueDate"),
    }
    if status in ("assigned", "blocked") or (status == "closed" and draft.get("assignee")):
        ticket["assignee"] = draft["assignee"]
    if status == "blocked":
        ticket["blockedReason"] = draft["blockedReason"]
    if status == "closed":
        ticket["closedAt"] = (existing or {}).get("closedAt") or now
    return ticket


class State:
    def __init__(self, options):
        seed = load_seed()
        self.options = options
        self.assignees = seed["assignees"]
        if options.many:
            self.tickets = generate_tickets(options.many, self.assignees)
        else:
            self.tickets = seed["tickets"]
        if options.bad_data:
            # Deliberately malformed: priority is a number and createdAt is missing.
            self.tickets.append({"id": "t-bad", "title": "Imported from the old system", "priority": 3, "status": "open"})


class Handler(BaseHTTPRequestHandler):
    state: State = None  # set in main()

    def log_message(self, fmt, *args):
        print(f"{self.command} {self.path} -> {args[1] if len(args) > 1 else ''}")

    def send_json(self, status, body):
        payload = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def read_json(self):
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b""
        try:
            return json.loads(raw or b"null")
        except json.JSONDecodeError:
            return None

    def before(self):
        delay = self.state.options.delay
        if delay:
            time.sleep(delay / 1000)

    def failing(self, route):
        if self.state.options.fail == route:
            self.send_json(500, {"error": f"Simulated failure on /api/{route} (started with --fail {route})"})
            return True
        return False

    def find(self, ticket_id):
        return next((t for t in self.state.tickets if t.get("id") == ticket_id), None)

    def do_GET(self):
        self.before()
        path = self.path.split("?")[0].rstrip("/")
        if path == "/api/tickets":
            if not self.failing("tickets"):
                self.send_json(200, self.state.tickets)
        elif path == "/api/assignees":
            if not self.failing("assignees"):
                self.send_json(200, self.state.assignees)
        elif match := re.fullmatch(r"/api/tickets/([\w-]+)", path):
            ticket = self.find(match.group(1))
            if ticket:
                self.send_json(200, ticket)
            else:
                self.send_json(404, {"error": f"No ticket with id {match.group(1)}"})
        else:
            self.send_json(404, {"error": f"Unknown route {path}"})

    def do_POST(self):
        self.before()
        if self.path.rstrip("/") != "/api/tickets":
            return self.send_json(404, {"error": f"Unknown route {self.path}"})
        draft = self.read_json()
        errors = validate(draft, {a["id"] for a in self.state.assignees})
        if errors:
            return self.send_json(400, {"errors": errors})
        ticket = normalise(draft)
        self.state.tickets.append(ticket)
        self.send_json(201, ticket)

    def do_PUT(self):
        self.before()
        match = re.fullmatch(r"/api/tickets/([\w-]+)", self.path.rstrip("/"))
        if not match:
            return self.send_json(404, {"error": f"Unknown route {self.path}"})
        existing = self.find(match.group(1))
        if not existing:
            return self.send_json(404, {"error": f"No ticket with id {match.group(1)}"})
        draft = self.read_json()
        errors = validate(draft, {a["id"] for a in self.state.assignees})
        if errors:
            return self.send_json(400, {"errors": errors})
        updated = normalise(draft, existing)
        index = self.state.tickets.index(existing)
        self.state.tickets[index] = updated
        self.send_json(200, updated)


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description="Bootcamp ticket API")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--delay", type=int, default=0, help="milliseconds to wait before each response")
    parser.add_argument("--fail", choices=["tickets", "assignees"], help="answer 500 on this route")
    parser.add_argument("--bad-data", action="store_true", help="add one malformed ticket")
    parser.add_argument("--many", type=int, default=0, help="generate this many tickets instead of the seed")
    return parser.parse_args(argv)


def make_server(options):
    handler = type("BoundHandler", (Handler,), {"state": State(options)})
    return ThreadingHTTPServer(("127.0.0.1", options.port), handler)


def main():
    options = parse_args()
    server = make_server(options)
    print(f"Ticket API on http://localhost:{options.port}  (Ctrl+C to stop)")
    extras = [f"--{k.replace('_', '-')} {v}" for k, v in vars(options).items() if v and k != "port"]
    if extras:
        print("Options:", " ".join(extras))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
