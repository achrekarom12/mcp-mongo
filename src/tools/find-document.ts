import { client } from "../mongo/client";
import { BaseTool, ToolParams } from "./base";

export interface FindParams extends ToolParams {
  collection: string;
  filter?: Record<string, unknown>;
  limit?: number;
  projection?: Record<string, unknown>;
}

export class FindDocumentTool extends BaseTool<FindParams> {
  name = "find_document";
  description = "Query documents in a collection using MongoDB query syntax";
  inputSchema = {
    type: "object" as const,
    properties: {
      collection: {
        type: "string",
        description: "Name of the collection to query",
      },
      filter: {
        type: "object",
        description: "MongoDB query filter",
        default: {},
      },
      limit: {
        type: "number",
        description: "Maximum documents to return",
        default: 10,
        minimum: 1,
        maximum: 1000,
      },
      projection: {
        type: "object",
        description: "Fields to include/exclude",
        default: {},
      },
    },
    required: ["collection"],
  };

  async execute(params: FindParams) {
    try {
      const collection = this.validateCollection(params.collection);
      const results = await client
        ?.db()
        .collection(collection)
        .find(params.filter || {})
        .project(params.projection || {})
        .limit(Math.min(params.limit || 10, 1000))
        .toArray();

      return {
        content: [
          { type: "text" as const, text: JSON.stringify(results, null, 2) },
        ],
        isError: false,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}