import React, { useState } from "react";

const ColorSelector = ({ initialSelectedColor, availableColors, onColorSelect }) => {
  const [selectedColor, setSelectedColor] = useState(initialSelectedColor);

  const handleClick = (color) => {
    setSelectedColor(color);
    if (onColorSelect) {
      onColorSelect(color);
    }
  };

  return (
    <div>
      <div className="flex space-x-2">
        {availableColors.map((color, index) => (
          <button
            key={index}
            className={`w-8 h-8 rounded-full ${color} ${selectedColor === color ? 'border-4 border-black' : ''}`}
            onClick={() => handleClick(color)}
          ></button>
        ))}
      </div>
      <div className="mt-2">
        <p>Selected Color: <span className={`text-xl ${selectedColor}`}>{selectedColor}</span></p>
      </div>
    </div>
  );
};

export default ColorSelector;
