import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    console.log("MONGODB_URI:", process.env.MONGODB_URI);
    try {
        if (mongoose.connection.readyState) return;
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        throw new Error("Failed to connect to the database");
    }
};