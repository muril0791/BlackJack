<template>
  <div class="debug-tools">
    <h3>Debug Tools</h3>
    <div class="tool">
      <label>Balance:</label>
      <input type="number" v-model="balance" @change="updateBalance" />
    </div>
    <div class="tool">
      <label>Bet:</label>
      <input type="number" v-model="bet" @change="updateBet" />
    </div>
    <div class="tool">
      <label>Game Started:</label>
      <input type="checkbox" v-model="gameStarted" @change="updateGameStarted" />
    </div>
    <div class="tool">
      <label>Message:</label>
      <input type="text" v-model="message" @change="updateMessage" />
    </div>
    <!-- Add more debug controls as needed -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'DebugTools',
  computed: {
    ...mapState({
      balance: state => state.balance,
      bet: state => state.bet,
      gameStarted: state => state.gameStarted,
      message: state => state.message,
    }),
  },
  methods: {
    ...mapMutations([
      'SET_BALANCE',
      'SET_BET',
      'SET_GAME_STARTED',
      'SET_MESSAGE',
    ]),
    updateBalance(event) {
      this.SET_BALANCE(Number(event.target.value));
    },
    updateBet(event) {
      this.SET_BET(Number(event.target.value));
    },
    updateGameStarted(event) {
      this.SET_GAME_STARTED(event.target.checked);
    },
    updateMessage(event) {
      this.SET_MESSAGE(event.target.value);
    },
  },
};
</script>

<style scoped>
.debug-tools {
  background-color: #333;
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  position: fixed;
  bottom: 20px;
  left: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.tool {
  margin-bottom: 10px;
}

.tool label {
  margin-right: 10px;
}
</style>
