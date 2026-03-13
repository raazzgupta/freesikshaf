import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiBook, FiAward, FiPlusSquare, FiUsers, FiBarChart2,
  FiMenu, FiX, FiLogOut, FiMessageSquare, FiStar
} from 'react-icons/fi';

const studentLinks = [
  { to: '/dashboard/student', label: 'Overview', icon: FiGrid, end: true },
  { to: '/dashboard/student/courses', label: 'My Courses', icon: FiBook },
  { to: '/dashboard/student/certificates', label: 'Certificates', icon: FiAward },
];

const teacherLinks = [
  { to: '/dashboard/teacher', label: 'Overview', icon: FiGrid, end: true },
  { to: '/dashboard/teacher/create', label: 'Create Course', icon: FiPlusSquare },
  { to: '/dashboard/teacher/discussions', label: 'Discussions', icon: FiMessageSquare },
];

const adminLinks = [
  { to: '/dashboard/admin', label: 'Analytics', icon: FiBarChart2, end: true },
  { to: '/dashboard/admin/users', label: 'Users', icon: FiUsers },
  { to: '/dashboard/admin/courses', label: 'Courses', icon: FiBook },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const links = user?.role === 'admin' ? adminLinks
    : user?.role === 'teacher' ? teacherLinks
    : studentLinks;

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
        : 'text-gray-400 hover:bg-dark-700 hover:text-white'
    }`;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} shrink-0 bg-dark-800 border-r border-dark-700 flex flex-col transition-all duration-300 relative`}>
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b border-dark-700 gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition-colors shrink-0">
            {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
          {sidebarOpen && (
            <NavLink to="/" className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center font-black text-white text-xs">FS</span>
              <span className="font-bold text-white text-sm">FreeSiksha</span>
            </NavLink>
          )}
        </div>

        {/* User */}
        {sidebarOpen && (
          <div className="p-4 border-b border-dark-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navClass} title={!sidebarOpen ? label : undefined}>
              <Icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-dark-700">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-dark-700 transition-all">
            <FiLogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-dark-700 bg-dark-900/80 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-30">
          <h1 className="text-lg font-semibold text-white capitalize">{user?.role} Dashboard</h1>
          <NavLink to="/" className="ml-auto text-sm text-gray-400 hover:text-brand-400 transition-colors">← Back to site</NavLink>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
