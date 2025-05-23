// src/app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Mock database (replace with your actual database)
const reviewsDb: Record<string, any[]> = {};

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const productId = searchParams.get("productId");

		if (!productId) {
			return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
		}

		const productReviews = reviewsDb[productId] || [];
		const totalReviews = productReviews.length;
		const averageRating =
			totalReviews > 0
				? Number(
						(
							productReviews.reduce((sum, review) => sum + review.rating, 0) /
							totalReviews
						).toFixed(1)
				)
				: 0;

		return NextResponse.json({
			reviews: productReviews,
			averageRating,
			totalReviews,
		});
	} catch (error) {
		console.error("Error fetching reviews:", error);
		return NextResponse.json(
			{ error: "Failed to fetch reviews" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		// Get the session
		const session = await getServerSession(authOptions);
		console.log("Session in API route:", session);

		// Verify user is authenticated
		if (!session?.user?.id) {
			console.error("Unauthorized: No session or user ID found");
			return NextResponse.json(
				{ error: "You must be signed in to submit a review" },
				{ status: 401 }
			);
		}

		// Parse and validate request body
		let body;
		try {
			body = await request.json();
			console.log("Request body:", body);
		} catch (error) {
			console.error("Error parsing request body:", error);
			return NextResponse.json(
				{ error: "Invalid request body" },
				{ status: 400 }
			);
		}

		const { id, rating, comment } = body;

		console.log("Extracted fields:", { id, rating, comment });

		// Validate required fields
		const missingFields = [];
		if (!id) missingFields.push("productId");
		if (rating === undefined || rating === null) missingFields.push("rating");
		if (!comment) missingFields.push("comment");

		if (missingFields.length > 0) {
			return NextResponse.json(
				{
					error: `Missing required fields: ${missingFields.join(", ")}`,
					missingFields,
				},
				{ status: 400 }
			);
		}

		// Validate rating is a number between 1-5
		if (typeof rating !== "number" || rating < 1 || rating > 5) {
			return NextResponse.json(
				{
					error: "Rating must be a number between 1 and 5",
					received: rating,
					type: typeof rating,
				},
				{ status: 400 }
			);
		}

		// Create the review object
		const newReview = {
			id: Date.now().toString(),
			userId: session.user.id, // Use the ID from session for security
			// productId: id, // Keep productId in the stored object for backward compatibility
			rating: Number(rating),
			comment: comment.trim(),
			createdAt: new Date().toISOString(),
			user: {
				name: session.user.name || "Anonymous",
				image: session.user.image || null,
			},
		};

		console.log("New review to be saved:", newReview);

		// Save to mock database
		if (!reviewsDb[id]) {
			reviewsDb[id] = [];
		}
		reviewsDb[id].push(newReview);

		console.log("Successfully added review. Current reviews:", reviewsDb);

		return NextResponse.json(newReview, { status: 201 });
	} catch (error) {
		console.error("Error in POST /api/reviews:", error);
		return NextResponse.json(
			{
				error: "An unexpected error occurred while submitting your review",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}
