import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;

export async function connectMongoDB(databaseUrl: string, dbName: string, collectionName: string) {
  try {
    if (!databaseUrl || !dbName || !collectionName) {
      throw new Error("Something is missing");
    }

    const client: MongoClient = new MongoClient(databaseUrl);
    await client.connect();
    
    const db: Db = client.db(dbName);
    console.log(`Connected to database: ${dbName}`);

    const collection = db.collection(collectionName);
    return collection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function closeMongoDB(client: MongoClient | null) {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  } else {
    console.warn("MongoDB client was not initialized.");
  }
}

export { client };