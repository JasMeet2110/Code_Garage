"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

type Review = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

const Star = ({ filled }: { filled: boolean }) => (
  <span className={`text-xl ${filled ? "text-orange-500" : "text-gray-400/60"}`}>★</span>
);

export default function ReviewsPage() {
  const { data: session } = useSession();

  const isLoggedIn = Boolean(session?.user);

  const userName = session?.user?.name || "";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Errors
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  // Success modal
  const [showSuccess, setShowSuccess] = useState(false);

  // Show more
  const [showMore, setShowMore] = useState(false);

  // Load from DB
  useEffect(() => {
    async function loadReviews() {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data);
      setLoading(false);
    }
    loadReviews();
  }, []);

  // Validation
  const validate = () => {
    const newErrors: typeof errors = {};

    if (rating === 0) newErrors.rating = "Select a rating.";
    if (!comment.trim()) newErrors.comment = "Comment is required.";
    else if (comment.length > 200) newErrors.comment = "Comment cannot exceed 200 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit review
  const submitReview = async () => {
    if (!validate()) return;

    const payload = {
      name: userName, // IMPORTANT — user cannot change
      rating,
      comment,
      email: session?.user?.email,
    };

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const saved = await res.json();
    setReviews((prev) => [saved, ...prev]);

    // Reset
    setRating(0);
    setComment("");
    setErrors({});
    setShowSuccess(true);
  };

  // SORT reviews by rating (top 5 first)
  const sorted = [...reviews].sort((a, b) => b.rating - a.rating);
  const topFive = sorted.slice(0, 5);
  const remaining = sorted.slice(5);

  return (
    <div className="relative min-h-screen text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/reviews.jpg"
          alt="Garage Reviews"
          fill
          priority
          className="object-cover brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 flex flex-col items-center min-h-screen py-16 px-6">
        
        {/* HEADER */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-orange-400 mb-4">Customer Reviews</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Read what customers are saying — and leave your own review.
          </p>
        </header>

        <div className="w-full max-w-5xl space-y-10">

          {/* IF NOT LOGGED IN */}
          {!isLoggedIn && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center text-gray-300">
              Please <span className="text-orange-400 font-semibold">sign in</span> to leave a review.
            </div>
          )}

          {/* WRITE REVIEW */}
          <section className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-lg ${!isLoggedIn && "opacity-40 pointer-events-none"}`}>
            
            <h2 className="text-2xl font-extrabold text-orange-400 mb-6 text-center">
              Write a Review
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* NAME (READ ONLY) */}
              <div>
                <p className="font-semibold mb-1 text-gray-200">Your Name</p>
                <input
                  value={userName}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-gray-300 cursor-not-allowed opacity-70"
                  placeholder="Your name"
                />
                <p className="text-xs text-gray-400 mt-1">Cannot be edited</p>
              </div>

              {/* RATING */}
              <div>
                <p className="font-semibold mb-1 text-gray-200">Rating</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setRating(n);
                        setErrors((prev) => ({ ...prev, rating: "" }));
                      }}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star filled={rating >= n} />
                    </button>
                  ))}
                </div>
                {errors.rating && <p className="text-red-400 text-sm">{errors.rating}</p>}
              </div>

              {/* COMMENT */}
              <div className="md:col-span-2">
                <p className="font-semibold mb-1 text-gray-200">Comment</p>
                <textarea
                  value={comment}
                  maxLength={200}
                  onChange={(e) => {
                    setComment(e.target.value);
                    setErrors((prev) => ({ ...prev, comment: "" }));
                  }}
                  className={`w-full min-h-[120px] px-4 py-3 rounded-lg bg-white/5 border ${
                    errors.comment ? "border-red-500" : "border-white/20"
                  } text-white placeholder-gray-400`}
                  placeholder="How was your experience?"
                />
                <p className="text-xs text-gray-400">{comment.length}/200 characters</p>
                {errors.comment && <p className="text-red-400 text-sm">{errors.comment}</p>}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setRating(0);
                  setComment("");
                  setErrors({});
                }}
                className="px-5 py-2 border border-white/20 text-gray-200 rounded-lg hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={submitReview}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 shadow-lg"
              >
                Submit Review
              </button>
            </div>
          </section>

          {/* RECENT REVIEWS */}
          <section className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-extrabold text-orange-400 mb-6 text-center">
              Recent Reviews
            </h2>

            {loading ? (
              <p className="text-center opacity-70">Loading...</p>
            ) : reviews.length === 0 ? (
              <p className="text-center opacity-70">No reviews yet.</p>
            ) : (
              <>
                <div className="flex flex-col gap-5">
                  {topFive.map((r) => (
                    <div
                      key={r.id}
                      className="border border-white/20 bg-white/5 rounded-xl p-5 shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{r.name}</p>
                        <p className="text-sm text-gray-300">
                          {new Date(r.date).toISOString().split("T")[0]}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} filled={r.rating >= n} />
                        ))}
                      </div>

                      <p className="mt-2 text-gray-200 break-words whitespace-normal">
                        {r.comment}
                      </p>
                    </div>
                  ))}
                </div>

                {remaining.length > 0 && (
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="mx-auto mt-4 px-5 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition"
                  >
                    {showMore ? "Show Less" : `Show All (${reviews.length})`}
                  </button>
                )}

                {showMore && (
                  <div className="mt-4 flex flex-col gap-5">
                    {remaining.map((r) => (
                      <div
                        key={r.id}
                        className="border border-white/20 bg-white/5 rounded-xl p-5 shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{r.name}</p>
                          <p className="text-sm text-gray-300">
                            {new Date(r.date).toISOString().split("T")[0]}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star key={n} filled={r.rating >= n} />
                          ))}
                        </div>

                        <p className="mt-2 text-gray-200 break-words whitespace-normal">
                          {r.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
