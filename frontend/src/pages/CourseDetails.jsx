import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourseById, getCurriculum, enrollInCourse, verifyPayment } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import ReviewList from '../components/ReviewList';
import DiscussionSection from '../components/DiscussionSection';
import StarRating from '../components/StarRating';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { FiBook, FiUsers, FiClock, FiCheckCircle, FiPlay, FiChevronDown, FiChevronUp, FiAward } from 'react-icons/fi';

function CurriculumSection({ section }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-dark-600 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-dark-700 hover:bg-dark-600 transition-colors text-left">
        <span className="font-medium text-white text-sm">{section.title}</span>
        <span className="flex items-center gap-2 text-xs text-gray-400">
          {section.lectures?.length || 0} lectures
          {open ? <FiChevronUp /> : <FiChevronDown />}
        </span>
      </button>
      {open && (
        <ul className="divide-y divide-dark-700">
          {(section.lectures || []).map((lec, i) => (
            <li key={lec._id || i} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400">
              <FiPlay className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span className="flex-1 truncate">{lec.title}</span>
              {lec.duration && <span className="text-xs text-gray-600">{lec.duration}m</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CourseDetails() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id),
  });

  const { data: curriculum = [] } = useQuery({
    queryKey: ['curriculum', id],
    queryFn: () => getCurriculum(id),
  });

  const isEnrolled = user?.enrolledCourses?.includes(id);

  const handleEnroll = async () => {
    if (!isAuthenticated) return navigate('/login');
    setEnrolling(true);
    try {
      if (course?.price === 0) {
        await enrollInCourse({ courseId: id });
        toast.success('Enrolled successfully!');
        navigate(`/learn/${id}`);
        return;
      }
      // Razorpay for paid courses
      const orderData = await enrollInCourse({ courseId: id });
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_placeholder',
        amount: orderData.amount,
        currency: 'INR',
        name: 'FreeSiksha',
        description: course?.title,
        order_id: orderData.orderId,
        handler: async (response) => {
          await verifyPayment({ ...response, courseId: id });
          toast.success('Payment successful! You are enrolled.');
          navigate(`/learn/${id}`);
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: '#4f46e5' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (courseLoading) return <Spinner fullScreen />;
  if (!course) return (
    <div className="text-center py-24 text-gray-500">Course not found</div>
  );

  const totalLectures = curriculum.reduce((acc, s) => acc + (s.lectures?.length || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            {course.category && (
              <span className="badge bg-brand-600/20 text-brand-300 border border-brand-600/30 text-xs mb-3">{course.category}</span>
            )}
            <h1 className="text-3xl font-extrabold text-white leading-tight">{course.title}</h1>
            <p className="text-gray-400 mt-3 leading-relaxed">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <StarRating rating={course.rating} />
                <span className="text-amber-400 font-semibold ml-1">{course.rating?.toFixed(1)}</span>
                <span className="text-gray-600">({course.numReviews} reviews)</span>
              </div>
              <span className="flex items-center gap-1"><FiUsers className="w-4 h-4" />{course.studentsCount} students</span>
              <span className="flex items-center gap-1"><FiBook className="w-4 h-4" />{totalLectures} lectures</span>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-3 mt-4 p-3 bg-dark-800 rounded-lg border border-dark-700 w-fit">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {course.instructor?.name?.[0] || 'I'}
              </div>
              <div>
                <p className="text-xs text-gray-500">Instructor</p>
                <p className="text-sm font-semibold text-white">{course.instructor?.name || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-dark-700 flex gap-0.5">
            {['overview', 'curriculum', 'reviews', 'discussion'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
                  activeTab === tab ? 'border-brand-500 text-brand-400' : 'border-transparent text-gray-400 hover:text-white'
                }`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <div className="prose prose-invert prose-sm max-w-none text-gray-400 leading-relaxed">
              <h3 className="text-white font-semibold mb-2">About this course</h3>
              <p>{course.description}</p>
              {course.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {course.tags.map((tag) => (
                    <span key={tag} className="badge bg-dark-700 text-gray-400 border border-dark-600">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400 mb-4">{curriculum.length} sections • {totalLectures} lectures</p>
              {curriculum.length === 0
                ? <p className="text-gray-500 text-sm">No curriculum added yet.</p>
                : curriculum.map((section, i) => (
                  <CurriculumSection key={section._id || i} section={section} />
                ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <ReviewList courseId={id} isEnrolled={isEnrolled} />
          )}

          {activeTab === 'discussion' && (
            <DiscussionSection courseId={id} />
          )}
        </div>

        {/* Right: Sticky Enroll Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 card shadow-2xl shadow-black/40">
            {/* Thumbnail */}
            <div className="aspect-video bg-dark-700 overflow-hidden">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-900 to-dark-700">
                  <span className="text-brand-500 text-5xl font-black opacity-30">FS</span>
                </div>
              )}
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  {course.price === 0 ? 'FREE' : `₹${course.price}`}
                </span>
              </div>

              {isEnrolled ? (
                <button onClick={() => navigate(`/learn/${id}`)} className="btn-primary w-full flex items-center justify-center gap-2">
                  <FiPlay className="w-4 h-4" /> Continue Learning
                </button>
              ) : (
                <button onClick={handleEnroll} disabled={enrolling} className="btn-primary w-full flex items-center justify-center gap-2">
                  {enrolling ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}</>
                  )}
                </button>
              )}

              <ul className="space-y-2 text-sm text-gray-400">
                {[
                  [`${totalLectures} video lectures`, FiPlay],
                  ['Certificate of completion', FiAward],
                  ['Lifetime access', FiCheckCircle],
                  [`${course.studentsCount} enrolled students`, FiUsers],
                ].map(([text, Icon]) => (
                  <li key={text} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-brand-400 shrink-0" /> {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
