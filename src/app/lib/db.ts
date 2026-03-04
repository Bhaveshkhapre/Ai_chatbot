import mongoose, { Mongoose } from "mongoose";

const mongooseUrl = process.env.MONGO_DB_URL;

if (!mongooseUrl) {
  throw new Error("Mongoose Url is not found");
}

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

let cache = global.mongoose;

if (!cache) {
  cache = global.mongoose = { conn: null, promise: null };
}

const connectDB = async (): Promise<Mongoose> => {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongooseUrl);
  }

  try {
    cache.conn = await cache.promise; 
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
};

export default connectDB;