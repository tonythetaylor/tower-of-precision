const towers = {
  A: document.getElementById("A"),
  B: document.getElementById("B"),
  C: document.getElementById("C"),
};

const moveDisplay = document.getElementById("moveCount");
const statusDisplay = document.getElementById("status");
const themeToggleBtn = document.getElementById("themeToggle");
const dropSound = document.getElementById("dropSound");
const invalidSound = document.getElementById("invalidSound");
const winSound = document.getElementById("winSound");
const muteToggleBtn = document.getElementById("muteToggle");
const modal = document.getElementById("howToPlayModal");
const closeModalBtn = document.getElementById("closeModal");
const howToPlayBtn = document.getElementById("howToPlayButton");

let isMuted = false;
let moveCount = 0;

muteToggleBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  muteToggleBtn.textContent = isMuted ? "🔇 Sound Off" : "🔊 Sound On";
});

howToPlayBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });
  
// Initialize game
function init() {
  for (let i = 5; i >= 1; i--) {
    const disc = document.createElement("div");
    disc.classList.add("disc");
    disc.setAttribute("draggable", true);
    disc.dataset.size = i;
    disc.id = `disc-${i}`;
    disc.addEventListener("dragstart", drag);
    towers.A.appendChild(disc);
  }
}

// Show modal on first load
window.addEventListener("load", () => {
    modal.style.display = "flex";
  });
  
  // Close modal on button click
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

function drag(e) {
  const disc = e.target;
  const tower = disc.parentElement;
  const topDisc = getTopDisc(tower);

  // Allow dragging only the top disc
  if (disc !== topDisc) {
    e.preventDefault();
    return;
  }

  e.dataTransfer.setData("text/plain", disc.id);
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const targetTower = e.currentTarget;
  const draggedId = e.dataTransfer.getData("text/plain");
  const draggedDisc = document.getElementById(draggedId);
  const sourceTower = draggedDisc.parentElement;

  const topDisc = getTopDisc(targetTower);
  const draggedSize = parseInt(draggedDisc.dataset.size);
  const topSize = topDisc ? parseInt(topDisc.dataset.size) : Infinity;

  // Valid move check
  if (draggedSize < topSize) {
    targetTower.appendChild(draggedDisc);
    moveCount++;
    moveDisplay.textContent = moveCount;

    // Play drop sound
    const dropSound = document.getElementById("dropSound");
    const invalidSound = document.getElementById("invalidSound");

    if (!isMuted) {
      dropSound.currentTime = 0; // rewind if played before
      dropSound.play();
    }

    checkWin();
  } else {
    if (!isMuted) {
      invalidSound.currentTime = 0;
      invalidSound.play();
    }
    const feedback = document.getElementById("feedback");
    feedback.textContent = "❌ Invalid move!";
    feedback.style.opacity = "1";
    setTimeout(() => {
      feedback.style.opacity = "0";
    }, 2000);
  }
}

function getTopDisc(tower) {
  const discs = tower.querySelectorAll(".disc");
  return discs[discs.length - 1] || null;
}

function checkWin() {
  if (towers.C.childElementCount === 5) {
    statusDisplay.textContent = `You won in ${moveCount} moves!`;
    if (!isMuted) {
      winSound.currentTime = 0;
      winSound.play();
    }
  }
}

document.getElementById("resetButton").addEventListener("click", () => {
  // Clear all towers
  Object.values(towers).forEach((tower) => {
    tower.innerHTML = "";
  });

  // Reset move count and status
  moveCount = 0;
  moveDisplay.textContent = moveCount;
  statusDisplay.textContent = "";

  // Re-initialize the game
  init();
});

function setTheme(mode) {
  document.body.classList.remove("light", "dark");
  document.body.classList.add(mode);
  themeToggleBtn.textContent =
    mode === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", mode);
}

// Toggle on click
themeToggleBtn.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  setTheme(newTheme);
});

// Load saved preference
const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);

init();
