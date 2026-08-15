# Security

## Supported Versions

Only this repository (`hibat972-tech/mcp-academy-project`, branch `main`)
is supported. There are no other released versions.

## Reporting an Issue

If you spot a security issue in this project, please report it to the
mentor at [info@nextflows.ai](mailto:info@nextflows.ai) rather than
opening a public GitHub issue.

## What We Hardened (Week 4)

- **Path traversal**: `src/lib/dataFile.ts` resolves file paths under
  `./data` and rejects paths that escape the data directory (for example,
  using `..`). The current fixture filename (`todos.json`) is a hardcoded
  value rather than user-controlled input, so this path-resolution check
  provides defense-in-depth protection for future file-path inputs.

- **Input bounds**: Zod schemas validate user-provided inputs before they
  reach tool logic. For example, `list_tasks` accepts an optional `limit`
  that must be a positive integer with a maximum value of 50. String fields
  such as `id` and `title` have maximum length limits, and fixed values such
  as `priority` are restricted using `.enum()`.

- **Invalid task IDs**: `complete_task` validates the supplied ID against
  the loaded task records. An unknown ID, such as `../etc/passwd`, is
  rejected with a clean "not found" error instead of causing the server
  to crash. This test was verified in MCP Inspector.

- **Malformed data handling**: `todos.json` is parsed and validated with
  `todoListSchema.safeParse()`. Invalid JSON or invalid task records are
  handled as errors instead of allowing malformed data to be used by the
  application.

- **Safe error handling**: Errors returned to the model are kept concise
  and actionable. Internal filesystem paths, stack traces, and detailed
  implementation errors are not intentionally exposed to the model.

- **No secrets**: This project uses no API keys or authentication tokens,
  so there are no secrets that need to be stored in the repository or
  protected from logs and commits.

- **No network calls**: The project only reads and writes a local fixture
  file. It does not make outbound network requests, so SSRF and network
  timeout risks do not apply.