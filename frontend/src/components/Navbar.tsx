import React, { useState } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const Navbar: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false); // Close signup modal if it's open
  };

  const handleSignupClick = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false); // Close login modal if it's open
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`Image uploaded: ${file.name}`);
    }
  };

  return (
    <nav className="w-full bg-gray-800 text-white py-4 shadow-md flex items-center px-8">
      {/* Empty div to balance the space on the left */}
      <div className="flex-1"></div>

      {/* Center Title */}
      <div className="text-2xl font-semibold flex-1 text-center">
        Tail ColorPicker
      </div>

      {/* Right Buttons */}
      <div className="flex items-center space-x-4 flex-1 justify-end">
        <button
          onClick={handleLoginClick}
          className="px-4 py-2 bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </div>

      {/* Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseModal} onSwitchToSignup={handleSignupClick} />
      <SignupModal isOpen={isSignupModalOpen} onClose={handleCloseModal} onSwitchToLogin={handleLoginClick} />
    </nav>
  );
};

export default Navbar;
