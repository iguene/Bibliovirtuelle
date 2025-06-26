import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLibrary } from '../../contexts/LibraryContext';
import { BookOpen, Users, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { books, loans, users } = useLibrary();

  // User-specific data
  const userLoans = loans.filter(loan => loan.userId === user?.id && loan.status === 'active');
  const overdueLoanCount = userLoans.filter(loan => {
    return new Date(loan.dueDate) < new Date();
  }).length;

  // Admin-specific data
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.status === 'available').length;
  const borrowedBooks = books.filter(book => book.status === 'borrowed').length;
  const totalUsers = users.length;
  const totalActiveLoans = loans.filter(loan => loan.status === 'active').length;

  const recentlyAdded = books
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 5);

  const popularGenres = books.reduce((acc, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topGenres = Object.entries(popularGenres)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.firstName} !
        </h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Role indicator */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Connecté en tant que :</span>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
          user?.role === 'admin' 
            ? 'bg-orange-100 text-orange-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
        </span>
      </div>

      {/* Stats Cards */}
      {user?.role === 'admin' ? (
        // Admin Dashboard
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total des livres</p>
                <p className="text-2xl font-bold text-gray-900">{totalBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{availableBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Emprunts actifs</p>
                <p className="text-2xl font-bold text-gray-900">{totalActiveLoans}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // User Dashboard
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Livres disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{availableBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mes emprunts</p>
                <p className="text-2xl font-bold text-gray-900">{userLoans.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${overdueLoanCount > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                {overdueLoanCount > 0 ? (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En retard</p>
                <p className="text-2xl font-bold text-gray-900">{overdueLoanCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert for overdue books */}
      {overdueLoanCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">
              Attention ! Vous avez {overdueLoanCount} livre{overdueLoanCount > 1 ? 's' : ''} en retard.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Added Books */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {user?.role === 'admin' ? 'Derniers ajouts' : 'Nouveautés'}
          </h3>
          <div className="space-y-3">
            {recentlyAdded.map(book => (
              <div key={book.id} className="flex items-center space-x-3">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-10 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {book.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {book.authors.map(a => `${a.firstName} ${a.lastName}`).join(', ')}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  book.status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.status === 'available' ? 'Disponible' : 'Emprunté'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Genres or User Activity */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {user?.role === 'admin' ? 'Genres populaires' : 'Mes derniers emprunts'}
          </h3>
          
          {user?.role === 'admin' ? (
            <div className="space-y-3">
              {topGenres.map(([genre, count], index) => (
                <div key={genre} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' :
                      index === 3 ? 'bg-red-500' : 'bg-purple-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-900">{genre}</span>
                  </div>
                  <span className="text-sm text-gray-500">{count} livre{count > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {loans
                .filter(loan => loan.userId === user?.id)
                .slice(0, 5)
                .map(loan => {
                  const book = books.find(b => b.id === loan.bookId);
                  if (!book) return null;
                  
                  return (
                    <div key={loan.id} className="flex items-center space-x-3">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-8 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {book.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {loan.status === 'active' ? 'En cours' : 'Retourné'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        loan.status === 'active' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {loan.status === 'active' ? 'Actif' : 'Terminé'}
                      </span>
                    </div>
                  );
                })}
              
              {loans.filter(loan => loan.userId === user?.id).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Aucun emprunt pour le moment
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;