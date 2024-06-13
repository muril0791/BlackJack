<template>
  <div :class="['game-container', { 'night-mode': isNightMode }]">
    <LoadingScreen v-if="loading" />
    <div class="menu-buttons">
      <button class="floating-button" @click="toggleNightMode">Night Mode</button>
      <button class="floating-button" @click="toggleHistory">History</button>
      <button class="floating-button" @click="toggleDebugTools">Debug Tools</button>
    </div>
    <GameArea />
    <div class="info">
      <GameInfo :message="message" />
      <ResultDisplay v-if="!gameStarted && resultsAvailable" :results="results" @rebet="rebet" @new-bet="newBet" />
    </div>
    <div class="footer">
      <div class="balance">Balance: ${{ balance }}</div>
      <div class="bet">Current Bet: ${{ bet }}</div>
    </div>
    <div v-if="showPopup" class="popup">{{ message }}</div>
    <GameHistory v-if="showHistory" :history="gameHistory" @close="toggleHistory"/>
    <DebugTools v-if="showDebugTools" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import GameArea from './components/GameArea.vue';
import ResultDisplay from './components/ResultDisplay.vue';
import GameInfo from './components/GameInfo.vue';
import LoadingScreen from './components/LoadingScreen.vue';
import GameHistory from './components/GameHistory.vue';
import DebugTools from './components/DebugTools.vue';

export default {
  name: 'BlackjackGame',
  components: {
    GameArea,
    ResultDisplay,
    GameInfo,
    LoadingScreen,
    GameHistory,
    DebugTools,
  },
  data() {
    return {
      showPopup: false,
      showHistory: false,
      showDebugTools: false,
    };
  },
  computed: {
    ...mapState({
      balance: state => state.balance,
      bet: state => state.bet,
      message: state => state.message,
      gameStarted: state => state.gameStarted,
      loading: state => state.loading,
      results: state => state.results,
      resultsAvailable: state => state.resultsAvailable,
      gameHistory: state => state.gameHistory,
      isNightMode: state => state.nightMode,
    }),
  },
  watch: {
    message(newMessage) {
      if (newMessage) {
        this.showPopup = true;
        setTimeout(() => {
          this.showPopup = false;
        }, 3000);
      }
    },
  },
  methods: {
    ...mapActions([
      'rebet',
      'newBet',
      'toggleNightMode',
    ]),
    resetGame() {
      this.newBet();
    },
    toggleHistory() {
      this.showHistory = !this.showHistory;
    },
    toggleDebugTools() {
      this.showDebugTools = !this.showDebugTools;
    },
  },
  mounted() {
    this.resetGame();
  },
  beforeDestroy() {
    this.resetGame();
  },
};
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: auto;
  transition: background-color 0.5s, color 0.5s;
}

.game-container.night-mode {
  background-color: #1a1a1a;
  color: #cccccc;
}

.menu-buttons {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
}

.floating-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s;
}

.floating-button:hover {
  background-color: #2980b9;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 20px;
}

.footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
}

.balance,
.bet {
  font-size: 20px;
}

.loading-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  border: 8px solid rgba(255, 255, 255, 0.2);
  border-top: 8px solid #fff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  font-size: 24px;
  z-index: 1000;
}
</style>
