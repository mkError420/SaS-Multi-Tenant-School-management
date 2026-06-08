import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI?.trim() ?? '';
const dbName = process.env.MONGODB_DB?.trim();

if (!uri) {
  console.warn('MONGODB_URI is not defined. The app will fall back to sample tenant data.');
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (uri) {
  const options = { 
    serverApi: { version: '1' as const },
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  };
  if (process.env.NODE_ENV === 'development') {
    if (!globalThis._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      globalThis._mongoClientPromise = client.connect();
    }
    clientPromise = globalThis._mongoClientPromise;
  } else {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export async function getMongoClient() {
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Please configure it in your Vercel settings.');
  }
  try {
    return await clientPromise;
  } catch (error) {
    console.error('MongoDB connection failed. Verify MONGODB_URI and Network Access.', error);
    throw error;
  }
}

export async function getDatabase() {
  const client = await getMongoClient();
  return dbName ? client.db(dbName) : client.db();
}
