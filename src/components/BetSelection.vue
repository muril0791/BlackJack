<template>
  <div class="bet-selection">
    <button @click="placeBet(10)">10</button>
    <button @click="placeBet(20)">20</button>
    <button @click="placeBet(50)">50</button>
    <button @click="placeBet(100)">100</button>
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
      if (this.balance >= amount) {
        this.$emit('place-bet', amount);
      } else {
        alert('Insufficient balance');
      }
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

.bet-selection button:hover {
  background-color: #3498db;
}
</style>
