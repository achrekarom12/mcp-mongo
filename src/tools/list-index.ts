import { client } from "../mongo/client";
import { BaseTool, ToolParams } from "./base";

interface ListIndexesParams extends ToolParams {
  collection: string;
  [key: string]: unknown;
}

export class ListIndexesTool extends BaseTool<ListIndexesParams> {
  name = "indexes";
  description = "List indexes for a collection";
  inputSchema = {
    type: "object" as const,
    properties: {
      collection: {
        type: "string",
        description: "Name of the collection",
      },
    },
    required: ["collection"],
  };

  async execute(params: ListIndexesParams) {
    try {
      const collection = this.validateCollection(params.collection);
      const indexes = await client
        ?.db()
        .collection(collection)
        .indexes();
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(indexes, null, 2),
          },
        ],
        isError: false,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}