import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyEnrollments, getAIRecommendations, getMyCertificates } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/Spinner';
import { FiBook, FiAward, FiTrendingUp, FiPlay } from 'react-icons/fi';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: enrollments = [], isLoading: eLoading } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: getMyEnrollments,
  });

  const { data: recommendations = [], isLoading: rLoading } = useQuery({
    queryKey: ['ai-recommendations'],
    queryFn: getAIRecommendations,
  });

  const { data: certificates = [], isLoading: cLoading } = useQuery({
    queryKey: ['my-certificates'],
    queryFn: getMyCertificates,
  });

  const isLoading = eLoading || rLoading || cLoading;
  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="text-gray-400 mt-1">Continue your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={FiBook} label="Enrolled Courses" value={enrollments.length} color="bg-brand-600" />
        <StatCard icon={FiAward} label="Certificates" value={certificates.length} color="bg-purple-600" />
        <StatCard icon={FiTrendingUp} label="In Progress" value={enrollments.filter(e => !e.completed).length} color="bg-green-600" />
      </div>

      {/* My Courses */}
      <section>
        <h3 className="section-title mb-4">My Courses</h3>
        {enrollments.length === 0 ? (
          <div className="card p-10 text-center text-gray-500">
            <FiBook className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>You haven't enrolled in any courses yet.</p>
            <Link to="/" className="btn-primary inline-block mt-4 text-sm">Browse Courses</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enrollment) => {
              const course = enrollment.course || enrollment;
              return (
                <div key={enrollment._id} className="card hover:border-brand-700 transition-colors">
                  <div className="aspect-video bg-dark-700 overflow-hidden">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-900 to-dark-700">
                        <span className="text-brand-500 text-3xl font-black opacity-30">FS</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-white text-sm line-clamp-2 mb-3">{course.title}</h4>
                    <div className="w-full h-1.5 bg-dark-600 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${enrollment.progress || 0}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{enrollment.progress || 0}% complete</span>
                      <Link to={`/learn/${course._id}`} className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-medium">
                        <FiPlay className="w-3 h-3" /> Continue
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="section-title my-0">Recommended for You</h3>
            <span className="badge bg-brand-600/20 text-brand-300 border border-brand-600/30 text-xs">AI Powered</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <section>
          <h3 className="section-title mb-4">My Certificates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div key={cert._id} className="card p-5 flex items-center gap-4 hover:border-amber-600/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <FiAward className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{cert.course?.title || 'Course'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Issued {new Date(cert.issuedAt).toLocaleDateString()}</p>
                </div>
                {cert.certificateUrl && (
                  <a href={cert.certificateUrl} target="_blank" rel="noreferrer"
                    className="text-xs text-brand-400 hover:text-brand-300 font-medium shrink-0">Download</a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
