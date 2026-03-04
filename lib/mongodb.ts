import { MongoClient, MongoClientOptions } from 'mongodb';

MONGODB_URI="mongodb+srv://Vercel-Admin-cookbook-database-2:SCX21F1Ho0aGurw0@cookbook-database-2.qi2avgg.mongodb.net/?retryWrites=true&w=majority";

//const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  appName: "devrel.nextjs.starter",
};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise; 
