<!--DealerHands.vue -->
<template>
  <div class="dealer-hand">
    <Card v-for="(card, index) in hand" :key="index" :card="card" />
    <div v-if="hand.length" class="hand-value">Total: {{ calculateHandValue(hand) }}</div>
  </div>
</template>

<script>
import Card from './Card.vue';
import { calculateHandValue } from '../logic/utils';

export default {
  name: 'DealerHand',
  components: { Card },
  props: {
    hand: Array,
  },
  methods: {
    calculateHandValue,
  },
};
</script>

<style scoped>
.dealer-hand {
  display: flex;
  flex-direction: row;
  margin: 20px 0;
  position: relative;
}

.hand-value {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 18px;
  color: #fff;
}
</style>
