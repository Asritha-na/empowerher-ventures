import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mail, Briefcase, CheckCircle, Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function InvestorCard({ investor, isConnected, onConnect, onDisconnect, onAddReview, currentUserEmail, index }) {
  const [showReviews, setShowReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const whatsappUrl = `https://wa.me/${investor.phone?.replace(/[^0-9]/g, "")}?text=Hello! I'm an entrepreneur from NariShakti platform. I'd love to discuss my business idea with you.`;
  const emailUrl = `mailto:${investor.email || ''}?subject=Business Opportunity from NariShakti&body=Hello ${investor.name}, I'm an entrepreneur from the NariShakti platform and would love to discuss my business idea with you.`;

  const categoryColors = {
    "MICRO-FINANCE": "bg-pink-100 text-pink-700",
    "ANGEL INVESTOR": "bg-blue-100 text-blue-700",
    "CSR FUND": "bg-purple-100 text-purple-700",
    "NGO": "bg-green-100 text-green-700",
    "VC FUND": "bg-orange-100 text-orange-700",
  };

  const handleSubmitReview = () => {
    if (!newReview.comment.trim()) return;
    
    const review = {
      user_name: currentUserEmail?.split('@')[0] || "Anonymous",
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString(),
    };

    onAddReview(investor.id, review);
    setNewReview({ rating: 5, comment: "" });
    setShowReviewForm(false);
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:fill-yellow-300" : ""}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        {/* Card Header */}
        <div className="p-5 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between mb-3">
            {investor.image_url ? (
              <img 
                src={investor.image_url} 
                alt={investor.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shrink-0">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
            )}
            {investor.is_verified && (
              <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-xs font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified
              </div>
            )}
          </div>
          
          <h3 className="font-bold text-lg text-gray-900 mb-1">{investor.name}</h3>
          
          {investor.category_label && (
            <Badge className={`${categoryColors[investor.category_label] || "bg-gray-100 text-gray-700"} text-xs font-semibold`}>
              {investor.category_label}
            </Badge>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          {/* Investment Range */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Investment Range</p>
            <p className="font-bold text-gray-900">
              ₹{investor.min_investment?.toLocaleString()} - ₹{investor.max_investment?.toLocaleString()}
            </p>
          </div>

          {/* Sectors of Interest */}
          {investor.focus_areas?.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Sectors of Interest</p>
              <div className="flex flex-wrap gap-1.5">
                {investor.focus_areas.map((area, i) => (
                  <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Investments Made */}
          {investor.investments_made > 0 && (
            <p className="text-sm text-rose-600 font-semibold">
              {investor.investments_made} investments made
            </p>
          )}

          {/* Rating */}
          {investor.rating > 0 && (
            <button 
              onClick={() => setShowReviews(true)}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              {renderStars(Math.round(investor.rating))}
              <span className="text-sm text-gray-600">
                ({investor.reviews?.length || 0} reviews)
              </span>
            </button>
          )}
        </div>

        {/* Card Footer */}
        <div className="p-4 bg-gray-50 flex gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Connect on WhatsApp
          </a>
          <a
            href={emailUrl}
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
          >
            <Mail className="w-4 h-4" />
            Send Email
          </a>
        </div>
      </motion.div>

      {/* Reviews Dialog */}
      <Dialog open={showReviews} onOpenChange={setShowReviews}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Reviews for {investor.name}</span>
              <Button 
                onClick={() => {
                  setShowReviews(false);
                  setShowReviewForm(true);
                }}
                size="sm"
                className="bg-gradient-to-r from-rose-500 to-pink-600"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Write Review
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {investor.reviews && investor.reviews.length > 0 ? (
              investor.reviews.map((review, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{review.user_name}</span>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Review Dialog */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review for {investor.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Your Rating</label>
              {renderStars(newReview.rating, true, (rating) => setNewReview({...newReview, rating}))}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Your Review</label>
              <Textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                placeholder="Share your experience with this investor..."
                rows={4}
                className="rounded-xl"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowReviewForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitReview}
                disabled={!newReview.comment.trim()}
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600"
              >
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}