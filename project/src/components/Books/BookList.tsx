import React, { useState, useMemo } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';
import { Search, Filter, SortAsc } from 'lucide-react';
import BookCard from './BookCard';
import BookDetails from './BookDetails';
import { Book } from '../../types';

const BookList: React.FC = () => {
  const { books } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(books.map(book => book.genre))];
    return uniqueGenres.sort();
  }, [books]);

  const filteredAndSortedBooks = useMemo(() => {
    let filtered = books;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authors.some(author =>
          `${author.firstName} ${author.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(book => book.status === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.authors[0]?.lastName.localeCompare(b.authors[0]?.lastName || '') || 0;
        case 'publishDate':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'pages':
          return b.pages - a.pages;
        default:
          return 0;
      }
    });

    return filtered;
  }, [books, searchTerm, selectedGenre, selectedStatus, sortBy]);

  if (selectedBook) {
    return <BookDetails book={selectedBook} onBack={() => setSelectedBook(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher par titre ou auteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="borrowed">Emprunté</option>
            <option value="reserved">Réservé</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="title">Trier par titre</option>
            <option value="author">Trier par auteur</option>
            <option value="publishDate">Trier par date</option>
            <option value="pages">Trier par pages</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        {filteredAndSortedBooks.length} livre{filteredAndSortedBooks.length !== 1 ? 's' : ''} trouvé{filteredAndSortedBooks.length !== 1 ? 's' : ''}
      </div>

      {/* Books grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedBooks.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onViewDetails={setSelectedBook}
          />
        ))}
      </div>

      {filteredAndSortedBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun livre trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookList;