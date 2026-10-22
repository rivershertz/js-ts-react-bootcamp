# Ticket API

A small Python API that the bootcamp's frontend code talks to. It uses only the Python standard library, so there is nothing to install.

```
python server/server.py
```

It listens on `http://localhost:8000`. Data lives in memory and resets every time you restart it.

## Routes

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/api/tickets` | Every ticket |
| GET | `/api/tickets/:id` | One ticket, or 404 |
| POST | `/api/tickets` | Creates a ticket. 201 with the new ticket, or 400 with `{ "errors": [{ "field", "message" }] }` |
| PUT | `/api/tickets/:id` | Replaces a ticket. Same answers as POST, or 404 |
| GET | `/api/assignees` | Every person a ticket can be assigned to |

## A ticket

```json
{
  "id": "t3",
  "title": "Search ignores Hebrew characters",
  "description": "Reported by a customer: search ignores hebrew characters.",
  "priority": "high",
  "status": "blocked",
  "createdAt": "2026-10-14T09:15:00Z",
  "dueDate": "2026-11-02",
  "assignee": "a4",
  "blockedReason": "Needs backend change"
}
```

- `status` is one of `open`, `assigned`, `blocked`, `closed`.
- `priority` is one of `low`, `medium`, `high`, `urgent`.
- `dueDate` can be `null`.
- Only `assigned` and `blocked` tickets always have an `assignee`. A `closed` ticket may have one.
- Only `blocked` tickets have `blockedReason`. Only `closed` tickets have `closedAt`.

## Options for practising

Some exercises ask you to start the server with an option:

| Option | What it does | Used for |
| --- | --- | --- |
| `--delay 1500` | Waits 1.5 s before every answer | Seeing loading states |
| `--fail tickets` | `/api/tickets` answers 500 (also `--fail assignees`) | Error handling, `Promise.allSettled`, retry buttons |
| `--bad-data` | Adds one malformed ticket | Type guards in Phase 2 |
| `--many 2000` | Serves 2000 generated tickets | Performance work in Phase 3 |

Options combine: `python server/server.py --delay 800 --many 2000`.
