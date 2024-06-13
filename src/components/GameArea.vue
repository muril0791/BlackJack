<template>
  <div class="game-area">
    <div class="table">
      <DealerHand v-if="dealerHand.length" :hand="dealerHand" />
      <div class="positions">
        <PositionSelection v-if="gameStarted && !positionsSelected" @select-positions="selectPositions" />
        <PlayerHands v-if="playerHands.length" :hands="playerHands" />
      </div>
    </div>
    <div class="controls">
      <GameControls v-if="gameStarted && positionsSelected" @action="handleAction"
        :available-actions="availableActions" />
      <BetSelection v-if="!gameStarted" @place-bet="placeBet" :balance="balance" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import DealerHand from './DealerHand.vue';
import PlayerHands from './PlayerHands.vue';
import BetSelection from './BetSelection.vue';
import PositionSelection from './PositionSelection.vue';
import GameControls from './GameControls.vue';

export default {
  name: 'GameArea',
  components: {
    DealerHand,
    PlayerHands,
    BetSelection,
    PositionSelection,
    GameControls,
  },
  computed: {
    ...mapState({
      dealerHand: state => state.dealerHand,
      playerHands: state => state.playerHands,
      gameStarted: state => state.gameStarted,
      positionsSelected: state => state.positionsSelected,
      availableActions: state => state.availableActions,
      balance: state => state.balance,
    }),
  },
  methods: {
    ...mapActions([
      'selectPositions',
      'handleAction',
      'placeBet',
    ]),
  },
};
</script>

<style scoped>
.game-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #006400;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.table {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
</style>
