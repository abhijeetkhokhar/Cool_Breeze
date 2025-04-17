import React, { useContext } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import MyOrdersPage from './pages/MyOrdersPage';
import LoginPage from './pages/LoginPage';
import { AuthContext } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function AppNav() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <nav className="bg-white shadow p-4 flex gap-4 items-center">
      <Link to="/" className="font-semibold text-blue-600">Home</Link>
      <Link to="/orders" className="font-semibold text-blue-600">My Orders</Link>
      <Link to="/profile" className="font-semibold text-blue-600">Profile</Link>
      {user ? (
        <button onClick={handleLogout} className="ml-auto bg-red-500 text-white px-3 py-1 rounded">Logout</button>
      ) : (
        <Link to="/login" className="ml-auto font-semibold text-blue-600">Login</Link>
      )}
    </nav>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AppNav />
      <Routes>
        <Route path="/" element={
          <div className="flex items-center justify-center py-16">
            <h1 className="text-2xl font-bold text-gray-800">Rider App is Running!</h1>
          </div>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/orders" element={
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/orders/:orderId" element={
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              {React.createElement(require('./pages/OrderDetailsPage').default)}
            </React.Suspense>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            {React.createElement(require('./pages/ProfilePage').default)}
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
