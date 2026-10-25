# JavaScript, TypeScript and React bootcamp

A self-paced bootcamp that takes Python developers to picking up frontend tickets in the team's React apps. You read JavaScript, migrate it to strict TypeScript, and build and fix a React and antd app, with exercises that check themselves and a mentor for when you are stuck.

Everything runs on your own machine. Packages come from the company's Artifactory, so nothing needs the public internet.

## What you need

Check each one in a terminal (PowerShell or cmd). If one is missing or too old, ask your mentor before you start.

| Tool | Check with | You need |
| --- | --- | --- |
| Git | `git --version` | any recent version |
| Node | `node -v` | 24 or newer |
| Yarn | `yarn -v` | 1.x (classic Yarn) |
| Python | `python --version` (or `py --version`) | 3.x |
| An editor | | VS Code is what the lessons show |
| A browser | | Chrome or Edge, for DevTools |

## Get set up (about 30 minutes)

1. **Clone the repo** and go into the `bootcamp` folder. That is where you work for the whole bootcamp.

   ```
   git clone <the repo URL your mentor gives you>
   cd js-ts-react-bootcamp/bootcamp
   ```

2. **Make your own branch**, so your work never lands on `main`:

   ```
   git switch -c student/<your-name>
   ```

3. **Add the team's `.npmrc`.** Ask your mentor for it and save it in the `bootcamp` folder, next to `package.json`. It tells Yarn to download packages from Artifactory. It can hold your access token, so it is git-ignored: never commit it.

4. **Install the packages:**

   ```
   yarn install
   ```

5. **Start the ticket API** in a **second terminal**, also in the `bootcamp` folder, and leave it running:

   ```
   python server/server.py
   ```

   If Windows says `python` is not found, use `py server/server.py`.

6. **Check your setup.** Back in the first terminal:

   ```
   yarn verify 00-setup
   ```

   All four steps should be green. A red step says what to fix.

7. **Open the lessons:**

   ```
   yarn lessons
   ```

   Open the link it prints. Watch **00-start, "Making the most of this bootcamp"** first, then **00-setup**.

8. **Follow [`bootcamp/START-HERE.md`](bootcamp/START-HERE.md).** It has the path through all four phases, how a module works, and what "done" means.

The full setup guide, with what each step does, is [`bootcamp/00-setup/README.md`](bootcamp/00-setup/README.md).

## Every day

Open two terminals in the `bootcamp` folder: one runs the ticket API (`python server/server.py`), the other runs everything else.

| Command | What it does |
| --- | --- |
| `yarn lessons` | Opens the lesson slides |
| `yarn verify <module>` | Checks your exercises, for example `yarn verify 01-js/03` |
| `yarn progress` | Shows every module, what you finished, and what is next |
| `yarn dev <module>` | Runs a React exercise or the final project in the browser |
| `yarn tickets` | Runs your Phase 1 and Phase 2 project code against the API |

Commit your work on your branch as you go (`git add -A` then `git commit -m "01-js/03 done"`). If your mentor wants to see your code, push your branch.

## What is in this repo

| Folder | What it is |
| --- | --- |
| `bootcamp/` | Everything you work in: lessons, exercises, projects, the ticket API |
| `mentor/` | The mentor guide and the solutions. Do not open it: each project builds on your own code, so copying a solution only moves the problem. |
| `docs/` | Design notes for whoever maintains the bootcamp |
| `tools/` | Checks for maintainers: every starter fails, every solution passes |

## When you are stuck

Read the step's message and hint in `yarn verify`, then the lesson slide or README it points to. Still stuck after about 20 minutes on one step? Ask your mentor, and bring the module, the step number and the `yarn verify` output.

Mentors start with [`mentor/guide.md`](mentor/guide.md).
