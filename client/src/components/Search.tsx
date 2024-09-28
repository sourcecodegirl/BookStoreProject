import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from './Header';

interface Book {
  id: string;
  title: string;
  authors?: string[];
  shelf: string;
  thumbnail?: string;
  imageLinks?: {
    thumbnail?: string;
  };
}

const Search: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(useLocation().search).get('q');
  const { token } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        const formattedQuery = query.trim().replace(/\s+/g, '+');
        const response = await axios.get(`/api/book/search/${formattedQuery}`);
        // Set the shelf property to an empty string if it doesn't exist
        const formattedBooks = response.data.books.map((book: Book) => ({
          ...book,
          shelf: book.shelf || '',
        }));
        setBooks(formattedBooks);
      } catch (err) {
        console.error(err);
        setError('Error fetching search results.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query]);

  const handleStatusChange = async (bookId: string, newShelf: string) => {
    if (newShelf === "") {
      return;
    }

    try {
      await axios.put(`/api/bookshelf/${bookId}/${newShelf}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state to reflect the change
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId ? { ...book, shelf: newShelf } : book
        )
      );
    } catch (error) {
      console.error('Error updating book status:', error);
    }
  };

  return (
    <>
      <Header />
      <div>
        <h2>Search Results for "{query}"</h2>
        {error && <p>{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : books.length > 0 ? (
          <div className="books-container">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                {book.imageLinks?.thumbnail && (
                  <img
                    src={book.imageLinks.thumbnail}
                    alt={book.title}
                    className="book-thumbnail"
                  />
                )}
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.authors?.join(', ') || 'Unknown Author'}</p>
                <select
                  value={book.shelf || ""}
                  className="status-select"
                  onChange={(e) => handleStatusChange(book.id, e.target.value)}
                >
                  <option value="" disabled>Select an option</option>
                  <option value="wantToRead">Want to Read</option>
                  <option value="currentlyReading">Currently Reading</option>
                  <option value="read">Read</option>
                </select>
              </div>
            ))}
          </div>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </>
  );
};

export default Search;
