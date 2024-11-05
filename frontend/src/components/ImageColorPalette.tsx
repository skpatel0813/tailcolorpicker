import React, { useEffect, useState, useRef } from 'react';
import ColorThief from 'colorthief';

interface ColorPaletteProps {
  imageUrl: string;
}

const ImageColorPalette: React.FC<ColorPaletteProps> = ({ imageUrl }) => {
  const [palette, setPalette] = useState<number[][]>([]);
  const [hoverColor, setHoverColor] = useState<number[] | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [currentImage, setCurrentImage] = useState<string>(imageUrl);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      img.crossOrigin = 'Anonymous'; // Required for cross-origin images
      img.onload = () => {
        const colorThief = new ColorThief();
        const colors = colorThief.getPalette(img, 6); // Extracts 6 dominant colors
        setPalette(colors);
        
        // Set canvas dimensions based on the loaded image size
        const canvas = canvasRef.current;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      };
    }
  }, [currentImage]);

  // Helper function to convert RGB to Hex
  const rgbToHex = (rgb: number[]) => {
    return `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (img && canvas) {
      const rect = img.getBoundingClientRect();
      const x = ((event.clientX - rect.left) * img.naturalWidth) / rect.width;
      const y = ((event.clientY - rect.top) * img.naturalHeight) / rect.height;

      const ctx = canvas.getContext('2d');
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

  // Save palette function
  const handleSavePalette = () => {
    const hexPalette = palette.map(color => rgbToHex(color));
    localStorage.setItem('savedPalette', JSON.stringify(hexPalette));
    alert('Palette saved successfully!');
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCurrentImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div className="flex space-x-4 mt-4">
        {palette.map((color, index) => {
          const rgbString = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
          const hexString = rgbToHex(color);

          return (
            <div key={index} className="flex flex-col items-center text-center">
              <div
                style={{ backgroundColor: rgbString }}
                className="w-12 h-12 rounded-full shadow-md mb-2"
              ></div>
              {/* <p className="text-sm font-medium text-center">{rgbString}</p> */}
              <p className="text-sm font-medium">{hexString}</p>
            </div>
          );
        })}
      </div>
      {hoverColor && tooltipPosition && (
        <div
          style={{
            top: tooltipPosition.y + 10,
            left: tooltipPosition.x + 10,
            backgroundColor: `rgb(${hoverColor[0]}, ${hoverColor[1]}, ${hoverColor[2]})`
          }}
          className="absolute p-2 rounded text-white shadow-md text-xs"
        >
          {/* <p>{`RGB: rgb(${hoverColor[0]}, ${hoverColor[1]}, ${hoverColor[2]})`}</p> */}
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
        <label className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-colors cursor-pointer">
          Upload Your Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default ImageColorPalette;
