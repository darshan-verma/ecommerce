'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Review = {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
};

type ReviewContextType = {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  getProductReviews: (productId: number) => Review[];
  getAverageRating: (productId: number) => number;
  getRatingCount: (productId: number, rating: number) => number;
};

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load reviews from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedReviews = localStorage.getItem('reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('reviews', JSON.stringify(reviews));
    }
  }, [reviews, isMounted]);

  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    
    setReviews(prevReviews => [...prevReviews, newReview]);
  };

  const getProductReviews = (productId: number) => {
    return reviews.filter(review => review.productId === productId);
  };

  const getAverageRating = (productId: number) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    
    const sum = productReviews.reduce((total, review) => total + review.rating, 0);
    return Number((sum / productReviews.length).toFixed(1));
  };

  const getRatingCount = (productId: number, rating: number) => {
    const productReviews = getProductReviews(productId);
    return productReviews.filter(review => Math.round(review.rating) === rating).length;
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        addReview,
        getProductReviews,
        getAverageRating,
        getRatingCount,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
}
