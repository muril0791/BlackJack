import { createStore } from "vuex";
import { createDeck, shuffleDeck, drawCard } from "../logic/deck";
import {
  initialDeal,
  dealerPlay,
  checkWinner,
  doubleDown,
  splitHand,
  offerInsurance,
  surrender,
} from "../logic/game";
import { calculateHandValue } from "../logic/utils";

const store = createStore({
  state: {
    deck: [],
    playerHands: [],
    dealerHand: [],
    currentHandIndex: 0,
    message: "",
    balance: 1000,
    bet: 0,
    gameStarted: false,
    loading: false,
    positionsSelected: false,
    results: [],
    resultsAvailable: false,
    availableActions: {},
    lastBet: 0,
  },
  mutations: {
    SET_DECK(state, deck) {
      state.deck = deck;
    },
    SET_PLAYER_HANDS(state, hands) {
      state.playerHands = hands;
    },
    SET_DEALER_HAND(state, hand) {
      state.dealerHand = hand;
    },
    SET_CURRENT_HAND_INDEX(state, index) {
      state.currentHandIndex = index;
    },
    SET_MESSAGE(state, message) {
      state.message = message;
    },
    SET_BALANCE(state, balance) {
      state.balance = balance;
    },
    SET_BET(state, bet) {
      state.bet = bet;
    },
    SET_GAME_STARTED(state, started) {
      state.gameStarted = started;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_POSITIONS_SELECTED(state, selected) {
      state.positionsSelected = selected;
    },
    SET_RESULTS(state, results) {
      state.results = results;
    },
    SET_RESULTS_AVAILABLE(state, available) {
      state.resultsAvailable = available;
    },
    SET_AVAILABLE_ACTIONS(state, actions) {
      state.availableActions = actions;
    },
    SET_LAST_BET(state, bet) {
      state.lastBet = bet;
    },
  },
  actions: {
    startGame({ commit, state, dispatch }) {
      if (state.bet <= 0) {
        commit("SET_MESSAGE", "Please place a bet to start the game");
        return;
      }
      commit("SET_LOADING", true);
      setTimeout(() => {
        const deck = shuffleDeck(createDeck());
        commit("SET_DECK", deck);
        commit("SET_PLAYER_HANDS", [[]]);
        commit("SET_DEALER_HAND", []);
        commit("SET_CURRENT_HAND_INDEX", 0);
        commit("SET_MESSAGE", "");
        commit("SET_GAME_STARTED", true);
        initialDeal(deck, state.playerHands[0], state.dealerHand);
        dispatch("checkForBlackjack");
        commit("SET_LOADING", false);
        dispatch("updateAvailableActions");
      }, 1000);
    },
    handleAction({ commit, state, dispatch }, action) {
      const currentHand = state.playerHands[state.currentHandIndex];
      switch (action) {
        case "hit":
          currentHand.push(drawCard(state.deck));
          if (calculateHandValue(currentHand) > 21) {
            commit("SET_MESSAGE", "Player busts! Dealer wins.");
            commit("SET_GAME_STARTED", false);
          }
          break;
        case "stand":
          dealerPlay(state.deck, state.dealerHand);
          commit("SET_MESSAGE", checkWinner(currentHand, state.dealerHand));
          commit("SET_GAME_STARTED", false);
          break;
        case "double":
          if (doubleDown(state.deck, currentHand)) {
            commit("SET_BET", state.bet * 2);
            dealerPlay(state.deck, state.dealerHand);
            commit("SET_MESSAGE", checkWinner(currentHand, state.dealerHand));
            commit("SET_GAME_STARTED", false);
          }
          break;
        case "split":
          const splitResult = splitHand(state.deck, currentHand);
          if (splitResult) {
            commit("SET_PLAYER_HANDS", splitResult);
            commit("SET_CURRENT_HAND_INDEX", 0);
          }
          break;
        case "insurance":
          if (offerInsurance(state.dealerHand)) {
            commit("SET_MESSAGE", "Insurance offered");
          }
          break;
        case "surrender":
          if (surrender(currentHand)) {
            commit("SET_MESSAGE", "Player surrenders. Half bet returned.");
            commit("SET_BALANCE", state.balance + state.bet / 2);
            commit("SET_BET", 0);
            commit("SET_GAME_STARTED", false);
          }
          break;
        default:
          break;
      }
      dispatch("updateAvailableActions");
    },
    placeBet({ commit, state, dispatch }, amount) {
      if (state.gameStarted) {
        commit(
          "SET_MESSAGE",
          "Finish the current game before placing a new bet"
        );
        return;
      }
      if (state.balance >= amount) {
        commit("SET_BET", amount);
        commit("SET_BALANCE", state.balance - amount);
        commit("SET_LAST_BET", amount);
        dispatch("startGame");
      } else {
        commit("SET_MESSAGE", "Insufficient balance to place bet");
      }
    },
    selectPositions({ commit, dispatch }, positions) {
      if (!Array.isArray(positions)) {
        throw new TypeError("Positions should be an array.");
      }
      commit("SET_POSITIONS_SELECTED", true);
      commit(
        "SET_PLAYER_HANDS",
        positions.map(() => [])
      );
      dispatch("startGame");
    },
    rebet({ commit, state, dispatch }) {
      if (state.balance >= state.lastBet) {
        commit("SET_BET", state.lastBet);
        commit("SET_BALANCE", state.balance - state.lastBet);
        commit("SET_GAME_STARTED", true);
        dispatch("startGame");
      } else {
        commit("SET_MESSAGE", "Insufficient balance to rebet");
      }
    },
    newBet({ commit }) {
      commit("SET_BET", 0);
      commit("SET_GAME_STARTED", false);
      commit("SET_RESULTS_AVAILABLE", false);
    },
    restartGame({ commit, dispatch }) {
      commit("SET_BALANCE", 1000);
      commit("SET_BET", 0);
      commit("SET_MESSAGE", "");
      commit("SET_GAME_STARTED", false);
      commit("SET_RESULTS_AVAILABLE", false);
      dispatch("startGame");
    },
    checkForBlackjack({ commit, state }) {
      const playerValue = calculateHandValue(state.playerHands[0]);
      const dealerValue = calculateHandValue(state.dealerHand);

      if (playerValue === 21 && dealerValue !== 21) {
        commit("SET_MESSAGE", "Player wins with a Blackjack!");
        commit("SET_BALANCE", state.balance + state.bet * 2.5);
        commit("SET_BET", 0);
        commit("SET_GAME_STARTED", false);
      } else if (dealerValue === 21 && playerValue !== 21) {
        commit("SET_MESSAGE", "Dealer wins with a Blackjack!");
        commit("SET_BET", 0);
        commit("SET_GAME_STARTED", false);
      } else if (dealerValue === 21 && playerValue === 21) {
        commit("SET_MESSAGE", "Push! Both have Blackjack.");
        commit("SET_BALANCE", state.balance + state.bet);
        commit("SET_BET", 0);
        commit("SET_GAME_STARTED", false);
      }
    },
    updateAvailableActions({ commit, state }) {
      const currentHand = state.playerHands[state.currentHandIndex];
      const actions = {
        canHit: state.gameStarted,
        canStand: state.gameStarted,
        canDouble:
          state.gameStarted &&
          state.bet <= state.balance &&
          currentHand.length === 2,
        canSplit:
          state.gameStarted &&
          currentHand.length === 2 &&
          currentHand[0].value === currentHand[1].value,
        canInsurance:
          state.gameStarted &&
          state.dealerHand.length === 2 &&
          state.dealerHand[0].value === "A",
        canSurrender: state.gameStarted && currentHand.length === 2,
      };
      commit("SET_AVAILABLE_ACTIONS", actions);
    },
  },
  getters: {
    getPlayerHands: (state) => state.playerHands,
    getDealerHand: (state) => state.dealerHand,
    getCurrentHandIndex: (state) => state.currentHandIndex,
    getMessage: (state) => state.message,
    getBalance: (state) => state.balance,
    getBet: (state) => state.bet,
    isGameStarted: (state) => state.gameStarted,
    isLoading: (state) => state.loading,
    isPositionsSelected: (state) => state.positionsSelected,
    getResults: (state) => state.results,
    isResultsAvailable: (state) => state.resultsAvailable,
    getAvailableActions: (state) => state.availableActions,
    getLastBet: (state) => state.lastBet,
  },
});

export default store;
