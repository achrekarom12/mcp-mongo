import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { connectMongoDB } from "./mongo/client";
import { config } from "dotenv";

config();

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
  console.log("mcp-mongo running on stdio");
  await connectMongoDB(process.env.MONGO_URL || "", process.env.MONGO_DB || "", process.env.MONGO_COLLECTION || "");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
