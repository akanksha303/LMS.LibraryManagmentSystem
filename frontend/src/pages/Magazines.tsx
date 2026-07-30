import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, BookOpen, FileText, Newspaper, Tags, RefreshCw, BarChart2, Settings, 
  HelpCircle, LogOut, Plus, Search, SlidersHorizontal, Eye, BookMarked, ChevronLeft, ChevronRight 
} from 'lucide-react';

interface Magazine {
  id: string;
  title: string;
  publisher: string;
  publishDate: string;
  category: string;
  status: 'Available' | 'Borrowed';
}

const Magazines: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock magazines list (5 items)
  const [magazines, setMagazines] = useState<Magazine[]>([
    { id: '1', title: 'Tech Horizon', publisher: 'Future Media Group', publishDate: 'July 2026', category: 'Science & Technology', status: 'Available' },
    { id: '2', title: 'Financial Outlook', publisher: 'Capital Press', publishDate: 'June 2026', category: 'Business', status: 'Available' },
    { id: '3', title: 'National Chronicle', publisher: 'Global News House', publishDate: 'July 30, 2026', category: 'News', status: 'Available' },
    { id: '4', title: 'Scientific Insights', publisher: 'Academic Discovery', publishDate: 'July 2026', category: 'Science & Technology', status: 'Available' },
    { id: '5', title: 'Modern Lifestyle', publisher: 'Conde Style', publishDate: 'May 2026', category: 'Lifestyle', status: 'Available' }
  ]);

  const categories = ['All', 'News', 'Science & Technology', 'Business', 'Education', 'Lifestyle'];

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const filteredMagazines = magazines.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.publisher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white flex text-charcoal font-sans">
      
      {/* ====================================================
          1. FIXED LEFT SIDEBAR NAVIGATION (WHITE BACKGROUND)
          ==================================================== */}
      <aside className="w-64 bg-white border-r border-gray-150 flex flex-col justify-between p-4 flex-shrink-0 h-screen sticky top-0">
        <div className="space-y-6">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center shadow-sm">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <span className="font-extrabold text-sm text-black tracking-tight">LMS Portal</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            
            {/* Dashboard */}
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50/50 rounded-lg text-xs font-semibold transition-all text-left"
            >
              <Home className="w-4.5 h-4.5" />
              <span>Dashboard</span>
            </button>

            {/* Books (Catalog) */}
            <button 
              onClick={() => navigate('/catalog')}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50/50 rounded-lg text-xs font-semibold transition-all text-left"
            >
              <BookOpen className="w-4.5 h-4.5" />
              <span>Books</span>
            </button>

            {/* Magazines (Active State) */}
            <button 
              onClick={() => navigate('/magazines')}
              className="w-full flex items-center justify-between px-3 py-2 bg-orange-50 border-l-[3.5px] border-orange-500 text-orange-500 rounded-r-lg text-xs font-bold transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-orange-500" />
                <span>Magazines</span>
              </div>
            </button>

            {/* Newspapers */}
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50/50 rounded-lg text-xs font-semibold transition-all text-left opacity-60 cursor-not-allowed"
              disabled
            >
              <Newspaper className="w-4.5 h-4.5" />
              <span>Newspapers</span>
            </button>

            {/* Categories */}
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50/50 rounded-lg text-xs font-semibold transition-all text-left opacity-60 cursor-not-allowed"
              disabled
            >
              <Tags className="w-4.5 h-4.5" />
              <span>Categories</span>
            </button>

            {/* Issue / Return */}
            <button 
              onClick={() => navigate('/librarian')}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50/50 rounded-lg text-xs font-semibold transition-all text-left"
            >
              <RefreshCw className="w-4.5 h-4.5" />
              <span>Issue / Return</span>
            </button>

            {/* Reports */}
            <button 
              onClick={() => navigate('/admin')}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50/50 rounded-lg text-xs font-semibold transition-all text-left"
            >
              <BarChart2 className="w-4.5 h-4.5" />
              <span>Reports</span>
            </button>

            {/* Settings */}
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50/50 rounded-lg text-xs font-semibold transition-all text-left opacity-60 cursor-not-allowed"
              disabled
            >
              <Settings className="w-4.5 h-4.5" />
              <span>Settings</span>
            </button>

          </nav>
        </div>

        {/* Need Help & Logout Bottom Widget */}
        <div className="space-y-4">
          
          {/* "Need Help?" Widget */}
          <div className="bg-orange-50/70 border border-orange-100 rounded-lg p-3 text-center space-y-2">
            <div className="flex justify-center text-orange-500">
              <HelpCircle className="w-5 h-5" />
            </div>
            <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
              Contact the librarian if you have any problems.
            </p>
            <button 
              onClick={() => alert("Connecting to librarian contact service...")}
              className="w-full py-1.5 bg-orange-500 text-white rounded-md text-[10px] font-bold hover:bg-orange-600 transition-colors shadow-sm"
            >
              Contact Us
            </button>
          </div>

          {/* Logout Link */}
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2.5 px-2 py-1.5 text-gray-500 hover:text-orange-500 text-xs font-bold transition-all text-left border-t border-gray-100 pt-3"
          >
            <LogOut className="w-4 h-4 rotate-180" />
            <span>Logout</span>
          </button>

        </div>
      </aside>

      {/* ====================================================
          2. MAIN CONTENT AREA (RIGHT ROW)
          ==================================================== */}
      <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto space-y-6">
        
        {/* Main Content Area - Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="text-orange-500">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-black tracking-tight">Magazines</h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Explore our extensive magazine collection.</p>
            </div>
          </div>
          
          {/* Primary Action Button */}
          <button 
            onClick={() => alert("Add Magazine form coming soon!")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add New Magazine
          </button>
        </div>

        {/* ====================================================
            3. FILTERS & SEARCH SECTION
            ==================================================== */}
        <div className="space-y-4">
          
          {/* Category Pills */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all ${
                  activeCategory === cat
                    ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {cat === 'Science & Technology' ? 'Science & Tech' : cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 bg-white border border-gray-200 rounded-lg text-xs text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              placeholder="Search magazine by title or publisher..."
            />
            <button 
              onClick={() => alert("Advanced filter sidebar option...")}
              className="absolute right-2 px-3 py-1 bg-white border border-gray-200 hover:border-gray-300 text-gray-500 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter
            </button>
          </div>

        </div>

        {/* ====================================================
            4. DATA TABLE
            ==================================================== */}
        <div className="bg-white border border-gray-150 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-orange-50/70 border-b border-gray-150">
                <th className="px-5 py-3 text-xs font-bold text-black uppercase tracking-wider">Title</th>
                <th className="px-5 py-3 text-xs font-bold text-black uppercase tracking-wider">Author / Publisher</th>
                <th className="px-5 py-3 text-xs font-bold text-black uppercase tracking-wider">Publication Date</th>
                <th className="px-5 py-3 text-xs font-bold text-black uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-bold text-black text-right uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {filteredMagazines.length > 0 ? (
                filteredMagazines.map((mag) => (
                  <tr key={mag.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-5 py-4 text-xs font-bold text-black">{mag.title}</td>
                    <td className="px-5 py-4 text-xs text-gray-600 font-medium">{mag.publisher}</td>
                    <td className="px-5 py-4 text-xs text-gray-500 font-medium">{mag.publishDate}</td>
                    <td className="px-5 py-4 text-xs">
                      <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">
                        {mag.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-right space-x-2">
                      {/* View Action (Outlined Eye Icon) */}
                      <button 
                        onClick={() => alert(`Viewing details for ${mag.title}`)}
                        className="p-1.5 bg-white border border-gray-200 text-gray-400 hover:text-orange-500 hover:border-orange-500 rounded-md transition-colors shadow-sm inline-flex items-center justify-center align-middle"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      
                      {/* Borrow Action (Orange Button with BookMarked Icon) */}
                      <button 
                        onClick={() => alert(`Borrow request submitted for ${mag.title}`)}
                        className="px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-[10px] font-bold flex inline-flex items-center gap-1 transition-colors shadow-sm align-middle"
                      >
                        <BookMarked className="w-3 h-3" />
                        Borrow
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-xs text-gray-400 font-bold">
                    No magazines found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ====================================================
            5. TABLE FOOTER & PAGINATION
            ==================================================== */}
        <div className="flex justify-between items-center pt-2">
          <div className="text-[11px] text-gray-500 font-medium">
            Showing {filteredMagazines.length} magazines
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5">
            {/* Prev Arrow */}
            <button 
              className="w-7 h-7 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 rounded-md flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 disabled:pointer-events-none"
              disabled
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page 1 (Active) */}
            <button className="w-7 h-7 bg-orange-500 border border-orange-500 text-white rounded-md text-xs font-bold shadow-sm">
              1
            </button>

            {/* Page 2 (Inactive) */}
            <button className="w-7 h-7 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 rounded-md text-xs font-medium transition-colors shadow-sm">
              2
            </button>

            {/* Next Arrow */}
            <button className="w-7 h-7 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 rounded-md flex items-center justify-center transition-colors shadow-sm">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Magazines;
