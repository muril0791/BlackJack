<template>
  <div class="game-container">
    <LoadingScreen v-if="loading" />
    <div class="table">
      <DealerHand v-if="dealerHand.length" :hand="dealerHand" />
      <div class="positions">
        <PositionSelection v-if="gameStarted && !positionsSelected" @select-positions="selectPositions" />
        <PlayerHands v-if="playerHands.length" :hands="playerHands" />
      </div>
      <div class="controls">
        <GameControls v-if="gameStarted && positionsSelected" @action="handleAction" :available-actions="availableActions" />
        <BetSelection v-if="!gameStarted" @place-bet="placeBet" :balance="balance" />
      </div>
    </div>
    <div class="info">
      <GameInfo :message="message" />
      <ResultDisplay v-if="!gameStarted && resultsAvailable" :results="results" @rebet="rebet" @new-bet="newBet" />
    </div>
    <div class="footer">
      <div class="balance">Balance: ${{ balance }}</div>
      <div class="bet">Current Bet: ${{ bet }}</div>
    </div>
    <div v-if="showPopup" class="popup">{{ message }}</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import DealerHand from './DealerHand.vue';
import PlayerHands from './PlayerHands.vue';
import BetSelection from './BetSelection.vue';
import PositionSelection from './PositionSelection.vue';
import GameControls from './GameControls.vue';
import ResultDisplay from './ResultDisplay.vue';
import GameInfo from './GameInfo.vue';
import LoadingScreen from './LoadingScreen.vue';

export default {
  name: 'BlackjackGame',
  components: {
    DealerHand,
    PlayerHands,
    BetSelection,
    PositionSelection,
    GameControls,
    ResultDisplay,
    GameInfo,
    LoadingScreen,
  },
  data() {
    return {
      showPopup: false,
    };
  },
  computed: {
    ...mapState({
      dealerHand: state => state.dealerHand,
      playerHands: state => state.playerHands,
      balance: state => state.balance,
      bet: state => state.bet,
      message: state => state.message,
      gameStarted: state => state.gameStarted,
      loading: state => state.loading,
      positionsSelected: state => state.positionsSelected,
      results: state => state.results,
      resultsAvailable: state => state.resultsAvailable,
      availableActions: state => state.availableActions,
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
      'startGame',
      'handleAction',
      'placeBet',
      'selectPositions',
      'rebet',
      'newBet',
    ]),
    resetGame() {
      this.newBet();
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
}

.table {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #006400;
  border-radius: 10px;
  padding: 20px;
}

.positions {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.controls {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
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
