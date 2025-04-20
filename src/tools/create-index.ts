import { BaseTool, ToolParams } from "./base";
import { IndexDirection } from "mongodb";
import { client } from "../mongo/client";

interface CreateIndexParams extends ToolParams {
  collection: string;
  indexSpec: { [key: string]: IndexDirection };
  [key: string]: unknown;
}

export class CreateIndexTool extends BaseTool<CreateIndexParams> {
  name = "createIndex";
  description = "Create a new index on a collection";
  inputSchema = {
    type: "object" as const,
    properties: {
      collection: {
        type: "string",
        description: "Name of the collection",
      },
      indexSpec: {
        type: "object",
        description:
          "Index specification",
      },
    },
    required: ["collection", "indexSpec"],
  };

  async execute(params: CreateIndexParams) {
    try {
      const collection = this.validateCollection(params.collection);
      const indexName = await client
        ?.db()
        .collection(collection)
        .createIndex(params.indexSpec);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ indexName }, null, 2),
          },
        ],
        isError: false,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}