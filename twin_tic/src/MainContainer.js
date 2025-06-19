import React, { useState, useEffect } from 'react';

/**
 * TwinTic Main Container - Tic Tac Toe game with Human vs AI mode.
 *
 * Features:
 *  - Renders 3x3 grid gameboard
 *  - Alternates player X/O moves
 *  - Allows Human to choose 'X' or 'O' at start
 *  - AI plays automatically for the other symbol, picking a random free square
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
   * Game-state management: board, turn, winner, player choice, mode.
   */
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [aiSymbol, setAiSymbol] = useState(null); // 'X' or 'O'
  const [humanSymbol, setHumanSymbol] = useState(null); // 'X' or 'O'
  const [gameStarted, setGameStarted] = useState(false);

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);
  const humanIsNext = (gameStarted && (xIsNext ? 'X' : 'O') === humanSymbol && !winner && !isDraw);
  const aiIsNext = (gameStarted && (xIsNext ? 'X' : 'O') === aiSymbol && !winner && !isDraw);

  /**
   * Handler for the human selecting X or O to start the game.
   * @param {'X'|'O'} symbol
   */
  // PUBLIC_INTERFACE
  function handlePlayerChoice(symbol) {
    setHumanSymbol(symbol);
    setAiSymbol(symbol === 'X' ? 'O' : 'X');
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setXIsNext(true); // X always starts
    setGameStarted(true);
  }

  /**
   * Handles click for a square, only on human turn.
   * @param {number} idx
   */
  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (!gameStarted) return;
    if (!humanIsNext) return;
    if (board[idx] || winner) return;
    makeMove(idx, humanSymbol);
  }

  /**
   * Makes a move for a player at a given board index.
   */
  function makeMove(idx, symbol) {
    const nextBoard = board.slice();
    nextBoard[idx] = symbol;
    setBoard(nextBoard);
    setXIsNext(symbol === 'X' ? false : true);
  }

  /**
   * AI logic: Pick random valid move, and make the move as AI.
   * Will trigger whenever it is AI's turn, after human or at game start.
   */
  useEffect(() => {
    if (aiIsNext) {
      // Give the UI a tiny delay for move to "feel" more natural
      const aiTimeout = setTimeout(() => {
        const emptyIndices = board
          .map((v, i) => (v == null ? i : null))
          .filter((v) => v !== null);
        if (emptyIndices.length === 0) return;
        const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        makeMove(move, aiSymbol);
      }, 400); // 400ms "thinking" delay
      return () => clearTimeout(aiTimeout);
    }
    // eslint-disable-next-line
    // (no need to depend on makeMove, it never changes)
    // Only depend on aiIsNext, board, aiSymbol
    // Ok to ignore strict exhaustive deps for this simple case
  }, [aiIsNext, board, aiSymbol]);

  // PUBLIC_INTERFACE
  function renderSquare(idx) {
    return (
      <button
        key={idx}
        className="twin-tic-square"
        onClick={() => handleClick(idx)}
        style={{
          color: board[idx] === 'X'
            ? COLORS.x
            : board[idx] === 'O'
            ? COLORS.o
            : COLORS.primary,
          background: COLORS.background,
          border: `2px solid ${COLORS.border}`,
          cursor: board[idx] || !humanIsNext ? 'default' : 'pointer',
          opacity: board[idx] || (!humanIsNext && board[idx] == null) ? 0.8 : 1,
        }}
        aria-label={`Square ${idx + 1} ${board[idx] ? board[idx] : ''}`}
        disabled={Boolean(board[idx]) || !humanIsNext}
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
  if (!gameStarted) {
    status = (
      <span style={{ color: COLORS.secondary }}>
        Choose your side to start:
      </span>
    );
  } else if (winner) {
    status = (
      <span style={{ color: COLORS.secondary }}>
        Winner: <strong>{winner === humanSymbol ? "You" : "AI"} ({winner})</strong>
      </span>
    );
  } else if (isDraw) {
    status = (
      <span style={{ color: COLORS.secondary }}>
        Draw!
      </span>
    );
  } else {
    status = (
      <span>
        Next turn:{" "}
        <strong style={{ color: xIsNext ? COLORS.x : COLORS.o }}>
          {(xIsNext ? 'X' : 'O') === humanSymbol ? "You" : "AI"} ({xIsNext ? 'X' : 'O'})
        </strong>
      </span>
    );
  }

  function renderChoiceButtons() {
    return (
      <div style={{ display: 'flex', gap: 20, marginBottom: 18 }}>
        <button
          className="btn btn-large"
          style={{ background: COLORS.x, color: '#fff', borderRadius: 6, minWidth: 80 }}
          onClick={() => handlePlayerChoice('X')}
        >
          Play as X
        </button>
        <button
          className="btn btn-large"
          style={{ background: COLORS.o, color: '#fff', borderRadius: 6, minWidth: 80 }}
          onClick={() => handlePlayerChoice('O')}
        >
          Play as O
        </button>
      </div>
    );
  }

  function handleRestart() {
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setXIsNext(true);
    setGameStarted(false);
    setAiSymbol(null);
    setHumanSymbol(null);
  }

  return (
    <div className="twin-tic-container" style={mainContainerStyle}>
      <h2 className="twin-tic-title" style={{ color: COLORS.primary, margin: '12px 0' }}>
        TwinTic: Human vs AI
      </h2>
      <div className="twin-tic-status" style={{ fontSize: '1.2rem', marginBottom: 16 }}>
        {status}
      </div>
      {!gameStarted && renderChoiceButtons()}
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
      <div style={{ marginTop: 22, textAlign: 'center' }}>
        {(winner || isDraw || !gameStarted) && (
          <button
            className="btn"
            style={{
              background: COLORS.accent,
              color: '#fff',
              borderRadius: 6,
              marginTop: 14,
              padding: '8px 28px',
              letterSpacing: 1,
            }}
            onClick={handleRestart}
          >
            {gameStarted ? "Restart" : "Start New Game"}
          </button>
        )}
      </div>
      {gameStarted &&
        <div style={{
          marginTop: 12,
          fontSize: '0.97rem',
          color: '#333',
          opacity: 0.7,
          textAlign: 'center',
          letterSpacing: 0.1,
        }}>
          You: <b>{humanSymbol}</b> &nbsp;|&nbsp; AI: <b>{aiSymbol}</b>
        </div>
      }
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
