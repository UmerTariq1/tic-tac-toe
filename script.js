const __WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let __board = [];
let __currentPlayer = "X";
let __gameOver = false;

const __statusEl = document.querySelector(".status");
const __boardEl = document.querySelector(".board");
const __restartBtn = document.querySelector(".restart");

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

function __render() {
  const __cells = __boardEl.querySelectorAll(".cell");
  const __winLine = __getWinLine();
  __cells.forEach((__cell, __i) => {
    __cell.textContent = __board[__i] || "";
    __cell.disabled = __board[__i] !== "" || __gameOver;
    __cell.classList.toggle("win", __winLine && __winLine.includes(__i));
  });
}

function __reset() {
  __board = ["", "", "", "", "", "", "", "", ""];
  __currentPlayer = "X";
  __gameOver = false;
  __updateStatus("X's turn");
  __render();
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
    __updateStatus(__winner + " wins!");
  } else if (__draw) {
    __gameOver = true;
    __updateStatus("Draw!");
  } else {
    __currentPlayer = __currentPlayer === "X" ? "O" : "X";
    __updateStatus(__currentPlayer + "'s turn");
  }
  __render();
});

__restartBtn.addEventListener("click", __reset);

__reset();
