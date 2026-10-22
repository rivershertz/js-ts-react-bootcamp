"""Tests for bootcamp/server/server.py. Run: python -m unittest discover tools/tests"""

import json
import sys
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "bootcamp" / "server"))
import server  # noqa: E402


class ServerCase(unittest.TestCase):
    flags = []

    def setUp(self):
        options = server.parse_args(["--port", "0", *self.flags])
        self.httpd = server.make_server(options)
        self.base = f"http://127.0.0.1:{self.httpd.server_address[1]}"
        threading.Thread(target=self.httpd.serve_forever, daemon=True).start()

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()

    def call(self, method, path, body=None):
        data = json.dumps(body).encode() if body is not None else None
        req = urllib.request.Request(self.base + path, data=data, method=method, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req) as res:
                return res.status, json.loads(res.read())
        except urllib.error.HTTPError as err:
            return err.code, json.loads(err.read())


class DefaultServer(ServerCase):
    def test_lists_seed_tickets_and_assignees(self):
        status, tickets = self.call("GET", "/api/tickets")
        self.assertEqual(status, 200)
        self.assertEqual(len(tickets), 40)
        self.assertEqual({t["status"] for t in tickets}, set(server.STATUSES))
        status, assignees = self.call("GET", "/api/assignees")
        self.assertEqual((status, len(assignees)), (200, 6))

    def test_status_specific_fields(self):
        _, tickets = self.call("GET", "/api/tickets")
        for t in tickets:
            self.assertEqual("assignee" in t, t["status"] in ("assigned", "blocked") or ("assignee" in t and t["status"] == "closed"))
            self.assertEqual("closedAt" in t, t["status"] == "closed")
            self.assertEqual("blockedReason" in t, t["status"] == "blocked")

    def test_get_one_and_404(self):
        self.assertEqual(self.call("GET", "/api/tickets/t1")[1]["id"], "t1")
        self.assertEqual(self.call("GET", "/api/tickets/nope")[0], 404)

    def test_create_reports_every_error(self):
        status, body = self.call("POST", "/api/tickets", {"title": " ", "priority": "huge", "dueDate": "soon"})
        self.assertEqual(status, 400)
        self.assertEqual({e["field"] for e in body["errors"]}, {"title", "priority", "dueDate"})

    def test_create_then_update(self):
        status, created = self.call("POST", "/api/tickets", {"title": "New", "priority": "low"})
        self.assertEqual((status, created["status"]), (201, "open"))
        status, updated = self.call("PUT", f"/api/tickets/{created['id']}", {"title": "New", "priority": "low", "status": "assigned", "assignee": "a1"})
        self.assertEqual((status, updated["assignee"], updated["createdAt"]), (200, "a1", created["createdAt"]))
        self.assertEqual(len(self.call("GET", "/api/tickets")[1]), 41)


class FailFlag(ServerCase):
    flags = ["--fail", "assignees"]

    def test_only_that_route_fails(self):
        self.assertEqual(self.call("GET", "/api/assignees")[0], 500)
        self.assertEqual(self.call("GET", "/api/tickets")[0], 200)


class BadDataFlag(ServerCase):
    flags = ["--bad-data"]

    def test_adds_one_malformed_ticket(self):
        _, tickets = self.call("GET", "/api/tickets")
        self.assertEqual(len(tickets), 41)
        self.assertNotIn("createdAt", tickets[-1])


class ManyFlag(ServerCase):
    flags = ["--many", "2000"]

    def test_generates_tickets(self):
        _, tickets = self.call("GET", "/api/tickets")
        self.assertEqual(len(tickets), 2000)
        self.assertEqual(len({t["id"] for t in tickets}), 2000)


if __name__ == "__main__":
    unittest.main()
