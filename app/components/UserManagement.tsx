'use client';

import { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { IconUsers, IconPlus, IconTrash, IconCrown, IconBriefcase } from '@tabler/icons-react';

export default function UserManagement() {
  const { users, addUser, deleteUser, currentCashier } = usePOS();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'cashier' as 'admin' | 'cashier',
  });
  const [error, setError] = useState('');

  // Only admin can access this page
  if (currentCashier?.role !== 'admin') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12 text-red-600">
          <p className="text-lg font-semibold">Access Denied</p>
          <p className="text-sm">Only administrators can access this page</p>
        </div>
      </div>
    );
  }

  const openAddModal = () => {
    setFormData({
      username: '',
      password: '',
      name: '',
      role: 'cashier',
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username || !formData.password || !formData.name) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Check if username already exists
    if (users.some(u => u.username === formData.username)) {
      setError('Username already exists');
      return;
    }

    // Add user
    addUser(formData);
    setShowModal(false);
  };

  const handleDelete = (userId: string, username: string) => {
    if (userId === 'admin001') {
      alert('Cannot delete the default admin user');
      return;
    }
    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
      deleteUser(userId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-violet-950 flex items-center gap-2">
            <IconUsers className="h-7 w-7" />
            User Management
          </h2>
          <button
            onClick={openAddModal}
            className="bg-violet-950 text-yellow-400 px-6 py-3 rounded-lg font-semibold hover:bg-violet-900 transition-colors flex items-center gap-2"
          >
            <IconPlus className="h-5 w-5" />
            Add New User
          </button>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-violet-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-violet-950">{users.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Administrators</p>
            <p className="text-2xl font-bold text-violet-950">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Cashiers</p>
            <p className="text-2xl font-bold text-violet-950">
              {users.filter(u => u.role === 'cashier').length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Username</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Created At</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600">{user.username}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit ${
                      user.role === 'admin' 
                        ? 'bg-violet-100 text-violet-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role === 'admin' ? (
                        <>
                          <IconCrown className="h-4 w-4" />
                          Admin
                        </>
                      ) : (
                        <>
                          <IconBriefcase className="h-4 w-4" />
                          Cashier
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleDelete(user.id, user.username)}
                        disabled={user.id === 'admin001'}
                        className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                          user.id === 'admin001'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                      >
                        <IconTrash className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-violet-950 mb-6">
              Add New User
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-violet-950"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username * (min. 3 characters)
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-violet-950"
                  placeholder="johndoe"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password * (min. 6 characters)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-violet-950"
                  placeholder="••••••"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'cashier' })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-violet-950"
                  required
                >
                  <option value="cashier">Cashier</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-violet-950 text-yellow-400 py-3 px-4 rounded-lg font-semibold hover:bg-violet-900 transition-colors"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
