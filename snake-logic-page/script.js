const boardPreview = document.getElementById("boardPreview");
const playerName = document.getElementById("playerName");
const diceValue = document.getElementById("diceValue");
const eventValue = document.getElementById("eventValue");
const positionValue = document.getElementById("positionValue");
const copyCodeButton = document.getElementById("copyCodeButton");
const javaSource = document.getElementById("javaSource");
const startZoneTokens = document.getElementById("startZoneTokens");
const diceIcon = document.getElementById("diceIcon");

const snakes = new Set([17, 47, 64, 80, 95, 99]);
const ladders = new Set([5, 25, 33, 40, 66]);

const snakeTargets = new Map([
  [17, 10],
  [47, 37],
  [64, 27],
  [80, 63],
  [95, 85],
  [99, 42]
]);

const ladderTargets = new Map([
  [5, 20],
  [25, 35],
  [33, 78],
  [40, 100],
  [66, 100]
]);

const players = [
  { id: "p1", position: 0, colorClass: "p1" },
  { id: "p2", position: 0, colorClass: "p2" },
  { id: "p3", position: 0, colorClass: "p3" },
  { id: "p4", position: 0, colorClass: "p4" }
];

const scriptedTurns = [
  { player: "p1", roll: 5, start: 0, next: 5, final: 20, event: "Ladder +15" },
  { player: "p2", roll: 6, start: 0, next: 6, final: 6, event: "Normal move" },
  { player: "p3", roll: 4, start: 0, next: 4, final: 4, event: "Normal move" },
  { player: "p4", roll: 5, start: 0, next: 5, final: 20, event: "Ladder +15" },
  { player: "p1", roll: 5, start: 20, next: 25, final: 35, event: "Ladder +10" },
  { player: "p2", roll: 6, start: 6, next: 12, final: 12, event: "Normal move" },
  { player: "p3", roll: 3, start: 4, next: 7, final: 7, event: "Normal move" },
  { player: "p4", roll: 4, start: 20, next: 24, final: 24, event: "Normal move" },
  { player: "p1", roll: 5, start: 35, next: 40, final: 100, event: "Ladder +60" },
  { player: "p2", roll: 5, start: 12, next: 17, final: 10, event: "Snake -7" },
  { player: "p3", roll: 6, start: 7, next: 13, final: 13, event: "Normal move" },
  { player: "p4", roll: 1, start: 24, next: 25, final: 35, event: "Ladder +10" }
];

function buildBoard() {
  const cells = [];

  for (let row = 9; row >= 0; row -= 1) {
    const leftToRight = row % 2 === 0;
    for (let col = 0; col < 10; col += 1) {
      const number = leftToRight ? row * 10 + col + 1 : row * 10 + (10 - col);
      const cell = document.createElement("div");
      let jumpMarkup = "";

      cell.className = "board-cell";
      if (snakes.has(number)) cell.classList.add("snake");
      if (ladders.has(number)) cell.classList.add("ladder");
      cell.dataset.position = String(number);

      if (ladderTargets.has(number)) {
        jumpMarkup = `<sup class="cell-jump">&uarr;${ladderTargets.get(number)}</sup>`;
      } else if (snakeTargets.has(number)) {
        jumpMarkup = `<sup class="cell-jump">&darr;${snakeTargets.get(number)}</sup>`;
      }

      cell.innerHTML = `<span class="cell-number">${number}${jumpMarkup}</span>`;
      boardPreview.appendChild(cell);
      cells.push(cell);
    }
  }

  players.forEach((player) => {
    const token = document.createElement("div");
    token.className = `token ${player.colorClass}`;
    token.id = player.id;
    boardPreview.appendChild(token);
  });

  return cells;
}

const cells = buildBoard();

function renderStartZone() {
  if (!startZoneTokens) return;

  startZoneTokens.innerHTML = "";
  players
    .filter((player) => player.position === 0)
    .forEach((player) => {
      const token = document.createElement("div");
      token.className = `start-token ${player.colorClass}`;
      token.title = player.id;
      startZoneTokens.appendChild(token);
    });
}

function getCellByPosition(position) {
  return cells.find((cell) => Number(cell.dataset.position) === position);
}

function updateDiceFace(value) {
  if (!diceIcon) return;
  diceIcon.dataset.roll = String(value);
}

function placeToken(player) {
  const token = document.getElementById(player.id);
  const playerIndex = players.findIndex((item) => item.id === player.id);
  const offsets = [
    { x: -13, y: -13 },
    { x: 13, y: -13 },
    { x: -13, y: 13 },
    { x: 13, y: 13 }
  ];
  const offset = offsets[playerIndex] || offsets[0];

  if (player.position === 0) {
    token.style.transform = "translate(-9999px, -9999px)";
    renderStartZone();
    return;
  }

  const cell = getCellByPosition(player.position);
  if (!cell) return;

  const cellRect = cell.getBoundingClientRect();
  const boardRect = boardPreview.getBoundingClientRect();
  const x = cellRect.left - boardRect.left + (cellRect.width / 2) - 9 + offset.x;
  const y = cellRect.top - boardRect.top + (cellRect.height / 2) - 9 + offset.y;

  token.style.transform = `translate(${x}px, ${y}px)`;
  renderStartZone();
}

function placeAllTokens() {
  players.forEach(placeToken);
  renderStartZone();
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function applyTurn(turn) {
  const current = players.find((player) => player.id === turn.player);
  if (!current) return;

  playerName.textContent = current.id;
  diceValue.textContent = String(turn.roll);
  updateDiceFace(turn.roll);
  eventValue.textContent = turn.next !== turn.final ? `Landed on ${turn.next}` : turn.event;
  positionValue.textContent = String(turn.next);

  current.position = turn.next;
  placeToken(current);

  if (turn.next !== turn.final) {
    await wait(700);
    current.position = turn.final;
    eventValue.textContent = turn.event;
    positionValue.textContent = String(turn.final);
    placeToken(current);
    await wait(850);
  } else {
    eventValue.textContent = turn.event;
    positionValue.textContent = String(turn.final);
    await wait(850);
  }
}

let turnIndex = 0;
let isAnimating = false;

function startLoop() {
  const runTurn = async () => {
    if (isAnimating) return;
    isAnimating = true;
    await applyTurn(scriptedTurns[turnIndex]);
    turnIndex = (turnIndex + 1) % scriptedTurns.length;
    isAnimating = false;
  };

  playerName.textContent = "p1";
  diceValue.textContent = "0";
  updateDiceFace(1);
  eventValue.textContent = "Waiting at start";
  positionValue.textContent = "0";

  window.setTimeout(() => {
    runTurn();
    setInterval(runTurn, 2100);
  }, 1600);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

if (copyCodeButton && javaSource) {
  copyCodeButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(javaSource.value);
      copyCodeButton.textContent = "Copied";
      window.setTimeout(() => {
        copyCodeButton.textContent = "Copy code";
      }, 1600);
    } catch (error) {
      copyCodeButton.textContent = "Copy failed";
      window.setTimeout(() => {
        copyCodeButton.textContent = "Copy code";
      }, 1600);
    }
  });
}

window.addEventListener("load", () => {
  placeAllTokens();
  startLoop();
});

window.addEventListener("resize", placeAllTokens);
