import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourseById, getCurriculum } from '../services/courseService';
import VideoPlayer from '../components/VideoPlayer';
import Spinner from '../components/Spinner';
import { FiCheckCircle, FiCircle, FiChevronLeft, FiList, FiX } from 'react-icons/fi';

export default function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeLecture, setActiveLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: course, isLoading: cLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId),
  });

  const { data: curriculum = [], isLoading: curLoading } = useQuery({
    queryKey: ['curriculum', courseId],
    queryFn: () => getCurriculum(courseId),
  });

  // Handle initial lecture selection
  useEffect(() => {
    if (curriculum.length > 0 && !activeLecture) {
      const firstLec = curriculum[0]?.lectures?.[0];
      if (firstLec) setActiveLecture(firstLec);
    }
  }, [curriculum, activeLecture]);

  const allLectures = curriculum.flatMap((s) => s.lectures || []);

  const markComplete = (lectureId) => {
    setCompletedLectures((prev) => new Set([...prev, lectureId]));
  };

  const totalProgress = allLectures.length
    ? Math.round((completedLectures.size / allLectures.length) * 100)
    : 0;

  if (cLoading || curLoading) return <Spinner fullScreen />;

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Top bar */}
      <header className="h-14 bg-dark-800 border-b border-dark-700 flex items-center px-4 gap-4 sticky top-0 z-30">
        <button onClick={() => navigate(`/courses/${courseId}`)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
          <FiChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{course?.title}</p>
          {activeLecture && <p className="text-xs text-gray-400 truncate">{activeLecture.title}</p>}
        </div>
        {/* Progress */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-32 h-1.5 bg-dark-600 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${totalProgress}%` }} />
          </div>
          <span className="text-xs text-gray-400">{totalProgress}%</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
          {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiList className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Video area */}
        <main className={`flex-1 min-w-0 p-4 md:p-6 overflow-y-auto transition-all ${sidebarOpen ? '' : 'max-w-full'}`}>
          {activeLecture ? (
            <div className="max-w-4xl mx-auto space-y-4">
              <VideoPlayer
                lecture={activeLecture}
                courseId={courseId}
              />
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">{activeLecture.title}</h2>
                  {activeLecture.description && (
                    <p className="text-sm text-gray-400 mt-1">{activeLecture.description}</p>
                  )}
                </div>
                <button
                  onClick={() => markComplete(activeLecture._id)}
                  className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-all ${
                    completedLectures.has(activeLecture._id)
                      ? 'border-green-500 text-green-400 bg-green-500/10'
                      : 'btn-outline'
                  }`}
                >
                  <FiCheckCircle className="w-4 h-4" />
                  {completedLectures.has(activeLecture._id) ? 'Completed' : 'Mark Complete'}
                </button>
              </div>

              {/* Next / Previous */}
              <div className="flex justify-between pt-4 border-t border-dark-700">
                <button
                  onClick={() => {
                    const idx = allLectures.findIndex((l) => l._id === activeLecture._id);
                    if (idx > 0) setActiveLecture(allLectures[idx - 1]);
                  }}
                  className="btn-secondary text-sm"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => {
                    const idx = allLectures.findIndex((l) => l._id === activeLecture._id);
                    if (idx < allLectures.length - 1) {
                      markComplete(activeLecture._id);
                      setActiveLecture(allLectures[idx + 1]);
                    }
                  }}
                  className="btn-primary text-sm"
                >
                  Next →
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto flex items-center justify-center h-64 text-gray-500">
              <p>Select a lecture from the sidebar to start learning</p>
            </div>
          )}
        </main>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-72 shrink-0 bg-dark-800 border-l border-dark-700 overflow-y-auto hidden md:block">
            <div className="p-4 border-b border-dark-700">
              <p className="text-sm font-semibold text-white">Course Content</p>
              <p className="text-xs text-gray-400 mt-0.5">{allLectures.length} lectures • {completedLectures.size} completed</p>
            </div>

            {curriculum.map((section, si) => (
              <div key={section._id || si} className="border-b border-dark-700">
                <div className="px-4 py-2.5 bg-dark-700/50">
                  <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">{section.title}</p>
                </div>
                {(section.lectures || []).map((lec, li) => {
                  const isActive = activeLecture?._id === lec._id;
                  const isDone = completedLectures.has(lec._id);
                  return (
                    <button
                      key={lec._id || li}
                      onClick={() => setActiveLecture(lec)}
                      className={`w-full text-left flex items-start gap-3 px-4 py-3 text-sm transition-colors ${
                        isActive ? 'bg-brand-600/20 text-brand-300' : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                      }`}
                    >
                      {isDone
                        ? <FiCheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                        : <FiCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      }
                      <span className="line-clamp-2">{lec.title}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </aside>
        )}
      </div>
    </div>
  );
}
