export const SUITS = ['♠', '♥', '♣', '♦'];
export const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const SUIT_COLORS = {
  '♥': 'red',
  '♦': 'red',
  '♠': 'black',
  '♣': 'black'
};

export const createDeck = () => {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck = [];

  for (let suit of suits) {
    for (let value of values) {
      deck.push({
        suit,
        value,
        id: `${value}-${suit}`
      });
    }
  }

  return deck;
};

export const shuffleDeck = (deck) => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}; 