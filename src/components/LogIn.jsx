import React, { useState } from 'react';
import { api } from '../services/Api';
import '../styles/LogIn.css';

const LogIn = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name || !email) {
      setError('Fill both fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await api.login(name, email);
      if (success) {
        onLogin({ name, email });
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-header">
          <h1>fetch</h1>
          <p>Find your companion</p>
        </div>

        <div className="login-form">
          <div className="input-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="login-input"
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="login-input"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Loading...' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogIn;