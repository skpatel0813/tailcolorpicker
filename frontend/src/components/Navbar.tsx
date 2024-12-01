import React from "react";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
  onViewSavedPalettes: () => Promise<void>;
}

const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  onLogout,
  onLoginClick,
  onViewSavedPalettes,
}) => {
  return (
    <nav className="w-full bg-gray-800 text-white py-4 shadow-md flex items-center px-8">
      <div className="flex-1"></div>

      <div className="text-2xl font-semibold flex-1 text-center">
        Tail ColorPicker
      </div>

      <div className="flex items-center space-x-4 flex-1 justify-end">
        {!isLoggedIn ? (
          <button
            onClick={onLoginClick}
            className="px-4 py-2 bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        ) : (
          <>
            <button
              onClick={onViewSavedPalettes}
              className="px-4 py-2 bg-green-500 rounded-md shadow-md hover:bg-green-600 transition-colors"
            >
              View Saved Palettes
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 rounded-md shadow-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
