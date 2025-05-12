import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import './Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignupClick = (e) => {
    e.preventDefault();
    if (user) {
      console.log('Login.jsx: User authenticated, redirecting to /dashboard');
      navigate('/dashboard');
      return;
    }
    console.log('Login.jsx: Navigating to /signup');
    navigate('/signup');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log('Login.jsx: Submitting login with:', { username, password });

    try {
      const apiUrl = 'http://localhost:3001/login';
      if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
        throw new Error('Invalid URL protocol. URL must start with http:// or https://');
      }
      console.log('Login.jsx: Sending API request to:', apiUrl);
      const response = await axios.post(apiUrl.trim(), {
        userInfo: {
          username: username.trim(),
          password: password.trim(),
        },
      });
      console.log('Login.jsx: Full API response:', response);
      console.log('Login.jsx: API response:', response.data);

      if (response.status === 200 && response.data === 'Login successful') {
        console.log('Login.jsx: Login successful, updating auth context');
        const userData = { username };
        localStorage.setItem('user', JSON.stringify(userData));
        dispatch({ type: 'LOGIN', payload: userData });

        // Post notification after successful login
        try {
          const notificationUrl = 'http://localhost:3001/notification';
          const notificationResponse = await axios.post(notificationUrl, {
            notificationInfo: {
              description: `User ${username} logged in successfully`,
              userKey: username,
              notificationId: Date.now(),
            },
          });
          console.log('Login.jsx: Notification response:', notificationResponse.data);
          if (notificationResponse.status !== 200) {
            console.warn('Login.jsx: Notification creation failed:', notificationResponse.data);
          }
        } catch (notificationError) {
          console.error('Login.jsx: Failed to post notification:', notificationError.message);
        }

        console.log('Login.jsx: Navigating to /dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        setError('Wrong password or username. Please try again.');
        console.log('Login.jsx: Login failed:', response.data);
      }
    } catch (err) {
      console.error('Login.jsx: Login error:', err.message);
      if (err.response) {
        console.error('Login.jsx: Error response:', err.response.data);
        setError('Server error occurred. Please try again later.');
      } else if (err.request) {
        console.error('Login.jsx: No response received:', err.request);
        setError('No response from server. Check if the server is running.');
      } else {
        console.error('Login.jsx: Error details:', err.message);
        setError('An error occurred while processing your request.');
      }
    } finally {
      setIsLoading(false);
      console.log('Login.jsx: Login process completed, isLoading:', isLoading);
    }
  };

  const handleDismiss = () => {
    setError(null);
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="/farm-drone.jpg" alt="SmartFarm field with drone" />
      </div>
      <div className="login-form">
        <div className="login-logo">
          <span className="material-icons">eco</span>
          <h1>SmartFarm</h1>
        </div>
        <h1>Welcome to SmartFarm</h1>
        <h2>Log In</h2>
        {error && (
          <div className="error">
            {error}
            <button className="dismiss-btn" onClick={handleDismiss}>
              ×
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          <button disabled={isLoading} className="btn-login">
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
          <p className="signup-link">
            Don’t have an account?{' '}
            <a href="#" onClick={handleSignupClick}>
              Go to Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;