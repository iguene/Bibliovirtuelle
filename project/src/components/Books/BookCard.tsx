import React from 'react';
import { Book } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useLibrary } from '../../contexts/LibraryContext';
import { Calendar, User, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onViewDetails: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onViewDetails }) => {
  const { user } = useAuth();
  const { borrowBook, reserveBook } = useLibrary();

  const handleBorrow = () => {
    if (user && book.status === 'available') {
      borrowBook(book.id, user.id);
    }
  };

  const handleReserve = () => {
    if (user && book.status === 'borrowed') {
      reserveBook(book.id, user.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'borrowed':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'borrowed':
        return 'Emprunté';
      case 'reserved':
        return 'Réservé';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-w-3 aspect-h-4">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-64 object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {book.title}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(book.status)}`}>
            {getStatusText(book.status)}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            {book.authors.map(author => `${author.firstName} ${author.lastName}`).join(', ')}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(book.publishDate).getFullYear()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="h-4 w-4 mr-2" />
            {book.pages} pages • {book.genre}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {book.description}
        </p>

        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(book)}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Détails
          </button>
          
          {book.status === 'available' && (
            <button
              onClick={handleBorrow}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Emprunter
            </button>
          )}
          
          {book.status === 'borrowed' && (
            <button
              onClick={handleReserve}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              Réserver
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;