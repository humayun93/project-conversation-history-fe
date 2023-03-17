// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleSignIn = () => {
    setLoggedIn(true);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={loggedIn ? (
              <Dashboard onSignOut={handleSignOut} />
            ) : (
              <Navigate to="/signin" />
            )}>
            
          </Route>
          <Route path="/signin" element={loggedIn ? (
              <Navigate to="/" />
            ) : (
              <SignIn onSignIn={handleSignIn} />
            )}>
            </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
