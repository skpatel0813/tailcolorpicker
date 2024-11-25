import React, { useState, useRef, useEffect } from "react";
import ColorThief from "colorthief";
import UploadImageForm from "./UploadImageForm";
import SavedPalettesModal from "./SavedPalettesModal";
import EditPaletteModal from "./EditPaletteModal";

interface ColorPaletteProps {
  imageUrl: string;
  isLoggedIn: boolean;
  username: string;
  onLoginRequest: () => void;
}

const ImageColorPalette: React.FC<ColorPaletteProps> = ({
  imageUrl,
  isLoggedIn,
  username,
  onLoginRequest,
}) => {
  const [palette, setPalette] = useState<number[][]>([]);
  const [hoverColor, setHoverColor] = useState<number[] | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [currentImage, setCurrentImage] = useState<string>(imageUrl);
  const [savedPalettes, setSavedPalettes] = useState<
    { _id: string; palette: string[]; createdAt: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavedPalettesModalOpen, setIsSavedPalettesModalOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<
    number | null
  >(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const colorThief = new ColorThief();
        const colors = colorThief.getPalette(img, 6);
        setPalette(colors);

        const canvas = canvasRef.current;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      };
    }
  }, [currentImage]);

  useEffect(() => {
    const fetchSavedPalettes = async () => {
      if (!username) return;

      try {
        const response = await fetch(
          `http://localhost:3001/api/getSavedPalettes?username=${username}`
        );
        if (response.ok) {
          const data = await response.json();
          setSavedPalettes(
            data.data.map((palette: any) => ({
              _id: palette._id,
              palette: palette.colors || [],
              createdAt: palette.createdAt,
            }))
          );
        } else {
          console.error("Failed to fetch saved palettes");
        }
      } catch (error) {
        console.error("Error fetching saved palettes:", error);
      }
    };

    fetchSavedPalettes();
  }, [username]);

  const rgbToHex = (rgb: number[]) => {
    return `#${rgb.map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (img && canvas) {
      const rect = img.getBoundingClientRect();
      const x = ((event.clientX - rect.left) * img.naturalWidth) / rect.width;
      const y = ((event.clientY - rect.top) * img.naturalHeight) / rect.height;

      const ctx = canvas.getContext("2d");
      const pixelData = ctx?.getImageData(x, y, 1, 1).data;

      if (pixelData) {
        const color = [pixelData[0], pixelData[1], pixelData[2]];
        setHoverColor(color);
        setTooltipPosition({ x: event.clientX, y: event.clientY });
      }
    }
  };

  const handleMouseLeave = () => {
    setHoverColor(null);
    setTooltipPosition(null);
  };

  const handleSavePalette = async () => {
    const hexPalette = palette.map((color) => rgbToHex(color));

    if (!username) {
      alert("Username is required to save the palette.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/savePalette", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ palette: hexPalette, username }),
      });

      if (res.ok) {
        try {
          const data = await res.json();
          alert("Palette saved successfully!");
          setSavedPalettes([
            ...savedPalettes,
            {
              _id: data._id,
              palette: hexPalette,
              createdAt: new Date().toISOString(),
            },
          ]);
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          alert(
            "Palette saved successfully, but there was an issue with the response format."
          );
        }
      } else {
        alert(`Failed to save palette: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error saving palette:", error);
      alert("An error occurred while saving the palette");
    }
  };

  const handleEditPalette = (index: number) => {
    setSelectedPaletteIndex(index);
    setIsEditModalOpen(true);
  };

  const handleUpdatePalette = async (updatedPalette: string[]) => {
    if (selectedPaletteIndex !== null) {
      try {
        const paletteToUpdate = savedPalettes[selectedPaletteIndex];
        const response = await fetch(
          `http://localhost:3000/api/updatePalette?paletteId=${paletteToUpdate._id}`,
          {
            method: "PUT",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              palette: updatedPalette,
              username: username,
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          const updatedPalettes = [...savedPalettes];
          updatedPalettes[selectedPaletteIndex] = result.data;
          setSavedPalettes(updatedPalettes);
          setIsEditModalOpen(false);
        } else {
          const errorData = await response.json();
          alert(`Failed to update palette: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error updating palette:", error);
        alert("An error occurred while updating the palette");
      }
    }
  };

  const handleDeletePalette = async (index: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this palette?"
    );
    if (confirmed) {
      try {
        const paletteToDelete = savedPalettes[index];
        const response = await fetch(
          `http://localhost:3000/api/deletePalette?paletteId=${
            paletteToDelete._id
          }&username=${encodeURIComponent(username)}`,
          {
            method: "DELETE",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const updatedPalettes = [...savedPalettes];
          updatedPalettes.splice(index, 1);
          setSavedPalettes(updatedPalettes);
          alert("Palette deleted successfully!");
        } else {
          const errorData = await response.json();
          alert(`Failed to delete palette: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error deleting palette:", error);
        alert("An error occurred while deleting the palette");
      }
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSavedPalettesModal = () => {
    setIsSavedPalettesModalOpen(true);
  };

  const closeSavedPalettesModal = () => {
    setIsSavedPalettesModalOpen(false);
  };

  const handleImageSubmit = (imageData: string) => {
    setCurrentImage(imageData);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setCurrentImage(imageUrl);
    }
  }, [isLoggedIn, imageUrl]);

  return (
    <div className="flex flex-col items-center relative">
      <img
        ref={imgRef}
        src={currentImage}
        alt="Default"
        className="w-64 h-64 object-cover mb-4 rounded-md shadow-md"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <div className="flex space-x-4 mt-4">
        {palette.map((color, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div
              style={{
                backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
              }}
              className="w-12 h-12 rounded-full shadow-md mb-2"
            ></div>
            <p className="text-sm font-medium">{rgbToHex(color)}</p>
          </div>
        ))}
      </div>
      {hoverColor && tooltipPosition && (
        <div
          style={{
            top: tooltipPosition.y + 10,
            left: tooltipPosition.x + 10,
            backgroundColor: `rgb(${hoverColor[0]}, ${hoverColor[1]}, ${hoverColor[2]})`,
          }}
          className="absolute p-2 rounded text-white shadow-md text-xs"
        >
          <p>{`HEX: ${rgbToHex(hoverColor)}`}</p>
        </div>
      )}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={handleSavePalette}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors"
        >
          Save Palette
        </button>
        {isLoggedIn && (
          <button
            onClick={openModal}
            className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-colors"
          >
            Upload New Image
          </button>
        )}
      </div>
      {isModalOpen && (
        <UploadImageForm
          onClose={closeModal}
          onSubmitImage={handleImageSubmit}
        />
      )}
      {isLoggedIn && (
        <div className="mt-8 w-full">
          <h2 className="text-lg font-semibold mb-4">
            Recently Saved Palettes
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {savedPalettes.map((savedPalette, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="flex space-x-2">
                  {savedPalette.palette.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="flex flex-col items-center"
                    >
                      <div
                        style={{ backgroundColor: color }}
                        className="w-8 h-8 rounded-full shadow-md"
                      ></div>
                      <p className="text-xs mt-1">{color}</p>
                    </div>
                  ))}
                </div>
                {/* <button
                  onClick={() => handleEditPalette(index)}
                  className="mt-2 px-2 py-1 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button> */}
              </div>
            ))}
          </div>
        </div>
      )}
      <SavedPalettesModal
        isOpen={isSavedPalettesModalOpen}
        onClose={closeSavedPalettesModal}
        palettes={savedPalettes}
        onEdit={handleEditPalette} // Added the missing onEdit prop
        onDelete={handleDeletePalette}
      />
      {/* {isEditModalOpen && selectedPaletteIndex !== null && (
        <EditPaletteModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          palette={savedPalettes[selectedPaletteIndex].palette}
          onSave={handleUpdatePalette}
        />
      )} */}
    </div>
  );
};

export default ImageColorPalette;
