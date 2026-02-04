(function () {
  'use strict';

  // --- Constants ---
  const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  // --- State ---
  let board = [];
  let currentPlayer = 'X';
  let gameOver = false;
  let winningLine = null;

  // --- DOM refs (set in init) ---
  let statusEl;
  let gridEl;
  let restartBtn;

  function getWinner(brd) {
    for (var i = 0; i < WIN_LINES.length; i++) {
      var line = WIN_LINES[i];
      var a = brd[line[0]], b = brd[line[1]], c = brd[line[2]];
      if (a && a === b && a === c) {
        winningLine = line;
        return a;
      }
    }
    return null;
  }

  function isDraw(brd) {
    return brd.every(function (cell) { return cell !== null; });
  }

  function resetState() {
    board = [null, null, null, null, null, null, null, null, null];
    currentPlayer = 'X';
    gameOver = false;
    winningLine = null;
  }

  function updateStatus() {
    if (gameOver) {
      var winner = getWinner(board);
      statusEl.textContent = winner ? 'Player ' + winner + ' wins!' : 'Draw!';
      return;
    }
    statusEl.textContent = 'Player ' + currentPlayer + "'s turn";
  }

  function renderGrid() {
    gridEl.innerHTML = '';
    for (var i = 0; i < 9; i++) {
      var cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.dataset.index = i;
      cell.setAttribute('aria-label', 'Cell ' + (i + 1));
      if (board[i]) {
        cell.textContent = board[i];
        cell.classList.add('taken', board[i].toLowerCase());
        cell.disabled = true;
      }
      gridEl.appendChild(cell);
    }
  }

  function highlightWinningCells() {
    if (!winningLine) return;
    winningLine.forEach(function (index) {
      var cell = gridEl.querySelector('[data-index="' + index + '"]');
      if (cell) {
        cell.classList.add('win');
      }
    });
  }

  function handleCellClick(evt) {
    var cell = evt.target;
    if (cell.classList.contains('cell') && !cell.classList.contains('taken') && !gameOver) {
      var index = parseInt(cell.dataset.index, 10);
      board[index] = currentPlayer;
      cell.textContent = currentPlayer;
      cell.classList.add('taken', currentPlayer.toLowerCase());
      cell.disabled = true;

      var winner = getWinner(board);
      if (winner) {
        gameOver = true;
        highlightWinningCells();
      } else if (isDraw(board)) {
        gameOver = true;
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      }
      updateStatus();
    }
  }

  function handleRestart() {
    resetState();
    renderGrid();
    updateStatus();
  }

  function init() {
    statusEl = document.getElementById('status');
    gridEl = document.getElementById('grid');
    restartBtn = document.getElementById('restart');

    resetState();
    renderGrid();
    updateStatus();

    gridEl.addEventListener('click', handleCellClick);
    restartBtn.addEventListener('click', handleRestart);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
