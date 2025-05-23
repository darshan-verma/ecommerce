// src/components/review/review-list.tsx
"use client";

import { format } from "date-fns";
import { Star, StarHalf, StarOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface ReviewListProps {
	reviews: Review[];
	averageRating: number;
	totalReviews: number;
}

export function ReviewList({
	reviews,
	averageRating,
	totalReviews,
}: ReviewListProps) {
	const renderStars = (rating: number) => {
		return (
			<div className="flex items-center">
				{[1, 2, 3, 4, 5].map((star) => {
					const isFilled = star <= Math.floor(rating);
					const isHalfFilled = star - 0.5 <= rating && star > rating;

					return (
						<span key={star} className="inline-block">
							{isFilled ? (
								<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
							) : isHalfFilled ? (
								<StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
							) : (
								<Star className="h-4 w-4 text-gray-300" />
							)}
						</span>
					);
				})}
			</div>
		);
	};

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h2 className="text-2xl font-bold">Customer Reviews</h2>
				<div className="flex items-center space-x-4">
					<div className="flex items-center">
						{renderStars(averageRating)}
						<span className="ml-2 text-sm text-muted-foreground">
							{averageRating.toFixed(1)} out of 5
						</span>
					</div>
					<span className="text-sm text-muted-foreground">
						{totalReviews} {totalReviews === 1 ? "review" : "reviews"}
					</span>
				</div>
			</div>

			<div className="space-y-6">
				{reviews.map((review) => (
					<div key={review.id} className="space-y-2 border-b pb-4">
						<div className="flex items-center space-x-3">
							<Avatar className="h-10 w-10">
								<AvatarImage src={review.user.image} alt={review.user.name} />
								<AvatarFallback>
									{review.user.name
										.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-medium">{review.user.name}</p>
								<div className="flex items-center space-x-2">
									{renderStars(review.rating)}
									<span className="text-sm text-muted-foreground">
										{format(new Date(review.createdAt), "MMMM d, yyyy")}
									</span>
								</div>
							</div>
						</div>
						<p className="mt-2 text-sm">{review.comment}</p>
					</div>
				))}
			</div>
		</div>
	);
}
