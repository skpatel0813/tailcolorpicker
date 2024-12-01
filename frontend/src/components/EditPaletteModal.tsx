import React, { useState } from "react";

interface EditPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  palette: string[];
  onSave: (updatedPalette: string[]) => void;
}

const EditPaletteModal: React.FC<EditPaletteModalProps> = ({
  isOpen,
  onClose,
  palette,
  onSave,
}) => {
  const [updatedPalette, setUpdatedPalette] = useState<string[]>(palette);

  const handleColorChange = (index: number, newColor: string) => {
    const newPalette = [...updatedPalette];
    newPalette[index] = newColor;
    setUpdatedPalette(newPalette);
  };

  const handleSave = () => {
    onSave(updatedPalette);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Palette</h2>
        <div className="flex flex-col space-y-2">
          {updatedPalette.map((color, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="w-10 h-10 border rounded"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="flex-1 border rounded p-1"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="ml-2 px-4 py-2 bg-gray-300 rounded-md shadow-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPaletteModal;
