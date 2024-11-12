import React from 'react';

interface SavedPalettesModalProps {
  isOpen: boolean;
  onClose: () => void;
  palettes: { palette: string[]; createdAt: string }[];
  onEdit: (index: number) => void; // Handler for editing a palette
  onDelete: (index: number) => void; // Handler for deleting a palette
}

const SavedPalettesModal: React.FC<SavedPalettesModalProps> = ({
  isOpen,
  onClose,
  palettes,
  onEdit,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-center">Saved Palettes</h2>
        {palettes.length > 0 ? (
          palettes.map((palette, index) => (
            <div key={index} className="mb-4">
              <div className="flex space-x-2 mb-2">
                {palette.palette.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    style={{ backgroundColor: color }}
                    className="w-8 h-8 rounded-full border border-gray-300"
                  ></div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Saved on: {new Date(palette.createdAt).toLocaleDateString()}</p>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => onEdit(index)}
                  className="px-2 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(index)}
                  className="px-2 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No saved palettes found.</p>
        )}
      </div>
    </div>
  );
};

export default SavedPalettesModal;
