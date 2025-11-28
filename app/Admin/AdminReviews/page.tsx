"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const Star = ({ filled }: { filled: boolean }) => (
  <span className={`text-orange-400 text-lg`}>★</span>
);

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews", { cache: "no-store" });
      const data = await res.json();
      setReviews(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    await fetch(`/api/reviews/${reviewToDelete.id}`, { method: "DELETE" });
    setReviewToDelete(null);
    fetchReviews();
  };

  const filtered = reviews.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Average reviews section
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const ratingCounts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviews.forEach((r) => {
    if (ratingCounts[r.rating] !== undefined) {
      ratingCounts[r.rating] = ratingCounts[r.rating] + 1;
    }
  });
  // ==============================================

  return (
    <div className="flex min-h-screen relative text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/background/admin.png"
          alt="Garage Background"
          fill
          priority
          className="object-cover brightness-[0.45] blur-sm"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="ml-72 flex-1 p-10 relative z-10">
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-8 shadow-lg border border-white/20">
          <h1 className="text-4xl font-bold text-orange-400 mb-8">
            Reviews Management
          </h1>

          {/* Search */}
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Average Reviews Summary */}
          {!loading && totalReviews > 0 && (
            <div className="mb-8 p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Average Rating
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-orange-400">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-300 text-sm">/ 5</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  {totalReviews} review{totalReviews !== 1 ? "s" : ""} total
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div
                    key={star}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 border border-white/10"
                  >
                    <span className="text-yellow-400">{star}★</span>
                    <span className="text-gray-300">
                      {ratingCounts[star] ?? 0}{" "}
                      <span className="text-gray-500">reviews</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-400 mb-6">Loading reviews...</p>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-xl bg.white/10 backdrop-blur-md border border-white/20 shadow-lg bg-white/10">
            <table className="min-w-full text-left">
              <thead className="bg-white/10 border-b border-white/20 text-orange-400">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Rating</th>
                  <th className="px-6 py-3">Comment</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-6 text-center text-gray-400"
                    >
                      No reviews found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((rev) => (
                    <tr
                      key={rev.id}
                      className="border-b border-white/10 hover:bg-white/10 transition-all"
                    >
                      <td className="px-6 py-4">{rev.name}</td>

                      {/* Stars */}
                      <td className="px-6 py-4 text-yellow-400">
                        {Array.from({ length: rev.rating }, (_, i) => (
                          <Star key={i} filled />
                        ))}
                      </td>

                      {/* COMMENT FIXED WRAPPING */}
                      <td className="px-6 py-4 text-gray-300 break-all whitespace-normal">
                        {rev.comment}
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {new Date(rev.date).toISOString().split("T")[0]}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setReviewToDelete(rev)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* DELETE MODAL */}
      {reviewToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-semibold text-orange-400 mb-3">
              Confirm Deletion
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the review from{" "}
              <span className="text-white font-semibold">
                {reviewToDelete.name}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold"
              >
                Delete
              </button>
              <button
                onClick={() => setReviewToDelete(null)}
                className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
