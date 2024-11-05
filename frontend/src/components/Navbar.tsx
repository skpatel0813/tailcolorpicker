import React from 'react';

const Navbar: React.FC = () => {
  const handleLogin = () => {
    alert('Login clicked!');
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
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
        <label className="px-4 py-2 bg-green-500 rounded-md shadow-md hover:bg-green-600 transition-colors cursor-pointer">
          Upload Your Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>
    </nav>
  );
};

export default Navbar;
