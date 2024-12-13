import React from 'react';
import DinoGame from './DinoGame';
import Minesweeper from './Minesweeper';
import Solitaire from './Solitaire';
import Poker from './Poker';

function GameSelector() {
  const [selectedGame, setSelectedGame] = React.useState(null);

  const renderGame = () => {
    switch (selectedGame) {
      case 'dino':
        return <DinoGame />;
      case 'minesweeper':
        return <Minesweeper />;
      case 'solitaire':
        return <Solitaire />;
      case 'poker':
        return <Poker />;
      default:
        return (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Select a Game</h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button 
                onClick={() => setSelectedGame('dino')}
                style={{ padding: '10px 20px', fontSize: '18px' }}
              >
                Dino Game
              </button>
              <button 
                onClick={() => setSelectedGame('minesweeper')}
                style={{ padding: '10px 20px', fontSize: '18px' }}
              >
                Minesweeper
              </button>
              <button 
                onClick={() => setSelectedGame('solitaire')}
                style={{ padding: '10px 20px', fontSize: '18px' }}
              >
                Solitaire
              </button>
              <button 
                onClick={() => setSelectedGame('poker')}
                style={{ padding: '10px 20px', fontSize: '18px' }}
              >
                Poker
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      {selectedGame && (
        <button 
          onClick={() => setSelectedGame(null)}
          style={{ margin: '10px', padding: '5px 10px' }}
        >
          Back to Game Selection
        </button>
      )}
      {renderGame()}
    </div>
  );
}

export default GameSelector; 