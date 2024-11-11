// frontend/components/UploadImageForm.tsx
import React, { useState } from 'react';

interface UploadImageFormProps {
  onClose: () => void;
  onSubmitImage: (imageData: string) => void;
}

const UploadImageForm: React.FC<UploadImageFormProps> = ({ onClose, onSubmitImage }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState('');

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setImageName(file ? file.name : '');
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSubmitImage(reader.result); // Pass the image data to the parent component
          onClose(); // Close the modal
        }
      };
      reader.readAsDataURL(imageFile);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">Upload Your Image</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="imageUpload" className="block text-sm font-medium">
              Select Image
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded p-2 w-full"
            />
          </div>
          {imageName && (
            <p className="text-sm text-gray-600">Selected Image: {imageName}</p>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadImageForm;
