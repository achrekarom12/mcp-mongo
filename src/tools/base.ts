import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

// type of the response that will be returned by the tool
export interface ToolResponse {
  content: {
    type: "text";
    text: string;
  }[];
  isError: boolean;
  _meta?: Record<string, unknown>;
}

// type of the parameters that will be passed to the tool
export type ToolParams = Record<string, unknown>

export abstract class BaseTool<T extends ToolParams = ToolParams> {
  abstract name: string;             // name of the tool
  abstract description: string;      // description of the tool 
  abstract inputSchema: {          // schema of the tool input
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  
  // execute is the main function that will be called when the tool is used
  abstract execute(params: T): Promise<ToolResponse>;

  // validateCollection is a helper function that will be used to validate the collection name
  protected validateCollection(collection: unknown): string {
    if (typeof collection !== "string") {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Collection name must be a string, got ${typeof collection}`
      );
    }
    return collection;
  }

  protected handleError(error: unknown): ToolResponse {
    return {
      content: [
        {
          type: "text",
          text: error instanceof Error ? error.message : String(error),
        },
      ],
      isError: true,
    };
  }
}