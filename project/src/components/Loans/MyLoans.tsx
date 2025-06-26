import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLibrary } from '../../contexts/LibraryContext';
import { Calendar, Clock, BookOpen, AlertTriangle } from 'lucide-react';

const MyLoans: React.FC = () => {
  const { user } = useAuth();
  const { books, loans, returnBook } = useLibrary();

  const userLoans = loans.filter(loan => loan.userId === user?.id);
  const activeLoans = userLoans.filter(loan => loan.status === 'active');
  const loanHistory = userLoans.filter(loan => loan.status === 'returned');

  const getLoanWithBook = (loan: any) => {
    const book = books.find(book => book.id === loan.bookId);
    return { ...loan, book };
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleReturn = (bookId: string) => {
    returnBook(bookId);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mes emprunts</h1>

      {/* Active Loans */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Emprunts en cours ({activeLoans.length})
        </h2>
        
        {activeLoans.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun emprunt en cours</h3>
            <p className="mt-1 text-sm text-gray-500">
              Visitez la bibliothèque pour emprunter des livres.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeLoans.map(loan => {
              const loanWithBook = getLoanWithBook(loan);
              const book = loanWithBook.book;
              const daysUntilDue = getDaysUntilDue(loan.dueDate);
              const overdue = isOverdue(loan.dueDate);
              
              if (!book) return null;

              return (
                <div key={loan.id} className={`border rounded-lg p-4 ${
                  overdue ? 'border-red-300 bg-red-50' : 
                  daysUntilDue <= 3 ? 'border-yellow-300 bg-yellow-50' : 
                  'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center space-x-4">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{book.title}</h3>
                      <p className="text-sm text-gray-600">
                        {book.authors.map(author => `${author.firstName} ${author.lastName}`).join(', ')}
                      </p>
                      
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          Emprunté le {new Date(loan.borrowDate).toLocaleDateString('fr-FR')}
                        </div>
                        
                        <div className={`flex items-center ${
                          overdue ? 'text-red-600' : 
                          daysUntilDue <= 3 ? 'text-yellow-600' : 
                          'text-gray-600'
                        }`}>
                          {overdue ? (
                            <AlertTriangle className="h-4 w-4 mr-1" />
                          ) : (
                            <Clock className="h-4 w-4 mr-1" />
                          )}
                          {overdue ? (
                            `En retard de ${Math.abs(daysUntilDue)} jour${Math.abs(daysUntilDue) > 1 ? 's' : ''}`
                          ) : daysUntilDue <= 3 ? (
                            `À retourner dans ${daysUntilDue} jour${daysUntilDue > 1 ? 's' : ''}`
                          ) : (
                            `À retourner le ${new Date(loan.dueDate).toLocaleDateString('fr-FR')}`
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleReturn(book.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Retourner
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Loan History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Historique des emprunts ({loanHistory.length})
        </h2>
        
        {loanHistory.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun historique</h3>
            <p className="mt-1 text-sm text-gray-500">
              Vos emprunts passés apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {loanHistory.slice(0, 10).map(loan => {
              const loanWithBook = getLoanWithBook(loan);
              const book = loanWithBook.book;
              
              if (!book) return null;

              return (
                <div key={loan.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{book.title}</h3>
                      <p className="text-sm text-gray-600">
                        {book.authors.map(author => `${author.firstName} ${author.lastName}`).join(', ')}
                      </p>
                      
                      <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          Emprunté: {new Date(loan.borrowDate).toLocaleDateString('fr-FR')}
                        </span>
                        {loan.returnDate && (
                          <span>
                            Retourné: {new Date(loan.returnDate).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Retourné
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLoans;