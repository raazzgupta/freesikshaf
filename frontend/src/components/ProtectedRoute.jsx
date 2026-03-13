import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

// Generic guard
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <Spinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={`/dashboard/${user?.role}`} replace />;
  }
  return <Outlet />;
};

export const StudentRoute = () => <ProtectedRoute allowedRoles={['student']} />;
export const TeacherRoute = () => <ProtectedRoute allowedRoles={['teacher', 'admin']} />;
export const AdminRoute  = () => <ProtectedRoute allowedRoles={['admin']} />;
export const AuthRoute   = () => <ProtectedRoute />;

export default ProtectedRoute;
