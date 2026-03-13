import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function StarRating({ rating = 0, maxStars = 5, interactive = false, onRate }) {
  const stars = Array.from({ length: maxStars }, (_, i) => {
    const full = i + 1 <= Math.floor(rating);
    const half = !full && i + 0.5 < rating;
    return { full, half };
  });

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star, i) => (
        <button
          key={i}
          onClick={() => interactive && onRate?.(i + 1)}
          className={`text-amber-400 ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          disabled={!interactive}
        >
          {star.full ? <FaStar /> : star.half ? <FaStarHalfAlt /> : <FaRegStar />}
        </button>
      ))}
    </div>
  );
}
