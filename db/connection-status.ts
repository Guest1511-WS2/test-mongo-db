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
    let users = db.collection("cooking_inventory_users");
    let ingredients = db.collection("ingredientInventory");
    let recipes = db.collection("recipesInventory");
    const result = await ingredients
      .find({})
      .project({
        name: 0,
        amount: 0,
        unit: 0,
      })
      .limit(1)
      .toArray();
    console.log(result);
    console.log("MongoDB connection successful");
    return "Database connected";
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return "Database not connected";
  }
}
