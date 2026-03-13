import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourses, getDiscussions } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { FiBook, FiUsers, FiMessageSquare, FiPlusSquare, FiEdit, FiEye } from 'react-icons/fi';

export default function TeacherDashboard() {
  const { user } = useAuth();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['teacher-courses', user?._id],
    queryFn: () => getCourses({ instructor: user?._id }),
  });

  const totalStudents = courses.reduce((a, c) => a + (c.studentsCount || 0), 0);

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Teacher Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your courses and students</p>
        </div>
        <Link to="/dashboard/teacher/create" className="btn-primary flex items-center gap-2 text-sm">
          <FiPlusSquare className="w-4 h-4" /> New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: FiBook, label: 'My Courses', value: courses.length, color: 'bg-brand-600' },
          { icon: FiUsers, label: 'Total Students', value: totalStudents, color: 'bg-purple-600' },
          { icon: FiMessageSquare, label: 'Discussions', value: '—', color: 'bg-green-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* My Courses Table */}
      <section>
        <h3 className="section-title mb-4">My Courses</h3>
        {courses.length === 0 ? (
          <div className="card p-10 text-center text-gray-500">
            <FiBook className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>You haven't created any courses yet.</p>
            <Link to="/dashboard/teacher/create" className="btn-primary inline-block mt-4 text-sm">Create Your First Course</Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-dark-700 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3 hidden sm:table-cell">Students</th>
                  <th className="px-5 py-3 hidden md:table-cell">Rating</th>
                  <th className="px-5 py-3 hidden md:table-cell">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 rounded bg-dark-700 overflow-hidden shrink-0">
                          {course.thumbnail
                            ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-brand-500 text-xs font-bold">FS</div>
                          }
                        </div>
                        <span className="font-medium text-white line-clamp-1">{course.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell text-gray-400">{course.studentsCount}</td>
                    <td className="px-5 py-4 hidden md:table-cell text-amber-400">{course.rating?.toFixed(1)} ⭐</td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`badge ${course.isPublished ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/courses/${course._id}`} className="text-gray-400 hover:text-brand-400 transition-colors" title="View">
                          <FiEye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
