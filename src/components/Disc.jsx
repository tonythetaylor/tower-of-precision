import React from 'react';

const gradients = {
  1: 'from-red-400 to-red-600',
  2: 'from-orange-300 to-orange-500',
  3: 'from-yellow-200 to-yellow-400',
  4: 'from-green-300 to-green-500',
  5: 'from-blue-400 to-blue-600',
};

export default function Disc({ tower, size }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ from: tower, size })
    );
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`
        bg-gradient-to-r ${gradients[size]}
        rounded-full
        shadow-xl
        cursor-grab active:cursor-grabbing
        transition-transform duration-200 ease-out
        hover:scale-105 active:scale-110
        border-2 border-gray-800 dark:border-gray-700
        my-1
      `}
      style={{
        width: `${60 + size * 15}px`,
        height: `${16 + size * 4}px`,
      }}
    />
  );
}