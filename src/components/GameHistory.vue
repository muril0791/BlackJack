<template>
  <div class="history-container" :class="{ open: showHistory }">
    <div class="history-header">
      <h2>Game History</h2>
      <button @click="$emit('close')">Close</button>
    </div>
    <ul>
      <li v-for="(game, index) in history" :key="index">
        <p>Result: {{ game.result }}</p>
        <p>Player Hand: {{ game.playerHand.map(card => `${card.value} of ${card.suit}`).join(', ') }}</p>
        <p>Dealer Hand: {{ game.dealerHand.map(card => `${card.value} of ${card.suit}`).join(', ') }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'GameHistory',
  props: {
    history: Array,
    showHistory: Boolean,
  },
};
</script>

<style scoped>
.history-container {
  position: fixed;
  top: 0;
  right: 0px;
  /* Initial position outside of the view */
  width: 300px;
  height: 100%;
  background-color: #444;
  color: #fff;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  transition: right 0.3s;
}

.history-container.open {
  right: 0;
  /* Slide in the view */
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-container h2 {
  margin-bottom: 10px;
  color: #fff;
}

.history-container ul {
  list-style: none;
  padding: 0;
  overflow-y: auto;
  max-height: calc(100% - 60px);
}

.history-container li {
  background-color: #555;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  color: #fff;
}

.history-container button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.history-container button:hover {
  background-color: #2980b9;
}
</style>
