import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

type Review = {
  user: string | { _id: string; name: string };
  name?: string;
  rating: number;
  comment: string;
  _id?: string;
  createdAt?: string;
};

type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type Session = {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = (await getServerSession(authOptions as any)) as Session | null;
    const user = session?.user as SessionUser | undefined;

    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { rating, comment } = await request.json();

    if (!rating || !comment) {
      return NextResponse.json(
        { message: "Rating and comment are required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Check if user already reviewed this product
    const existingReviewIndex = product.reviews.findIndex((r: Review) => {
      const userId = typeof r.user === "string" ? r.user : r.user?._id;
      return userId === user.id;
    });

    const review: Review = {
      user: user.id,
      name: user.name || "Anonymous",
      rating: Number(rating),
      comment,
    };

    if (existingReviewIndex >= 0) {
      // Update existing review
      product.reviews[existingReviewIndex] = review;
    } else {
      // Add new review
      product.reviews.push(review);
    }

    // Update product rating
    const totalRatings = product.reviews.reduce(
      (acc: number, item: Review) => item.rating + acc,
      0
    );
    product.ratings = totalRatings / product.reviews.length;

    await product.save();

    return NextResponse.json(
      { message: "Review submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const product = await Product.findById(params.id)
      .select("reviews")
      .populate({
        path: "reviews.user",
        select: "name",
      });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ reviews: product.reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
