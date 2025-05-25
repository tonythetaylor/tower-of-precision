import React from "react";
import Disc from "./Disc";

export default function Tower({ name, discs, onDrop, isSelected }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const { from, size } = JSON.parse(
      e.dataTransfer.getData("application/json")
    );
    onDrop(from, name, size);
  };

  // sort so smallest discs are first → bottom-up stacking
  const sorted = [...discs].sort((a, b) => a - b);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={
        `relative flex flex-col justify-start items-center
        w-full h-64
        bg-gray-800 dark:bg-gray-800
        border-4 ${isSelected ? 'border-yellow-400' : 'border-gray-700'}
        rounded-lg shadow-lg p-3`
      }
    >
      {/* subtle full-background watermark letter */}
      <span className="absolute top-2 right-2 text-xl font-bold text-white opacity-10 pointer-events-none">
        {name}
      </span>

      {/* vertical peg behind discs */}
      <div
        className="absolute bottom-3 left-1/2 transform -translate-x-1/2
          w-2 h-4/5 bg-gray-600 dark:bg-gray-400
          rounded-full z-0"
      />

      {/* stack discs bottom-up, above the peg */}
      <div className="relative z-10 flex flex-col justify-end items-center w-full h-full space-y-2">
        {sorted.map((size, i) => (
          <Disc key={i} tower={name} size={size} />
        ))}
      </div>
    </div>
  );
}
