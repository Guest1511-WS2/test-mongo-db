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
    declare users = db.collection("cooking_inventory_users");
    declare ingredients = db.collection("ingredientInventory");
    declare recipes = db.collection("recipesInventory");
    console.log("MongoDB connection successful");
    const result = await ingredients
      .find({})
      .project({
        name: 0,
        amount: 0,
        unit: 0,
      })
      .limit(10)
      .toArray();
    console.log(ingredients);
    return "Database connected";
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return "Database not connected";
  }
}
