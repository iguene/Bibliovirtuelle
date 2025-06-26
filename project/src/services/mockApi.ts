// Mock API service to simulate Django backend functionality
interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin';
  join_date: string;
  avatar?: string;
  is_active: boolean;
}

interface Author {
  id: number;
  first_name: string;
  last_name: string;
  biography?: string;
  birth_date?: string;
  nationality?: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
}

interface Publisher {
  id: number;
  name: string;
  email?: string;
  website?: string;
}

interface Book {
  id: number;
  title: string;
  subtitle?: string;
  isbn: string;
  description: string;
  publish_date: string;
  pages: number;
  language: string;
  cover_image?: string;
  status: 'available' | 'borrowed' | 'reserved';
  quantity: number;
  available_quantity: number;
  authors: Author[];
  categories: Category[];
  publisher?: Publisher;
  created_at: string;
  updated_at: string;
}

interface Loan {
  id: number;
  book: Book;
  user: User;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: 'active' | 'returned' | 'overdue';
}

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@library.com',
    username: 'admin',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin',
    join_date: '2023-01-01',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    is_active: true
  },
  {
    id: 2,
    email: 'john.doe@email.com',
    username: 'johndoe',
    first_name: 'John',
    last_name: 'Doe',
    role: 'user',
    join_date: '2023-06-15',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    is_active: true
  },
  {
    id: 3,
    email: 'jane.smith@email.com',
    username: 'janesmith',
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'user',
    join_date: '2023-08-20',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    is_active: true
  }
];

const mockAuthors: Author[] = [
  {
    id: 1,
    first_name: 'Gabriel',
    last_name: 'García Márquez',
    biography: 'Colombian novelist and Nobel Prize winner',
    birth_date: '1927-03-06',
    nationality: 'Colombian'
  },
  {
    id: 2,
    first_name: 'George',
    last_name: 'Orwell',
    biography: 'English novelist and social critic',
    birth_date: '1903-06-25',
    nationality: 'British'
  },
  {
    id: 3,
    first_name: 'Jane',
    last_name: 'Austen',
    biography: 'English novelist known for romantic fiction',
    birth_date: '1775-12-16',
    nationality: 'British'
  },
  {
    id: 4,
    first_name: 'Harper',
    last_name: 'Lee',
    biography: 'American novelist',
    birth_date: '1926-04-28',
    nationality: 'American'
  },
  {
    id: 5,
    first_name: 'F. Scott',
    last_name: 'Fitzgerald',
    biography: 'American novelist and short story writer',
    birth_date: '1896-09-24',
    nationality: 'American'
  }
];

const mockCategories: Category[] = [
  { id: 1, name: 'Magical Realism', description: 'Literary fiction with magical elements', color: '#3B82F6' },
  { id: 2, name: 'Dystopian Fiction', description: 'Fiction depicting dystopian societies', color: '#EF4444' },
  { id: 3, name: 'Romance', description: 'Romantic literature', color: '#EC4899' },
  { id: 4, name: 'Southern Gothic', description: 'Southern American literature', color: '#F59E0B' },
  { id: 5, name: 'Classic Literature', description: 'Timeless literary works', color: '#8B5CF6' },
  { id: 6, name: 'Political Satire', description: 'Satirical political commentary', color: '#10B981' }
];

const mockPublishers: Publisher[] = [
  { id: 1, name: 'Gallimard', email: 'contact@gallimard.fr', website: 'https://www.gallimard.fr' },
  { id: 2, name: 'Penguin Random House', email: 'contact@penguin.com', website: 'https://www.penguin.com' },
  { id: 3, name: 'HarperCollins', email: 'contact@harpercollins.com', website: 'https://www.harpercollins.com' }
];

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'One Hundred Years of Solitude',
    isbn: '978-0-06-088328-7',
    description: 'A landmark novel that tells the story of the Buendía family over seven generations.',
    publish_date: '1967-05-30',
    pages: 417,
    language: 'fr',
    cover_image: 'https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=2',
    status: 'available',
    quantity: 3,
    available_quantity: 3,
    authors: [mockAuthors[0]],
    categories: [mockCategories[0]],
    publisher: mockPublishers[0],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    title: '1984',
    isbn: '978-0-452-28423-4',
    description: 'A dystopian social science fiction novel about totalitarian control.',
    publish_date: '1949-06-08',
    pages: 328,
    language: 'en',
    cover_image: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=2',
    status: 'borrowed',
    quantity: 2,
    available_quantity: 1,
    authors: [mockAuthors[1]],
    categories: [mockCategories[1]],
    publisher: mockPublishers[1],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 3,
    title: 'Pride and Prejudice',
    isbn: '978-0-14-143951-8',
    description: 'A romantic novel about manners, marriage, and society in Regency England.',
    publish_date: '1813-01-28',
    pages: 432,
    language: 'en',
    cover_image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=2',
    status: 'available',
    quantity: 4,
    available_quantity: 4,
    authors: [mockAuthors[2]],
    categories: [mockCategories[2]],
    publisher: mockPublishers[2],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    title: 'To Kill a Mockingbird',
    isbn: '978-0-06-112008-4',
    description: 'A novel about racial injustice and childhood in the American South.',
    publish_date: '1960-07-11',
    pages: 376,
    language: 'en',
    cover_image: 'https://images.pexels.com/photos/1309766/pexels-photo-1309766.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=2',
    status: 'reserved',
    quantity: 2,
    available_quantity: 0,
    authors: [mockAuthors[3]],
    categories: [mockCategories[3]],
    publisher: mockPublishers[2],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    title: 'The Great Gatsby',
    isbn: '978-0-7432-7356-5',
    description: 'A critique of the American Dream through the story of Jay Gatsby.',
    publish_date: '1925-04-10',
    pages: 180,
    language: 'en',
    cover_image: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=2',
    status: 'available',
    quantity: 5,
    available_quantity: 5,
    authors: [mockAuthors[4]],
    categories: [mockCategories[4]],
    publisher: mockPublishers[1],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    title: 'Animal Farm',
    isbn: '978-0-452-28424-1',
    description: 'An allegorical novella about a group of farm animals who rebel against their owner.',
    publish_date: '1945-08-17',
    pages: 112,
    language: 'en',
    cover_image: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=2',
    status: 'available',
    quantity: 3,
    available_quantity: 3,
    authors: [mockAuthors[1]],
    categories: [mockCategories[5]],
    publisher: mockPublishers[0],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const mockLoans: Loan[] = [
  {
    id: 1,
    book: mockBooks[1], // 1984
    user: mockUsers[1], // John Doe
    borrow_date: '2024-01-15',
    due_date: '2024-02-15',
    status: 'active'
  }
];

// Mock credentials for demo
const mockCredentials = {
  'admin@library.com': { password: 'password', user: mockUsers[0] },
  'john.doe@email.com': { password: 'password', user: mockUsers[1] },
  'jane.smith@email.com': { password: 'password', user: mockUsers[2] }
};

class MockApiService {
  private token: string | null = null;
  private currentUser: User | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('current_user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  private generateToken(): string {
    return 'mock_token_' + Math.random().toString(36).substr(2, 9);
  }

  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private requireAuth(): void {
    if (!this.currentUser) {
      throw new Error('Non authentifié');
    }
  }

  private requireAdmin(): void {
    this.requireAuth();
    if (this.currentUser!.role !== 'admin') {
      throw new Error('Accès non autorisé - Droits administrateur requis');
    }
  }

  // Test connection - always returns true for mock
  async testConnection(): Promise<boolean> {
    await this.delay(100);
    return true;
  }

  // Authentication
  async login(email: string, password: string): Promise<any> {
    await this.delay();
    
    const credentials = mockCredentials[email as keyof typeof mockCredentials];
    if (!credentials || credentials.password !== password) {
      throw new Error('Email ou mot de passe incorrect');
    }

    this.token = this.generateToken();
    this.currentUser = credentials.user;
    localStorage.setItem('auth_token', this.token);
    localStorage.setItem('current_user', JSON.stringify(this.currentUser));

    return {
      user: this.currentUser,
      token: this.token,
      message: 'Connexion réussie'
    };
  }

  async register(userData: {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }): Promise<any> {
    await this.delay();

    if (userData.password !== userData.password_confirm) {
      throw new Error('Les mots de passe ne correspondent pas');
    }

    if (mockUsers.find(u => u.email === userData.email)) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    const newUser: User = {
      id: mockUsers.length + 1,
      email: userData.email,
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role: 'user', // New users are always regular users
      join_date: new Date().toISOString().split('T')[0],
      is_active: true
    };

    mockUsers.push(newUser);
    this.token = this.generateToken();
    this.currentUser = newUser;
    localStorage.setItem('auth_token', this.token);
    localStorage.setItem('current_user', JSON.stringify(this.currentUser));

    return {
      user: this.currentUser,
      token: this.token,
      message: 'Inscription réussie'
    };
  }

  async logout(): Promise<void> {
    await this.delay(200);
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  }

  async getProfile(): Promise<User> {
    await this.delay();
    this.requireAuth();
    return this.currentUser!;
  }

  // Books
  async getBooks(params?: Record<string, string>): Promise<any> {
    await this.delay();
    this.requireAuth();
    
    let filteredBooks = [...mockBooks];

    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(search) ||
        book.authors.some(author => 
          `${author.first_name} ${author.last_name}`.toLowerCase().includes(search)
        ) ||
        book.categories.some(cat => cat.name.toLowerCase().includes(search))
      );
    }

    return {
      results: filteredBooks,
      count: filteredBooks.length
    };
  }

  async getBook(id: string): Promise<Book> {
    await this.delay();
    this.requireAuth();
    
    const book = mockBooks.find(b => b.id === parseInt(id));
    if (!book) {
      throw new Error('Livre non trouvé');
    }
    return book;
  }

  async createBook(bookData: any): Promise<Book> {
    await this.delay();
    this.requireAdmin(); // Only admins can create books
    
    const newBook: Book = {
      id: mockBooks.length + 1,
      ...bookData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockBooks.push(newBook);
    return newBook;
  }

  async updateBook(id: string, bookData: any): Promise<Book> {
    await this.delay();
    this.requireAdmin(); // Only admins can update books
    
    const index = mockBooks.findIndex(b => b.id === parseInt(id));
    if (index === -1) {
      throw new Error('Livre non trouvé');
    }
    mockBooks[index] = { 
      ...mockBooks[index], 
      ...bookData, 
      updated_at: new Date().toISOString() 
    };
    return mockBooks[index];
  }

  async deleteBook(id: string): Promise<void> {
    await this.delay();
    this.requireAdmin(); // Only admins can delete books
    
    const index = mockBooks.findIndex(b => b.id === parseInt(id));
    if (index === -1) {
      throw new Error('Livre non trouvé');
    }
    mockBooks.splice(index, 1);
  }

  // Authors
  async getAuthors(): Promise<any> {
    await this.delay();
    this.requireAuth();
    return { results: mockAuthors };
  }

  async createAuthor(authorData: any): Promise<any> {
    await this.delay();
    this.requireAdmin(); // Only admins can create authors
    
    const newAuthor: Author = {
      id: mockAuthors.length + 1,
      ...authorData
    };
    mockAuthors.push(newAuthor);
    return newAuthor;
  }

  // Categories
  async getCategories(): Promise<any> {
    await this.delay();
    this.requireAuth();
    return { results: mockCategories };
  }

  // Publishers
  async getPublishers(): Promise<any> {
    await this.delay();
    this.requireAuth();
    return { results: mockPublishers };
  }

  // Loans
  async getLoans(): Promise<any> {
    await this.delay();
    this.requireAuth();
    
    // Regular users can only see their own loans
    const userLoans = this.currentUser!.role === 'admin' 
      ? mockLoans 
      : mockLoans.filter(loan => loan.user.id === this.currentUser!.id);
      
    return { results: userLoans };
  }

  async createLoan(loanData: { book_id: number }): Promise<Loan> {
    await this.delay();
    this.requireAuth();
    
    const book = mockBooks.find(b => b.id === loanData.book_id);
    if (!book) {
      throw new Error('Livre non trouvé');
    }
    if (book.available_quantity <= 0) {
      throw new Error('Aucun exemplaire disponible');
    }

    // Check if user already has too many active loans (limit for regular users)
    if (this.currentUser!.role === 'user') {
      const userActiveLoans = mockLoans.filter(l => 
        l.user.id === this.currentUser!.id && l.status === 'active'
      );
      if (userActiveLoans.length >= 5) { // Max 5 books per user
        throw new Error('Vous avez atteint la limite de livres empruntés');
      }
    }

    const newLoan: Loan = {
      id: mockLoans.length + 1,
      book,
      user: this.currentUser!,
      borrow_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active'
    };

    mockLoans.push(newLoan);
    book.available_quantity--;
    if (book.available_quantity === 0) {
      book.status = 'borrowed';
    }
    return newLoan;
  }

  async returnBook(loanId: string): Promise<Loan> {
    await this.delay();
    this.requireAuth();
    
    const loan = mockLoans.find(l => l.id === parseInt(loanId));
    if (!loan) {
      throw new Error('Emprunt non trouvé');
    }

    // Regular users can only return their own books
    if (this.currentUser!.role === 'user' && loan.user.id !== this.currentUser!.id) {
      throw new Error('Vous ne pouvez retourner que vos propres livres');
    }

    loan.return_date = new Date().toISOString().split('T')[0];
    loan.status = 'returned';
    loan.book.available_quantity++;
    if (loan.book.available_quantity > 0) {
      loan.book.status = 'available';
    }
    return loan;
  }

  // Reservations
  async getReservations(): Promise<any> {
    await this.delay();
    this.requireAuth();
    return { results: [] }; // Mock empty reservations
  }

  async createReservation(reservationData: { book_id: number }): Promise<any> {
    await this.delay();
    this.requireAuth();
    return { id: Date.now(), ...reservationData, status: 'active' };
  }

  // Users (Admin only)
  async getUsers(): Promise<any> {
    await this.delay();
    this.requireAdmin(); // Only admins can view all users
    return { results: mockUsers };
  }

  async updateUser(id: string, userData: any): Promise<User> {
    await this.delay();
    this.requireAdmin(); // Only admins can update users
    
    const index = mockUsers.findIndex(u => u.id === parseInt(id));
    if (index === -1) {
      throw new Error('Utilisateur non trouvé');
    }
    mockUsers[index] = { ...mockUsers[index], ...userData };
    return mockUsers[index];
  }

  async deleteUser(id: string): Promise<void> {
    await this.delay();
    this.requireAdmin(); // Only admins can delete users
    
    const index = mockUsers.findIndex(u => u.id === parseInt(id));
    if (index === -1) {
      throw new Error('Utilisateur non trouvé');
    }
    
    // Don't allow deleting the current admin user
    if (mockUsers[index].id === this.currentUser!.id) {
      throw new Error('Vous ne pouvez pas supprimer votre propre compte');
    }
    
    mockUsers.splice(index, 1);
  }

  // Dashboard stats
  async getDashboardStats(): Promise<any> {
    await this.delay();
    this.requireAuth();
    
    if (this.currentUser!.role === 'admin') {
      // Admin stats - full system overview
      return {
        total_books: mockBooks.length,
        available_books: mockBooks.reduce((sum, book) => sum + book.available_quantity, 0),
        borrowed_books: mockBooks.filter(b => b.status === 'borrowed').length,
        total_users: mockUsers.length,
        active_loans: mockLoans.filter(l => l.status === 'active').length,
        overdue_loans: mockLoans.filter(l => {
          if (l.status !== 'active') return false;
          const dueDate = new Date(l.due_date);
          return dueDate < new Date();
        }).length,
        top_categories: mockCategories.slice(0, 5),
        recent_books: mockBooks.slice(-5)
      };
    } else {
      // User stats - personal overview only
      const userLoans = mockLoans.filter(l => l.user.id === this.currentUser!.id);
      const activeLoans = userLoans.filter(l => l.status === 'active');
      const overdueLoans = activeLoans.filter(l => {
        const dueDate = new Date(l.due_date);
        return dueDate < new Date();
      });
      
      return {
        active_loans: activeLoans.length,
        overdue_loans: overdueLoans.length,
        total_borrowed: userLoans.length,
        books_available: mockBooks.filter(b => b.status === 'available').length
      };
    }
  }
}

export const mockApiService = new MockApiService();