import { client } from "../mongo/client";
import { BaseTool, ToolParams } from "./base";

export interface InsertParams extends ToolParams {
  collection: string;
  document: Document;
}

export class InsertDocumentTool extends BaseTool<InsertParams> {
  name = "insert_document";
  description = "Insert a document into a collection";
  inputSchema = {
    type: "object" as const,
    properties: {
      collection: {
        type: "string",
        description: "Name of the collection to insert the document into",
      },
      document: {
        type: "object",
        description: "Document to insert",
        default: {},
      },
    },
    required: ["collection", "document"],
  };

  async execute(params: InsertParams) {
    try {
      const collection = this.validateCollection(params.collection);
      const results = await client
        ?.db()
        .collection(collection)
        .insertOne(params.document);

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