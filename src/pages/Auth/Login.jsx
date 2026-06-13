import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const { login, addToast } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, password, role);
    setIsLoading(false);

    if (result.success) {
      addToast('Login successful', 'success');
      // Redirection handled by App.jsx
    } else {
      addToast(result.message || 'Invalid credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F9FAFB] p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-blue mb-2 tracking-tight">HostelHub</h1>
          <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['student', 'warden', 'admin'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${
                  role === r ? 'bg-white shadow-sm text-primary-blue' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-blue hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg transition-colors shadow-md disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-center text-gray-500">
            Sample Credentials:<br />
            Student: student01@college.com / password123<br />
            Admin: admin@hostel.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
