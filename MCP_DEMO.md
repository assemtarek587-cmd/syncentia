# MCP Server Demo (Postman)

## 1) Install / start the server
This repo includes `blackbox_mcp_settings.json` configured for the Postman MCP server using `npx`.

If you use the local server, you must set a Postman API key via environment variable:

- Windows (PowerShell):
  - `$env:POSTMAN_API_KEY="<YOUR_KEY>"`

## 2) Demonstrate capabilities
Run one tool call by starting the server and issuing an MCP request.

Recommended: use `@postman/postman-mcp-server` “minimal” toolset for faster startup.

> Note: exact demo command depends on the MCP host integration.


