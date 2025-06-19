import React, { useState, useEffect } from 'react';

/**
 * TwinTic Main Container - Tic Tac Toe game with Human vs AI mode.
 *
 * Features:
 *  - Renders 3x3 grid gameboard
 *  - Alternates player X/O moves
 *  - Allows Human to choose 'X' or 'O' at start
 *  - Lets user SELECT AI difficulty (Easy/Medium/Hard) before game starts
 *  - AI plays with different strength according to difficulty
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

// Difficulty options
const DIFFICULTY_LABELS = {
  easy: "Easy (Random)",
  medium: "Medium (Blocks/Opportunities)",
  hard: "Hard (Optimal/Minimax)",
};

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
  const [difficulty, setDifficulty] = useState("medium");

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
   * AI move logic, based on selected difficulty.
   * Will trigger whenever it is AI's turn.
   */
  useEffect(() => {
    if (aiIsNext) {
      // Give the UI a tiny delay for move to "feel" more natural
      const aiTimeout = setTimeout(() => {
        let move;
        if (difficulty === "easy") {
          move = chooseRandomMove(board);
        } else if (difficulty === "medium") {
          move = chooseMediumMove(board, aiSymbol, humanSymbol);
        } else {
          move = chooseHardMove(board, aiSymbol, humanSymbol);
        }
        if (move != null) {
          makeMove(move, aiSymbol);
        }
      }, 400); // 400ms "thinking" delay
      return () => clearTimeout(aiTimeout);
    }
    // (no need to depend on makeMove, it never changes)
  }, [aiIsNext, board, aiSymbol, difficulty, humanSymbol]);

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
      <span style={{
        color: '#ffc107'
      }}>Choose your side to start</span>
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
    // Choice of X/O and Difficulty (radio/select)
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", marginBottom: 18 }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontWeight: 500, marginRight: 6, color: "#364", fontSize: "1rem" }}>
            AI Difficulty:&nbsp;
          </span>
          <select
            value={difficulty}
            style={{
              padding: "6px 10px",
              fontSize: "1rem",
              borderRadius: 5,
              border: `1px solid ${COLORS.border}`,
              outline: "none",
              background: "#f4f8fa"
            }}
            onChange={e => setDifficulty(e.target.value)}
            aria-label="Select AI Difficulty"
            disabled={gameStarted}
          >
            {Object.entries(DIFFICULTY_LABELS).map(([val, label]) =>
              <option key={val} value={val}>{label}</option>
            )}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
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
      <h2 className="twin-tic-title" style={{
        color: '#4caf50',
        margin: '12px 0'
      }}>Tic Tac: Human vs AI</h2>
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

/* ----- AI Difficulty Strategies ----- */

// PUBLIC_INTERFACE
function chooseRandomMove(board) {
  // Easy: pick any available square randomly
  const emptyIndices = board
    .map((v, i) => (v == null ? i : null))
    .filter((v) => v !== null);
  if (emptyIndices.length === 0) return null;
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

// PUBLIC_INTERFACE
function chooseMediumMove(board, aiSymbol, humanSymbol) {
  // Medium: Win if possible, block if needed, else random.
  // Check if AI can win in one move
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const testBoard = board.slice();
      testBoard[i] = aiSymbol;
      if (calculateWinner(testBoard) === aiSymbol) return i;
    }
  }
  // Check if human can win in one move (block)
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const testBoard = board.slice();
      testBoard[i] = humanSymbol;
      if (calculateWinner(testBoard) === humanSymbol) return i;
    }
  }
  // Otherwise, pick random
  return chooseRandomMove(board);
}

// PUBLIC_INTERFACE
function chooseHardMove(board, aiSymbol, humanSymbol) {
  // Hard: Minimax (AI is maximizing)
  const maximizer = aiSymbol;
  const minimizer = humanSymbol;
  let bestScore = -Infinity;
  let bestMove = null;
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const newBoard = [...board];
      newBoard[i] = maximizer;
      const score = minimax(newBoard, 0, false, maximizer, minimizer);
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

/**
 * Minimax implementation (no alpha-beta for 3x3).
 */
function minimax(board, depth, isMaximizing, maximizer, minimizer) {
  const winner = calculateWinner(board);
  if (winner === maximizer) return 10 - depth;
  if (winner === minimizer) return depth - 10;
  if (board.every(Boolean)) return 0;
  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = maximizer;
        best = Math.max(best, minimax(board, depth + 1, false, maximizer, minimizer));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = minimizer;
        best = Math.min(best, minimax(board, depth + 1, true, maximizer, minimizer));
        board[i] = null;
      }
    }
    return best;
  }
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
