import { client } from "../mongo/client";
import { BaseTool, ToolParams } from "./base";

export interface UpdateParams extends ToolParams {
  collection: string;
  filter: Document;
  update: Document;
}

export class UpdateDocumentTool extends BaseTool<UpdateParams> {
  name = "update_document";
  description = "Update a document in a collection";
  inputSchema = {
    type: "object" as const,
    properties: {
      collection: {
        type: "string",
        description: "Name of the collection to insert the document into",
      },
      filter: {
        type: "object",
        description: "MongoDB query filter",
        default: {},
      },
      update: {
        type: "object",
        description: "Document to update",
        default: {},
      },
    },
    required: ["collection", "filter", "update"],
  };

  async execute(params: UpdateParams) {
    try {
      const collection = this.validateCollection(params.collection);
      const results = await client
        ?.db()
        .collection(collection)
        .updateOne(params.filter, params.update);

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
