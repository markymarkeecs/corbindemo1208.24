import React from 'react';
import '../../styles/Card.css';

function Card({ card, isSelected, onClick, onDragStart, onDragOver, onDrop, style }) {
  if (!card.faceUp) {
    return (
      <div className="card back" style={style}>
        🂠
      </div>
    );
  }

  const renderMiddleContent = () => {
    const value = card.value;
    const suit = card.suit;

    return (
      <div className="five-column-layout">
        <div className="number-area">{value}{suit}</div>
        <div className="center-suit">
          {suit}
        </div>
        <div className="number-area rotated">{value}{suit}</div>
      </div>
    );
  };

  return (
    <div 
      className={`card ${card.color} ${isSelected ? 'selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(e);
      }}
      draggable={true}
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart && onDragStart(e);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragOver && onDragOver(e);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDrop && onDrop(e);
      }}
      style={style}
    >
      {renderMiddleContent()}
    </div>
  );
}

export default Card; 