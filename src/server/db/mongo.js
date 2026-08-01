import mongoose from "mongoose";
import { appConfig } from "@/server/config";

const globalWithMongoose = global;

const cached = globalWithMongoose._sahayak_mongoose_cache || (globalWithMongoose._sahayak_mongoose_cache = {
  conn: null,
  promise: null,
});

export async function connectMongo() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(appConfig.mongoUri, {
      dbName: "sahayak",
      autoCreate: true,
      serverSelectionTimeoutMS: 5000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
