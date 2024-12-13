export class CardGame {
  constructor() {
    this.deck = [];
    this.selectedCard = null;
    this.selectedPileType = null;
    this.selectedPileIndex = null;
  }

  initializeGame() {
    throw new Error('initializeGame must be implemented by child class');
  }

  isValidMove(card, targetPile, targetPileType) {
    throw new Error('isValidMove must be implemented by child class');
  }

  handleMove(sourceCard, sourcePile, targetPile) {
    throw new Error('handleMove must be implemented by child class');
  }
} 