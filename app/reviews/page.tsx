'use client'

import React, { useState } from 'react'
import Image from 'next/image'

type Review = {
  id: string
  name: string
  rating: number
  comment: string
  date: string
}

const Star = ({ filled }: { filled: boolean }) => (
  <span className={`text-xl ${filled ? 'text-orange-500' : 'text-gray-300'}`}>★</span>
)

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    { id: 'r1', name: 'John D.', rating: 5, comment: 'Great service and friendly staff. Highly recommended!', date: '2025-09-01' },
    { id: 'r2', name: 'Sara K.', rating: 4, comment: 'Quick oil change and fair prices.', date: '2025-08-27' },
    { id: 'r3', name: 'Mike L.', rating: 5, comment: 'Diagnosed my issue fast and fixed it same day.', date: '2025-08-15' },
  ])
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const submitReview = () => {
    if (!name.trim() || !comment.trim() || rating === 0) {
      alert('Please enter your name, rating, and comment.')
      return
    }
    const newReview: Review = {
      id: crypto.randomUUID(),
      name,
      rating,
      comment,
      date: new Date().toISOString().slice(0, 10),
    }
    setReviews([newReview, ...reviews])
    setName('')
    setRating(0)
    setComment('')
    alert('Thanks for your review!')
  }

  return (
    <div className="relative min-h-[900px] flex flex-col justify-center items-center text-center text-white">
      <Image
        src="/reviews.png"
        alt="Background"
        fill
        className="absolute inset-0 object-cover brightness-30"
        priority
      />
      <div className="relative z-10 w-full">
        <div className="mt-20 px-6 md:px-10 mb-40">
          <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
            <header className="section-header text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 text-orange-400 drop-shadow-lg">Reviews</h1>
              <p className="text-lg text-white drop-shadow-md">Read what customers say and leave your review.</p>
            </header>

            <section className="bg-white text-black rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold mb-1">Name</p>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border px-3 py-2 rounded-md w-full"
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
                    className="border px-3 py-2 rounded-md w-full min-h-[120px]"
                    placeholder="How was your experience?"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="nav-btn"
                  onClick={() => { setName(''); setRating(0); setComment('') }}
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition"
                >
                  Submit Review
                </button>
              </div>
            </section>

            <section className="bg-white text-black rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
              <div className="flex flex-col gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border rounded-lg p-4 text-left">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-sm opacity-70">{r.date}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} filled={r.rating >= n} />
                      ))}
                    </div>
                    <p className="mt-2">{r.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="opacity-70">No reviews yet. Be the first to leave one!</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
