"use client";

import { useEffect, useState } from "react";

type Review = {
  id?: string | number;
  name: string;
  comment: string;
  rating: number;
  date?: string;
};

interface ReviewsCarouselProps {
  reviews: Review[];
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);

  // Auto rotate
  useEffect(() => {
    if (!reviews || reviews.length === 0) return;

    const id = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);

    return () => clearInterval(id);
  }, [reviews]);

  if (!reviews || reviews.length === 0) return null;

  const visibleCount = Math.min(3, reviews.length);

  const getReviewAt = (offset: number) => {
    const index = (startIndex + offset) % reviews.length;
    return reviews[index];
  };

  const cards = [];
  for (let i = 0; i < visibleCount; i++) {
    const r = getReviewAt(i);
    cards.push(
      <div
        key={`${r.id ?? r.name}-${i}`}
        className="
          bg-black/40 
          backdrop-blur-md
          border border-white/10
          rounded-2xl
          shadow-xl
          p-6 
          text-left 
          min-h-[200px] 
          flex 
          flex-col 
          justify-between
          hover:scale-[1.02] 
          transition-transform 
        "
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-orange-300 text-xl">{r.name}</p>
            <p className="text-yellow-400 text-md">
              {"⭐".repeat(r.rating || 0)}
            </p>
          </div>
          <span className="text-xs text-gray-500">Verified Customer</span>
        </div>

        <p className="text-gray-200 text-sm md:text-base mb-4 break-words whitespace-normal">
          “{r.comment}”
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-2 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards}
      </div>
    </div>
  );
}