import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Book } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Search, Filter, ArrowUpDown, ArrowLeft, BookOpen, AlertCircle, 
  Sparkles, CheckCircle2, ShoppingBag 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Catalog: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchBooks();
  }, [search, category, sortBy, onlyAvailable, page]);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books', {
        params: {
          search: search || undefined,
          category: category || undefined,
          sortBy,
          onlyAvailable: onlyAvailable || undefined,
          page,
          pageSize: 6
        }
      });
      setBooks(res.data.books);
      setTotalCount(res.data.totalCount);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const handleReserve = async (bookId: string) => {
    setMessage(null);
    try {
      const res = await api.post('/reservations', { bookId });
      setMessage({ type: 'success', text: `Book reserved successfully! ID: ${res.data.id}` });
      fetchBooks();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to reserve book.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 space-y-8">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-brand-royal-violet hover:border-brand-royal-violet/30 shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold text-brand-dark-text">Digital Catalog</h2>
            <p className="text-xs text-gray-500">Search and explore our entire archive</p>
          </div>
        </div>

        {/* User context badge */}
        <div className="hidden sm:flex items-center gap-2 bg-brand-light-lavender px-4 py-2 rounded-xl border border-brand-lavender-border text-xs font-semibold text-brand-dark-text">
          <Sparkles className="w-3.5 h-3.5 text-brand-royal-violet" />
          <span>Role: {user?.role || 'Student'}</span>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-2 text-sm max-w-xl ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter panel */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-soft grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title, author..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-brand-dark-text focus:outline-none focus:ring-1 focus:ring-brand-royal-violet"
          />
        </div>

        {/* Category */}
        <div className="relative">
          <Filter className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-brand-dark-text focus:outline-none focus:ring-1 focus:ring-brand-royal-violet appearance-none"
          >
            <option value="">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="History">History</option>
            <option value="Fantasy">Fantasy</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="relative">
          <ArrowUpDown className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-brand-dark-text focus:outline-none focus:ring-1 focus:ring-brand-royal-violet appearance-none"
          >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="isbn">Sort by ISBN</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>

        {/* Only Available toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none pl-2">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => { setOnlyAvailable(e.target.checked); setPage(1); }}
            className="rounded text-brand-royal-violet focus:ring-brand-royal-violet w-4 h-4 accent-brand-royal-violet"
          />
          <span className="text-xs text-gray-600 font-medium">Show only available titles</span>
        </label>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-soft flex flex-col justify-between hover:border-brand-royal-violet/30 transition-all group">
            
            <div className="p-5 flex gap-4">
              {/* Cover Placeholder */}
              <div className="w-24 h-32 bg-purple-50 text-brand-royal-violet rounded-lg border border-purple-100/50 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm relative">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-8 h-8 text-brand-royal-violet/40" />
                )}
                <div className="absolute top-1 right-1 bg-white/80 px-1 py-0.5 rounded text-[8px] font-bold border border-gray-200">{book.rackLocation}</div>
              </div>

              {/* Text metadata */}
              <div className="space-y-1.5 flex-1">
                <div className="inline-block px-2 py-0.5 bg-brand-light-lavender text-brand-royal-violet border border-brand-lavender-border rounded-full text-[9px] font-extrabold uppercase tracking-wider">{book.category}</div>
                <h3 className="text-sm font-extrabold text-brand-dark-text line-clamp-2 leading-snug group-hover:text-brand-royal-violet transition-colors">{book.title}</h3>
                <p className="text-xs text-gray-500">By {book.author}</p>
                <div className="text-[10px] text-gray-400 space-y-0.5">
                  <div>ISBN: {book.isbn}</div>
                  <div>Publisher: {book.publisher}</div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <div className="font-semibold text-gray-500">
                Copies: <span className={book.availableCopies > 0 ? 'text-green-600' : 'text-red-500'}>{book.availableCopies}</span> / {book.totalCopies}
              </div>

              {book.availableCopies > 0 ? (
                <div className="text-[10px] text-green-600 font-bold bg-green-50 border border-green-200/50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Available
                </div>
              ) : (
                <button
                  onClick={() => handleReserve(book.id)}
                  className="px-3 py-1.5 bg-brand-royal-violet hover:bg-brand-royal-violet/90 text-white rounded-lg font-bold text-[10px] shadow-soft flex items-center gap-1 transition-colors"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Reserve Book
                </button>
              )}
            </div>

          </div>
        ))}

        {books.length === 0 && (
          <div className="md:col-span-3 text-center py-12 bg-white border border-gray-100 rounded-2xl">
            <p className="text-gray-400 text-sm">No books matching search parameters found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalCount > 6 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold hover:border-brand-royal-violet disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-xs font-bold text-brand-dark-text">Page {page} of {Math.ceil(totalCount / 6)}</span>
          <button
            onClick={() => setPage(p => (p * 6 < totalCount ? p + 1 : p))}
            disabled={page * 6 >= totalCount}
            className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold hover:border-brand-royal-violet disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
