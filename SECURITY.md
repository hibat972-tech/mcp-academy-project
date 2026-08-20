# Security

## Supported Versions

Only this repository (`hibat972-tech/mcp-academy-project`, branch `main`)
is supported. There are no other released versions.

## Reporting an Issue

If you spot a security issue in this project, please report it to the
mentor at [info@nextflows.ai](mailto:info@nextflows.ai) rather than
opening a public GitHub issue.

## What We Hardened (Week 4)

- **Path traversal**: `src/lib/dataFile.ts` resolves all file paths under
  `./data` and rejects any path that escapes it (e.g. `..`), verified in
  Inspector with `id: "../etc/passwd"`.
- **Input bounds**: all Zod schemas enforce `.min()`/`.max()` on string
  fields (e.g. `id` capped at 100 characters, `title` capped at 200) and
  `.enum()` for fixed values like `priority`, rejecting oversized or
  malformed input before it reaches tool logic.
- **Malformed data handling**: `todos.json` is parsed and validated with
  `todoListSchema.safeParse()` — a corrupted file throws a clear error
  instead of crashing the server.
- **No secrets**: this project uses no API keys or tokens, so there is
  nothing to leak in logs or commits.
- **No network calls**: the project only reads/writes a local fixture
  file, so SSRF and network timeout risks don't apply.