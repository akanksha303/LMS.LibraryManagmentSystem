import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Book, User, BorrowingTransaction } from '../types';
import { 
  PlusCircle, CheckCircle2, AlertCircle, ShoppingBag, 
  RefreshCw, LogOut, Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LibrarianDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Selections for Issue Book
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [activeLoans, setActiveLoans] = useState<BorrowingTransaction[]>([]);

  // Form states
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  
  // Feedback
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const booksRes = await api.get('/books', { params: { pageSize: 100 } });
      setBooks(booksRes.data.books.filter((b: Book) => b.availableCopies > 0));

      const usersRes = await api.get('/users');
      setMembers(usersRes.data.filter((u: User) => u.role === 'Student'));

      const activeRes = await api.get('/borrow/active');
      setActiveLoans(activeRes.data);
    } catch (e) {
      console.error("Error fetching librarian metadata:", e);
    }
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !selectedMember) {
      setMessage({ type: 'error', text: 'Select both a book and a student.' });
      return;
    }

    setMessage(null);
    setIsLoading(true);
    try {
      await api.post('/borrow/issue', {
        bookId: selectedBook,
        userId: selectedMember
      });
      setMessage({ type: 'success', text: 'Book issued successfully.' });
      setSelectedBook('');
      setSelectedMember('');
      fetchMetadata();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to issue book.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = async (transactionId: string) => {
    setMessage(null);
    setIsLoading(true);
    try {
      const res = await api.post(`/borrow/return/${transactionId}`);
      const data = res.data;
      if (data.fineAmount > 0) {
        setMessage({ type: 'success', text: `Book returned. Late fee registered: $${data.fineAmount.toFixed(2)}.` });
      } else {
        setMessage({ type: 'success', text: 'Book returned successfully with no late fees.' });
      }
      fetchMetadata();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to return book.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 space-y-10">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-dark-text flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-royal-violet" />
            Librarian Workstation
          </h2>
          <p className="text-xs text-gray-500">Manage book borrowing, return cycles and members</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:text-brand-royal-violet transition-colors"
          >
            Analytics View
          </button>
          <button 
            onClick={logout}
            className="w-9 h-9 bg-white hover:bg-red-50 text-red-500 border border-gray-200 rounded-full flex items-center justify-center transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-2 text-sm max-w-2xl ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Issue Book Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-soft space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <PlusCircle className="w-5 h-5 text-brand-royal-violet" />
            <h3 className="font-extrabold text-brand-dark-text text-sm">Issue Book Transaction</h3>
          </div>

          <form onSubmit={handleIssue} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Select Book</label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-brand-dark-text focus:outline-none focus:ring-1 focus:ring-brand-royal-violet"
              >
                <option value="">-- Choose Book in stock --</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>{b.title} ({b.author}) - {b.availableCopies} available</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Select Student</label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-brand-dark-text focus:outline-none focus:ring-1 focus:ring-brand-royal-violet"
              >
                <option value="">-- Choose Active Student --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-brand-royal-violet hover:bg-brand-royal-violet/90 text-white rounded-xl font-bold text-xs shadow-soft flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Issue Book
            </button>
          </form>
        </div>

        {/* Active Loans Table */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-soft space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-brand-royal-violet" />
              <h3 className="font-extrabold text-brand-dark-text text-sm">Active Borrowed Books</h3>
            </div>
            <span className="px-2.5 py-0.5 bg-brand-light-lavender text-brand-royal-violet text-[10px] font-bold rounded-full">{activeLoans.length} Loans</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5">Book Title</th>
                  <th className="py-2.5">Borrowed By</th>
                  <th className="py-2.5">Due Date</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeLoans.map(loan => {
                  const isOverdue = new Date(loan.dueDate) < new Date();
                  return (
                    <tr key={loan.id} className="hover:bg-gray-50/50">
                      <td className="py-3 font-semibold text-brand-dark-text">
                        <div>{loan.bookTitle}</div>
                        <div className="text-[10px] text-gray-400 font-normal">By {loan.bookAuthor}</div>
                      </td>
                      <td className="py-3">
                        <div className="font-medium">{loan.userName}</div>
                        <div className="text-[10px] text-gray-400">{loan.userEmail}</div>
                      </td>
                      <td className="py-3">
                        <div className={isOverdue ? 'text-red-500 font-bold' : 'text-gray-600'}>
                          {new Date(loan.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleReturn(loan.id)}
                          className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-[10px] transition-colors"
                        >
                          Check In (Return)
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {activeLoans.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">No active books currently checked out.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default LibrarianDashboard;
