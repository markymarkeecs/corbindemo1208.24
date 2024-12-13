import { CardGame } from '../utils/CardGame';
import { createDeck, shuffleDeck, VALUES } from '../utils/cardDeck';

export class SolitaireGame extends CardGame {
  constructor() {
    super();
    this.tableauPiles = [[], [], [], [], [], [], []];
    this.foundationPiles = [[], [], [], []];
    this.stockPile = [];
    this.wastePile = [];
    this.selectedCard = null;
    this.selectedPileType = null;
    this.selectedPileIndex = null;
    this.foundationSuits = ['♥', '♦', '♠', '♣'];
  }

  initializeGame() {
    const newDeck = shuffleDeck(createDeck());

    // Deal cards to tableau
    const newTableauPiles = [[], [], [], [], [], [], []];
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = newDeck.pop();
        card.faceUp = i === j;
        newTableauPiles[j].push(card);
      }
    }

    this.tableauPiles = newTableauPiles;
    this.stockPile = newDeck;
    this.wastePile = [];
    this.foundationPiles = [[], [], [], []];
    this.selectedCard = null;
    this.selectedPileType = null;
    this.selectedPileIndex = null;

    return this.getGameState();
  }

  getGameState() {
    return {
      tableauPiles: this.tableauPiles,
      foundationPiles: this.foundationPiles,
      stockPile: this.stockPile,
      wastePile: this.wastePile,
      selectedCard: this.selectedCard,
      selectedPileType: this.selectedPileType,
      selectedPileIndex: this.selectedPileIndex,
      foundationSuits: this.foundationSuits
    };
  }

  drawCard() {
    if (this.stockPile.length === 0) {
      // If stock is empty, flip waste pile back to stock
      this.stockPile = [...this.wastePile].reverse().map(card => ({ ...card, faceUp: false }));
      this.wastePile = [];
    } else {
      // Draw top card from stock to waste
      const card = this.stockPile.pop();
      if (card) {
        card.faceUp = true;
        this.wastePile.push(card);
      }
    }

    // Update the game state
    this.selectedCard = null;
    this.selectedPileType = null;
    this.selectedPileIndex = null;

    return {
      tableauPiles: this.tableauPiles,
      foundationPiles: this.foundationPiles,
      stockPile: this.stockPile,
      wastePile: this.wastePile,
      selectedCard: this.selectedCard,
      selectedPileType: this.selectedPileType,
      selectedPileIndex: this.selectedPileIndex,
      foundationSuits: this.foundationSuits
    };
  }

  isValidTableauMove(card, targetPile) {
    if (!card) return false;
    
    if (!targetPile || targetPile.length === 0) {
      return card.value === 'K';
    }

    const targetCard = targetPile[targetPile.length - 1];
    if (!targetCard) return false;

    const valueIndex = VALUES.indexOf(card.value);
    const targetValueIndex = VALUES.indexOf(targetCard.value);

    return valueIndex === targetValueIndex - 1 && card.color !== targetCard.color;
  }

  isValidFoundationMove(card, pileIndex) {
    if (!card) return false;

    const pile = this.foundationPiles[pileIndex];
    if (!pile) return false;

    if (pile.length === 0) {
      return card.value === 'A' && card.suit === this.foundationSuits[pileIndex];
    }

    const targetCard = pile[pile.length - 1];
    if (!targetCard) return false;

    const valueIndex = VALUES.indexOf(card.value);
    const targetValueIndex = VALUES.indexOf(targetCard.value);

    return valueIndex === targetValueIndex + 1 && card.suit === targetCard.suit;
  }

  moveCard(sourceType, sourcePileIndex, sourceCardIndex, targetType, targetIndex) {
    // Get source and target piles
    let sourcePile, targetPile;
    switch (sourceType) {
      case 'tableau':
        sourcePile = this.tableauPiles[sourcePileIndex];
        break;
      case 'foundation':
        sourcePile = this.foundationPiles[sourcePileIndex];
        break;
      case 'waste':
        sourcePile = this.wastePile;
        break;
      default:
        return null;
    }

    switch (targetType) {
      case 'tableau':
        targetPile = this.tableauPiles[targetIndex];
        break;
      case 'foundation':
        targetPile = this.foundationPiles[targetIndex];
        break;
      default:
        return null;
    }

    // Get the card(s) being moved
    const movingCards = sourcePile.slice(sourceCardIndex);
    const targetCard = targetPile.length > 0 ? targetPile[targetPile.length - 1] : null;

    // Check if move is valid
    if (!this.isValidMove(movingCards[0], targetCard, targetType)) {
      return null;
    }

    // Perform the move
    sourcePile.splice(sourceCardIndex); // Remove cards from source
    targetPile.push(...movingCards); // Add cards to target

    // If we moved from tableau and revealed a new card, flip it
    if (sourceType === 'tableau' && sourceCardIndex > 0) {
      const newTopCard = sourcePile[sourceCardIndex - 1];
      if (newTopCard && !newTopCard.faceUp) {
        newTopCard.faceUp = true;
      }
    }

    return this.getGameState();
  }

  isValidMove(movingCard, targetCard, targetType) {
    if (!movingCard.faceUp) return false;

    if (targetType === 'foundation') {
      // Foundation rules
      if (!targetCard) {
        // Empty foundation can only receive Ace
        return movingCard.value === 'A';
      }
      // Must be same suit and next value up
      return movingCard.suit === targetCard.suit && 
             this.getCardValue(movingCard) === this.getCardValue(targetCard) + 1;
    }

    if (targetType === 'tableau') {
      if (!targetCard) {
        // Empty tableau can only receive King
        return movingCard.value === 'K';
      }
      // Must be alternate color and next value down
      return this.isOppositeColor(movingCard, targetCard) && 
             this.getCardValue(movingCard) === this.getCardValue(targetCard) - 1;
    }

    return false;
  }

  isOppositeColor(card1, card2) {
    const redSuits = ['♥', '♦'];
    const card1IsRed = redSuits.includes(card1.suit);
    const card2IsRed = redSuits.includes(card2.suit);
    return card1IsRed !== card2IsRed;
  }

  getCardValue(card) {
    const values = {
      'A': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 10,
      'J': 11,
      'Q': 12,
      'K': 13
    };
    return values[card.value];
  }

  clearSelection() {
    this.selectedCard = null;
    this.selectedPileType = null;
    this.selectedPileIndex = null;
  }

  selectCard(card, pileType, pileIndex, cardIndex) {
    if (card.faceUp) {
      this.selectedCard = { ...card, cardIndex };
      this.selectedPileType = pileType;
      this.selectedPileIndex = pileIndex;
    }
    return this.getGameState();
  }

  findValidFoundationPile(card) {
    // Try each foundation pile
    for (let i = 0; i < this.foundationPiles.length; i++) {
      const pile = this.foundationPiles[i];
      
      // For empty piles, check if it's an Ace and matches the suit
      if (pile.length === 0) {
        if (card.value === 'A' && card.suit === this.foundationSuits[i]) {
          return i;
        }
        continue;
      }

      // For non-empty piles, check if card can be placed on top
      const topCard = pile[pile.length - 1];
      if (card.suit === topCard.suit && 
          this.getCardValue(card) === this.getCardValue(topCard) + 1) {
        return i;
      }
    }
    return -1; // No valid foundation pile found
  }

  autoMoveToFoundation(sourceType, sourcePileIndex, cardIndex) {
    // Get the source card
    let sourcePile;
    switch (sourceType) {
      case 'tableau':
        sourcePile = this.tableauPiles[sourcePileIndex];
        break;
      case 'waste':
        sourcePile = this.wastePile;
        break;
      default:
        return null;
    }

    const sourceCard = sourcePile[cardIndex];
    if (!sourceCard || !sourceCard.faceUp) {
      return null;
    }

    // Find a valid foundation pile
    const foundationIndex = this.findValidFoundationPile(sourceCard);
    if (foundationIndex === -1) {
      return null;
    }

    // Move the card
    return this.moveCard(
      sourceType,
      sourcePileIndex,
      cardIndex,
      'foundation',
      foundationIndex
    );
  }
} 