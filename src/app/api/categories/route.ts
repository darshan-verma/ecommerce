import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomBytes } from "crypto";

// Function to generate a random filename
const generateUniqueFilename = (extension: string): string => {
	return `${randomBytes(16).toString("hex")}${extension}`;
};

// Configure where to store uploaded files
const uploadDir = path.join(process.cwd(), "public", "uploads", "categories");

// Ensure upload directory exists
const ensureUploadDir = async () => {
	if (!existsSync(uploadDir)) {
		await mkdir(uploadDir, { recursive: true });
	}
};

// Connect to database
await connectDB().catch((error) => {
	console.error("Database connection error:", error);
	throw new Error("Failed to connect to the database");
});

// Ensure uploads directory exists on server start
ensureUploadDir().catch(console.error);

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
	try {
		// Check authentication
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Ensure upload directory exists
		await ensureUploadDir();

		// Parse form data
		const formData = await request.formData();
		const name = formData.get("name") as string;
		const description = formData.get("description") as string;
		const imageFile = formData.get("image") as File | null;

		// Validate required fields
		if (!name) {
			return NextResponse.json(
				{ success: false, message: "Category name is required" },
				{ status: 400 }
			);
		}

		// Handle file upload if present
		let imageUrl = "";
		if (imageFile && imageFile.size > 0) {
			try {
				const fileExtension = path.extname(imageFile.name);
				const fileName = generateUniqueFilename(fileExtension);
				const filePath = path.join(uploadDir, fileName);

				// Validate file type (optional)
				const allowedTypes = [".jpg", ".jpeg", ".png", ".webp"];
				if (!allowedTypes.includes(fileExtension.toLowerCase())) {
					return NextResponse.json(
						{
							success: false,
							message:
								"Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.",
						},
						{ status: 400 }
					);
				}

				// Validate file size (e.g., 5MB max)
				const maxSize = 5 * 1024 * 1024; // 5MB
				if (imageFile.size > maxSize) {
					return NextResponse.json(
						{
							success: false,
							message: "File is too large. Maximum size is 5MB.",
						},
						{ status: 400 }
					);
				}

				// Convert file to buffer and save
				const bytes = await imageFile.arrayBuffer();
				const buffer = Buffer.from(bytes);
				await writeFile(filePath, buffer);

				// Set the URL to be stored in the database
				imageUrl = `/uploads/categories/${fileName}`;
			} catch (error) {
				console.error("Error saving file:", error);
				return NextResponse.json(
					{ success: false, message: "Error processing the uploaded file" },
					{ status: 500 }
				);
			}
		}

		// Create new category
		const category = new Category({
			name,
			description: description || "",
			image: imageUrl,
			slug: name
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^\w-]+/g, ""),
			isActive: true,
		});

		await category.save();

		return NextResponse.json(
			{
				success: true,
				data: category,
				message: "Category created successfully",
			},
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("Error creating category:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Error creating category",
				error:
					process.env.NODE_ENV === "development" ? error.message : undefined,
			},
			{ status: 500 }
		);
	}
}
