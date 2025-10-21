"use client";

import React, { useState } from "react";
import Image from "next/image";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

const Star = ({ filled }: { filled: boolean }) => (
  <span className={`text-xl ${filled ? "text-orange-500" : "text-gray-300"}`}>★</span>
);

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "r1",
      name: "John D.",
      rating: 5,
      comment: "Great service and friendly staff. Highly recommended!",
      date: "2025-09-01",
    },
    {
      id: "r2",
      name: "Sara K.",
      rating: 4,
      comment: "Quick oil change and fair prices.",
      date: "2025-08-27",
    },
    {
      id: "r3",
      name: "Mike L.",
      rating: 5,
      comment: "Diagnosed my issue fast and fixed it same day.",
      date: "2025-08-15",
    },
  ]);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = () => {
    if (!name.trim() || !comment.trim() || rating === 0) {
      alert("Please enter your name, rating, and comment.");
      return;
    }

    const newReview: Review = {
      id: crypto.randomUUID(),
      name,
      rating,
      comment,
      date: new Date().toISOString().slice(0, 10),
    };

    setReviews([newReview, ...reviews]);
    setName("");
    setRating(0);
    setComment("");
    alert("Thanks for your review!");
  };

  return (
    <div className="relative min-h-screen text-white">
      {/* ✅ Fixed background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/reviews.png"
          alt="Garage Reviews Background"
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* ✅ Scrollable content container */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen py-16 px-6">
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-orange-400 drop-shadow-lg mb-4">
            Customer Reviews
          </h1>
          <p className="text-lg text-gray-200 drop-shadow-md max-w-2xl mx-auto">
            Hear from our valued customers and share your experience with Trackside Garage.
          </p>
        </header>

        {/* ✅ Main Content Area */}
        <div className="w-full max-w-5xl space-y-10">
          {/* Write a Review */}
          <section className="bg-white/90 text-black rounded-xl shadow-xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-extrabold text-orange-500 mb-6 drop-shadow text-center">
              Write a Review
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold mb-1">Name</p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Your name"
                />
              </div>

              <div>
                <p className="font-semibold mb-1">Rating</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      className="px-2 py-1 rounded-md"
                      aria-label={`Set rating ${n}`}
                    >
                      <Star filled={rating >= n} />
                    </button>
                  ))}
                  <span className="text-sm opacity-70">{rating}/5</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="font-semibold mb-1">Comment</p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="border px-3 py-2 rounded-md w-full min-h-[120px] focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="How was your experience?"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setName("");
                  setRating(0);
                  setComment("");
                }}
                className="border border-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Submit Review
              </button>
            </div>
          </section>

          {/* Recent Reviews */}
          <section className="bg-white/90 text-black rounded-xl shadow-xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-extrabold text-orange-500 mb-6 drop-shadow text-center">
              Recent Reviews
            </h2>

            <div className="flex flex-col gap-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="border border-gray-200 rounded-lg p-4 text-left bg-white/95 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-sm text-gray-500">{r.date}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} filled={r.rating >= n} />
                    ))}
                  </div>
                  <p className="mt-2 text-gray-700">{r.comment}</p>
                </div>
              ))}

              {reviews.length === 0 && (
                <p className="opacity-70 text-center">
                  No reviews yet. Be the first to leave one!
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
