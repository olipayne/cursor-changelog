import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FiAlertCircle } from 'react-icons/fi';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Spinner from '../components/common/Spinner';
import Layout from '../components/Layout/Layout';

const LoginPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmailPasswordLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithRedirect({
        authorizationParams: {
          connection: 'Username-Password-Authentication',
        },
      });
    } catch (err) {
      setError('Failed to login. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithRedirect({
        authorizationParams: {
          connection: 'google-oauth2',
        },
      });
    } catch (err) {
      setError('Failed to login with Google. Please try again.');
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithRedirect({
        authorizationParams: {
          connection: 'github',
        },
      });
    } catch (err) {
      setError('Failed to login with GitHub. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center py-12">
        <div className="card max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
          
          {error && (
            <div className="mb-4 bg-red-950 border border-red-700 text-red-300 px-4 py-3 rounded-md flex items-center">
              <FiAlertCircle className="mr-2" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleEmailPasswordLogin}
              disabled={loading}
              className="w-full py-2.5 bg-primary-600 text-cursor-light rounded-md hover:bg-primary-700 flex items-center justify-center transition-colors"
            >
              {loading ? <Spinner size="sm" /> : "Continue with Email & Password"}
            </button>
            
            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-cursor-border absolute w-full"></div>
              <span className="bg-cursor-darker px-2 relative text-sm text-cursor-muted">or continue with</span>
            </div>
            
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2.5 bg-cursor-darker text-cursor-light rounded-md border border-cursor-border hover:bg-cursor-dark flex items-center justify-center transition-colors"
            >
              <FaGoogle className="mr-2" />
              Google
            </button>
            
            <button
              onClick={handleGithubLogin}
              disabled={loading}
              className="w-full py-2.5 bg-cursor-darker text-cursor-light rounded-md border border-cursor-border hover:bg-cursor-dark flex items-center justify-center transition-colors"
            >
              <FaGithub className="mr-2" />
              GitHub
            </button>
          </div>
          
          <p className="mt-6 text-center text-sm text-cursor-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage; 