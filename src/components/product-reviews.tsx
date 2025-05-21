"use client";

import { format } from "date-fns";
import { Star } from "lucide-react";
import { ReviewForm } from "./review-form";

export interface Review {
	_id: string;
	user: {
		_id: string;
		name: string;
	};
	rating: number;
	comment: string;
	createdAt: string;
}

interface ProductReviewsProps {
	productId: string;
	reviews: Review[];
	onReviewSubmit: () => void;
}

export default function ProductReviews({
	productId,
	reviews = [],
	onReviewSubmit,
}: ProductReviewsProps) {
	return (
		<div className="mt-12">
			<h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

			<div className="grid md:grid-cols-3 gap-8">
				{/* Review Form */}
				<div className="md:col-span-1">
					<ReviewForm productId={productId} onReviewSubmit={onReviewSubmit} />
				</div>

				{/* Reviews List */}
				<div className="md:col-span-2">
					{reviews.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							No reviews yet. Be the first to review!
						</div>
					) : (
						<div className="space-y-6">
							{reviews.map((review) => (
								<div key={review._id} className="border-b pb-4">
									<div className="flex justify-between items-start">
										<div>
											<h4 className="font-medium">{review.user.name}</h4>
											<div className="flex items-center mt-1">
												{[1, 2, 3, 4, 5].map((star) => (
													<Star
														key={star}
														className={`h-4 w-4 ${
															star <= review.rating
																? "fill-yellow-400 text-yellow-400"
																: "text-gray-300"
														}`}
													/>
												))}
											</div>
										</div>
										<span className="text-sm text-gray-500">
											{format(new Date(review.createdAt), "MMMM d, yyyy")}
										</span>
									</div>
									<p className="mt-2 text-gray-700">{review.comment}</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
