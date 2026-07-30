import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { DashboardStats } from '../types';
import { 
  Sparkles, ArrowLeft, BarChart2, BookOpen, Users, 
  DollarSign, RefreshCw, Star, ShieldAlert 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (e) {
      console.error("Error fetching admin stats:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-bold text-sm">Loading analytics parameters...</p>
      </div>
    );
  }

  // Find max borrow count for scaling the simple bar chart
  const maxBorrow = stats.monthlyBorrowingTrends.length > 0 
    ? Math.max(...stats.monthlyBorrowingTrends.map(t => t.borrowCount)) 
    : 10;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-brand-royal-violet hover:border-brand-royal-violet/30 shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold text-brand-dark-text flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-brand-royal-violet" />
              Administrative Analytics
            </h2>
            <p className="text-xs text-gray-500">Global statistics, monthly borrowing trends and active profiles</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/librarian')}
          className="px-3.5 py-1.5 bg-brand-royal-violet hover:bg-brand-royal-violet/90 text-white rounded-lg font-bold text-xs shadow-soft transition-colors"
        >
          Librarian Controls
        </button>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Books */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-brand-royal-violet rounded-xl flex items-center justify-center shadow-soft">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-brand-dark-text">{stats.totalBooks}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Copies</div>
          </div>
        </div>

        {/* Checked Out */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-brand-royal-violet rounded-xl flex items-center justify-center shadow-soft">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-brand-dark-text">{stats.issuedBooks}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Loans</div>
          </div>
        </div>

        {/* Total Members */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-brand-royal-violet rounded-xl flex items-center justify-center shadow-soft">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-brand-dark-text">{stats.totalMembers}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Members</div>
          </div>
        </div>

        {/* Fines */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shadow-soft">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-brand-dark-text">${stats.pendingFines.toFixed(2)}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Unpaid Fines</div>
          </div>
        </div>

      </div>

      {/* Main Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Borrowing Trends Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-soft lg:col-span-2 space-y-6">
          <h3 className="font-extrabold text-brand-dark-text text-sm">Monthly Borrowing Trends</h3>
          
          <div className="h-64 flex items-end justify-between gap-4 pt-4 border-b border-gray-150">
            {stats.monthlyBorrowingTrends.map((trend, i) => {
              const heightPercent = maxBorrow > 0 ? (trend.borrowCount / maxBorrow) * 80 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-bold text-brand-royal-violet opacity-0 group-hover:opacity-100 transition-opacity">
                    {trend.borrowCount}
                  </div>
                  <div 
                    style={{ height: `${Math.max(10, heightPercent)}%` }} 
                    className="w-full bg-gradient-to-t from-brand-deep-purple to-brand-royal-violet rounded-t-lg group-hover:scale-x-105 transition-transform"
                  ></div>
                  <div className="text-[10px] font-semibold text-gray-400 mt-2 truncate w-full text-center">
                    {trend.month}
                  </div>
                </div>
              );
            })}
            
            {stats.monthlyBorrowingTrends.length === 0 && (
              <div className="w-full text-center pb-24 text-gray-400 text-xs">No trend records compiled yet.</div>
            )}
          </div>
        </div>

        {/* Most Borrowed Books */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-soft space-y-4">
          <h3 className="font-extrabold text-brand-dark-text text-sm flex items-center gap-2">
            <Star className="w-4 h-4 text-brand-royal-violet" />
            Top Borrowed Books
          </h3>

          <div className="space-y-4">
            {stats.mostBorrowedBooks.map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-150 pb-2">
                <div>
                  <div className="font-bold text-xs text-brand-dark-text line-clamp-1">{item.title}</div>
                  <div className="text-[10px] text-gray-400">By {item.author}</div>
                </div>
                <div className="bg-brand-light-lavender text-brand-royal-violet border border-brand-lavender-border text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                  {item.borrowCount} Checkouts
                </div>
              </div>
            ))}

            {stats.mostBorrowedBooks.length === 0 && (
              <p className="text-gray-400 text-xs py-8 text-center">No transactions recorded.</p>
            )}
          </div>
        </div>

        {/* Active Members Listing */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-soft lg:col-span-3 space-y-4">
          <h3 className="font-extrabold text-brand-dark-text text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-royal-violet" />
            Most Active Members
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.activeUsers.map((item, i) => (
              <div key={i} className="p-4 bg-gray-50 border border-gray-150 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-brand-dark-text">{item.name}</div>
                  <div className="text-[10px] text-gray-400">{item.email}</div>
                </div>
                <div className="text-[10px] text-gray-500 font-bold bg-white border border-gray-200 px-2 py-1 rounded-lg">
                  {item.booksBorrowedCount} Books
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
