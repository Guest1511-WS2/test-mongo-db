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
    const users = db.collection("cooking_inventory_users");
    const ingredients = db.collection("ingredientInventory");
    const recipes = db.collection("recipesInventory");
    const result = await users
      .find({})
      .project({
        username: 1,
        email: 1,
        password_hash: 1,
      })
      .limit(10)
      .toArray();
    console.log(result);
    console.log("MongoDB connection successful");
    return "Database connected";
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return "Database not connected";
  }
}
