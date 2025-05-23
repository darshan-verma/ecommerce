import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
	try {
		await connectDB();

		// Get all products with their stock information
		const products = await Product.find({}, "name price stock images category")
			.populate("category", "name")
			.sort({ stock: 1, name: 1 });

		return NextResponse.json(products);
	} catch (error) {
		console.error("Error fetching inventory:", error);
		return NextResponse.json(
			{ message: "Failed to fetch inventory" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const { productId, quantity } = await request.json();

		if (!productId || typeof quantity !== "number") {
			return NextResponse.json(
				{ message: "Product ID and quantity are required" },
				{ status: 400 }
			);
		}

		await connectDB();

		// Update product stock
		const product = await Product.findById(productId);
		if (!product) {
			return NextResponse.json(
				{ message: "Product not found" },
				{ status: 404 }
			);
		}

		product.stock += quantity;
		await product.save();

		return NextResponse.json(product);
	} catch (error) {
		console.error("Error updating inventory:", error);
		return NextResponse.json(
			{ message: "Failed to update inventory" },
			{ status: 500 }
		);
	}
}
