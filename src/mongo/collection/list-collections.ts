import { MongoClient } from "mongodb";

async function listCollections(client: MongoClient) {
    const db = client.db();
    const collections = await db.listCollections().toArray();
    return collections;
}

export default listCollections;