import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ImageColorPalette from './components/ImageColorPalette';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal'; 
import SavedPalettesModal from './components/SavedPalettesModal';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isSavedPalettesModalOpen, setIsSavedPalettesModalOpen] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState<any[]>([]);

  const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0V9Cevo3BSOtjYT5-baCTTd2hJvyxCiRbFw&s';

  const onLoginRequest = () => {
    setIsLoginModalOpen(true);
  };

  const handleSuccessfulLogin = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleViewSavedPalettes = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/getSavedPalettes', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setSavedPalettes(data.data);
        setIsSavedPalettesModalOpen(true);
      } else {
        alert('Failed to fetch saved palettes');
      }
    } catch (error) {
      console.error('Error fetching saved palettes:', error);
      alert('An error occurred while fetching saved palettes');
    }
  };

  // Function to switch from login to signup modal
  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  // Function to switch from signup to login modal
  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <div className="App min-h-screen bg-gray-100">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLoginClick={onLoginRequest}
        onViewSavedPalettes={handleViewSavedPalettes} // Pass function to view saved palettes
      />
      <div className="flex items-center justify-center min-h-screen">
        <ImageColorPalette
          imageUrl={defaultImageUrl}
          isLoggedIn={isLoggedIn}
          onLoginRequest={onLoginRequest}
        />
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
        onSwitchToLogin={handleSwitchToLogin} // Pass function to switch to login modal
      />
      <SavedPalettesModal
        isOpen={isSavedPalettesModalOpen}
        onClose={() => setIsSavedPalettesModalOpen(false)}
        palettes={savedPalettes}
      />
    </div>
  );
};

export default App;
