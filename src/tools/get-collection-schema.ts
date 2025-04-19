import { client } from "../mongo/client";
import { BaseTool, ToolParams } from "./base";
import { getCollectionSchema } from "../mongo/schema";
import { Collection, Document } from "mongodb";

export interface GetCollectionSchemaParams extends ToolParams {
  collection: string;
}

export class GetCollectionSchemaTool extends BaseTool<GetCollectionSchemaParams> {
  name = "get_collection_schema";
  description = "Get the schema of a collection";
  inputSchema = {
    type: "object" as const,
    properties: {
      collection: {
        type: "string",
        description: "Name of the collection to query",
      },    
    },
    required: ["collection"],
  };

  async execute(params: GetCollectionSchemaParams) {
    try {
      const collection = this.validateCollection(params.collection);
      const schema = await getCollectionSchema(client?.db().collection(collection) as Collection<Document>);

      return {
        content: [
          { type: "text" as const, text: JSON.stringify(schema, null, 2) },
        ],
        isError: false,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}