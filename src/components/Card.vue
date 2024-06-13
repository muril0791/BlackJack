<!--Card.vue -->
<template>
  <div class="card">
    <img :src="`/cards/${cardImage}`" alt="card" />
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    card: Object,
  },
  computed: {
    cardImage() {
      const suitMap = {
        'clubs': 'clubs',
        'spades': 'spades',
        'hearts': 'hearts',
        'diamonds': 'diamonds'
      };
      const valueMap = {
        'A': 'ace', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6',
        '7': '7', '8': '8', '9': '9', '10': '10', 'J': 'jack', 'Q': 'queen', 'K': 'king'
      };
      const suit = suitMap[this.card.suit];
      const value = valueMap[this.card.value];
      return `${value}_${suit}.png`;
    },
  },
};
</script>

<style scoped>
.card {
  width: 100px;
  height: 150px;
  margin: 5px;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>
