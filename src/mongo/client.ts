import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;

export async function connectMongoDB(databaseUrl: string) {
  try {
    client = new MongoClient(databaseUrl);
    await client.connect();
    console.log(`Connected to database: ${client.db().databaseName}`);
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