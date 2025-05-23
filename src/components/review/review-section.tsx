// src/components/review/review-section.tsx
"use client";

import { useState, useEffect } from "react";
import { ReviewForm } from "./review-form";
import { ReviewList } from "./review-list";

interface Review {
	id: string;
	user: {
		name: string;
		image?: string;
	};
	rating: number;
	comment: string;
	createdAt: string;
}

interface ReviewSectionProps {
	id: string;
}

export function ReviewSection({ id }: ReviewSectionProps) {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [averageRating, setAverageRating] = useState(0);
	const [totalReviews, setTotalReviews] = useState(0);

	useEffect(() => {
		const fetchReviews = async () => {
			console.log("Fetching reviews for id:", id);
			if (!id) {
				console.log("No id provided, skipping fetch");
				setIsLoading(false);
				return;
			}

			try {
				const response = await fetch(`/api/reviews?productId=${id}`);
				console.log("API Response status:", response.status);

				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(
						`Failed to fetch reviews: ${response.status} - ${errorText}`
					);
				}

				const data = await response.json();
				console.log("Received reviews data:", data);

				setReviews(data.reviews || []);
				setAverageRating(data.averageRating || 0);
				setTotalReviews(data.totalReviews || 0);
			} catch (error) {
				console.error("Error in fetchReviews:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchReviews();
	}, [id]);

	const handleReviewSubmit = async () => {
		// Refetch reviews after submission
		const response = await fetch(`/api/reviews?productId=${id}`);
		if (response.ok) {
			const data = await response.json();
			setReviews(data.reviews);
			setAverageRating(data.averageRating || 0);
			setTotalReviews(data.totalReviews || 0);
		}
	};

	if (isLoading) {
		return <div>Loading reviews...</div>;
	}

	return (
		<div className="space-y-12">
			<ReviewList
				reviews={reviews}
				averageRating={averageRating}
				totalReviews={totalReviews}
			/>
			<ReviewForm id={id} onReviewSubmit={handleReviewSubmit} />
		</div>
	);
}
