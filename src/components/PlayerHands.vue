<!--PlayerHands.vue -->
<template>
  <div class="player-hands">
    <div v-for="(hand, index) in hands" :key="index" class="player-hand">
      <Card v-for="(card, cardIndex) in hand" :key="cardIndex" :card="card" />
      <div v-if="hand.length" class="hand-value">Total: {{ calculateHandValue(hand) }}</div>
    </div>
  </div>
</template>

<script>
import Card from './Card.vue';
import { calculateHandValue } from '../logic/utils';

export default {
  name: 'PlayerHands',
  components: { Card },
  props: {
    hands: Array,
  },
  methods: {
    calculateHandValue,
  },
};
</script>

<style scoped>
.player-hands {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.player-hand {
  display: flex;
  flex-direction: row;
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
