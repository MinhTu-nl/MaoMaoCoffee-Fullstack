import mongoose from "mongoose";

// Keep a cached connection across invocations (serverless safe)
let cached = global._mongooseCachedConnection;
if (!cached) {
    cached = global._mongooseCachedConnection = { conn: null, promise: null };
}

const connectDB = async () => {
    try {
        if (cached.conn) {
            return cached.conn;
        }

        if (!cached.promise) {
            const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
            if (!mongoUri) {
                throw new Error('MongoDB connection string is not defined. Please set MONGODB_URI.');
            }
            cached.promise = mongoose
                .connect(mongoUri)
                .then((mongooseInstance) => mongooseInstance);
        }

        cached.conn = await cached.promise;
        console.log('MONGODB CONNECT SUCCESSFULLY!');
        return cached.conn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

export default connectDB;