<template>
  <div class="info-container">
    <div class="message">{{ message }}</div>
    <div class="balance">Balance: ${{ balance }}</div>
    <div class="bet">Current Bet: ${{ bet }}</div>
    <button @click="$emit('restart')" class="restart-button">Restart Game</button>
  </div>
</template>

<script>
export default {
  name: 'GameInfo',
  props: {
    message: String,
    balance: Number,
    bet: Number,
  },
};
</script>

<style scoped>
.info-container {
  margin-top: 20px;
  text-align: center;
}

.message {
  font-size: 24px;
  margin-bottom: 10px;
}

.balance,
.bet {
  font-size: 20px;
}

.restart-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #2980b9;
  color: #ecf0f1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.restart-button:hover {
  background-color: #3498db;
}
</style>
