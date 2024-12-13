import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import { createDeck, shuffleDeck } from '../utils/cardDeck';
import './Poker.css';

function Poker() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [computerHand, setComputerHand] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [gameStage, setGameStage] = useState('pre-flop');
  const [playerChips, setPlayerChips] = useState(1000);
  const [computerChips, setComputerChips] = useState(1000);
  const [pot, setPot] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newDeck = shuffleDeck(createDeck()).map(card => ({
      suit: card.suit,
      value: card.value,
      id: `${card.value}-${card.suit}`
    }));
    
    setDeck(newDeck);
    setPlayerHand([newDeck[0], newDeck[1]]);
    setComputerHand([newDeck[2], newDeck[3]]);
    setCommunityCards([]);
    setGameStage('pre-flop');
    setCurrentBet(0);
    setPot(0);
  };

  const dealFlop = () => {
    setCommunityCards([deck[4], deck[5], deck[6]]);
    setGameStage('flop');
  };

  const dealTurn = () => {
    setCommunityCards([...communityCards, deck[7]]);
    setGameStage('turn');
  };

  const dealRiver = () => {
    setCommunityCards([...communityCards, deck[8]]);
    setGameStage('river');
  };

  // New utility functions for poker gameplay
  const placeBet = (amount) => {
    if (amount <= playerChips) {
      setPlayerChips(prev => prev - amount);
      setPot(prev => prev + amount);
      setCurrentBet(amount);
    }
  };

  const fold = () => {
    // Computer wins the pot
    setComputerChips(prev => prev + pot);
    setPot(0);
    startNewGame();
  };

  const call = () => {
    const callAmount = currentBet;
    if (callAmount <= playerChips) {
      setPlayerChips(prev => prev - callAmount);
      setPot(prev => prev + callAmount);
      moveToNextStage();
    }
  };

  const moveToNextStage = () => {
    switch (gameStage) {
      case 'pre-flop':
        dealFlop();
        break;
      case 'flop':
        dealTurn();
        break;
      case 'turn':
        dealRiver();
        break;
      case 'river':
        setGameStage('showdown');
        break;
      default:
        break;
    }
  };

  const evaluateHands = () => {
    // This would contain the logic to determine the winning hand
    // For now, we'll just return a placeholder
    return 'player';
  };

  const handleShowdown = () => {
    const winner = evaluateHands();
    if (winner === 'player') {
      setPlayerChips(prev => prev + pot);
    } else {
      setComputerChips(prev => prev + pot);
    }
    setPot(0);
  };

  return (
    <div className="poker-table">
      <div className="chips-display">
        <div>Computer: ${computerChips}</div>
        <div>Pot: ${pot}</div>
      </div>

      <div className="computer-hand">
        {computerHand.map((card, index) => (
          <Card
            key={card.id || index}
            card={card}
            faceUp={gameStage === 'showdown'}
          />
        ))}
      </div>

      <div className="community-cards">
        {communityCards.map((card, index) => (
          <Card
            key={card.id || index}
            card={card}
            faceUp={true}
          />
        ))}
      </div>

      <div className="player-hand">
        {playerHand.map((card, index) => (
          <Card
            key={card.id || index}
            card={card}
            faceUp={true}
          />
        ))}
      </div>

      <div className="player-info">
        <div>Your Chips: ${playerChips}</div>
        <div>Current Bet: ${currentBet}</div>
      </div>

      <div className="controls">
        {gameStage !== 'showdown' && (
          <>
            <button onClick={() => placeBet(10)}>Bet $10</button>
            <button onClick={call}>Call</button>
            <button onClick={fold}>Fold</button>
          </>
        )}
        {gameStage === 'river' && (
          <button onClick={() => setGameStage('showdown')}>Show Cards</button>
        )}
        {gameStage === 'showdown' && (
          <button onClick={handleShowdown}>Evaluate Winner</button>
        )}
        <button onClick={startNewGame}>New Game</button>
      </div>
    </div>
  );
}

export default Poker; 