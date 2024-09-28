import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface BookDetails {
  title: string;
  authors: string[];
  description: string;
}

const BookDetails: React.FC = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState<BookDetails | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      const { data } = await axios.get(`/api/book/${bookId}`);
      setBook(data.book);
    };
    fetchBookDetails();
  }, [bookId]);

  if (!book) return <p>Loading...</p>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.authors.join(', ')}</p>
      <p>{book.description}</p>
    </div>
  );
};

export default BookDetails;
