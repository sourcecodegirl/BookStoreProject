import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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

const Bookshelf: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await axios.get('/api/bookshelf', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks([
          ...data.books.wantToRead.map((book: Book) => ({
            ...book,
            thumbnail: book.imageLinks?.thumbnail || '',
          })),
          ...data.books.currentlyReading.map((book: Book) => ({
            ...book,
            thumbnail: book.imageLinks?.thumbnail || '',
          })),
          ...data.books.read.map((book: Book) => ({
            ...book,
            thumbnail: book.imageLinks?.thumbnail || '',
          })),
        ]);
      } catch {
        navigate('/');
      }
    };
    fetchBooks();
  }, [token, navigate]);

  const handleStatusChange = async (bookId: string, newShelf: string) => {
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
      <h2>My Bookshelf</h2>
      <div className="bookshelf">
        <div className="books-container">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              {book.thumbnail && (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="book-thumbnail"
                />
              )}
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.authors?.join(', ') || 'Unknown Author'}</p>
              <select
                value={book.shelf}
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
      </div>
    </>
  );
};

export default Bookshelf;
