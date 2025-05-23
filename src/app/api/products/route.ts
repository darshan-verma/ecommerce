import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose"; // Import mongoose

// Get all products
// GET /api/products
// Optional query params: ?keyword=...&category=...&price[gte]=...&price[lte]=...&page=...&limit=...
export async function GET(request: Request) {
	try {
		const start = Date.now();
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
			query.category = categoryId;
		}
		
		console.log(query);
		// Define projection to limit returned fields
		const projection = {
			name: 1,
			price: 1,
			description: 1,
			images: 1,
			category: 1,
			stock: 1,
			rating: 1,
			numReviews: 1,
			createdAt: 1,
			// Add any other fields you need
		};

		// Use aggregation pipeline to get products and count in a single query
		const [result] = await Product.aggregate([
			{ $match: query },
			{
				$facet: {
					metadata: [{ $count: "total" }],
					products: [
						{ $sort: { createdAt: -1 } },
						{ $skip: (page - 1) * limit },
						{ $limit: limit },
						{ $project: projection },
					],
				},
			},
		]);

		const products = result.products;
		const total = result.metadata[0]?.total || 0;

		console.log("API Execution time:", Date.now() - start);
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
