import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";


const server = new McpServer({
  name: "mcp-mongo",
  description: "MongoDB server for Model Context Protocol",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("mcp-mongo running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
