import { createDeck, shuffleDeck, drawCard } from "../src/logic/deck";

describe("Deck logic", () => {
  test("createDeck creates a deck of 52 cards", () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
  });

  test("shuffleDeck shuffles the deck", () => {
    const deck = createDeck();
    const shuffledDeck = shuffleDeck([...deck]);
    expect(shuffledDeck).not.toEqual(deck);
  });

  test("drawCard draws a card from the deck", () => {
    const deck = createDeck();
    const card = drawCard(deck);
    expect(deck).toHaveLength(51);
    expect(card).toBeDefined();
  });
});
