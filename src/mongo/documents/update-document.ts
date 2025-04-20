import { client } from "../client";
import { Document } from "mongodb";

export async function updateDocument(
  collectionName: string,
  filter: Document,
  update: Document
): Promise<Document> {
  if (!client) {
    throw new Error("Client not initialized");
  }
  const db = client.db();
  const collection = db.collection(collectionName);
  const results = await collection.updateOne(filter, update);
  return results;
}
