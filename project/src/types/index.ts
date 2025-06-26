export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  joinDate: string;
  avatar?: string;
  isActive?: boolean;
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  description: string;
  publishDate: string;
  genre: string;
  language: string;
  pages: number;
  coverImage: string;
  authors: Author[];
  status: 'available' | 'borrowed' | 'reserved';
  borrowedBy?: string;
  borrowDate?: string;
  dueDate?: string;
  reservedBy?: string[];
}

export interface Loan {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
}

export interface LibrarySettings {
  maxBooksPerUser: number;
  defaultLoanDuration: number;
  lateFeePerDay: number;
  maxLateDays: number;
}

export interface ConnectionLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  type: 'login' | 'logout' | 'failed_login';
  timestamp: string;
  ipAddress: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'joinDate'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface LibraryContextType {
  books: Book[];
  loans: Loan[];
  authors: Author[];
  users: User[];
  settings: LibrarySettings;
  connectionLogs: ConnectionLog[];
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  borrowBook: (bookId: string, userId: string) => boolean;
  returnBook: (bookId: string) => void;
  reserveBook: (bookId: string, userId: string) => boolean;
  addAuthor: (author: Omit<Author, 'id'>) => void;
  updateAuthor: (id: string, author: Partial<Author>) => void;
  deleteAuthor: (id: string) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  updateSettings: (settings: Partial<LibrarySettings>) => void;
  addConnectionLog: (log: Omit<ConnectionLog, 'id'>) => void;
}