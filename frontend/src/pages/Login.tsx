import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, FileText, Newspaper, User, Lock, Eye, EyeOff, 
  GraduationCap, Key, Sparkles, ArrowRight, Rocket, 
  CheckSquare, Square, AlertCircle 
} from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('student@lms.com');
  const [password, setPassword] = useState('Student123!');
  const [selectedRole, setSelectedRole] = useState<'Student' | 'Admin'>('Student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: 'Student' | 'Admin') => {
    setSelectedRole(role);
    if (role === 'Student') {
      setEmail('student@lms.com');
      setPassword('Student123!');
    } else {
      setEmail('admin@lms.com');
      setPassword('Admin123!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      
      {/* ====================================================
          LEFT COLUMN: HERO SECTION (DEEP PURPLE)
          ==================================================== */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-brand-deep-purple via-brand-deep-purple to-purple-950 text-white p-8 md:p-16 flex flex-col justify-between sidebar-pattern relative overflow-hidden">
        
        {/* Large-scale pattern of book spine outlines */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full object-cover">
            <rect x="5" y="10" width="8" height="80" fill="#fff" />
            <rect x="15" y="25" width="10" height="65" fill="#fff" />
            <rect x="27" y="5" width="7" height="85" fill="#fff" />
            <rect x="36" y="20" width="9" height="70" fill="#fff" />
            <rect x="47" y="15" width="8" height="75" fill="#fff" />
            <rect x="57" y="30" width="11" height="60" fill="#fff" />
            <rect x="70" y="8" width="7" height="82" fill="#fff" />
            <rect x="79" y="22" width="10" height="68" fill="#fff" />
            <rect x="91" y="12" width="6" height="78" fill="#fff" />
          </svg>
        </div>

        {/* Top Branding */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-brand-royal-violet rounded-lg flex items-center justify-center shadow-soft">
              <BookOpen className="w-4.5 h-4.5 font-bold" />
            </div>
            <span className="font-extrabold text-sm tracking-wide">Library Management System</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-xs">
            <Rocket className="w-3.5 h-3.5 text-purple-300" />
            <span className="font-medium tracking-wide">Digital Library</span>
          </div>
        </div>

        {/* Main Heading Text */}
        <div className="relative z-10 my-12 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight font-sans">
            Read.<br/>Explore.<br/>Innovate.
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-md">
            Your gateway to books, magazines and newspapers. Explore knowledge and manage your library experience from one place.
          </p>

          {/* Icon List */}
          <div className="space-y-4 pt-6">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 bg-white/10 border border-white/10 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-purple-200" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Explore Books</h4>
                <p className="text-[10px] text-white/50">Discover books from multiple categories</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 bg-white/10 border border-white/10 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-purple-200" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Latest Magazines</h4>
                <p className="text-[10px] text-white/50">Browse and borrow available magazines</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 bg-white/10 border border-white/10 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                <Newspaper className="w-5 h-5 text-purple-200" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Daily Newspapers</h4>
                <p className="text-[10px] text-white/50">Stay informed with today's newspapers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-white/10 pt-4 text-xs text-white/40">
          © 2026 Library Management System
        </div>

      </div>

      {/* ====================================================
          RIGHT COLUMN: LOGIN FORM SECTION (LIGHT GRAY)
          ==================================================== */}
      <div className="flex-1 bg-gray-50 p-8 md:p-16 flex flex-col justify-between relative min-h-screen">
        
        {/* Top Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-brand-dark-text tracking-tight">Welcome Back</h2>
            <p className="text-xs text-gray-500 font-medium">Sign in to continue to your library</p>
          </div>
          
          <div className="text-right text-xs text-gray-400">
            Need an account?{' '}
            <Link to="/register" className="text-brand-royal-violet font-bold hover:underline">
              Register
            </Link>
          </div>
        </div>

        {/* Central Profile Circle and Form */}
        <div className="max-w-md w-full mx-auto my-12 space-y-8">
          
          {/* User Icon Circle */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-brand-royal-violet/10 text-brand-royal-violet rounded-full flex items-center justify-center shadow-soft border border-brand-lavender-border">
              <User className="w-10 h-10" />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name/Email Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email / Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs text-brand-dark-text focus:outline-none focus:ring-2 focus:ring-brand-royal-violet/20 focus:border-brand-royal-violet transition-all"
                  placeholder="student@lms.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Password</label>
                <a href="#forgot" className="text-[10px] text-brand-royal-violet font-bold hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-xs text-brand-dark-text focus:outline-none focus:ring-2 focus:ring-brand-royal-violet/20 focus:border-brand-royal-violet transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-royal-violet"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 'Login As' Cards Section */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Login As (Quick Demo Select)</label>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Card 1: Student */}
                <div 
                  onClick={() => handleRoleSelect('Student')}
                  className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    selectedRole === 'Student'
                      ? 'border-brand-royal-violet bg-brand-light-lavender/50 text-brand-royal-violet shadow-sm'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-5 h-5" />
                    <span className="text-xs font-bold">Student</span>
                  </div>
                  {selectedRole === 'Student' ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                </div>

                {/* Card 2: Admin */}
                <div 
                  onClick={() => handleRoleSelect('Admin')}
                  className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    selectedRole === 'Admin'
                      ? 'border-brand-royal-violet bg-brand-light-lavender/50 text-brand-royal-violet shadow-sm'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Key className="w-4 h-4" />
                    <span className="text-xs font-bold">Admin</span>
                  </div>
                  {selectedRole === 'Admin' ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                </div>

              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-royal-violet to-brand-deep-purple text-white rounded-xl font-bold text-xs hover:shadow-premium hover:scale-[1.01] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : (
                <>
                  Sign In
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-150 pt-4 mt-8">
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
            <Lock className="w-3.5 h-3.5 text-gray-300" />
            <span>Secure access to your library account</span>
          </div>

          {/* Page control indicator */}
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-brand-royal-violet rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
            <button 
              onClick={() => navigate('/catalog')}
              className="w-7 h-7 bg-white hover:bg-brand-royal-violet/10 border border-gray-200 rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-brand-royal-violet transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Login;
