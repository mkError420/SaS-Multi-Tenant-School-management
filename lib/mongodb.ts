import dns from 'dns';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI?.trim() ?? '';
const dbName = process.env.MONGODB_DB?.trim();

dns.setServers(['8.8.8.8', '8.8.4.4']);

if (!uri) {
  console.warn('MONGODB_URI is not defined. The app will fall back to sample tenant data.');
}

let cachedClient: MongoClient | null = null;

export async function getMongoClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, { serverApi: { version: '1' } });

  try {
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('MongoDB connection failed. Verify MONGODB_URI, network access, DNS resolution, and Atlas IP access list.', error);
    if (uri.startsWith('mongodb+srv://')) {
      throw new Error('MongoDB Atlas SRV connection failed. Check your MongoDB URI, DNS resolution, and firewall/IP access rules.');
    }
    throw error;
  }
}

export async function getDatabase() {
  const client = await getMongoClient();
  return dbName ? client.db(dbName) : client.db();
}
