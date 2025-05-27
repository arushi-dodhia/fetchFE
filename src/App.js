import React, { useState } from 'react';
import LogIn from './components/LogIn';
import Search from './components/Search';
import './styles/App.css';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="app">
      {!user ? (
        <LogIn onLogin={handleLogin} />
      ) : (
        <Search user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;