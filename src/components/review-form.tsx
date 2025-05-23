// src/components/review-form.tsx
"use client";

import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
	productId: string;
	onReviewSubmit?: () => void;
}

export function ReviewForm({ productId, onReviewSubmit }: ReviewFormProps) {
	const { data: session } = useSession();
	const router = useRouter();
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hoverRating, setHoverRating] = useState(0);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!session) {
			toast.error("Please sign in to submit a review");
			router.push("/login");
			return;
		}

		if (!productId) {
			toast.error("Product ID is missing. Please try again.");
			return;
		}

		if (rating === 0) {
			toast.error("Please select a rating");
			return;
		}

		if (!comment.trim()) {
			toast.error("Please enter your review comment");
			return;
		}

		try {
			setIsSubmitting(true);

			const response = await fetch("/api/reviews", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					productId,
					rating,
					comment: comment.trim(),
					userId: session.user.id,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to submit review");
			}

			// Reset form
			setRating(0);
			setComment("");
			setHoverRating(0);

			toast.success("Thank you for your review!");

			// Call the onReviewSubmit callback if provided
			if (onReviewSubmit) {
				onReviewSubmit();
			}

			// Refresh the page to show the new review
			router.refresh();
		} catch (error) {
			console.error("Error submitting review:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to submit review"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium">Write a Review</h3>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="flex items-center space-x-1">
					{[1, 2, 3, 4, 5].map((star) => (
						<button
							key={star}
							type="button"
							className="focus:outline-none"
							onClick={() => setRating(star)}
							onMouseEnter={() => setHoverRating(star)}
							onMouseLeave={() => setHoverRating(0)}
						>
							<Star
								className={`h-6 w-6 ${
									(hoverRating || rating) >= star
										? "fill-yellow-400 text-yellow-400"
										: "text-gray-300"
								}`}
							/>
						</button>
					))}
					<span className="ml-2 text-sm text-muted-foreground">
						{rating > 0
							? `${rating} star${rating > 1 ? "s" : ""}`
							: "Rate this product"}
					</span>
				</div>

				<div className="space-y-2">
					<Textarea
						placeholder="Share your experience with this product..."
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						rows={4}
						className="min-h-[100px]"
						disabled={isSubmitting}
						required
					/>
				</div>

				<Button
					type="submit"
					disabled={isSubmitting || !session}
					className="w-full sm:w-auto"
				>
					{isSubmitting ? (
						<>
							<svg
								className="animate-spin -ml-1 mr-2 h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Submitting...
						</>
					) : session ? (
						"Submit Review"
					) : (
						"Sign in to Review"
					)}
				</Button>
			</form>
		</div>
	);
}
