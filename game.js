// game.js

const towers = {
  A: document.getElementById("A"),
  B: document.getElementById("B"),
  C: document.getElementById("C"),
};
const moveDisplay = document.getElementById("moveCount");
const statusDisplay = document.getElementById("status");
let isMuted = false;
let moveCount = 0;

// for touch dragging
let draggingDisc = null;
let originalTower = null;

function init() {
  // clear existing discs
  Object.values(towers).forEach(t => t.innerHTML = "");
  // create discs
  for (let i = 5; i >= 1; i--) {
    const disc = document.createElement("div");
    disc.className = "disc";
    disc.dataset.size = i;
    disc.id = `disc-${i}`;
    disc.draggable = true;
    disc.addEventListener("dragstart", drag);

    // touch support
    disc.addEventListener("touchstart", touchStart, { passive: false });
    disc.addEventListener("touchmove",  touchMove,  { passive: false });
    disc.addEventListener("touchend",   touchEnd);

    towers.A.appendChild(disc);
  }
  moveCount = 0;
  moveDisplay.textContent = moveCount;
  statusDisplay.textContent = "";
}

function drag(e) {
  const disc = e.target;
  const top = getTopDisc(disc.parentElement);
  if (disc !== top) {
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
  const id = e.dataTransfer.getData("text/plain");
  const disc = document.getElementById(id);
  const top = getTopDisc(targetTower);
  const size = +disc.dataset.size;
  const topSize = top ? +top.dataset.size : Infinity;

  if (size < topSize) {
    targetTower.appendChild(disc);
    moveCount++;
    moveDisplay.textContent = moveCount;
    if (!isMuted) document.getElementById("dropSound").play();
    checkWin();
  } else {
    if (!isMuted) document.getElementById("invalidSound").play();
  }
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

// —————— TOUCH HANDLERS ——————

function touchStart(e) {
  e.preventDefault();
  const disc = e.target;
  const top = getTopDisc(disc.parentElement);
  if (disc !== top) return;
  draggingDisc = disc;
  originalTower = disc.parentElement;
  // lift it up
  disc.style.position = "absolute";
  disc.style.zIndex = "1000";
}

function touchMove(e) {
  if (!draggingDisc) return;
  e.preventDefault();
  const touch = e.touches[0];
  draggingDisc.style.left = `${touch.clientX - draggingDisc.offsetWidth / 2}px`;
  draggingDisc.style.top  = `${touch.clientY - draggingDisc.offsetHeight / 2}px`;
}

function touchEnd(e) {
  if (!draggingDisc) return;
  const touch = e.changedTouches[0];
  const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY)
                         ?.closest(".tower");
  if (dropTarget) {
    // reuse drop validation logic
    const top = getTopDisc(dropTarget);
    const size = +draggingDisc.dataset.size;
    const topSize = top ? +top.dataset.size : Infinity;
    if (size < topSize) {
      dropTarget.appendChild(draggingDisc);
      moveCount++;
      moveDisplay.textContent = moveCount;
      if (!isMuted) document.getElementById("dropSound").play();
      checkWin();
    } else {
      if (!isMuted) document.getElementById("invalidSound").play();
      originalTower.appendChild(draggingDisc);
    }
  } else {
    // not dropped over a tower → revert
    originalTower.appendChild(draggingDisc);
  }
  // reset styles
  draggingDisc.style.position = "";
  draggingDisc.style.zIndex   = "";
  draggingDisc.style.left     = "";
  draggingDisc.style.top      = "";
  draggingDisc = null;
}

// —————— CONTROLS & HOOKUPS ——————

document.getElementById("resetButton").addEventListener("click", init);

for (const t of Object.values(towers)) {
  t.addEventListener("dragover", allowDrop);
  t.addEventListener("drop",     drop);
}

document.getElementById("themeToggle").addEventListener("click", () => {
  const body = document.body;
  body.classList.toggle("light");
  body.classList.toggle("dark");
});

document.getElementById("muteToggle").addEventListener("click", () => {
  isMuted = !isMuted;
  document.getElementById("muteToggle").textContent = isMuted
    ? "🔇 Muted"
    : "🔊 Sound On";
});

const howToPlayBtn = document.getElementById("howToPlayButton");
const modal        = document.getElementById("howToPlayModal");
const closeModal   = document.getElementById("closeModal");
howToPlayBtn.addEventListener("click",  () => modal.style.display = "flex");
closeModal .addEventListener("click",   () => modal.style.display = "none");

window.addEventListener("load", () => {
  init();
  modal.style.display = "flex";
});