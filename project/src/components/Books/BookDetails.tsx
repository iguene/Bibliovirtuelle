import React from 'react';
import { Book } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useLibrary } from '../../contexts/LibraryContext';
import { ArrowLeft, Calendar, User, BookOpen, Globe, Hash } from 'lucide-react';

interface BookDetailsProps {
  book: Book;
  onBack: () => void;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book, onBack }) => {
  const { user } = useAuth();
  const { borrowBook, reserveBook, returnBook, users } = useLibrary();

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

  const handleReturn = () => {
    if (user && book.status === 'borrowed' && book.borrowedBy === user.id) {
      returnBook(book.id);
    }
  };

  const borrowedByUser = book.borrowedBy ? users.find(u => u.id === book.borrowedBy) : null;

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
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Retour à la liste</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-96 md:h-full object-cover"
            />
          </div>
          
          <div className="md:w-2/3 p-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(book.status)}`}>
                {getStatusText(book.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-3" />
                  <div>
                    <span className="font-medium">Auteur{book.authors.length > 1 ? 's' : ''}: </span>
                    {book.authors.map(author => `${author.firstName} ${author.lastName}`).join(', ')}
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <div>
                    <span className="font-medium">Publication: </span>
                    {new Date(book.publishDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <BookOpen className="h-5 w-5 mr-3" />
                  <div>
                    <span className="font-medium">Pages: </span>
                    {book.pages}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Globe className="h-5 w-5 mr-3" />
                  <div>
                    <span className="font-medium">Langue: </span>
                    {book.language}
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Hash className="h-5 w-5 mr-3" />
                  <div>
                    <span className="font-medium">ISBN: </span>
                    {book.isbn}
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <BookOpen className="h-5 w-5 mr-3" />
                  <div>
                    <span className="font-medium">Genre: </span>
                    {book.genre}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Résumé</h3>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
            </div>

            {/* Loan information */}
            {book.status === 'borrowed' && borrowedByUser && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-red-900 mb-2">Informations d'emprunt</h4>
                <div className="text-sm text-red-700 space-y-1">
                  <p>Emprunté par: {borrowedByUser.firstName} {borrowedByUser.lastName}</p>
                  <p>Date d'emprunt: {book.borrowDate ? new Date(book.borrowDate).toLocaleDateString('fr-FR') : 'N/A'}</p>
                  <p>Date de retour prévue: {book.dueDate ? new Date(book.dueDate).toLocaleDateString('fr-FR') : 'N/A'}</p>
                </div>
              </div>
            )}

            {/* Reservation information */}
            {book.reservedBy && book.reservedBy.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-yellow-900 mb-2">Réservations</h4>
                <p className="text-sm text-yellow-700">
                  {book.reservedBy.length} personne{book.reservedBy.length > 1 ? 's' : ''} en attente
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-3">
              {book.status === 'available' && (
                <button
                  onClick={handleBorrow}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Emprunter ce livre
                </button>
              )}
              
              {book.status === 'borrowed' && book.borrowedBy !== user?.id && (
                <button
                  onClick={handleReserve}
                  className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  Réserver ce livre
                </button>
              )}
              
              {book.status === 'borrowed' && book.borrowedBy === user?.id && (
                <button
                  onClick={handleReturn}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Retourner ce livre
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;