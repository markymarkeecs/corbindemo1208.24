import React, { useState, useEffect } from 'react';

function Minesweeper() {
  const BOARD_SIZE = 10;
  const MINE_COUNT = 10;

  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [flagged, setFlagged] = useState([]);

  // Initialize board
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Create empty board
    const newBoard = Array(BOARD_SIZE).fill().map(() => 
      Array(BOARD_SIZE).fill(0)
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      if (newBoard[row][col] !== -1) {
        newBoard[row][col] = -1;
        minesPlaced++;
      }
    }

    // Calculate numbers
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (newBoard[i][j] === -1) continue;
        let count = 0;
        // Check all 8 adjacent cells
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            const ni = i + di;
            const nj = j + dj;
            if (ni >= 0 && ni < BOARD_SIZE && nj >= 0 && nj < BOARD_SIZE) {
              if (newBoard[ni][nj] === -1) count++;
            }
          }
        }
        newBoard[i][j] = count;
      }
    }

    setBoard(newBoard);
    setRevealed(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(false)));
    setFlagged(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(false)));
    setGameOver(false);
    setGameWon(false);
  };

  const revealCell = (row, col) => {
    if (gameOver || gameWon || revealed[row][col] || flagged[row][col]) return;

    const newRevealed = [...revealed.map(row => [...row])];
    
    if (board[row][col] === -1) {
      // Hit a mine
      setGameOver(true);
      // Reveal all mines
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (board[i][j] === -1) newRevealed[i][j] = true;
        }
      }
    } else {
      // Reveal empty cells recursively
      const revealEmpty = (r, c) => {
        if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || 
            newRevealed[r][c] || flagged[r][c]) return;
        
        newRevealed[r][c] = true;
        
        if (board[r][c] === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              revealEmpty(r + dr, c + dc);
            }
          }
        }
      };
      
      revealEmpty(row, col);
    }

    setRevealed(newRevealed);
    checkWin(newRevealed);
  };

  const toggleFlag = (e, row, col) => {
    e.preventDefault();
    if (gameOver || gameWon || revealed[row][col]) return;

    const newFlagged = [...flagged.map(row => [...row])];
    newFlagged[row][col] = !newFlagged[row][col];
    setFlagged(newFlagged);
  };

  const checkWin = (newRevealed) => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] !== -1 && !newRevealed[i][j]) return;
      }
    }
    setGameWon(true);
  };

  const getCellContent = (row, col) => {
    if (!revealed[row][col]) {
      return flagged[row][col] ? '🚩' : '';
    }
    if (board[row][col] === -1) {
      return '💣';
    }
    return board[row][col] || '';
  };

  const getCellColor = (row, col) => {
    if (!revealed[row][col]) return '#ddd';
    if (board[row][col] === -1) return '#ff0000';
    return '#fff';
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Minesweeper</h2>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={initializeGame}>New Game</button>
      </div>
      <div style={{ 
        display: 'inline-block',
        border: '1px solid black',
        backgroundColor: '#f0f0f0'
      }}>
        {board.map((row, i) => (
          <div key={i} style={{ display: 'flex' }}>
            {row.map((_, j) => (
              <div
                key={`${i}-${j}`}
                onClick={() => revealCell(i, j)}
                onContextMenu={(e) => toggleFlag(e, i, j)}
                style={{
                  width: '30px',
                  height: '30px',
                  border: '1px solid #999',
                  backgroundColor: getCellColor(i, j),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                {getCellContent(i, j)}
              </div>
            ))}
          </div>
        ))}
      </div>
      {gameOver && <div style={{ marginTop: '20px' }}>Game Over! 💥</div>}
      {gameWon && <div style={{ marginTop: '20px' }}>Congratulations! You won! 🎉</div>}
    </div>
  );
}

export default Minesweeper;