import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './components/Signin';
import Bookshelf from './components/Bookshelf';
import Search from './components/Search';
import BookDetails from './components/BookDetails';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Signin />} />
    <Route path="/bookshelf" element={<ProtectedRoute><Bookshelf /></ProtectedRoute>} />
    <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
    <Route path="/book/:bookId" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
  </Routes>
);

export default AppRoutes;
