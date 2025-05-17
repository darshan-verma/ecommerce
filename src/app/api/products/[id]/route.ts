import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

// Get product by ID
// GET /api/products/[id]
export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		console.log("Connecting to DB...");
		await connectDB();
		console.log("Connected to DB");

		console.log("Received ID:", params.id);

		if (!mongoose.Types.ObjectId.isValid(params.id)) {
			console.log("Invalid ID format:", params.id);
			return NextResponse.json(
				{ error: "Invalid product ID format" },
				{ status: 400 }
			);
		}

		console.log("Searching for product with ID:", params.id);
		const product = await Product.findById(params.id);
		console.log("Found product:", product);

		if (!product) {
			console.log("Product not found");
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		return NextResponse.json(product);
	} catch (error) {
		console.error("Error in GET /api/products/[id]:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch product",
				details:
					process.env.NODE_ENV === "development"
						? error instanceof Error
							? error.message
							: String(error)
						: undefined,
			},
			{ status: 500 }
		);
	}
}

// Update product
// PUT /api/products/[id]
export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await connectDB();

		const body = await request.json();

		let product = await Product.findById(params.id);

		if (!product) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		product = await Product.findByIdAndUpdate(params.id, body, {
			new: true,
			runValidators: true,
		});

		return NextResponse.json(product);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to update product", details: error },
			{ status: 500 }
		);
	}
}

// Delete product
// DELETE /api/products/[id]
export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await connectDB();

		const product = await Product.findById(params.id);

		if (!product) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		await product.deleteOne();

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to delete product", details: error },
			{ status: 500 }
		);
	}
}
