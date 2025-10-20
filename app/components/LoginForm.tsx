'use client';

import { useState } from 'react';
import { usePOS } from '../context/POSContext';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = usePOS();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    // Authenticate user
    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password');
      setPassword(''); // Clear password on failed login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-violet-700 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Company Name */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.jpeg" 
              alt="Kapruka Logo" 
              className="h-24 w-24 rounded-2xl object-cover shadow-lg"
            />
          </div>
          <h1 className="text-5xl font-bold text-yellow-400 mb-2">KAPRUKA</h1>
          </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-violet-950 mb-6 text-center">
            Cashier Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-violet-950 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-violet-950/20 rounded-lg focus:outline-none focus:border-violet-950 focus:ring-2 focus:ring-violet-950/20 transition-all"
                placeholder="Enter your username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-violet-950 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-violet-950/20 rounded-lg focus:outline-none focus:border-violet-950 focus:ring-2 focus:ring-violet-950/20 transition-all"
                placeholder="Enter your password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-violet-950 text-yellow-400 py-3 px-4 rounded-lg font-semibold text-lg hover:bg-violet-900 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact your supervisor
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-yellow-400/60 text-sm">
            © 2025 Kapruka. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
