import React, { useState } from 'react';
import { CirclePicker } from 'react-color';

const ColorWheel = () => {
  const [color, setColor] = useState('#ffffff'); // Default color

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex); // Save selected color
  };

  return (
    <div>
      <h3>Selected Color: {color}</h3>
      <CirclePicker color={color} onChange={handleColorChange} />
    </div>
  );
};

export default ColorWheel;

