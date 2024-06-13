//utils.js
export function calculateHandValue(hand) {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.value === "A") {
      aces += 1;
      value += 11;
    } else if (["K", "Q", "J"].includes(card.value)) {
      value += 10;
    } else {
      value += parseInt(card.value, 10);
    }
  }

  while (value > 21 && aces) {
    value -= 10;
    aces -= 1;
  }

  return value;
}
