import { client } from "../client";
import { Document } from "mongodb";

export async function findDocuments(
  collectionName: string,
  filter: Record<string, unknown> = {}
): Promise<Document[]> {
  if (!client) {
    throw new Error("Client not initialized");
  }
  const db = client.db();
  const collection = db.collection(collectionName);
  const results = await collection.find(filter).toArray();
  return results;
}
