import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, AlertCircle, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      // Determine dashboard path based on role
      const storedUser = localStorage.getItem('lms_user');
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.role === 'Admin') {
          navigate('/admin');
        } else if (u.role === 'Librarian') {
          navigate('/librarian');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light-lavender flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-premium border border-brand-lavender-border p-8 relative overflow-hidden">
        {/* Branding Decor */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-royal-violet/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-royal-violet/5 rounded-full blur-3xl"></div>

        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-12 h-12 bg-brand-royal-violet text-white rounded-xl flex items-center justify-center shadow-soft mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-brand-dark-text font-sans">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to access your digital library portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-brand-dark-text uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-brand-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-royal-violet/50 focus:border-brand-royal-violet transition-colors"
              placeholder="student@lms.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dark-text uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-brand-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-royal-violet/50 focus:border-brand-royal-violet transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-royal-violet to-brand-deep-purple text-white rounded-xl font-semibold text-sm hover:shadow-premium hover:scale-[1.01] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? 'Signing in...' : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 relative z-10">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-royal-violet font-semibold hover:underline">
            Register as Member
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
