import { Link } from 'react-router-dom';
import { FiUsers, FiClock } from 'react-icons/fi';
import StarRating from './StarRating';

export default function CourseCard({ course }) {
  const {
    _id,
    title = 'Untitled Course',
    instructor,
    thumbnail,
    price = 0,
    rating = 0,
    numReviews = 0,
    studentsCount = 0,
    category,
  } = course || {};

  const instructorName = instructor?.name || 'Unknown Instructor';
  const isFree = price === 0;

  return (
    <Link to={`/courses/${_id}`} className="group card hover:border-brand-700 hover:shadow-xl hover:shadow-brand-900/30 transition-all duration-300 flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-dark-700">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-course.png'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-900 to-dark-700">
            <span className="text-4xl font-black text-brand-500 opacity-30">FS</span>
          </div>
        )}
        {/* Price badge */}
        <span className={`absolute top-2 right-2 badge text-xs font-bold ${isFree ? 'bg-green-500/90 text-white' : 'bg-brand-600/90 text-white'}`}>
          {isFree ? 'FREE' : `₹${price}`}
        </span>
        {category && (
          <span className="absolute bottom-2 left-2 badge bg-dark-900/80 text-gray-300 text-xs border border-dark-500">
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 group-hover:text-brand-300 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-400">{instructorName}</p>

        <div className="flex items-center gap-1.5 mt-auto pt-2">
          <StarRating rating={rating} />
          <span className="text-amber-400 text-xs font-semibold">{rating?.toFixed(1)}</span>
          <span className="text-gray-500 text-xs">({numReviews})</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 border-t border-dark-600 pt-2 mt-1">
          <span className="flex items-center gap-1">
            <FiUsers className="w-3 h-3" /> {studentsCount?.toLocaleString()} students
          </span>
        </div>
      </div>
    </Link>
  );
}
