# Security

<<<<<<< HEAD
## Reporting Issues
This is a student academy project (To-Do List MCP). If you spot a security issue, please open a GitHub Issue on this repo describing the problem — no formal disclosure process is needed for this scope.

## What We Hardened (Week 4)

- **Path traversal**: `src/lib/dataFile.ts` resolves all file paths under `./data` and rejects any path that escapes it (e.g. `..`), verified in Inspector with `id: "../etc/passwd"`.
- **Input bounds**: all Zod schemas enforce `.min()`/`.max()` on string fields (e.g. `id` capped at 100 characters, `title` capped at 200) and `.enum()` for fixed values like `priority`, rejecting oversized or malformed input before it reaches tool logic.
- **Malformed data handling**: `todos.json` is parsed and validated with `todoListSchema.safeParse()` — a corrupted file throws a clear error instead of crashing the server.
- **No secrets**: this project uses no API keys or tokens, so there is nothing to leak in logs or commits.
- **No network calls**: the project only reads/writes a local fixture file, so SSRF and network timeout risks don't apply.
=======
## Supported Versions

Only this repository (`hibat972-tech/mcp-academy-project`, branch `main`)
is supported. There are no other released versions.

## Reporting an Issue

If I find any security issue in the project, I will report it to the mentor through the agreed communication email: [info@nextflows.ai](mailto:info@nextflows.ai)


## Summary of Hardening (Week 4)

### 4.3 Validation, allowlists, timeouts

This project has no fetch tools — all three tools (`add_task`,
`list_tasks`, `complete_task`) only read and write a local file
(`data/todos.json`). Because of that, host allowlisting and network
timeouts do not apply here; there is no outbound network call to
restrict or time out. What does apply — input validation and file
path protection — is already implemented: every tool input is
validated with a Zod schema (length limits, enums for fixed values),
and all file access goes through `dataFile.ts`, which resolves the
path and rejects anything that escapes the `./data` directory.

### 4.4 Secrets & .env

This project does not use API keys, tokens, credentials, or environment
variables. Therefore, there are no secrets or environment variables that
need to be managed. A review of the repository found no committed
credentials or sensitive values.

### Output caps

`list_tasks` enforces a hard cap of 50 items via a Zod `.max(50)` on
its `limit` input, so the model can never request more than that.

### Error messages

All three tools return short, user-facing error messages (e.g.
"Could not add task: ...") and never expose raw stack traces or
internal file paths to the model.
>>>>>>> b5b2629 (week4: add SECURITY.md)
