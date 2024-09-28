import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { token } = useAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedQuery = query.trim().replace(/\s+/g, '+');
    navigate(`/search?q=${formattedQuery}`);
  };

  return (
    <header className="header">
      <h1>Book Store Project</h1>
      <nav className="nav-bar">
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/bookshelf">Bookshelf</Link>
          </li>
        </ul>
      </nav>
      {token && (
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search for books..."
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      )}
    </header>
  );
};

export default Header;
