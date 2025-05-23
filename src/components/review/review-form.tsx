// src/components/review/review-form.tsx
"use client";

import { useState } from "react";
import { Star, StarHalf, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

interface ReviewFormProps {
	id: string;
	onReviewSubmit?: () => void;
}

export function ReviewForm({ id, onReviewSubmit }: ReviewFormProps) {
	const { data: session } = useSession();
	const { toast } = useToast();
	const [rating, setRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleRatingClick = (value: number) => {
		setRating(value);
	};

	const handleMouseEnter = (value: number) => {
		setHoverRating(value);
	};

	const handleMouseLeave = () => {
		setHoverRating(0);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!session) {
			toast({
				title: "Sign in required",
				description: "Please sign in to submit a review",
			});
			return;
		}

		if (rating === 0) {
			toast({
				title: "Rating required",
				description: "Please select a rating",
			});
			return;
		}

		if (!comment.trim()) {
			toast({
				title: "Comment required",
				description: "Please enter your review comment",
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const reviewData = {
				id: id,
				rating: rating,
				comment: comment.trim(),
				userId: session.user?.id,
			};

			console.log("Submitting review with data:", reviewData);

			const response = await fetch("/api/reviews", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(reviewData),
			});

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(
					responseData.error ||
						`Failed to submit review: ${response.status} ${response.statusText}`
				);
			}

			toast({
				title: "Review submitted",
				description: "Thank you for your feedback!",
			});

			setRating(0);
			setComment("");
			onReviewSubmit?.();
		} catch (error) {
			console.error("Error submitting review:", error);
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to submit review. Please try again.",
				// variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const displayRating = hoverRating || rating;

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium">Write a Review</h3>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<p className="text-sm font-medium mb-2">Your Rating</p>
					<div className="flex items-center space-x-1">
						{[1, 2, 3, 4, 5].map((star) => {
							const isFilled = star <= displayRating;
							const isHalfFilled =
								star - 0.5 <= displayRating && star > displayRating;

							return (
								<button
									key={star}
									type="button"
									className="p-1"
									onClick={() => handleRatingClick(star)}
									onMouseEnter={() => handleMouseEnter(star)}
									onMouseLeave={handleMouseLeave}
									aria-label={`Rate ${star} out of 5`}
								>
									{isFilled ? (
										<Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
									) : isHalfFilled ? (
										<StarHalf className="h-6 w-6 fill-yellow-400 text-yellow-400" />
									) : (
										<Star className="h-6 w-6 text-gray-300" />
									)}
								</button>
							);
						})}
					</div>
				</div>

				<div className="space-y-2">
					<label htmlFor="comment" className="text-sm font-medium">
						Your Review
					</label>
					<Textarea
						id="comment"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Share your thoughts about this product..."
						className="min-h-[120px]"
						required
					/>
				</div>

				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Submitting..." : "Submit Review"}
				</Button>
			</form>
		</div>
	);
}
