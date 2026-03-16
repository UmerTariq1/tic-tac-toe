const __WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const __TURN_SECONDS = 15;

let __board = [];
let __currentPlayer = "X";
let __gameOver = false;
let __timerId = null;
let __secondsLeft = __TURN_SECONDS;

const __statusEl = document.querySelector(".status");
const __boardEl = document.querySelector(".board");
const __restartBtn = document.querySelector(".restart");
const __timerBarEl = document.getElementById("timer-bar");
const __timerTextEl = document.getElementById("timer-text");
const __timerWrapEl = document.querySelector(".timer-wrap");

function __getCell(__index) {
  return __board[__index];
}

function __checkWin() {
  for (const __line of __WIN_LINES) {
    const __a = __getCell(__line[0]);
    const __b = __getCell(__line[1]);
    const __c = __getCell(__line[2]);
    if (__a && __a === __b && __b === __c) return __a;
  }
  return null;
}

function __checkDraw() {
  return __board.every((__cell) => __cell !== "") && !__checkWin();
}

function __updateStatus(__text) {
  __statusEl.textContent = __text;
}

function __getWinLine() {
  for (const __line of __WIN_LINES) {
    const __a = __getCell(__line[0]);
    const __b = __getCell(__line[1]);
    const __c = __getCell(__line[2]);
    if (__a && __a === __b && __b === __c) return __line;
  }
  return null;
}

function __stopTimer() {
  if (__timerId) {
    clearInterval(__timerId);
    __timerId = null;
  }
  __secondsLeft = __TURN_SECONDS;
  if (__timerBarEl) __timerBarEl.style.width = "100%";
  if (__timerTextEl) __timerTextEl.textContent = __TURN_SECONDS;
}

function __startTimer() {
  __stopTimer();
  __secondsLeft = __TURN_SECONDS;
  if (__timerWrapEl) {
    __timerWrapEl.classList.remove("turn-x", "turn-o");
    __timerWrapEl.classList.add(__currentPlayer === "X" ? "turn-x" : "turn-o");
  }
  function __tick() {
    __secondsLeft--;
    if (__timerBarEl) __timerBarEl.style.width = (__secondsLeft / __TURN_SECONDS) * 100 + "%";
    if (__timerTextEl) __timerTextEl.textContent = __secondsLeft;
    if (__secondsLeft <= 0) {
      __stopTimer();
      const __loser = __currentPlayer;
      const __winner = __loser === "X" ? "O" : "X";
      __gameOver = true;
      __updateStatus(__winner + " wins! (" + __loser + " ran out of time)");
      __render();
      __confetti();
    }
  }
  __tick();
  __timerId = setInterval(__tick, 1000);
}

function __confetti() {
  const __colors = ["#e84393", "#0984e3", "#00b894", "#fdcb6e", "#e17055", "#6c5ce7", "#fd79a8", "#74b9ff"];
  const __container = document.createElement("div");
  __container.id = "confetti-container";
  document.body.appendChild(__container);
  for (let __i = 0; __i < 80; __i++) {
    const __p = document.createElement("div");
    __p.className = "confetti";
    __p.style.left = Math.random() * 100 + "vw";
    __p.style.background = __colors[Math.floor(Math.random() * __colors.length)];
    __p.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
    __p.style.animationDelay = Math.random() * 0.5 + "s";
    __p.style.animationDuration = (2 + Math.random() * 1.5) + "s";
    __container.appendChild(__p);
  }
  setTimeout(() => __container.remove(), 4000);
}

function __render() {
  const __cells = __boardEl.querySelectorAll(".cell");
  const __winLine = __getWinLine();
  __cells.forEach((__cell, __i) => {
    const __val = __board[__i];
    __cell.textContent = __val || "";
    __cell.classList.remove("x", "o");
    if (__val) __cell.classList.add(__val.toLowerCase());
    __cell.disabled = __val !== "" || __gameOver;
    __cell.classList.toggle("win", __winLine && __winLine.includes(__i));
  });
}

function __reset() {
  __stopTimer();
  __board = ["", "", "", "", "", "", "", "", ""];
  __currentPlayer = "X";
  __gameOver = false;
  __updateStatus("X's turn");
  __render();
  __startTimer();
}

__boardEl.addEventListener("click", (__e) => {
  const __cell = __e.target.closest(".cell");
  if (!__cell || __gameOver) return;
  const __index = parseInt(__cell.dataset.index, 10);
  if (__getCell(__index) !== "") return;

  __board[__index] = __currentPlayer;
  const __winner = __checkWin();
  const __draw = __checkDraw();

  if (__winner) {
    __gameOver = true;
    __stopTimer();
    __updateStatus(__winner + " wins!");
    __render();
    __confetti();
  } else if (__draw) {
    __gameOver = true;
    __stopTimer();
    __updateStatus("Draw!");
    __render();
  } else {
    __currentPlayer = __currentPlayer === "X" ? "O" : "X";
    __updateStatus(__currentPlayer + "'s turn");
    __render();
    __startTimer();
  }
});

__restartBtn.addEventListener("click", __reset);

__reset();
