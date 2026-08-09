# Security

## Reporting Issues
This is a student academy project (To-Do List MCP). If you spot a security issue, please open a GitHub Issue on this repo describing the problem — no formal disclosure process is needed for this scope.

## What We Hardened (Week 4)

- **Path traversal**: `src/lib/dataFile.ts` resolves all file paths under `./data` and rejects any path that escapes it (e.g. `..`), verified in Inspector with `id: "../etc/passwd"`.
- **Input bounds**: all Zod schemas enforce `.min()`/`.max()` on string fields (e.g. `id` capped at 100 characters, `title` capped at 200) and `.enum()` for fixed values like `priority`, rejecting oversized or malformed input before it reaches tool logic.
- **Malformed data handling**: `todos.json` is parsed and validated with `todoListSchema.safeParse()` — a corrupted file throws a clear error instead of crashing the server.
- **No secrets**: this project uses no API keys or tokens, so there is nothing to leak in logs or commits.
- **No network calls**: the project only reads/writes a local fixture file, so SSRF and network timeout risks don't apply.