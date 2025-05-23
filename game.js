const towers = {
  A: document.getElementById("A"),
  B: document.getElementById("B"),
  C: document.getElementById("C"),
};
const moveDisplay = document.getElementById("moveCount");
const statusDisplay = document.getElementById("status");
let isMuted = false, moveCount = 0, selectedDisc = null;

function init() {
  // clear & create discs
  Object.values(towers).forEach(t => t.innerHTML = "");
  for (let i = 5; i >= 1; i--) {
    const disc = document.createElement("div");
    disc.className = "disc";
    disc.dataset.size = i;
    disc.id = `disc-${i}`;
    // existing drag handlers
    disc.draggable = true;
    disc.addEventListener("dragstart", dragStart);

    // tap handler
    disc.addEventListener("click", () => pickUp(disc));

    towers.A.appendChild(disc);
  }
  moveCount = 0;
  moveDisplay.textContent = moveCount;
  statusDisplay.textContent = "";
  // tower click handlers
  Object.values(towers).forEach(t => t.addEventListener("click", towerTap));
}

function pickUp(disc) {
  // only top disc
  if (disc !== getTopDisc(disc.parentElement)) return;
  // deselect previous if any
  if (selectedDisc) selectedDisc.classList.remove("selected");
  selectedDisc = disc;
  disc.classList.add("selected");
}

function towerTap(e) {
  if (!selectedDisc) return;
  const target = e.currentTarget;
  const size = +selectedDisc.dataset.size;
  const top = getTopDisc(target);
  const topSize = top ? +top.dataset.size : Infinity;

  if (size < topSize) {
    target.appendChild(selectedDisc);
    moveCount++;
    moveDisplay.textContent = moveCount;
    if (!isMuted) document.getElementById("dropSound").play();
    checkWin();
  } else if (!isMuted) {
    document.getElementById("invalidSound").play();
  }
  selectedDisc.classList.remove("selected");
  selectedDisc = null;
}

function getTopDisc(tower) {
  const all = tower.querySelectorAll(".disc");
  return all[all.length - 1] || null;
}

function checkWin() {
  if (towers.C.childElementCount === 5) {
    statusDisplay.textContent = `You won in ${moveCount} moves! (Optimal = 31)`;
    if (!isMuted) document.getElementById("winSound").play();
  }
}

// optional: desktop native drag/drop
function dragStart(e) {
  const disc = e.target;
  if (disc !== getTopDisc(disc.parentElement)) {
    e.preventDefault();
    return;
  }
  e.dataTransfer.setData("text/plain", disc.id);
}

document.querySelectorAll(".tower").forEach(t => {
  t.addEventListener("dragover", e => e.preventDefault());
  t.addEventListener("drop", e => {
    const id = e.dataTransfer.getData("text/plain");
    const disc = document.getElementById(id);
    const top = getTopDisc(e.currentTarget);
    const size = +disc.dataset.size;
    const topSize = top ? +top.dataset.size : Infinity;
    if (size < topSize) {
      e.currentTarget.appendChild(disc);
      moveCount++;
      moveDisplay.textContent = moveCount;
      if (!isMuted) document.getElementById("dropSound").play();
      checkWin();
    } else if (!isMuted) {
      document.getElementById("invalidSound").play();
    }
  });
});

// controls
const themeToggleBtn = document.getElementById("themeToggle");
const muteToggleBtn = document.getElementById("muteToggle");
const resetBtn = document.getElementById("resetButton");
const howToPlayBtn = document.getElementById("howToPlayButton");
const closeModalBtn = document.getElementById("closeModal");

resetBtn.onclick = init;

// theme toggle with label update & persistence
themeToggleBtn.onclick = () => {
  const isNowDark = document.body.classList.toggle("dark");
  document.body.classList.toggle("light", !isNowDark);
  themeToggleBtn.textContent = isNowDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isNowDark ? "dark" : "light");
};

muteToggleBtn.onclick = () => {
  isMuted = !isMuted;
  muteToggleBtn.textContent = isMuted ? "🔇 Muted" : "🔊 Sound On";
};

howToPlayBtn.onclick = () => document.getElementById("howToPlayModal").style.display = "flex";
closeModalBtn.onclick = () => document.getElementById("howToPlayModal").style.display = "none";

window.addEventListener("load", () => {
  // restore theme
  const saved = localStorage.getItem("theme") || "dark";
  document.body.classList.add(saved);
  themeToggleBtn.textContent = saved === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  init();
  // don't auto-open modal
});
