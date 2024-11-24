import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ImageColorPalette from './components/ImageColorPalette';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import SavedPalettesModal from './components/SavedPalettesModal';
import ColorPicker from './components/ColorPicker';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isSavedPalettesModalOpen, setIsSavedPalettesModalOpen] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState<{ palette: string[]; createdAt: string }[]>([]);
  const [username, setUsername] = useState<string>('');

  const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0V9Cevo3BSOtjYT5-baCTTd2hJvyxCiRbFw&s';

  const onLoginRequest = () => {
    setIsLoginModalOpen(true);
  };

  const handleSuccessfulLogin = (loggedInUsername: string) => {
    setIsLoggedIn(true);
    setUsername(loggedInUsername);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  const handleViewSavedPalettes = async () => {
    if (!username) {
      alert('Please log in first.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/getSavedPalettes?username=${encodeURIComponent(username)}`, {
        method: 'GET',
        credentials: 'same-origin',
      });

      if (res.ok) {
        const data = await res.json();
        setSavedPalettes(data.data);
        setIsSavedPalettesModalOpen(true);
      } else {
        const errorData = await res.json();
        alert(`Failed to fetch saved palettes: ${errorData.error}`);
      }
    } catch (error) {
      alert('An error occurred while fetching saved palettes');
    }
  };

  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  // New Logout Component
  const Logout: React.FC = () => {
    handleLogout();
    return <Navigate to="/" />;
  };

  return (
    <Router>
      <div className="App min-h-screen bg-gray-100">
        <Navbar
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onLoginClick={onLoginRequest}
          onViewSavedPalettes={handleViewSavedPalettes}
        />

        <div>
          <ColorPicker />
        </div>

        <div className="flex items-center justify-center ">
          <Routes>
            <Route
              path="/"
              element={
                <ImageColorPalette
                  imageUrl={defaultImageUrl}
                  isLoggedIn={isLoggedIn}
                  username={username}
                  onLoginRequest={onLoginRequest}
                />
              }
            />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToSignup={handleSwitchToSignup}
          onSuccessfulLogin={handleSuccessfulLogin}
        />
        <SignupModal
          isOpen={isSignupModalOpen}
          onClose={() => setIsSignupModalOpen(false)}
          onSwitchToLogin={handleSwitchToLogin}
        />
        <SavedPalettesModal
          isOpen={isSavedPalettesModalOpen}
          onClose={() => setIsSavedPalettesModalOpen(false)}
          palettes={savedPalettes}
          onEdit={(index) => {
            alert(`Edit palette at index ${index}`);
          }}
          onDelete={(index) => {
            const confirmed = window.confirm('Are you sure you want to delete this palette?');
            if (confirmed) {
              const updatedPalettes = [...savedPalettes];
              updatedPalettes.splice(index, 1);
              setSavedPalettes(updatedPalettes);
            }
          }}
        />
      </div>
    </Router>
  );
};

export default App;
