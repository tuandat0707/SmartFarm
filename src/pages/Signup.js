import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import './Login.scss';

const Signup = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    console.log('Signup.jsx: Clearing localStorage');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    console.log('Signup.jsx: Submitting signup with:', { username, password });

    try {
      const apiUrl = 'http://localhost:3001/user';
      if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
        throw new Error('Invalid URL protocol. URL must start with http:// or https://');
      }
      console.log('Signup.jsx: Sending API request to:', apiUrl);
      const response = await axios.post(apiUrl.trim(), {
        userInfo: {
          username: username.trim(),
          password: password.trim(),
        },
      });
      console.log('Signup.jsx: Full API response:', response);
      console.log('Signup.jsx: Response data:', response.data);

      if (response.status === 200 && response.data === 'User created successfully') {
        console.log('Signup.jsx: Signup successful, updating auth context');
        const userData = { username };
        localStorage.setItem('user', JSON.stringify(userData));
        dispatch({ type: 'LOGIN', payload: userData });
        setSuccess('Signup successful! Redirecting to login...');
      } else {
        if (response.data.includes('is already taken')) {
          setError(`${response.data}. Please choose a different username.`);
        } else {
          setError(response.data || 'Signup failed');
        }
        console.log('Signup.jsx: Signup failed:', response.data);
      }
    } catch (err) {
      console.error('Signup.jsx: Signup error:', err.message);
      if (err.response) {
        console.error('Signup.jsx: Error response:', err.response.data);
        setError(err.response.data || 'Server error');
      } else if (err.request) {
        console.error('Signup.jsx: No response received:', err.request);
        setError('No response from server. Check if the server is running.');
      } else {
        console.error('Signup.jsx: Error details:', err.message);
        setError(err.message || 'Request error');
      }
    } finally {
      setIsLoading(false);
      console.log('Signup.jsx: Signup process completed, isLoading:', isLoading);
    }
  };

  useEffect(() => {
    if (success) {
      console.log('Signup.jsx: Success state set, starting 2-second timer for navigation');
      const timer = setTimeout(() => {
        console.log('Signup.jsx: Navigating to /login');
        navigate('/login', { replace: true });
      }, 2000);
      return () => {
        console.log('Signup.jsx: Cleaning up timer');
        clearTimeout(timer);
      };
    }
  }, [success, navigate]);

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
        <h2>Sign Up</h2>
        {success && <div className="success">{success}</div>}
        {error && <div className="error">{error}</div>}
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
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <p className="signup-link">
            Already have an account?{' '}
            <a href="#" onClick={() => navigate('/login')}>
              Go to Log In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;