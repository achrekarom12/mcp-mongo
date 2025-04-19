import { client } from "../client";

async function listCollections() {
    if (!client) {
        throw new Error("Client not initialized");
    }
    const db = client.db();
    const collections = await db.listCollections().toArray();
    return collections;
}

export default listCollections;