import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { BorrowingTransaction, Book } from '../types';
import { 
  Home, BookOpen, FileText, Newspaper, ArrowLeft, ArrowRight,
  GraduationCap, Lock, Calendar, MessageSquare, Send, CheckCircle2,
  AlertCircle, LogOut, Search, Sparkles, SlidersHorizontal, Eye, 
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Dashboard states
  const [loans, setLoans] = useState<BorrowingTransaction[]>([]);
  const [overdueCount, setOverdueCount] = useState(0);
  const [finesAmount, setFinesAmount] = useState(0);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  
  // AI Chat states
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Hello! I am your AI Library Assistant. Ask me to recommend books or check account status!' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Recommended Books states
  const [bookSearch, setBookSearch] = useState('');
  const [bookCategory, setBookCategory] = useState('All');
  const [bookPage, setBookPage] = useState(1);
  const booksPerPage = 3;

  const filteredBooks = recommendations.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(bookSearch.toLowerCase()) || 
                          book.author.toLowerCase().includes(bookSearch.toLowerCase());
    const matchesCategory = bookCategory === 'All' || book.category === bookCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage) || 1;
  const paginatedBooks = filteredBooks.slice((bookPage - 1) * booksPerPage, bookPage * booksPerPage);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get active loans / history
        const historyRes = await api.get('/borrow/history');
        const list: BorrowingTransaction[] = historyRes.data;
        setLoans(list.filter(x => x.status === 'Issued' || x.status === 'Overdue'));

        // Overdue count
        const overdue = list.filter(x => x.status === 'Issued' && new Date(x.dueDate) < new Date());
        setOverdueCount(overdue.length);

        // Fines
        const finesRes = await api.get('/fines');
        const finesList = finesRes.data;
        const pendingFines = finesList.filter((f: any) => !f.isPaid).reduce((sum: number, f: any) => sum + f.amount, 0);
        setFinesAmount(pendingFines);

        // AI Recommendations
        const recRes = await api.get('/books/recommendations');
        setRecommendations(recRes.data);

        // Mock recent activities (would map from transaction history log)
        const recentActs = list.slice(0, 3).map(t => {
          if (t.status === 'Returned') {
            return `Returned '${t.bookTitle}' recently`;
          }
          return `Borrowed '${t.bookTitle}' on ${new Date(t.issueDate).toLocaleDateString()}`;
        });
        if (recentActs.length === 0) {
          recentActs.push("No recent activities recorded.");
        }
        setActivities(recentActs);
      } catch (err) {
        console.error("Error loading student dashboard details:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatLog(prev => [...prev, { sender: 'user', text: userText }]);
    setChatMessage('');
    setIsChatLoading(true);

    try {
      const res = await api.post('/books/chat', { message: userText });
      setChatLog(prev => [...prev, { sender: 'bot', text: res.data.response }]);
    } catch (e) {
      setChatLog(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative">
      
      {/* ====================================================
          LEFT SECTION: ROYAL VIOLET SIDEBAR
          ==================================================== */}
      <div className="w-full md:w-[420px] bg-gradient-to-b from-brand-deep-purple via-brand-deep-purple to-purple-950 text-white p-8 flex flex-col justify-between sidebar-pattern min-h-screen relative md:sticky top-0">
        
        {/* Faint elegant background vector books & shelves outlines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full object-cover">
            <rect x="10" y="20" width="30" height="5" fill="#fff" />
            <rect x="15" y="8" width="5" height="12" fill="#fff" />
            <rect x="23" y="10" width="6" height="10" fill="#fff" />
            <rect x="50" y="45" width="40" height="5" fill="#fff" />
            <line x1="10" y1="80" x2="90" y2="80" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>

        {/* Sidebar Content wrapper */}
        <div className="relative z-10 space-y-12">
          
          {/* Branding Area (Top Left) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white text-brand-royal-violet rounded-lg flex items-center justify-center shadow-soft">
                <BookOpen className="w-5 h-5 font-bold" />
              </div>
              <span className="font-extrabold text-lg tracking-wide">Library Management System</span>
            </div>
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span className="font-medium tracking-wide">Digital Library</span>
            </div>
          </div>

          {/* Hero Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Read.<br/>Explore.<br/>Innovate.
            </h1>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Your gateway to books, magazines and newspapers. Explore knowledge and manage your library experience from one place.
            </p>
          </div>

          {/* SIDEBAR NAVIGATION MENU */}
          <nav className="space-y-3">
            
            {/* Nav Item 1: Selected */}
            <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/15 transition-all">
              <div className="flex items-center gap-3.5">
                <Home className="w-5 h-5 text-white" />
                <div>
                  <div className="font-bold text-sm">Dashboard</div>
                  <div className="text-[10px] text-white/50">Main metrics and overview</div>
                </div>
              </div>
              <div className="w-4 h-4 bg-white text-brand-deep-purple rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-brand-royal-violet rounded-full"></div>
              </div>
            </div>

            {/* Nav Item 2: Catalog */}
            <div 
              onClick={() => navigate('/catalog')}
              className="flex items-center gap-3.5 p-4 rounded-2xl cursor-pointer hover:bg-white/5 transition-all group"
            >
              <BookOpen className="w-5 h-5 text-white/60 group-hover:text-white" />
              <div>
                <div className="font-bold text-sm text-white/80 group-hover:text-white">Books Catalog</div>
                <div className="text-[10px] text-white/40">Browse and manage titles</div>
              </div>
            </div>

            {/* Nav Item 3 */}
            <div 
              onClick={() => navigate('/magazines')}
              className="flex items-center gap-3.5 p-4 rounded-2xl cursor-pointer hover:bg-white/5 transition-all group"
            >
              <FileText className="w-5 h-5 text-white/60 group-hover:text-white" />
              <div>
                <div className="font-bold text-sm text-white/80 group-hover:text-white">My Magazines</div>
                <div className="text-[10px] text-white/40">Current and past issues</div>
              </div>
            </div>

            {/* Nav Item 4 */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl cursor-pointer hover:bg-white/5 transition-all group">
              <Newspaper className="w-5 h-5 text-white/60 group-hover:text-white" />
              <div>
                <div className="font-bold text-sm text-white/80 group-hover:text-white">Daily News</div>
                <div className="text-[10px] text-white/40">Today's headlines</div>
              </div>
            </div>

          </nav>
        </div>

        {/* Sidebar Footer and Nav Control */}
        <div className="relative z-10 pt-8 flex items-center justify-between border-t border-white/10 mt-12 md:mt-0">
          <span className="text-[11px] text-white/40">@ 2026 Library Management System</span>
          
          {/* Floating Navigation Control */}
          <div className="flex gap-2">
            <button 
              onClick={logout}
              title="Logout"
              className="w-9 h-9 bg-white/10 hover:bg-red-500/20 hover:text-red-300 border border-white/10 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ====================================================
          RIGHT SECTION: CLEAN WHITE CONTENT AREA
          ==================================================== */}
      <div className="flex-1 bg-white p-8 md:p-12 space-y-12">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-light-lavender pb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-brand-dark-text tracking-tight">Student Dashboard Overview</h2>
            <p className="text-gray-500 text-sm mt-1">Welcome back, <span className="font-semibold text-brand-royal-violet">{user?.name || 'Student'}</span></p>
          </div>
          
          {/* Profile Section */}
          <div className="flex items-center gap-3 bg-brand-light-lavender px-4 py-2 rounded-2xl border border-brand-lavender-border">
            <div className="text-right">
              <div className="font-bold text-xs text-brand-dark-text">{user?.name || 'Alice Student'}</div>
              <div className="text-[10px] text-gray-500">{user?.email || 'student@lms.com'}</div>
            </div>
            <div className="w-10 h-10 bg-purple-200 text-brand-royal-violet rounded-full flex items-center justify-center font-bold text-sm shadow-soft">
              {user?.name ? user.name.split(' ').map(n=>n[0]).join('') : 'ST'}
            </div>
          </div>
        </div>

        {/* SUMMARY METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Loans */}
          <div className="bg-brand-light-lavender border border-brand-lavender-border rounded-2xl p-6 relative overflow-hidden shadow-soft group hover:border-brand-royal-violet/30 transition-all">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-white text-brand-royal-violet rounded-xl flex items-center justify-center shadow-soft">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="w-5 h-5 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-5 space-y-1">
              <h3 className="text-2xl font-extrabold text-brand-dark-text">{loans.length}</h3>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Current Loans</p>
            </div>
          </div>

          {/* Card 2: Fines */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden shadow-soft group hover:border-brand-royal-violet/30 transition-all">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-purple-50 text-brand-royal-violet rounded-xl flex items-center justify-center shadow-soft">
                <Lock className="w-5 h-5" />
              </div>
              {finesAmount > 0 && (
                <div className="px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-[10px] font-bold">
                  Overdue
                </div>
              )}
            </div>
            <div className="mt-5 space-y-1">
              <h3 className="text-2xl font-extrabold text-brand-dark-text">${finesAmount.toFixed(2)}</h3>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Fines Pending</p>
            </div>
          </div>

          {/* Card 3: Overdue */}
          <div className="bg-brand-light-lavender border border-brand-lavender-border rounded-2xl p-6 relative overflow-hidden shadow-soft group hover:border-brand-royal-violet/30 transition-all">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-white text-brand-royal-violet rounded-xl flex items-center justify-center shadow-soft">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="w-5 h-5 bg-brand-royal-violet/10 text-brand-royal-violet rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-5 space-y-1">
              <h3 className="text-2xl font-extrabold text-brand-dark-text">{overdueCount}</h3>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Overdue Items</p>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* RECENT LIBRARY ACTIVITY SECTION & AI REC */}
          <div className="space-y-8 lg:col-span-2">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-brand-dark-text">Recent Library Activity</h3>
              <div className="border border-brand-light-lavender rounded-2xl p-6 space-y-6">
                
                {activities.map((act, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-brand-light-lavender text-brand-royal-violet rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index === 0 ? <CheckCircle2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-brand-dark-text">{act}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Verified activity log</div>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* AI Recommendation Listing */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-brand-dark-text flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-royal-violet" />
                  Recommended Books
                </h3>
                
                {/* Search and Category Filter */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={bookSearch}
                      onChange={(e) => { setBookSearch(e.target.value); setBookPage(1); }}
                      placeholder="Search recommended..."
                      className="w-full pl-8 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-brand-dark-text focus:outline-none focus:ring-1 focus:ring-brand-royal-violet focus:border-brand-royal-violet"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={bookCategory}
                      onChange={(e) => { setBookCategory(e.target.value); setBookPage(1); }}
                      className="pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] text-brand-dark-text focus:outline-none focus:ring-1 focus:ring-brand-royal-violet appearance-none"
                    >
                      <option value="All">All Genres</option>
                      <option value="Programming">Programming</option>
                      <option value="Sci-Fi">Sci-Fi</option>
                      <option value="History">History</option>
                      <option value="Fantasy">Fantasy</option>
                    </select>
                    <SlidersHorizontal className="w-3 h-3 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              {/* Books Data Table (Clean spacious layout) */}
              <div className="bg-white border border-brand-lavender-border rounded-2xl overflow-hidden shadow-soft">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-light-lavender border-b border-brand-lavender-border">
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-455 uppercase tracking-wider">Cover</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-455 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-455 uppercase tracking-wider">Author</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-455 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-455 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-455 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-light-lavender">
                    {paginatedBooks.length > 0 ? (
                      paginatedBooks.map((book) => (
                        <tr key={book.id} className="hover:bg-brand-light-lavender/5 transition-colors group">
                          <td className="px-4 py-3.5">
                            <div className="w-16 h-22 bg-purple-50 text-brand-royal-violet rounded-lg border border-purple-100/50 flex items-center justify-center overflow-hidden shadow-sm relative flex-shrink-0">
                              {book.coverImage ? (
                                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                              ) : (
                                <BookOpen className="w-6 h-6 text-brand-royal-violet/30" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-xs font-bold text-brand-dark-text">{book.title}</td>
                          <td className="px-4 py-3.5 text-xs text-gray-500 font-medium">By {book.author}</td>
                          <td className="px-4 py-3.5">
                            <span className="inline-block px-2.5 py-0.5 bg-brand-royal-violet/15 text-brand-royal-violet border border-brand-lavender-border rounded-full text-[9px] font-bold uppercase tracking-wider">
                              {book.category}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-xs">
                            {book.availableCopies > 0 ? (
                              <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">
                                Available
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-[10px] font-bold">
                                Borrowed
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-xs text-right space-x-2">
                            <button 
                              onClick={() => navigate('/catalog')}
                              className="p-1.5 bg-white border border-gray-200 text-gray-400 hover:text-brand-royal-violet hover:border-brand-royal-violet/30 rounded-lg transition-colors shadow-sm inline-flex items-center justify-center align-middle"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => navigate('/catalog')}
                              className="px-3 py-1.5 bg-brand-royal-violet hover:bg-brand-royal-violet/90 text-white rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition-all shadow-soft align-middle"
                            >
                              <BookOpen className="w-3 h-3" />
                              Borrow
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-xs text-gray-400 font-bold">
                          No recommended books matching filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center pt-2">
                  <div className="text-[10px] text-gray-500 font-medium">
                    Showing {paginatedBooks.length} of {filteredBooks.length} books
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setBookPage(prev => Math.max(1, prev - 1))}
                      disabled={bookPage === 1}
                      className="w-7 h-7 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 rounded-lg flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setBookPage(i + 1)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold shadow-sm border transition-all ${
                          bookPage === i + 1
                            ? 'bg-brand-royal-violet border-brand-royal-violet text-white'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button 
                      onClick={() => setBookPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={bookPage === totalPages}
                      className="w-7 h-7 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 rounded-lg flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI ASSISTANT CHAT BOT (Right Pane) */}
          <div className="border border-brand-lavender-border bg-brand-light-lavender/30 rounded-3xl p-6 flex flex-col h-[400px] shadow-soft lg:col-span-1">
            <div className="flex items-center gap-2 pb-4 border-b border-brand-lavender-border">
              <div className="w-8 h-8 bg-brand-royal-violet text-white rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-brand-dark-text">Library AI Assistant</h4>
                <p className="text-[10px] text-gray-500">Ask for recommendations or account status</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-2 scroll-smooth">
              {chatLog.map((log, i) => (
                <div key={i} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                    log.sender === 'user' 
                      ? 'bg-brand-royal-violet text-white rounded-br-none shadow-soft' 
                      : 'bg-white text-brand-dark-text border border-brand-lavender-border rounded-bl-none shadow-sm'
                  }`}>
                    {log.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-400 border border-brand-lavender-border rounded-2xl rounded-bl-none px-4 py-2.5 text-xs shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about programming books..."
                className="flex-1 px-4 py-2.5 bg-white border border-brand-lavender-border rounded-xl text-xs text-brand-dark-text focus:outline-none focus:ring-1 focus:ring-brand-royal-violet focus:border-brand-royal-violet transition-colors"
              />
              <button 
                type="submit"
                className="w-10 h-10 bg-brand-royal-violet hover:bg-brand-royal-violet/90 text-white rounded-xl flex items-center justify-center transition-colors shadow-soft"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* PRIMARY ACTION BUTTON & SECURITY BADGE */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-brand-light-lavender pt-8">
          
          {/* Primary Action Button */}
          <button 
            onClick={() => navigate('/catalog')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-royal-violet to-brand-deep-purple hover:scale-[1.01] transition-transform text-white font-bold rounded-2xl shadow-premium flex items-center justify-center gap-2 group text-sm"
          >
            Browse New Arrivals
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Security Badge */}
          <div className="flex items-center gap-2.5 text-xs text-gray-500 font-medium bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-full">
            <div className="w-5 h-5 bg-purple-100 text-brand-royal-violet rounded-full flex items-center justify-center flex-shrink-0">
              <Lock className="w-3 h-3" />
            </div>
            <span>Secure access to your library account</span>
          </div>

        </div>

      </div>

      {/* Mirrored right floating navigation arrow button */}
      <button 
        onClick={() => navigate('/catalog')}
        title="Go to Book Catalog"
        className="fixed bottom-6 right-6 w-12 h-12 bg-black hover:bg-brand-royal-violet text-white rounded-full flex items-center justify-center shadow-premium hover:scale-110 transition-all z-40 hidden md:flex"
      >
        <ArrowRight className="w-5 h-5" />
      </button>

    </div>
  );
};

export default StudentDashboard;
