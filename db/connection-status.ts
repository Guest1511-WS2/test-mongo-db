import clientPromise from '@/lib/mongodb';

export async function dbConnectionStatus() {
  if (!process.env.MONGODB_URI) {
    return "No MONGODB_URI environment variable";
  }
  if (!clientPromise) {
    return "Database client not initialized";
  }
  try {
    const client = await clientPromise;
    const db = client.db("cooking_inventory");
    const result = await db.command({ ping: 1 });
    console.log("MongoDB connection successful:", result);
    return db + " connected";
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return "Database not connected";
  }
}
