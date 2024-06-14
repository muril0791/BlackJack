<template>
  <div class="bet-selection">
    <p>Place Bet</p>
    <button v-for="amount in [10, 20, 50, 100]" :key="amount" :disabled="amount > balance" @click="placeBet(amount)">{{ amount }}</button>
  </div>
</template>

<script>
export default {
  name: 'BetSelection',
  props: {
    balance: Number,
  },
  methods: {
    placeBet(amount) {
      this.$emit('place-bet', amount);
    },
  },
};
</script>

<style scoped>
.bet-selection {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.bet-selection button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #2980b9;
  color: #ecf0f1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.bet-selection button:disabled {
  background-color: grey;
  cursor: not-allowed;
}

.bet-selection button:hover:not(:disabled) {
  background-color: #3498db;
}
</style>
