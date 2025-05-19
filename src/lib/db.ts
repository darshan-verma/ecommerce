import mongoose from "mongoose";

export const connectDB = async (): Promise<typeof mongoose> => {
	if (mongoose.connection.readyState) {
		console.log("Using existing database connection");
		return mongoose;
	}

	if (!process.env.MONGODB_URI) {
		throw new Error("MONGODB_URI environment variable is not defined");
	}

	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		console.log("Database connected successfully");
		return conn;
	} catch (error) {
		console.error("Database connection error:", error);
		throw new Error("Failed to connect to the database");
	}
};
