import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminStats, getAdminUsers, deleteUser, updateUserRole } from '../services/courseService';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { FiUsers, FiBook, FiDollarSign, FiTrendingUp, FiTrash2, FiEdit2 } from 'react-icons/fi';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const qc = useQueryClient();
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const { data: stats, isLoading: sLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getAdminStats,
  });

  const { data: users = [], isLoading: uLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAdminUsers,
  });

  const { mutate: removeUser } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => { toast.success('User deleted'); qc.invalidateQueries(['admin-users']); },
    onError: () => toast.error('Failed to delete user'),
  });

  const { mutate: changeRole } = useMutation({
    mutationFn: ({ userId, data }) => updateUserRole(userId, data),
    onSuccess: () => { toast.success('Role updated'); qc.invalidateQueries(['admin-users']); setEditingUser(null); },
    onError: () => toast.error('Failed to update role'),
  });

  if (sLoading || uLoading) return <Spinner />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">Platform analytics and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiUsers} label="Total Users" value={stats?.totalUsers} color="bg-brand-600"
          sub={`+${stats?.newUsersThisMonth || 0} this month`} />
        <StatCard icon={FiBook} label="Total Courses" value={stats?.totalCourses} color="bg-purple-600"
          sub={`${stats?.publishedCourses || 0} published`} />
        <StatCard icon={FiDollarSign} label="Revenue" value={stats?.revenue ? `₹${stats.revenue.toLocaleString()}` : '₹0'} color="bg-green-600"
          sub="all time" />
        <StatCard icon={FiTrendingUp} label="Enrollments" value={stats?.totalEnrollments} color="bg-amber-500"
          sub={`+${stats?.newEnrollmentsThisMonth || 0} this month`} />
      </div>

      {/* Quick Charts placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">User Breakdown</h3>
          {[
            { label: 'Students', value: stats?.students || 0, color: 'bg-brand-500' },
            { label: 'Teachers', value: stats?.teachers || 0, color: 'bg-purple-500' },
            { label: 'Admins', value: stats?.admins || 0, color: 'bg-green-500' },
          ].map(({ label, value, color }) => {
            const total = stats?.totalUsers || 1;
            const pct = Math.round((value / total) * 100);
            return (
              <div key={label} className="mb-3">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>{label}</span><span>{value} ({pct}%)</span>
                </div>
                <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Course Stats</h3>
          {[
            { label: 'Published', value: stats?.publishedCourses || 0, color: 'bg-green-500' },
            { label: 'Draft', value: (stats?.totalCourses || 0) - (stats?.publishedCourses || 0), color: 'bg-yellow-500' },
          ].map(({ label, value, color }) => {
            const total = stats?.totalCourses || 1;
            const pct = Math.round((value / total) * 100);
            return (
              <div key={label} className="mb-3">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>{label}</span><span>{value} ({pct}%)</span>
                </div>
                <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      <section>
        <h3 className="section-title mb-4">User Management</h3>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="bg-dark-700 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-dark-700/40 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name?.[0] || 'U'}
                        </div>
                        <span className="font-medium text-white truncate max-w-[120px]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400 truncate max-w-[160px]">{u.email}</td>
                    <td className="px-5 py-3">
                      {editingUser === u._id ? (
                        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}
                          className="bg-dark-700 border border-dark-500 text-white text-xs rounded px-2 py-1">
                          {['student', 'teacher', 'admin'].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`badge capitalize ${
                          u.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : u.role === 'teacher' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                        }`}>{u.role}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {editingUser === u._id ? (
                          <>
                            <button onClick={() => changeRole({ userId: u._id, data: { role: selectedRole } })}
                              className="text-xs text-green-400 hover:text-green-300">Save</button>
                            <button onClick={() => setEditingUser(null)} className="text-xs text-gray-400 hover:text-white">Cancel</button>
                          </>
                        ) : (
                          <button onClick={() => { setEditingUser(u._id); setSelectedRole(u.role); }}
                            className="text-gray-400 hover:text-brand-400 transition-colors" title="Edit role">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => { if (confirm('Delete this user?')) removeUser(u._id); }}
                          className="text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-500">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
