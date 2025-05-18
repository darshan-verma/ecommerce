import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Connect to database
await connectDB().catch((error) => {
	console.error("Database connection error:", error);
	throw new Error("Failed to connect to the database");
});

// Get all categories
// GET /api/categories
export async function GET() {
	try {
		console.log("Fetching categories...");
		const categories = await Category.find({ isActive: true })
			.sort({ name: 1 })
			.select("-__v");

		console.log(`Found ${categories.length} categories`);
		return NextResponse.json({ success: true, data: categories });
	} catch (error: any) {
		console.error("Error fetching categories:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Error fetching categories",
				error:
					process.env.NODE_ENV === "development" ? error.message : undefined,
			},
			{ status: 500 }
		);
	}
}

// Create a new category
// POST /api/categories
export async function POST(request: Request) {
	console.log("Category creation request received");

	try {
		// Check authentication
		const session = await getServerSession(authOptions);
		console.log(
			"Session data:",
			session ? "Authenticated" : "Not authenticated"
		);

		if (!session?.user) {
			console.warn("Unauthorized access attempt");
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Parse request body
		let body;
		try {
			body = await request.json();
			console.log("Request body:", body);
		} catch (parseError) {
			console.error("Error parsing request body:", parseError);
			return NextResponse.json(
				{ success: false, message: "Invalid request body" },
				{ status: 400 }
			);
		}

		// Validate required fields
		if (!body.name || typeof body.name !== "string") {
			console.warn("Invalid category name:", body.name);
			return NextResponse.json(
				{
					success: false,
					message: "Category name is required and must be a string",
				},
				{ status: 400 }
			);
		}

		// Check if category already exists
		console.log(`Checking if category '${body.name}' exists...`);
		const existingCategory = await Category.findOne({ name: body.name.trim() });
		if (existingCategory) {
			console.warn(`Category '${body.name}' already exists`);
			return NextResponse.json(
				{ success: false, message: "Category already exists" },
				{ status: 400 }
			);
		}

		// Create new category
		console.log("Creating new category...");
		const categoryData = {
			name: body.name.trim(),
			description: body.description?.trim() || "",
			slug: body.name.trim().toLowerCase().replace(/\s+/g, "-"),
			isActive: true,
		};

		console.log("Category data to save:", categoryData);
		const category = await Category.create(categoryData);
		console.log("Category created successfully:", category._id);

		return NextResponse.json(
			{
				success: true,
				message: "Category created successfully",
				data: category,
			},
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("Error in category creation:", error);
		return NextResponse.json(
			{
				success: false,
				message: error.message || "Error creating category",
				stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
			},
			{ status: 500 }
		);
	}
}
