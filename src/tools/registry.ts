import { BaseTool } from "./base";
import { ListCollectionTool } from "./list-collection-tool";
import { FindDocumentTool } from "./find-document";
import { GetCollectionSchemaTool } from "./get-collection-schema";
import { McpError, ErrorCode, Tool } from "@modelcontextprotocol/sdk/types.js";

export class ToolRegistry {
  private tools: Map<string, BaseTool<any>> = new Map();

  constructor() {
    this.registerTool(new ListCollectionTool());
    this.registerTool(new GetCollectionSchemaTool());
    this.registerTool(new FindDocumentTool());
  }

  // register a tool into the registry
  registerTool(tool: BaseTool<any>) {
    this.tools.set(tool.name, tool);
  }

  // get a tool from the registry
  getTool(name: string): BaseTool<any> | undefined {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
    return tool;
  }

  // get all tools from the registry
  getAllTools(): BaseTool<any>[] {
    return Array.from(this.tools.values());
  }

  // get all tool schemas from the registry
  getToolSchemas(): Tool[] {
    return this.getAllTools().map((tool) => {
      const inputSchema = tool.inputSchema as any;
      return {
        name: tool.name,
        description: tool.description,
        inputSchema: {
          type: "object",
          properties: inputSchema.properties || {},
          ...(inputSchema.required && { required: inputSchema.required }),
        },
      };
    });
  }
}