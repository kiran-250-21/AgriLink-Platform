const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agrilink';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`[MongoDB Error] Failed to connect: ${error.message}`);
      process.exit(1);
    } else {
      console.warn(`[MongoDB Warning] Direct connection to ${uri} failed (${error.message}).`);
      console.log(`[MongoDB Dev Fallback] Spawning in-memory MongoDB instance for local testing...`);
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`[MongoDB Memory Server] Connected successfully: ${memUri}`);
      } catch (memErr) {
        console.error('[MongoDB Fatal Error]', memErr.message);
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
