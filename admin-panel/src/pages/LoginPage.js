import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const { handleGoogleLogin, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Handle Google Sign-In response
  const handleCredentialResponse = async (credentialResponse) => {
    try {
      const result = await handleGoogleLogin(credentialResponse.credential);
      if (result.success) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <h1 className="text-2xl font-bold text-primary">CoolBreeze Admin</h1>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">
              Sign in with your Google account to access the admin panel
            </p>
            
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleCredentialResponse}
                onError={() => toast.error('Google login failed')}
                useOneTap
                width="280"
              />
            </div>
          </div>
          
          <div className="border-t pt-6">
            <p className="text-sm text-gray-600 text-center">
              Only authorized admin accounts can access this panel.
            </p>
            
            <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> If you don't have admin access, please contact the system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
