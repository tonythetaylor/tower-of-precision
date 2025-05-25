import React from 'react';

export default function Controls({ theme, setTheme, muted, setMuted, onReset, onShowHelp }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">
        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <button onClick={() => setMuted(!muted)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500">
        {muted ? '🔇 Sound Off' : '🔊 Sound On'}
      </button>
      <button onClick={onReset} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500">
        Reset Game
      </button>
      <button onClick={onShowHelp} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500">
        ❓ How to Play
      </button>
    </div>
  );
}
