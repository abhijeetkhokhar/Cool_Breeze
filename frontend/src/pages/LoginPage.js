import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const { handleGoogleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from URL query params
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect") || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  // Handle Google Sign-In response
  const handleCredentialResponse = async (credentialResponse) => {
    try {
      const result = await handleGoogleLogin(credentialResponse.credential);

      if (result.success) {
        toast.success("Login successful!");
        navigate(redirect);
      } else {
        toast.error(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">
              Sign in with your Google account to continue
            </p>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleCredentialResponse}
                onError={() => toast.error("Google login failed")}
                useOneTap
                width="280"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-gray-600 text-center">
              By signing in, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
