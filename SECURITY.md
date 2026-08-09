# Security

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