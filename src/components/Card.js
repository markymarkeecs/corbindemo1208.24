import React from 'react';
import '../styles/Card.css';

function Card({ card, pileType, pileIndex, cardIndex, onDragStart, onDoubleClick }) {
  if (!card) return null;

  // If the card is face down, render the back of the card
  if (!card.faceUp) {
    return (
      <div 
        className="card back"
        draggable={false}
      >
        🂠
      </div>
    );
  }

  return (
    <div 
      className={`card ${card.isSelected ? 'selected' : ''}`}
      draggable={true}
      onDragStart={(e) => onDragStart(e, pileType, pileIndex, cardIndex)}
      onDoubleClick={() => onDoubleClick(pileType, pileIndex, cardIndex)}
      data-suit={card.suit}
    >
      <div className="number-area top">{card.value}{card.suit}</div>
      <div className="center-suit">{card.suit}</div>
      <div className="number-area bottom">{card.value}{card.suit}</div>
    </div>
  );
}

export default Card; 