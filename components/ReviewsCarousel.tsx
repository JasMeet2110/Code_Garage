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

  // auto rotate reviews
  useEffect(() => {
    if (!reviews || reviews.length === 0) return;

    const id = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);

    return () => clearInterval(id);
  }, [reviews]);

  if (!reviews || reviews.length === 0) {
    return null;
  }

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
        className="bg-neutral-900/70 border border-neutral-700/80 rounded-2xl shadow-2xl 
        p-6 text-left min-h-[180px] flex flex-col justify-between"
      >
        <p className="text-gray-200 text-sm md:text-base mb-4 break-words whitespace-normal">
          “{r.comment}”
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-orange-300">{r.name}</p>
            <p className="text-yellow-400 text-xs md:text-sm">
              {"⭐".repeat(r.rating || 0)}
            </p>
          </div>
          <span className="text-xs text-gray-500">Verified Customer</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards}
      </div>
    </div>
  );
}
