//game.js
import { drawCard } from "./deck";
import { calculateHandValue } from "./utils";

export function initialDeal(deck, playerHand, dealerHand) {
  for (let i = 0; i < 2; i++) {
    playerHand.push(drawCard(deck));
    dealerHand.push(drawCard(deck));
  }
}

export function dealerPlay(deck, dealerHand) {
  while (calculateHandValue(dealerHand) < 17) {
    dealerHand.push(drawCard(deck));
  }
}

export function checkWinner(playerHand, dealerHand) {
  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  if (playerValue > 21) {
    return "Dealer wins";
  }
  if (dealerValue > 21 || playerValue > dealerValue) {
    return "Player wins";
  }
  if (playerValue < dealerValue) {
    return "Dealer wins";
  }
  return "Push";
}

export function doubleDown(deck, playerHand) {
  if (playerHand.length === 2) {
    playerHand.push(drawCard(deck));
    return true;
  }
  return false;
}

export function splitHand(deck, playerHand) {
  if (playerHand.length === 2 && playerHand[0].value === playerHand[1].value) {
    return [
      [playerHand[0], drawCard(deck)],
      [playerHand[1], drawCard(deck)],
    ];
  }
  return null;
}

export function offerInsurance(dealerHand) {
  return dealerHand && dealerHand[0] && dealerHand[0].value === "A";
}

export function surrender(playerHand) {
  if (playerHand.length === 2) {
    return true;
  }
  return false;
}
