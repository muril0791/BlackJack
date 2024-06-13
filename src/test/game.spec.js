import { initialDeal, checkWinner } from "../src/logic/game";
import { createDeck } from "../src/logic/deck";

describe("Game logic", () => {
  test("initialDeal deals two cards to player and dealer", () => {
    const deck = createDeck();
    const playerHand = [];
    const dealerHand = [];
    initialDeal(deck, playerHand, dealerHand);
    expect(playerHand).toHaveLength(2);
    expect(dealerHand).toHaveLength(2);
  });

  test("checkWinner determines the correct winner", () => {
    const playerHand = [
      { value: "10", suit: "hearts" },
      { value: "K", suit: "spades" },
    ];
    const dealerHand = [
      { value: "9", suit: "clubs" },
      { value: "5", suit: "diamonds" },
    ];
    const result = checkWinner(playerHand, dealerHand);
    expect(result).toBe("Player wins");
  });
});
