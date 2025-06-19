import React, { useState } from 'react';

/**
 * TwinTic Main Container - Tic Tac Toe game for two players.
 * Features:
 *  - Renders 3x3 grid gameboard
 *  - Alternates player X/O moves
 *  - Displays current turn or winner
 *  - Uses provided color palette and light theme
 */

// Styling variables based on requirements
const COLORS = {
  primary: '#4CAF50',
  secondary: '#FFC107',
  accent: '#2196F3',
  background: '#f9f9f9', // light background
  border: '#e0e0e0', // light gray border
  x: '#4CAF50',
  o: '#2196F3',
};

const BOARD_SIZE = 3;

// PUBLIC_INTERFACE
function MainContainer() {
  /**
   * Game-state management: Squares, turn, winner.
   */
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || winner) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function renderSquare(idx) {
    return (
      <button
        key={idx}
        className="twin-tic-square"
        onClick={() => handleClick(idx)}
        style={{
          color: board[idx] === 'X' ? COLORS.x : (board[idx] === 'O' ? COLORS.o : COLORS.primary),
          background: COLORS.background,
          border: `2px solid ${COLORS.border}`,
        }}
        aria-label={`Square ${idx + 1} ${board[idx] ? board[idx] : ''}`}
      >
        {board[idx]}
      </button>
    );
  }

  // PUBLIC_INTERFACE
  function renderBoard() {
    let rows = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      let row = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        row.push(renderSquare(i * BOARD_SIZE + j));
      }
      rows.push(
        <div className="twin-tic-row" key={i} style={{ display: 'flex' }}>
          {row}
        </div>
      );
    }
    return rows;
  }

  let status;
  if (winner) {
    status = (
      <span style={{ color: COLORS.secondary }}>
        Winner: <strong>{winner}</strong>
      </span>
    );
  } else if (isDraw) {
    status = <span style={{ color: COLORS.secondary }}>Draw!</span>;
  } else {
    status = (
      <span>
        Next turn:{" "}
        <strong style={{ color: xIsNext ? COLORS.x : COLORS.o }}>
          {xIsNext ? 'X' : 'O'}
        </strong>
      </span>
    );
  }

  return (
    <div className="twin-tic-container" style={mainContainerStyle}>
      <h2 className="twin-tic-title" style={{ color: COLORS.primary, margin: '12px 0' }}>
        TwinTic: Tic Tac Toe
      </h2>
      <div className="twin-tic-status" style={{ fontSize: '1.2rem', marginBottom: 16 }}>
        {status}
      </div>
      <div
        className="twin-tic-board"
        style={{
          display: 'inline-block',
          background: COLORS.background,
          borderRadius: 12,
          boxShadow: '0 2px 12px 0 rgba(114, 191, 255, 0.15)',
          padding: 18,
        }}
      >
        {renderBoard()}
      </div>
    </div>
  );
}

// Helper styles
const mainContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: COLORS.background,
  padding: '32px 0',
  minHeight: '70vh',
};

//
// Helper to check winner
//
function calculateWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    // Cols
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    // Diags
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a]; // 'X' or 'O'
    }
  }
  return null;
}

export default MainContainer;
