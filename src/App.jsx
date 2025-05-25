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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    // Prevent overscroll bounce on mobile
    document.documentElement.style.overscrollBehavior = "none";
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
      setMoves((m) => m + 1);
      play("drop");
      setFeedback("");
      if (to === "C" && dst.length === INITIAL.length) {
        setFeedback(`🎉 You won in ${moves + 1} moves!`);
        play("win");
      }
    } else {
      setFeedback("❌ Invalid move!");
      play("invalid");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 h-screen overflow-hidden text-gray-900 dark:text-gray-100 transition-colors landscape:flex landscape:flex-col landscape:justify-center landscape:items-center">
      {/* Toggle button in landscape only */}
      <button
        onClick={() => setControlsVisible((v) => !v)}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-full landscape:block hidden"
      >
        ☰
      </button>

      {/* Controls + feedback */}
      <div
        className={
          `gap-4 p-4
           sm:flex sm:justify-center sm:items-center
           ${controlsVisible ? "landscape:flex" : "landscape:hidden"}`
        }
      >
        <Controls
          theme={theme}
          setTheme={setTheme}
          muted={muted}
          setMuted={setMuted}
          onReset={reset}
          onShowHelp={() => setShowHelp(true)}
        />
        {feedback && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-lg shadow-lg">
            {feedback}
          </div>
        )}
      </div>

      {/* How to Play modal */}
      {showHelp && <HowToPlayModal onClose={() => setShowHelp(false)} />}

      {/* Three towers, always centered */}
      <main className="w-full px-4 mt-8 flex flex-row items-end justify-center gap-x-8">
        {['A','B','C'].map((t) => (
          <Tower key={t} name={t} discs={towers[t]} onDrop={handleMove} />
        ))}
      </main>

      {/* Footer */}
      <footer className={
        `text-center mt-8 pb-8 text-gray-900 dark:text-gray-100
         sm:block
         ${controlsVisible ? "landscape:block" : "landscape:hidden"}`
      }>
        Moves: <strong>{moves}</strong>
      </footer>

      {/* Sounds */}
      <audio id="drop" src="/drop.wav" preload="auto" />
      <audio id="invalid" src="/invalid.wav" preload="auto" />
      <audio id="win" src="/win.wav" preload="auto" />
    </div>
  );
}
