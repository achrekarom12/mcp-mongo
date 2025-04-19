import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { connectMongoDB } from "./mongo/client";
import { config } from "dotenv";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ToolRegistry } from "./tools/registry";

config();

const toolRegistry = new ToolRegistry();

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Please provide a MongoDB connection URL");
  process.exit(1);
}
const databaseUrl = args[0];

const server = new McpServer({
  name: "mcp-mongo",
  version: "1.0.0",
}).server;

server.registerCapabilities({
  resources: {},
  tools: {
    list: true,
    call: true,
  },
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolRegistry.getToolSchemas(),
  _meta: {},
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const name = request.params.name;
  const args = request.params.arguments ?? {};

  try {
    console.error(`Executing tool: ${name}`);
    console.error(`Arguments: ${JSON.stringify(args, null, 2)}`);

    const tool = toolRegistry.getTool(name);
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    const result = await tool.execute(args);
    return { toolResult: result };
  } catch (error) {
    console.error("Operation failed:", error);
    return {
      toolResult: {
        content: [
          {
            type: "text" as const,
            text: (error as Error).message,
          },
        ],
        isError: true,
      },
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  console.log("attemping to connect to mcp-mongo");
  await server.connect(transport);
  console.log("mcp-mongo running on stdio");
  await connectMongoDB(databaseUrl || "");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
