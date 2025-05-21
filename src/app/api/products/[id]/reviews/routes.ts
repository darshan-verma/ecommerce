
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		await connectDB();
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json(
				{ success: false, message: "Authentication required" },
				{ status: 401 }
			);
		}

		const { rating, comment } = await req.json();

		if (!rating || !comment) {
			return NextResponse.json(
				{ success: false, message: "Rating and comment are required" },
				{ status: 400 }
			);
		}

		const review = {
			user: session.user.email,
			name: session.user.name || "Anonymous",
			rating: Number(rating),
			comment,
			createdAt: new Date(),
		};

		const product = await Product.findById(params.id);
		if (!product) {
			return NextResponse.json(
				{ success: false, message: "Product not found" },
				{ status: 404 }
			);
		}

		// Check if user already reviewed
		const alreadyReviewed = product.reviews.find(
			(r: any) => r.user.toString() === session.user.email
		);

		if (alreadyReviewed) {
			return NextResponse.json(
				{ success: false, message: "You have already reviewed this product" },
				{ status: 400 }
			);
		}

		// Add review
		product.reviews.push(review);
		product.ratings =
			product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
			product.reviews.length;

		await product.save();

		return NextResponse.json({
			success: true,
			data: review,
		});
	} catch (error) {
		console.error("Error submitting review:", error);
		return NextResponse.json(
			{ success: false, message: "Error submitting review" },
			{ status: 500 }
		);
	}
}
