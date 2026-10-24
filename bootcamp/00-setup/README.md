# 00 Setup

**Time:** about 30 minutes.

By the end you will have the bootcamp installed, the ticket API running, and a green setup check.

## 1. Tell Yarn where to download packages

Your computer cannot reach the public internet, so packages come from the company's Artifactory. Yarn finds it through a file called `.npmrc`.

1. Ask your mentor for the team's `.npmrc` (or for the Artifactory address and how to log in).
2. Save it as `.npmrc` in this `bootcamp` folder, next to `package.json`.

A typical `.npmrc` has one `registry=` line with the Artifactory address, and sometimes a line with your access token. Never commit a token to git.

## 2. Install

In a terminal (PowerShell or cmd) in the `bootcamp` folder:

```
yarn install
```

This reads `package.json`, downloads every package listed there into `node_modules`, and uses `yarn.lock` to get exactly the versions the bootcamp was tested with. It is like `pip install -r requirements.txt` with every version pinned.

## 3. Start the ticket API

Open a **second** terminal in the `bootcamp` folder and run:

```
python server/server.py
```

If Windows says `python` is not found, use `py server/server.py`. Leave this terminal open all day. You will see a line for every request your code makes.

The API is described in [`server/README.md`](../server/README.md). You never change it.

## 4. Run the setup check

Back in the first terminal:

```
yarn verify 00-setup
```

All four steps should be green. Each red step says what to do.

## 5. Watch the setup lesson

```
yarn lessons
```

Open the link it prints and pick **00-setup**. It explains what a dev server is, why the browser talks to Vite instead of to Python directly, and the tools you will use: VS Code, the browser's DevTools, ESLint and Prettier.

## 6. Keep the cheat sheet open

[`python-to-js.md`](python-to-js.md) is a one-page Python to JavaScript cheat sheet. Keep it in a VS Code tab during Phase 1.

## Commands you will use every day

| Command | What it does |
| --- | --- |
| `yarn lessons` | Opens the lesson slides |
| `yarn verify <module>` | Checks your exercises, for example `yarn verify 01-js/03` |
| `yarn verify <module>/<step>` | Checks one step, for example `yarn verify 01-js/03/2` |
| `yarn progress` | Shows every module, what you finished, and what is next |
| `yarn dev <module>` | Runs a React exercise or the final project in the browser |
| `yarn tickets` | Runs your Phase 1 / Phase 2 ticket code against the API |
