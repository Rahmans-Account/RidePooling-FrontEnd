import React, { useState } from "react";
import { Star, MessageSquare, AlertCircle, Quote, Clock } from "lucide-react";
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
      setError("Calibration required: Please select a star frequency.");
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
      setError(err.response?.data?.message || "Transmission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Archive this transmission?")) return;
    
    setDeletingId(reviewId);
    try {
      await reviewService.deleteReview(reviewId);
      onReviewAdded?.();
    } catch (err) {
      setError(err.response?.data?.message || "Deletion failed.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-slate-200/70 shadow-pastel-shadow relative overflow-hidden group/main">
      <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-pastel-mint-light/10 rounded-full blur-3xl -z-10 group-hover/main:bg-pastel-mint-light/20 transition-all duration-1000" />
      
      {/* Header */}
      <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-pastel-lavender-light rounded-2xl shadow-sm border border-slate-200/70">
             <MessageSquare size={24} className="text-pastel-lavender-dark" />
           </div>
           <h3 className="text-3xl font-black text-slate-800 tracking-tight">Quantum Feedback</h3>
        </div>
        <p className="text-slate-500 font-medium italic">"Every data point refined our navigation parameters."</p>
      </div>

      {/* Review Submission */}
      {canReview && (
        <div className="mb-14 p-8 bg-white/60 border-2 border-slate-200/70 rounded-[2.5rem] shadow-inner relative group/submission">
          <div className="absolute top-4 right-8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pastel-mint animate-pulse" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Input</span>
          </div>

          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Log Your Expedition</h4>

          {error && (
            <div className="mb-6 p-4 bg-pastel-pink/30 border border-pastel-pink text-red-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Star Frequency */}
          <div className="mb-8">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Assign Star Magnitude</p>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Set rating to ${star} star${star > 1 ? "s" : ""}`}
                  className="transition-all transform hover:scale-125 active:scale-95 duration-300"
                >
                  <Star
                    size={36}
                    strokeWidth={1.5}
                    className={`${
                      star <= (hoverRating || newRating)
                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                        : "text-slate-200"
                    } transition-all duration-300`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Observation Log */}
          <div className="mb-8 group">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 block">
              Descriptive Observation
            </label>
            <div className="relative">
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about your experience..."
                  maxLength={500}
                  className="w-full px-6 py-5 bg-white border-2 border-white rounded-[2rem] focus:outline-none focus:border-pastel-lavender focus:ring-4 focus:ring-pastel-lavender-light/30 transition-all font-medium text-sm placeholder:text-slate-300 resize-none shadow-sm min-h-[140px]"
                />
                <div className="absolute bottom-4 right-6 text-[8px] font-black text-slate-300 uppercase tracking-widest">
                  {comment.length}/500
                </div>
            </div>
          </div>

          {/* Broadcast Trigger */}
          <button
            onClick={handleSubmitReview}
            disabled={submitting || !newRating}
            className="w-full px-8 py-5 bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[2rem] hover:bg-slate-900 transition-all shadow-xl active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group/btn overflow-hidden relative"
          >
            <span className="relative z-10">{submitting ? "Broadcasting..." : "Broadcast Review"}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pastel-lavender to-pastel-mint opacity-0 group-hover/btn:opacity-10 transition-opacity" />
          </button>
        </div>
      )}

      {/* Reviews Matrix */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div
              key={review._id || idx}
              className="p-8 bg-white/60 border-2 border-slate-200/70 rounded-[2.5rem] hover:shadow-lg transition-all relative overflow-hidden group/review"
            >
              <div className="absolute top-6 right-8 opacity-5 text-slate-400">
                 <Quote size={40} />
              </div>

              {/* Identity Hub */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-tr from-pastel-lavender-dark to-pastel-lavender flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-white group-hover/review:rotate-3 transition-transform">
                    {review.reviewer?.name?.[0] || "U"}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 tracking-tight">{review.reviewer?.name || "Anonymous Traveler"}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-slate-400" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                  </div>
                </div>

                {/* Magnitude Counter */}
                <div className="flex flex-col items-end">
                    <div className="flex gap-1.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            strokeWidth={2.5}
                            className={`${
                            i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-100"
                            }`}
                        />
                        ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest tabular-nums">Level {review.rating}.0</span>
                </div>
              </div>

              {/* Content Node */}
              {review.comment && (
                <div className="relative pl-4 border-l-2 border-pastel-mint/30">
                    <p className="text-slate-600 font-medium leading-relaxed italic text-sm">"{review.comment}"</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white/30 border-2 border-dashed border-slate-200/70 rounded-[3rem]">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-inner border border-slate-200/70">
                <MessageSquare size={32} strokeWidth={1} />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Observation Vacuum</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-3">
              {canReview
                ? "Initiate the first record"
                : "Awaiting Expedition Conclusion"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
