import React, { useState } from "react";
import { Star, Trash2, User } from "lucide-react";
import reviewService from "../api/reviewService";

export default function RideReview({ rideId, rideStatus, reviews = [], onReviewAdded }) {
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const canReview = rideStatus === "completed";

  const handleSubmitReview = async () => {
    if (!newRating) {
      setError("Please select a rating");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await reviewService.createReview(rideId, newRating, comment);
      setNewRating(0);
      setComment("");
      onReviewAdded?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    
    setDeletingId(reviewId);
    try {
      await reviewService.deleteReview(reviewId);
      onReviewAdded?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-900 mb-2">Ratings & Reviews</h3>
        <p className="text-slate-500">See what other passengers have to say about this ride</p>
      </div>

      {/* Review Submission */}
      {canReview && (
        <div className="mb-10 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
          <h4 className="text-lg font-bold text-slate-900 mb-4">Share Your Experience</h4>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}

          {/* Star Rating */}
          <div className="mb-6">
            <p className="text-sm font-bold text-slate-700 mb-3">How would you rate this ride?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoverRating || newRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {newRating > 0 && (
              <p className="mt-2 text-sm font-bold text-slate-600">
                {newRating === 5 && "Excellent!"}
                {newRating === 4 && "Great!"}
                {newRating === 3 && "Good"}
                {newRating === 2 && "Fair"}
                {newRating === 1 && "Poor"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="text-sm font-bold text-slate-700 mb-2 block">
              Add a comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about your experience..."
              maxLength={500}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={4}
            />
            <p className="text-xs text-slate-400 mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitReview}
            disabled={submitting || !newRating}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="p-6 border border-slate-100 rounded-2xl hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                    {review.reviewer?.name?.[0] || "U"}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{review.reviewer?.name || "Anonymous"}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{review.rating}.0</span>
                </div>
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="text-slate-600 mb-4 leading-relaxed">{review.comment}</p>
              )}

              {/* Delete Button (if user is reviewer) */}
              {/* Note: Add logic to show delete if user is the reviewer */}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 font-bold mb-2">No reviews yet</p>
            <p className="text-slate-400 text-sm">
              {canReview
                ? "Be the first to review this ride!"
                : "Reviews will appear after the ride is completed"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
