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

  // Option 2: scroll to hide mobile chrome
  useEffect(() => {
    const hideAddressBar = () => window.scrollTo(0, 1);
    setTimeout(hideAddressBar, 200);
    window.addEventListener("orientationchange", hideAddressBar);
    return () => window.removeEventListener("orientationchange", hideAddressBar);
  }, []);

  // load / save theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // cross-browser fullscreen
  function goFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  }

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
    <div className="
      relative bg-gray-100 dark:bg-gray-900 
      h-screen overflow-hidden 
      text-gray-900 dark:text-gray-100
      transition-colors
    ">
      {/* rotate hint in small-portrait */}
      <div className="
        absolute inset-0 z-50 
        flex sm:hidden landscape:hidden 
        items-center justify-center 
        bg-black bg-opacity-75 
        text-white text-center p-4
      ">
        Please rotate your device to landscape to play.
      </div>

      {/* desktop (sm:) or landscape */}
      <div className="hidden sm:flex landscape:flex flex-col h-screen">
        {/* controls + fullscreen */}
        <div className="flex justify-center items-center gap-4 p-4 w-full max-w-4xl mx-auto">
          <Controls
            theme={theme}
            setTheme={setTheme}
            muted={muted}
            setMuted={setMuted}
            onReset={reset}
            onShowHelp={() => setShowHelp(true)}
          />
          <button
            onClick={goFullscreen}
            className="ml-2 p-2 bg-gray-600 dark:bg-gray-700 text-white rounded hover:bg-gray-500"
            aria-label="Enter Fullscreen"
          >
            ⛶
          </button>
        </div>

        {/* towers + moves */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <main className="flex gap-x-8">
            {["A", "B", "C"].map((t) => (
              <Tower
                key={t}
                name={t}
                discs={towers[t]}
                onDrop={handleMove}
                isSelected={false}
              />
            ))}
          </main>
          <div className="mt-4 text-lg text-gray-900 dark:text-white">
            Moves: <strong>{moves}</strong>
          </div>
        </div>
      </div>

      {showHelp && <HowToPlayModal onClose={() => setShowHelp(false)} />}

      {/* sounds */}
      <audio id="drop" src="drop.wav" preload="auto" />
      <audio id="invalid" src="invalid.wav" preload="auto" />
      <audio id="win" src="win.wav" preload="auto" />
    </div>
  );
}