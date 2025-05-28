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

  // sort so 1 is at top, 5 is at bottom
  const sorted = [...discs].sort((a, b) => a - b);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-start flex-none
        w-[100px] sm:w-[160px] md:w-[200px] lg:w-[240px] xl:w-[300px] h-64
        bg-gray-800 dark:bg-gray-900
        rounded-2xl
        shadow-2xl shadow-black/50
        transform transition-all duration-300
        hover:-translate-y-2 hover:scale-105
        ${isSelected ? "ring-4 ring-yellow-400" : ""}
        overflow-hidden
      `}
    >
      {/* huge translucent label */}
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center
                       text-7xl font-extrabold text-white opacity-10 select-none"
      >
        {name}
      </span>

      {/* stack bottom-up */}
      <div className="flex flex-col justify-end items-center w-full h-full space-y-1 px-2 pb-4">
        {sorted.map((size, i) => (
          <Disc key={i} tower={name} size={size} />
        ))}
      </div>
    </div>
  );
}