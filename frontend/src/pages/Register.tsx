import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, AlertCircle, ArrowRight } from 'lucide-react';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('Student');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await register({ email, password, name, phone, department, role });
      if (role === 'Admin') {
        navigate('/admin');
      } else if (role === 'Librarian') {
        navigate('/librarian');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light-lavender flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-premium border border-brand-lavender-border p-8 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-royal-violet/10 rounded-full blur-2xl"></div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-brand-royal-violet text-white rounded-xl flex items-center justify-center shadow-soft mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-brand-dark-text font-sans">Create Account</h2>
          <p className="text-gray-500 text-sm mt-1">Register as a library member to borrow books</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-dark-text uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-brand-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-royal-violet/50 focus:border-brand-royal-violet transition-colors"
              placeholder="Alice Student"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dark-text uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-brand-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-royal-violet/50 focus:border-brand-royal-violet transition-colors"
              placeholder="alice@lms.com"
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
              placeholder="Min 6 characters"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dark-text uppercase tracking-wider mb-2">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-brand-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-royal-violet/50 focus:border-brand-royal-violet transition-colors"
              placeholder="e.g. +15550199"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-dark-text uppercase tracking-wider mb-2">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-brand-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-royal-violet/50 focus:border-brand-royal-violet transition-colors"
              placeholder="e.g. Computer Science"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-dark-text uppercase tracking-wider mb-2">Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-brand-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-royal-violet/50 focus:border-brand-royal-violet transition-colors"
            >
              <option value="Student">Student (General Member)</option>
              <option value="Librarian">Librarian (Book Issuer)</option>
              <option value="Admin">Administrator (Analytics/Manage Users)</option>
            </select>
          </div>

          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-royal-violet to-brand-deep-purple text-white rounded-xl font-semibold text-sm hover:shadow-premium hover:scale-[1.01] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : (
                <>
                  Register
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-royal-violet font-semibold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
