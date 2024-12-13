import React, { useState, useEffect, useCallback } from 'react';
import { SolitaireGame } from '../games/Solitaire';
import Card from './Card';
import '../styles/Pile.css';

function Solitaire() {
  const [gameState, setGameState] = useState(null);
  const [game] = useState(new SolitaireGame());

  const handleNewGame = useCallback(() => {
    const newState = game.initializeGame();
    setGameState(newState);
  }, [game]);

  useEffect(() => {
    handleNewGame();
  }, [handleNewGame]);

  const handleDrawCard = () => {
    if (!gameState) return;
    const newState = game.drawCard();
    setGameState(newState);
  };

  const handleDragStart = (e, sourceType, pileIndex, cardIndex) => {
    if (!gameState) return;
    e.dataTransfer.setData('text/plain', JSON.stringify({
      sourceType,
      pileIndex,
      cardIndex
    }));
  };

  const handleDrop = (e, targetType, targetIndex) => {
    e.preventDefault();
    if (!gameState) return;

    const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { sourceType, pileIndex: sourcePileIndex, cardIndex: sourceCardIndex } = dragData;

    const newState = game.moveCard(
      sourceType,
      sourcePileIndex,
      sourceCardIndex,
      targetType,
      targetIndex
    );

    if (newState) {
      setGameState(newState);
    }
  };

  const handleDoubleClick = (sourceType, sourcePileIndex, cardIndex) => {
    if (!gameState) return;
    const newState = game.autoMoveToFoundation(sourceType, sourcePileIndex, cardIndex);
    if (newState) {
      setGameState(newState);
    }
  };

  const renderStockPile = () => {
    return (
      <div 
        className="pile stock"
        onClick={handleDrawCard}
        style={{ 
          width: '60px',
          height: '84px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {gameState?.stockPile.length > 0 ? (
          <div className="card back">🂠</div>
        ) : (
          <div className="card empty">♢</div>
        )}
      </div>
    );
  };

  const renderWastePile = () => {
    const topCard = gameState?.wastePile[gameState.wastePile.length - 1];
    return (
      <div 
        className="pile waste"
        style={{ 
          width: '60px',
          height: '84px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {topCard && (
          <Card 
            card={topCard}
            pileType="waste"
            pileIndex={0}
            cardIndex={gameState.wastePile.length - 1}
            onDragStart={handleDragStart}
            onDoubleClick={handleDoubleClick}
          />
        )}
      </div>
    );
  };

  const renderTableauPile = (pile, pileIndex) => {
    return (
      <div 
        key={pileIndex}
        className={`pile tableau ${gameState.selectedCard ? 'droppable' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, 'tableau', pileIndex)}
        style={{ 
          width: '60px',
          minHeight: '84px',
          height: pile.length ? `${pile.length * 25 + 84}px` : '84px',
          position: 'relative'
        }}
      >
        {pile.map((card, cardIndex) => (
          <div 
            key={cardIndex} 
            style={{
              position: 'absolute',
              top: `${cardIndex * 25}px`,
              width: '100%'
            }}
          >
            <Card 
              card={card}
              pileType="tableau"
              pileIndex={pileIndex}
              cardIndex={cardIndex}
              onDragStart={handleDragStart}
              onDoubleClick={handleDoubleClick}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderFoundationPile = (pile, index) => {
    return (
      <div 
        key={index}
        className={`pile foundation ${gameState.selectedCard ? 'droppable' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, 'foundation', index)}
        style={{ 
          width: '60px',
          height: '84px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {pile.length > 0 ? (
          <Card 
            card={pile[pile.length - 1]}
            pileType="foundation"
            pileIndex={index}
            cardIndex={pile.length - 1}
            onDragStart={handleDragStart}
          />
        ) : (
          <span style={{ 
            color: '#ccc', 
            fontSize: '2em',
            opacity: 0.5 
          }}>
            {gameState.foundationSuits[index]}
          </span>
        )}
      </div>
    );
  };

  if (!gameState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="solitaire-game" style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      alignItems: 'center'
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        maxWidth: '800px'
      }}>
        <div style={{
          display: 'flex',
          gap: '4px'
        }}>
          {renderStockPile()}
          {renderWastePile()}
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '4px',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '800px'
      }}>
        {gameState.foundationPiles.map((pile, index) => renderFoundationPile(pile, index))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '4px',
        width: '100%',
        maxWidth: '800px'
      }}>
        {gameState.tableauPiles.map((pile, index) => renderTableauPile(pile, index))}
      </div>
    </div>
  );
}

export default Solitaire; 