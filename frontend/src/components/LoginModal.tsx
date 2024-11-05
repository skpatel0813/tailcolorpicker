import React from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToSignup }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white p-6 rounded-md shadow-md w-80">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>

        {/* "Don't Have An Account?" Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t Have An Account?{' '}
          <a href="#" className="text-blue-500 hover:underline" onClick={onSwitchToSignup}>
            Click Here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
