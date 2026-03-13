import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Protected route wrappers
import { StudentRoute, TeacherRoute, AdminRoute, AuthRoute } from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseDetails from './pages/CourseDetails';
import CoursePlayer from './pages/CoursePlayer';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateCourse from './pages/CreateCourse';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Routes>
      {/* Public routes under main layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
      </Route>

      {/* Student: /learn/:courseId — no main nav, full-screen player */}
      <Route element={<StudentRoute />}>
        <Route path="/learn/:courseId" element={<CoursePlayer />} />
      </Route>

      {/* Student Dashboard */}
      <Route element={<StudentRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/student/courses" element={<StudentDashboard />} />
          <Route path="/dashboard/student/certificates" element={<StudentDashboard />} />
        </Route>
      </Route>

      {/* Teacher Dashboard */}
      <Route element={<TeacherRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="/dashboard/teacher/discussions" element={<TeacherDashboard />} />
        </Route>
        <Route path="/dashboard/teacher/create" element={<CreateCourse />} />
      </Route>

      {/* Admin Dashboard */}
      <Route element={<AdminRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/users" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/courses" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
