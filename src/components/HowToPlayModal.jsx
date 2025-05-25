import React from 'react';

export default function HowToPlayModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-xl max-w-md p-6 text-left">
        <h2 className="text-2xl font-bold mb-4">How to Play</h2>
        <p className="mb-2"><strong>Goal:</strong> Move all the discs from the left tower to the right tower.</p>
        <p className="mb-2"><strong>Rules:</strong></p>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Only one disc can be moved at a time.</li>
          <li>You may only move the top disc from a tower.</li>
          <li>No disc may be placed on top of a smaller disc.</li>
          <li>Use the middle tower to help reorganize!</li>
        </ul>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
         Got it
        </button>
      </div>
    </div>
  );
}
