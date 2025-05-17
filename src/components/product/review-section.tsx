'use client';

import { useState } from 'react';
import { Star, StarHalf, StarOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useReviews } from '@/contexts/review-context';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

interface ReviewSectionProps {
  productId: number;
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    reviews, 
    addReview, 
    getProductReviews, 
    getAverageRating, 
    getRatingCount 
  } = useReviews();
  
  const productReviews = getProductReviews(productId);
  const averageRating = getAverageRating(productId);
  const totalReviews = productReviews.length;

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user || !rating || !title.trim() || !comment.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Generate a unique user ID based on email or use a fallback
    const userId = session.user?.email || `user-${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate API call
    setTimeout(() => {
      addReview({
        productId,
        userId,
        userName: session.user?.name || 'Anonymous',
        rating,
        title: title.trim(),
        comment: comment.trim(),
        verified: true,
      });
      
      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setIsWritingReview(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const renderStars = (value: number, size = 'md' as 'sm' | 'md' | 'lg') => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= value;
          const isHalfFilled = star - 0.5 <= value && value < star;
          
          return (
            <span key={star} className="text-yellow-400">
              {isFilled ? (
                <Star className={`${sizeClasses[size]} fill-current`} />
              ) : isHalfFilled ? (
                <StarHalf className={`${sizeClasses[size]} fill-current`} />
              ) : (
                <Star className={`${sizeClasses[size]} text-gray-300`} />
              )}
            </span>
          );
        })}
      </div>
    );
  };

  const getRatingPercentage = (starValue: number) => {
    const count = getRatingCount(productId, starValue);
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  return (
    <div className="mt-12">
      <div className="border-b pb-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        
        <div className="mt-6 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="flex items-center">
              <div className="text-5xl font-bold mr-4">{averageRating.toFixed(1)}</div>
              <div>
                {renderStars(averageRating, 'lg')}
                <div className="text-sm text-gray-500 mt-1">{totalReviews} reviews</div>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center">
                  <div className="w-10 text-sm font-medium">{star} star</div>
                  <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400" 
                      style={{ width: `${getRatingPercentage(star)}%` }}
                    />
                  </div>
                  <div className="w-10 text-sm text-gray-500 text-right">
                    {getRatingPercentage(star)}%
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              className="mt-6 w-full"
              onClick={() => setIsWritingReview(true)}
              disabled={!session}
            >
              Write a Review
            </Button>
            
            {!session && (
              <p className="mt-2 text-sm text-gray-500 text-center">
                Please sign in to leave a review
              </p>
            )}
          </div>
          
          <div className="md:w-2/3">
            {isWritingReview ? (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Rating</label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-1"
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            (hoverRating || rating) >= star
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="review-title" className="block text-sm font-medium mb-1">
                    Review Title
                  </label>
                  <input
                    id="review-title"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="review-comment" className="block text-sm font-medium mb-1">
                    Your Review
                  </label>
                  <Textarea
                    id="review-comment"
                    rows={4}
                    className="w-full"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike? What did you use this product for?"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsWritingReview(false);
                      setRating(0);
                      setTitle('');
                      setComment('');
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!rating || !title.trim() || !comment.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </form>
            ) : productReviews.length > 0 ? (
              <div className="space-y-8">
                {productReviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{review.userName}</p>
                            <div className="flex items-center">
                              {renderStars(review.rating, 'sm')}
                              <span className="ml-2 text-sm text-gray-500">
                                {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <h3 className="mt-2 font-medium">{review.title}</h3>
                        <p className="mt-1 text-gray-700">{review.comment}</p>
                        {review.verified && (
                          <div className="mt-2 flex items-center text-sm text-green-600">
                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Verified Purchase
                          </div>
                        )}
                      </div>
                      {review.verified && (
                        <div className="text-xs text-gray-500">
                          Verified
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                {session && (
                  <Button 
                    className="mt-4"
                    onClick={() => setIsWritingReview(true)}
                  >
                    Write a Review
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
