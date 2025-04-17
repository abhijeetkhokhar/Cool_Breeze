import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/rider/login`, { email, password });
      setUser(data.user);
      localStorage.setItem('riderToken', data.token);
      navigate('/orders');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    try {
      // credentialResponse.credential is the JWT token from Google
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/rider/google-login`, {
        token: credentialResponse.credential
      });
      setUser(data.user);
      localStorage.setItem('riderToken', data.token);
      navigate('/orders');
    } catch (err) {
      setError('Google login failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Rider Login</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="mb-6">
            <label className="block mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold mb-4">Login</button>
          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-500">or</span>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed')}
              width="100%"
            />
          </div>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
