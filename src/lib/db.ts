import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
	if (mongoose.connection.readyState) {
		console.log("Using existing database connection");
		return;
	}

	if (!process.env.MONGODB_URI) {
		throw new Error("MONGODB_URI environment variable is not defined");
	}

	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Database connected successfully");
	} catch (error) {
		console.error("Database connection error:", error);
		throw new Error("Failed to connect to the database");
	}
};
