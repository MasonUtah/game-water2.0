// Game configuration and state variables
const GOAL_CANS = 20;        // Total items needed to collect
const DIFFICULTY_SETTINGS = {
  easy: 1400,
  medium: 1000,
  hard: 700
};

let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;           // Holds the interval for spawning items
let timerInterval;          // Holds the interval for the countdown timer
let timeLeft = 30;           // Starting time for each round
let currentDifficulty = 'medium';

const scoreDisplay = document.getElementById('current-cans');
const timerDisplay = document.getElementById('timer');
const achievementDisplay = document.getElementById('achievements');
const difficultySelect = document.getElementById('difficulty');
const resetButton = document.getElementById('reset-game');

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.addEventListener('click', handleCellClick);
    grid.appendChild(cell);
  }
}

function updateScoreDisplay() {
  scoreDisplay.textContent = currentCans;
}

function updateTimerDisplay() {
  timerDisplay.textContent = timeLeft;
}

function setResetButtonState() {
  resetButton.disabled = !gameActive || timeLeft <= 0;
}

function clearGameIntervals() {
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
}

function clearGrid() {
  document.querySelectorAll('.grid-cell').forEach((cell) => {
    cell.innerHTML = '';
    cell.dataset.hasCan = 'false';
  });
}

function handleCellClick(event) {
  if (!gameActive) return;

  const cell = event.currentTarget;
  const hasCan = cell.querySelector('.water-can');

  if (hasCan) {
    currentCans += 1;
    updateScoreDisplay();
    cell.innerHTML = '';
    cell.dataset.hasCan = 'false';
  }
}

// Ensure the grid is created when the page loads
createGrid();
updateScoreDisplay();
updateTimerDisplay();
setResetButtonState();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  clearGrid();

  const cells = document.querySelectorAll('.grid-cell');
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can" aria-label="water can"></div>
    </div>
  `;
  randomCell.dataset.hasCan = 'true';
}

function startIntervals() {
  const spawnSpeed = DIFFICULTY_SETTINGS[currentDifficulty] || DIFFICULTY_SETTINGS.medium;
  spawnInterval = setInterval(spawnWaterCan, spawnSpeed);
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    updateTimerDisplay();
    setResetButtonState();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// Initializes and starts a new game
function startGame() {
  if (gameActive) return; // Prevent starting a new game if one is already active

  currentDifficulty = difficultySelect.value;
  gameActive = true;
  currentCans = 0;
  timeLeft = 30;
  achievementDisplay.textContent = '';
  updateScoreDisplay();
  updateTimerDisplay();
  setResetButtonState();

  clearGameIntervals();
  createGrid();
  spawnWaterCan();
  startIntervals();
}

function resetGame() {
  if (!gameActive || timeLeft <= 0) return;

  gameActive = false;
  currentCans = 0;
  timeLeft = 30;
  achievementDisplay.textContent = '';
  updateScoreDisplay();
  updateTimerDisplay();
  setResetButtonState();

  clearGameIntervals();
  clearGrid();
  createGrid();
}

function endGame() {
  gameActive = false;
  clearGameIntervals();
  clearGrid();
  setResetButtonState();

  if (currentCans >= GOAL_CANS) {
    achievementDisplay.textContent = 'You win! You collected enough water cans!';
  } else {
    achievementDisplay.textContent = 'Time is up! Try again and collect more water cans.';
  }
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('reset-game').addEventListener('click', resetGame);
