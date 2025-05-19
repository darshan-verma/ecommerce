import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import path from "path";
import { existsSync } from "fs";
import { mkdir, writeFile, unlink } from "fs/promises";
import { randomBytes } from "crypto";

// Connect to database
await connectDB().catch((error) => {
	console.error("Database connection error:", error);
	throw new Error("Failed to connect to the database");
});

// GET /api/categories/[id]
export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const category = await Category.findById(params.id);
		if (!category) {
			return NextResponse.json(
				{ success: false, message: "Category not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json({ success: true, data: category });
	} catch (error) {
		console.error("Error fetching category:", error);
		return NextResponse.json(
			{ success: false, message: "Error fetching category" },
			{ status: 500 }
		);
	}
}

// PUT /api/categories/[id]
export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		// Check authentication
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Find existing category
		const existingCategory = await Category.findById(params.id);
		if (!existingCategory) {
			return NextResponse.json(
				{ success: false, message: "Category not found" },
				{ status: 404 }
			);
		}

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
		let imageUrl = existingCategory.image;
		if (imageFile && imageFile.size > 0) {
			try {
				// Verify the file is a valid image
				if (!imageFile.type.startsWith("image/")) {
					throw new Error("Invalid file type. Please upload an image file.");
				}

				const fileExtension = path.extname(imageFile.name).toLowerCase();
				const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

				if (!allowedExtensions.includes(fileExtension)) {
					throw new Error(
						"Unsupported file format. Please upload a JPG, PNG, or WebP image."
					);
				}

				const fileName = `${randomBytes(16).toString("hex")}${fileExtension}`;

				// Delete old image if it exists
				if (existingCategory.image) {
					try {
						const oldImagePath = path.join(
							process.cwd(),
							"public",
							...existingCategory.image.split("/").filter(Boolean)
						);
						if (existsSync(oldImagePath)) {
							await unlink(oldImagePath);
						}
					} catch (error) {
						console.error("Error deleting old image:", error);
						// Continue even if old image deletion fails
					}
				}

				// Save new image
				const uploadDir = path.join(
					process.cwd(),
					"public",
					"uploads",
					"categories"
				);

				// Ensure upload directory exists
				if (!existsSync(uploadDir)) {
					await mkdir(uploadDir, { recursive: true });
				}

				const newFilePath = path.join(uploadDir, fileName);
				const bytes = await imageFile.arrayBuffer();
				const buffer = Buffer.from(bytes);
				await writeFile(newFilePath, buffer);

				// Ensure the URL is consistent with how Next.js serves static files
				imageUrl = `/uploads/categories/${fileName}`.replace(/\\/g, "/");
			} catch (error) {
				console.error("Detailed image upload error:", error);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Unknown error during image upload";
				return NextResponse.json(
					{
						success: false,
						message: `Error updating category image: ${errorMessage}`,
					},
					{ status: 500 }
				);
			}
		}

		// Update category
		const updatedCategory = await Category.findByIdAndUpdate(
			params.id,
			{
				name,
				description: description || "",
				image: imageUrl,
				slug: name
					.toLowerCase()
					.replace(/\s+/g, "-")
					.replace(/[^\w-]+/g, ""),
			},
			{ new: true }
		);

		return NextResponse.json({
			success: true,
			data: updatedCategory,
			message: "Category updated successfully",
		});
	} catch (error) {
		console.error("Error updating category:", error);
		return NextResponse.json(
			{ success: false, message: "Error updating category" },
			{ status: 500 }
		);
	}
}

// DELETE /api/categories/[id]
export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		// Check authentication
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Find and delete category
		const category = await Category.findByIdAndDelete(params.id);
		if (!category) {
			return NextResponse.json(
				{ success: false, message: "Category not found" },
				{ status: 404 }
			);
		}

		// Delete associated image if it exists
		if (category.image) {
			const filePath = path.join(process.cwd(), "public", category.image);
			if (existsSync(filePath)) {
				await unlink(filePath);
			}
		}

		return NextResponse.json({
			success: true,
			message: "Category deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting category:", error);
		return NextResponse.json(
			{ success: false, message: "Error deleting category" },
			{ status: 500 }
		);
	}
}
