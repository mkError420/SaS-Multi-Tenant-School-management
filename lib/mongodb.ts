import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI?.trim() ?? '';
const dbName = process.env.MONGODB_DB?.trim();

if (!uri) {
  console.warn('MONGODB_URI is not defined. The app will fall back to sample tenant data.');
}

let cachedClient: MongoClient | null = null;

export async function getMongoClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, { serverApi: { version: '1' } });
  await client.connect();
  cachedClient = client;
  return client;
}

export async function getDatabase() {
  const client = await getMongoClient();
  return dbName ? client.db(dbName) : client.db();
}
