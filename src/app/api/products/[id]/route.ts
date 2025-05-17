import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// Get product by ID
// GET /api/products/[id]
export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await connectDB();

		const product = await Product.findById(params.id);

		if (!product) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		return NextResponse.json(product);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch product", details: error },
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
