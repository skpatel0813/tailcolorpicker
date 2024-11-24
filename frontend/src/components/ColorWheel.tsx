import React, { useState } from 'react';
import { CirclePicker } from 'react-color';

function ColorWheel() {

    const [color, setColor] = useState('#f44336'); 
  
    
    const handleChange = (newColor) => {
      setColor(newColor.hex);
    };
  
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Pick a Color</h1>
        {/* Color Picker */}
        <CirclePicker color={color} onChange={handleChange} />
        
        {/* Display the selected color */}
        <div style={{
          marginTop: '20px',
          width: '100px',
          height: '100px',
          backgroundColor: color,
          border: '1px solid #000',
          display: 'inline-block'
        }}>
          Selected Color
        </div>
      </div>
    );
  }
  
  export default ColorWheel;
