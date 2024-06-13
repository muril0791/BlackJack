<template>
  <div class="game-container">
    <LoadingScreen v-if="loading" />
    <DealerHand v-if="dealerHand.length" :hand="dealerHand" />
    <PlayerHands v-if="playerHands.length" :hands="playerHands" />
    <BetSelection v-if="!gameStarted" @place-bet="placeBet" :balance="balance" />
    <PositionSelection v-if="gameStarted && !positionsSelected" @select-positions="selectPositions" />
    <GameControls v-if="gameStarted && positionsSelected" @action="handleAction" :available-actions="availableActions" />
    <ResultDisplay v-if="!gameStarted && resultsAvailable" :results="results" @rebet="rebet" @new-bet="newBet" />
    <GameInfo :message="message" :balance="balance" :bet="bet" @restart="restartGame" />
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
  methods: {
    ...mapActions([
      'startGame',
      'handleAction',
      'placeBet',
      'selectPositions',
      'rebet',
      'newBet',
      'restartGame',
    ]),
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

.dealer-hand,
.player-hand {
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

.controls-container {
  margin-top: 20px;
}

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

button {
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

button:hover {
  background-color: #3498db;
}
</style>
