// src/components/review-form.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ReviewForm({
	productId,
	onReviewSubmit,
}: {
	productId: string;
	onReviewSubmit: () => void;
}) {
	const { data: session } = useSession();
	const router = useRouter();
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!session) {
			toast.error("Please sign in to submit a review");
			return;
		}

		if (!rating || !comment.trim()) {
			toast.error("Please provide both a rating and a comment");
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await fetch(`/api/products/${productId}/reviews`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ rating, comment }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to submit review");
			}

			toast.success("Review submitted successfully!");
			setRating(0);
			setComment("");
			onReviewSubmit(); // Refresh reviews
		} catch (error) {
			console.error("Error submitting review:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to submit review"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!session) {
		return (
			<div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
				<p className="text-gray-600">Please sign in to write a review</p>
				<Button
					onClick={() => router.push("/auth/signin")}
					className="mt-2"
					variant="outline"
				>
					Sign In
				</Button>
			</div>
		);
	}

	return (
		<div className="mt-6 p-4 border rounded-lg">
			<h3 className="text-lg font-medium mb-4">Write a Review</h3>
			<form onSubmit={handleSubmit}>
				<div className="flex items-center mb-4">
					<span className="mr-2">Rating:</span>
					{[1, 2, 3, 4, 5].map((star) => (
						<button
							key={star}
							type="button"
							onClick={() => setRating(star)}
							className="focus:outline-none"
						>
							<Star
								className={`h-6 w-6 ${
									star <= rating
										? "fill-yellow-400 text-yellow-400"
										: "text-gray-300"
								}`}
							/>
						</button>
					))}
				</div>
				<Textarea
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder="Share your thoughts about this product..."
					className="min-h-[100px]"
					required
				/>
				<div className="mt-4">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "Submit Review"}
					</Button>
				</div>
			</form>
		</div>
	);
}
