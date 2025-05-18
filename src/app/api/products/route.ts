import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
// Get all products
// GET /api/products
// Optional query params: ?keyword=...&category=...&price[gte]=...&price[lte]=...&page=...&limit=...
export async function GET(request: Request) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const keyword = searchParams.get("keyword") || "";
		const category = searchParams.get("category");
		const priceGte = searchParams.get("price[gte]");
		const priceLte = searchParams.get("price[lte]");
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "9"); // Default to 9 products per page

		const query: any = {};

		if (keyword) {
			query.$or = [
				{ name: { $regex: keyword, $options: "i" } },
				{ description: { $regex: keyword, $options: "i" } },
			];
		}

		if (category) {
			query.category = category;
		}

		if (priceGte || priceLte) {
			query.price = {};
			if (priceGte) query.price.$gte = Number(priceGte);
			if (priceLte) query.price.$lte = Number(priceLte);
		}

		const count = await Product.countDocuments(query);
		const products = await Product.find(query)
			.limit(limit)
			.skip(limit * (page - 1));

		return NextResponse.json({
			products,
			page,
			pages: Math.ceil(count / limit),
			total: count,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch products", details: error },
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
