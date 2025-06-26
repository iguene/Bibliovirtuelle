import React, { useState } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';
import { Book, Author } from '../../types';
import { Search, Plus, Edit, Trash2, BookOpen, Eye, EyeOff } from 'lucide-react';

const ManageBooks: React.FC = () => {
  const { books, authors, addBook, updateBook, deleteBook } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const genres = [...new Set(books.map(book => book.genre))].sort();

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.authors.some(author => 
                           `${author.firstName} ${author.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = !selectedStatus || book.status === selectedStatus;
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    
    return matchesSearch && matchesStatus && matchesGenre;
  });

  const handleStatusChange = (bookId: string, newStatus: Book['status']) => {
    updateBook(bookId, { status: newStatus });
  };

  const handleDeleteBook = (bookId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      deleteBook(bookId);
    }
  };

  const BookFormModal = ({ 
    book, 
    onClose, 
    onSave 
  }: { 
    book?: Book, 
    onClose: () => void, 
    onSave: (bookData: Omit<Book, 'id'>) => void 
  }) => {
    const [formData, setFormData] = useState({
      title: book?.title || '',
      isbn: book?.isbn || '',
      description: book?.description || '',
      publishDate: book?.publishDate || '',
      genre: book?.genre || '',
      language: book?.language || 'Français',
      pages: book?.pages || 0,
      coverImage: book?.coverImage || '',
      authors: book?.authors || [],
      status: book?.status || 'available' as Book['status']
    });

    const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>(
      book?.authors.map(a => a.id) || []
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const selectedAuthors = authors.filter(author => selectedAuthorIds.includes(author.id));
      
      onSave({
        ...formData,
        authors: selectedAuthors
      });
      onClose();
    };

    const handleAuthorToggle = (authorId: string) => {
      setSelectedAuthorIds(prev => 
        prev.includes(authorId) 
          ? prev.filter(id => id !== authorId)
          : [...prev, authorId]
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            {book ? 'Modifier le livre' : 'Ajouter un livre'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de publication</label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                <input
                  type="number"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Français">Français</option>
                  <option value="Anglais">Anglais</option>
                  <option value="Espagnol">Espagnol</option>
                  <option value="Allemand">Allemand</option>
                  <option value="Italien">Italien</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Book['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Disponible</option>
                  <option value="borrowed">Emprunté</option>
                  <option value="reserved">Réservé</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image de couverture</label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Auteurs</label>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                {authors.map(author => (
                  <label key={author.id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedAuthorIds.includes(author.id)}
                      onChange={() => handleAuthorToggle(author.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{author.firstName} {author.lastName}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {book ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des livres</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau livre</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher par titre ou auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="borrowed">Emprunté</option>
            <option value="reserved">Réservé</option>
          </select>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auteur(s)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Publication
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-12 w-8 object-cover rounded mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {book.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {book.pages} pages • {book.language}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.authors.map(author => `${author.firstName} ${author.lastName}`).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {book.genre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={book.status}
                      onChange={(e) => handleStatusChange(book.id, e.target.value as Book['status'])}
                      className={`px-2 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${
                        book.status === 'available' ? 'bg-green-100 text-green-800' :
                        book.status === 'borrowed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <option value="available">Disponible</option>
                      <option value="borrowed">Emprunté</option>
                      <option value="reserved">Réservé</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(book.publishDate).getFullYear()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingBook(book)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun livre trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      )}

      {/* Add/Edit Book Modal */}
      {(showAddForm || editingBook) && (
        <BookFormModal
          book={editingBook || undefined}
          onClose={() => {
            setShowAddForm(false);
            setEditingBook(null);
          }}
          onSave={(bookData) => {
            if (editingBook) {
              updateBook(editingBook.id, bookData);
            } else {
              addBook(bookData);
            }
          }}
        />
      )}
    </div>
  );
};

export default ManageBooks;