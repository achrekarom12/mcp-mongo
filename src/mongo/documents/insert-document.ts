import { client } from "../client";
import { Document } from "mongodb";

export async function insertDocument(
  collectionName: string,
  document: Document
): Promise<Document> {
  if (!client) {
    throw new Error("Client not initialized");
  }
  const db = client.db();
  const collection = db.collection(collectionName);
  const results = await collection.insertOne(document);
  return results;
}
