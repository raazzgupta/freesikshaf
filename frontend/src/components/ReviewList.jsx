import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviews, submitReview } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import Spinner from './Spinner';
import toast from 'react-hot-toast';
import { FiUser } from 'react-icons/fi';

export default function ReviewList({ courseId, isEnrolled }) {
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', courseId],
    queryFn: () => getReviews(courseId),
  });

  const { mutate: submitReviewMutation, isPending } = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      toast.success('Review submitted!');
      qc.invalidateQueries(['reviews', courseId]);
      setRating(0);
      setComment('');
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to submit review'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Please select a rating');
    submitReviewMutation({ courseId, rating, comment });
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h3 className="section-title">Student Reviews</h3>

      {/* Add Review Form */}
      {isAuthenticated && isEnrolled && (
        <form onSubmit={handleSubmit} className="card p-5 space-y-4">
          <h4 className="font-semibold text-white">Write a Review</h4>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Your Rating:</span>
            <StarRating rating={rating} interactive onRate={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this course..."
            rows={3}
            className="input-field resize-none text-sm"
          />
          <button type="submit" disabled={isPending} className="btn-primary text-sm">
            {isPending ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <div key={review._id || i} className="card p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {review.student?.name?.[0] || <FiUser />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-white">{review.student?.name || 'Student'}</span>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{review.comment}</p>
                <p className="text-xs text-gray-600 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
