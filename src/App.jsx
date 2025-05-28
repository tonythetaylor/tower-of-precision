import React, { useState, useEffect } from "react";
import Tower from "./components/Tower";
import Controls from "./components/Controls";
import HowToPlayModal from "./components/HowToPlayModal";

const INITIAL = [5, 4, 3, 2, 1];

export default function App() {
  const [towers, setTowers] = useState({ A: [...INITIAL], B: [], C: [] });
  const [moves, setMoves] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [muted, setMuted] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [controlsVisible, setControlsVisible] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    }
  }, []);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const play = (id) => {
    if (!muted) {
      const s = document.getElementById(id);
      if (s) { s.currentTime = 0; s.play(); }
    }
  };

  const reset = () => {
    setTowers({ A: [...INITIAL], B: [], C: [] });
    setMoves(0);
    setFeedback("");
  };

  const handleMove = (from, to, size) => {
    const src = [...towers[from]];
    const dst = [...towers[to]];
    const top = dst[dst.length - 1] ?? Infinity;
    if (src[src.length - 1] === size && size < top) {
      src.pop();
      dst.push(size);
      setTowers({ ...towers, [from]: src, [to]: dst });
      setMoves(m => m + 1);
      play("drop");
      setFeedback("");
      if (to === "C" && dst.length === INITIAL.length) {
        setFeedback(`🎉 You won in ${moves + 1} moves!`);
        play("win");
      }
    } else {
      setFeedback('❌ Invalid move!');
      play("invalid");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 h-screen overflow-hidden text-gray-900 dark:text-gray-100 transition-colors landscape:flex landscape:flex-col landscape:justify-center landscape:items-center">
      {/* Toggle button: visible on mobile only */}
      <button
        onClick={() => setControlsVisible(v => !v)}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-full md:hidden"
      >
        ☰
      </button>

      {/* Controls panel: mobile toggle, always visible on md+ */}
      <div className={`${controlsVisible ? 'block' : 'hidden'} md:flex gap-4 p-4 sm:justify-center sm:items-center`}>
        <Controls
          theme={theme}
          setTheme={setTheme}
          muted={muted}
          setMuted={setMuted}
          onReset={reset}
          onShowHelp={() => setShowHelp(true)}
        />
      </div>

      {/* How to Play modal */}
      {showHelp && <HowToPlayModal onClose={() => setShowHelp(false)} />}

      {/* Three towers */}
      <main className="w-full px-4 mt-8 flex flex-row items-end justify-center gap-x-8">
        {['A','B','C'].map(t => (
          <Tower key={t} name={t} discs={towers[t]} onDrop={handleMove} />
        ))}
      </main>

      {/* Footer */}
      <footer className="text-center mt-8 pb-8 text-gray-900 dark:text-gray-100">
        <div>Moves: <strong>{moves}</strong></div>
        {feedback && (
          <div className={`mt-2 ${feedback.startsWith('🎉') ? 'text-green-500' : 'text-red-400'}`}>{feedback}</div>
        )}
      </footer>

      {/* Sounds */}
      <audio id="drop" src="drop.wav" preload="auto" />
      <audio id="invalid" src="invalid.wav" preload="auto" />
      <audio id="win" src="win.wav" preload="auto" />
    </div>
  );
}
