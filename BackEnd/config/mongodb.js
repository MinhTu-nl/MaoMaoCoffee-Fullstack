import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;

        if (!mongoUri) {
            throw new Error('MongoDB connection string is not defined. Please set MONGODB_URI environment variable.');
        }

        await mongoose.connect(mongoUri);
        console.log('MONGODB CONNECT SUCCESSFULLY!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Don't exit process in production, let Vercel handle it
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
}

export default connectDB;