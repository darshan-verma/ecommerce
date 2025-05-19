import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose"; // Import mongoose

// Get all products
// GET /api/products
// Optional query params: ?keyword=...&category=...&price[gte]=...&price[lte]=...&page=...&limit=...
export async function GET(request: Request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const keyword = searchParams.get("keyword") || "";
		const categoryId = searchParams.get("category");

		const query: any = {};

		// Add search keyword filter
		if (keyword) {
			query.$or = [
				{ name: { $regex: keyword, $options: "i" } },
				{ description: { $regex: keyword, $options: "i" } },
			];
		}

		// Add category filter if provided
		if (categoryId && categoryId !== "all") {
			query.category = new mongoose.Types.ObjectId(categoryId);
		}

		// Get total count for pagination
		const total = await Product.countDocuments(query);

		// Get paginated products
		const products = await Product.find(query)
			.limit(limit)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });

		return NextResponse.json({
			success: true,
			products,
			page,
			totalPages: Math.ceil(total / limit),
			totalProducts: total,
		});
	} catch (error) {
		console.error("Error in GET /api/products:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// Create a new product
// POST /api/products
export async function POST(request: Request) {
	try {
		await connectDB();
		const body = await request.json();

		const product = await Product.create(body);

		return NextResponse.json(product, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to create product", details: error },
			{ status: 500 }
		);
	}
}
