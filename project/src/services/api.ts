import { mockApiService } from './mockApi';

// Use mock API service instead of real backend
// This allows the application to work in WebContainer environment
// where Django backend cannot run

// Types pour les réponses API
interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

interface LoginResponse {
  user: any;
  token: string;
  message: string;
}

interface RegisterResponse {
  user: any;
  token: string;
  message: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  // Test connection - always returns true with mock service
  async testConnection(): Promise<boolean> {
    return await mockApiService.testConnection();
  }

  // Authentication
  async login(email: string, password: string): Promise<LoginResponse> {
    const result = await mockApiService.login(email, password);
    this.token = result.token;
    return result;
  }

  async register(userData: {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }): Promise<RegisterResponse> {
    const result = await mockApiService.register(userData);
    this.token = result.token;
    return result;
  }

  async logout(): Promise<void> {
    await mockApiService.logout();
    this.token = null;
  }

  async getProfile(): Promise<any> {
    return await mockApiService.getProfile();
  }

  // Books
  async getBooks(params?: Record<string, string>): Promise<any> {
    return await mockApiService.getBooks(params);
  }

  async getBook(id: string): Promise<any> {
    return await mockApiService.getBook(id);
  }

  async createBook(bookData: any): Promise<any> {
    return await mockApiService.createBook(bookData);
  }

  async updateBook(id: string, bookData: any): Promise<any> {
    return await mockApiService.updateBook(id, bookData);
  }

  async deleteBook(id: string): Promise<void> {
    return await mockApiService.deleteBook(id);
  }

  // Authors
  async getAuthors(): Promise<any> {
    return await mockApiService.getAuthors();
  }

  async createAuthor(authorData: any): Promise<any> {
    return await mockApiService.createAuthor(authorData);
  }

  // Categories
  async getCategories(): Promise<any> {
    return await mockApiService.getCategories();
  }

  // Publishers
  async getPublishers(): Promise<any> {
    return await mockApiService.getPublishers();
  }

  // Loans
  async getLoans(): Promise<any> {
    return await mockApiService.getLoans();
  }

  async createLoan(loanData: { book_id: number }): Promise<any> {
    return await mockApiService.createLoan(loanData);
  }

  async returnBook(loanId: string): Promise<any> {
    return await mockApiService.returnBook(loanId);
  }

  // Reservations
  async getReservations(): Promise<any> {
    return await mockApiService.getReservations();
  }

  async createReservation(reservationData: { book_id: number }): Promise<any> {
    return await mockApiService.createReservation(reservationData);
  }

  // Users (Admin only)
  async getUsers(): Promise<any> {
    return await mockApiService.getUsers();
  }

  // Dashboard stats
  async getDashboardStats(): Promise<any> {
    return await mockApiService.getDashboardStats();
  }
}

export const apiService = new ApiService();