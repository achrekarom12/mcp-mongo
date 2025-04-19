import { BaseTool, ToolParams, ToolResponse } from "./base";
import listCollections from "../mongo/collection/list-collections"

export class ListCollectionTool extends BaseTool {
  name = "list_collection";
  description = "List all collections in the database";
  inputSchema = {
    type: "object" as const,
    properties: {
      collectionName: { type: "string" },
    },
  };

  async execute(params: ToolParams): Promise<ToolResponse> {
    const collections = await listCollections();
    return {
      content: [
        {
            type: "text" as const,
            text: JSON.stringify(
              collections.map((collection: any) => ({
                name: collection.name,
                type: collection.type,
                size: collection.size,
              })),
              null,
              2
            ),
          },
      ],
      isError: false,
    };
  }
}
