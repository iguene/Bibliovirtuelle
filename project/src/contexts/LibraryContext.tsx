import React, { createContext, useContext, useState, useEffect } from 'react';
import { LibraryContextType, Book, Loan, Author, User, LibrarySettings, ConnectionLog } from '../types';
import { apiService } from '../services/api';

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

interface LibraryProviderProps {
  children: React.ReactNode;
}

const defaultSettings: LibrarySettings = {
  maxBooksPerUser: 5,
  defaultLoanDuration: 30,
  lateFeePerDay: 0.50,
  maxLateDays: 90
};

export const LibraryProvider: React.FC<LibraryProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<LibrarySettings>(defaultSettings);
  const [connectionLogs, setConnectionLogs] = useState<ConnectionLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Transform Django data to frontend format
  const transformBook = (djangoBook: any): Book => ({
    id: djangoBook.id.toString(),
    title: djangoBook.title,
    isbn: djangoBook.isbn,
    description: djangoBook.description,
    publishDate: djangoBook.publish_date,
    genre: djangoBook.categories?.[0]?.name || 'Non classé',
    language: djangoBook.language === 'fr' ? 'Français' : 
              djangoBook.language === 'en' ? 'Anglais' : 
              djangoBook.language === 'es' ? 'Espagnol' : 'Autre',
    pages: djangoBook.pages,
    coverImage: djangoBook.cover_image || 'https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=2',
    authors: djangoBook.authors?.map((author: any) => ({
      id: author.id.toString(),
      firstName: author.first_name,
      lastName: author.last_name,
      biography: author.biography,
      birthDate: author.birth_date,
      nationality: author.nationality
    })) || [],
    status: djangoBook.status === 'available' ? 'available' : 
            djangoBook.status === 'borrowed' ? 'borrowed' : 'reserved'
  });

  const transformLoan = (djangoLoan: any): Loan => ({
    id: djangoLoan.id.toString(),
    bookId: djangoLoan.book?.id?.toString() || '',
    userId: djangoLoan.user?.id?.toString() || '',
    borrowDate: djangoLoan.borrow_date,
    dueDate: djangoLoan.due_date,
    returnDate: djangoLoan.return_date,
    status: djangoLoan.status === 'active' ? 'active' : 
            djangoLoan.status === 'returned' ? 'returned' : 'overdue'
  });

  const transformAuthor = (djangoAuthor: any): Author => ({
    id: djangoAuthor.id.toString(),
    firstName: djangoAuthor.first_name,
    lastName: djangoAuthor.last_name,
    biography: djangoAuthor.biography,
    birthDate: djangoAuthor.birth_date,
    nationality: djangoAuthor.nationality
  });

  const transformUser = (djangoUser: any): User => ({
    id: djangoUser.id.toString(),
    email: djangoUser.email,
    firstName: djangoUser.first_name,
    lastName: djangoUser.last_name,
    role: djangoUser.role,
    joinDate: djangoUser.join_date,
    avatar: djangoUser.avatar,
    isActive: djangoUser.is_active !== false
  });

  // Load initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [booksData, authorsData, loansData] = await Promise.all([
        apiService.getBooks(),
        apiService.getAuthors(),
        apiService.getLoans()
      ]);

      setBooks(booksData.results?.map(transformBook) || []);
      setAuthors(authorsData.results?.map(transformAuthor) || []);
      setLoans(loansData.results?.map(transformLoan) || []);

      // Try to load users if admin
      try {
        const usersData = await apiService.getUsers();
        setUsers(usersData.results?.map(transformUser) || []);
      } catch (error) {
        // Not admin, ignore error
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addBook = async (book: Omit<Book, 'id'>) => {
    try {
      const bookData = {
        title: book.title,
        isbn: book.isbn,
        description: book.description,
        publish_date: book.publishDate,
        pages: book.pages,
        language: book.language === 'Français' ? 'fr' : 
                  book.language === 'Anglais' ? 'en' : 
                  book.language === 'Espagnol' ? 'es' : 'other',
        cover_image: book.coverImage,
        authors: book.authors.map(a => parseInt(a.id)),
        categories: [], // Will need to be implemented
        status: book.status
      };

      const newBook = await apiService.createBook(bookData);
      setBooks(prev => [...prev, transformBook(newBook)]);
    } catch (error) {
      console.error('Failed to add book:', error);
      throw error;
    }
  };

  const updateBook = async (id: string, bookUpdate: Partial<Book>) => {
    try {
      const updateData: any = {};
      
      if (bookUpdate.title) updateData.title = bookUpdate.title;
      if (bookUpdate.isbn) updateData.isbn = bookUpdate.isbn;
      if (bookUpdate.description) updateData.description = bookUpdate.description;
      if (bookUpdate.publishDate) updateData.publish_date = bookUpdate.publishDate;
      if (bookUpdate.pages) updateData.pages = bookUpdate.pages;
      if (bookUpdate.language) {
        updateData.language = bookUpdate.language === 'Français' ? 'fr' : 
                             bookUpdate.language === 'Anglais' ? 'en' : 
                             bookUpdate.language === 'Espagnol' ? 'es' : 'other';
      }
      if (bookUpdate.coverImage) updateData.cover_image = bookUpdate.coverImage;
      if (bookUpdate.status) updateData.status = bookUpdate.status;
      if (bookUpdate.authors) updateData.authors = bookUpdate.authors.map(a => parseInt(a.id));

      const updatedBook = await apiService.updateBook(id, updateData);
      setBooks(prev => prev.map(book => 
        book.id === id ? transformBook(updatedBook) : book
      ));
    } catch (error) {
      console.error('Failed to update book:', error);
      throw error;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      await apiService.deleteBook(id);
      setBooks(prev => prev.filter(book => book.id !== id));
      setLoans(prev => prev.filter(loan => loan.bookId !== id));
    } catch (error) {
      console.error('Failed to delete book:', error);
      throw error;
    }
  };

  const borrowBook = async (bookId: string, userId: string): Promise<boolean> => {
    try {
      await apiService.createLoan({ book_id: parseInt(bookId) });
      await loadData(); // Reload data to get updated status
      return true;
    } catch (error) {
      console.error('Failed to borrow book:', error);
      return false;
    }
  };

  const returnBook = async (bookId: string) => {
    try {
      const loan = loans.find(l => l.bookId === bookId && l.status === 'active');
      if (loan) {
        await apiService.returnBook(loan.id);
        await loadData(); // Reload data to get updated status
      }
    } catch (error) {
      console.error('Failed to return book:', error);
      throw error;
    }
  };

  const reserveBook = async (bookId: string, userId: string): Promise<boolean> => {
    try {
      await apiService.createReservation({ book_id: parseInt(bookId) });
      await loadData(); // Reload data to get updated status
      return true;
    } catch (error) {
      console.error('Failed to reserve book:', error);
      return false;
    }
  };

  const addAuthor = async (author: Omit<Author, 'id'>) => {
    try {
      const authorData = {
        first_name: author.firstName,
        last_name: author.lastName,
        biography: author.biography,
        birth_date: author.birthDate,
        nationality: author.nationality
      };

      const newAuthor = await apiService.createAuthor(authorData);
      setAuthors(prev => [...prev, transformAuthor(newAuthor)]);
    } catch (error) {
      console.error('Failed to add author:', error);
      throw error;
    }
  };

  const updateAuthor = (id: string, authorUpdate: Partial<Author>) => {
    setAuthors(prev => prev.map(author => 
      author.id === id ? { ...author, ...authorUpdate } : author
    ));
  };

  const deleteAuthor = (id: string) => {
    setAuthors(prev => prev.filter(author => author.id !== id));
  };

  const updateUser = (id: string, userUpdate: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...userUpdate } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    setLoans(prev => prev.filter(loan => loan.userId !== id));
  };

  const updateSettings = (settingsUpdate: Partial<LibrarySettings>) => {
    setSettings(prev => ({ ...prev, ...settingsUpdate }));
  };

  const addConnectionLog = (log: Omit<ConnectionLog, 'id'>) => {
    const newLog: ConnectionLog = {
      ...log,
      id: Date.now().toString()
    };
    setConnectionLogs(prev => [newLog, ...prev].slice(0, 1000));
  };

  const value: LibraryContextType = {
    books,
    loans,
    authors,
    users,
    settings,
    connectionLogs,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    reserveBook,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    updateUser,
    deleteUser,
    updateSettings,
    addConnectionLog
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};