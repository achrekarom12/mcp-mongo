import { client } from "../mongo/client";
import { BaseTool, ToolParams } from "./base";

interface DeleteIndexParams extends ToolParams {
  collection: string;
  indexName: string;
  [key: string]: unknown;
}

export class DeleteIndexTool extends BaseTool<DeleteIndexParams> {
  name = "deleteIndex";
  description = "Delete an index from a collection";
  inputSchema = {
    type: "object" as const,
    properties: {
      collection: {
        type: "string",
        description: "Name of the collection",
      },
      indexName: {
        type: "string",
        description: "Name of the index to delete",
      },
    },
    required: ["collection", "indexName"],
  };

  async execute(params: DeleteIndexParams) {
    try {
      const collection = this.validateCollection(params.collection);
      if (typeof params.indexName !== "string") {
        return this.handleError(new Error("Index name must be a string"));
      }

      const result = await client
        ?.db()
        .collection(collection)
        .dropIndex(params.indexName);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
        isError: false,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}