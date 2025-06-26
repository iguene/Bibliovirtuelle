import { User, Author, Book, Loan } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@library.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    joinDate: '2023-01-01',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: '2',
    email: 'john.doe@email.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    joinDate: '2023-06-15',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: '3',
    email: 'jane.smith@email.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user',
    joinDate: '2023-08-20',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
];

export const mockAuthors: Author[] = [
  {
    id: '1',
    firstName: 'Gabriel',
    lastName: 'García Márquez',
    biography: 'Colombian novelist and Nobel Prize winner',
    birthDate: '1927-03-06',
    nationality: 'Colombian'
  },
  {
    id: '2',
    firstName: 'George',
    lastName: 'Orwell',
    biography: 'English novelist and social critic',
    birthDate: '1903-06-25',
    nationality: 'British'
  },
  {
    id: '3',
    firstName: 'Jane',
    lastName: 'Austen',
    biography: 'English novelist known for romantic fiction',
    birthDate: '1775-12-16',
    nationality: 'British'
  },
  {
    id: '4',
    firstName: 'Harper',
    lastName: 'Lee',
    biography: 'American novelist',
    birthDate: '1926-04-28',
    nationality: 'American'
  },
  {
    id: '5',
    firstName: 'F. Scott',
    lastName: 'Fitzgerald',
    biography: 'American novelist and short story writer',
    birthDate: '1896-09-24',
    nationality: 'American'
  }
];

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'One Hundred Years of Solitude',
    isbn: '978-0-06-088328-7',
    description: 'A landmark novel that tells the story of the Buendía family over seven generations.',
    publishDate: '1967-05-30',
    genre: 'Magical Realism',
    language: 'Spanish',
    pages: 417,
    coverImage: 'https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=2',
    authors: [mockAuthors[0]],
    status: 'available'
  },
  {
    id: '2',
    title: '1984',
    isbn: '978-0-452-28423-4',
    description: 'A dystopian social science fiction novel about totalitarian control.',
    publishDate: '1949-06-08',
    genre: 'Dystopian Fiction',
    language: 'English',
    pages: 328,
    coverImage: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=2',
    authors: [mockAuthors[1]],
    status: 'borrowed',
    borrowedBy: '2',
    borrowDate: '2024-01-15',
    dueDate: '2024-02-15'
  },
  {
    id: '3',
    title: 'Pride and Prejudice',
    isbn: '978-0-14-143951-8',
    description: 'A romantic novel about manners, marriage, and society in Regency England.',
    publishDate: '1813-01-28',
    genre: 'Romance',
    language: 'English',
    pages: 432,
    coverImage: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=2',
    authors: [mockAuthors[2]],
    status: 'available'
  },
  {
    id: '4',
    title: 'To Kill a Mockingbird',
    isbn: '978-0-06-112008-4',
    description: 'A novel about racial injustice and childhood in the American South.',
    publishDate: '1960-07-11',
    genre: 'Southern Gothic',
    language: 'English',
    pages: 376,
    coverImage: 'https://images.pexels.com/photos/1309766/pexels-photo-1309766.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=2',
    authors: [mockAuthors[3]],
    status: 'reserved',
    reservedBy: ['3']
  },
  {
    id: '5',
    title: 'The Great Gatsby',
    isbn: '978-0-7432-7356-5',
    description: 'A critique of the American Dream through the story of Jay Gatsby.',
    publishDate: '1925-04-10',
    genre: 'Classic Literature',
    language: 'English',
    pages: 180,
    coverImage: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=2',
    authors: [mockAuthors[4]],
    status: 'available'
  },
  {
    id: '6',
    title: 'Animal Farm',
    isbn: '978-0-452-28424-1',
    description: 'An allegorical novella about a group of farm animals who rebel against their owner.',
    publishDate: '1945-08-17',
    genre: 'Political Satire',
    language: 'English',
    pages: 112,
    coverImage: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&dpr=2',
    authors: [mockAuthors[1]],
    status: 'available'
  }
];

export const mockLoans: Loan[] = [
  {
    id: '1',
    bookId: '2',
    userId: '2',
    borrowDate: '2024-01-15',
    dueDate: '2024-02-15',
    status: 'active'
  }
];