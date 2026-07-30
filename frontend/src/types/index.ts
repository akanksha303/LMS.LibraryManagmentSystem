export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  membershipDate?: string;
  status?: string;
  role: 'Admin' | 'Librarian' | 'Student';
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  edition: string;
  language: string;
  totalCopies: number;
  availableCopies: number;
  rackLocation: string;
  coverImage: string;
  averageRating: number;
}

export interface BorrowingTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
  fineAmount?: number;
  isFinePaid?: boolean;
}

export interface Fine {
  id: string;
  transactionId: string;
  bookTitle: string;
  amount: number;
  isPaid: boolean;
  createdDate: string;
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  reservationDate: string;
  status: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  rating: number;
  comment: string;
  createdDate: string;
}

export interface BookPopularity {
  title: string;
  author: string;
  borrowCount: number;
}

export interface BorrowingTrend {
  month: string;
  borrowCount: number;
}

export interface ActiveUser {
  name: string;
  email: string;
  booksBorrowedCount: number;
}

export interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  issuedBooks: number;
  totalMembers: number;
  pendingFines: number;
  mostBorrowedBooks: BookPopularity[];
  monthlyBorrowingTrends: BorrowingTrend[];
  activeUsers: ActiveUser[];
}
