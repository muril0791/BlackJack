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
    gameHistory: [],
    nightMode: false,
  },
  mutations: {
    SET_GAME_STATE(
      state,
      { deck, playerHands, dealerHand, currentHandIndex, gameStarted, loading }
    ) {
      state.deck = deck;
      state.playerHands = playerHands;
      state.dealerHand = dealerHand;
      state.currentHandIndex = currentHandIndex;
      state.gameStarted = gameStarted;
      state.loading = loading;
    },
    SET_BALANCE(state, balance) {
      state.balance = balance;
    },
    SET_MESSAGE(state, message) {
      state.message = message;
    },
    SET_BET(state, bet) {
      state.bet = bet;
    },
    SET_AVAILABLE_ACTIONS(state, actions) {
      state.availableActions = actions;
    },
    SET_RESULTS(state, results) {
      state.results = results;
      state.resultsAvailable = true;
    },
    RESET_GAME(state) {
      state.deck = [];
      state.playerHands = [];
      state.dealerHand = [];
      state.currentHandIndex = 0;
      state.message = "";
      state.gameStarted = false;
      state.loading = false;
      state.positionsSelected = false;
      state.results = [];
      state.resultsAvailable = false;
      state.availableActions = {};
      state.bet = 0;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_LAST_BET(state, bet) {
      state.lastBet = bet;
    },
    SET_POSITIONS_SELECTED(state, selected) {
      state.positionsSelected = selected;
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
    SET_GAME_STARTED(state, started) {
      state.gameStarted = started;
    },
    ADD_TO_HISTORY(state, gameResult) {
      state.gameHistory.push(gameResult);
    },
    TOGGLE_NIGHT_MODE(state) {
      state.nightMode = !state.nightMode;
    },
  },
  actions: {
    async startGame({ commit, state, dispatch }) {
      if (state.bet <= 0) {
        commit("SET_MESSAGE", "Please place a bet to start the game");
        return;
      }
      commit("SET_LOADING", true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const deck = shuffleDeck(createDeck());
      const playerHands = [[]];
      const dealerHand = [];
      commit("SET_GAME_STATE", {
        deck,
        playerHands,
        dealerHand,
        currentHandIndex: 0,
        gameStarted: true,
        loading: false,
      });
      initialDeal(deck, playerHands[0], dealerHand);
      dispatch("checkForBlackjack");
      dispatch("updateAvailableActions");
    },
    handleAction({ commit, state, dispatch }, action) {
      const currentHand = state.playerHands[state.currentHandIndex];
      switch (action) {
        case "hit":
          currentHand.push(drawCard(state.deck));
          if (calculateHandValue(currentHand) > 21) {
            commit("SET_MESSAGE", "Player busts! Dealer wins.");
            commit("SET_GAME_STARTED", false);
            commit("ADD_TO_HISTORY", {
              result: "Dealer wins",
              playerHand: [...currentHand],
              dealerHand: [...state.dealerHand],
            });
          }
          break;
        case "stand":
          dealerPlay(state.deck, state.dealerHand);
          const result = checkWinner(currentHand, state.dealerHand);
          commit("SET_MESSAGE", result);
          commit("SET_GAME_STARTED", false);
          commit("ADD_TO_HISTORY", {
            result,
            playerHand: [...currentHand],
            dealerHand: [...state.dealerHand],
          });
          break;
        case "double":
          if (doubleDown(state.deck, currentHand)) {
            commit("SET_BET", state.bet * 2);
            dealerPlay(state.deck, state.dealerHand);
            const doubleResult = checkWinner(currentHand, state.dealerHand);
            commit("SET_MESSAGE", doubleResult);
            commit("SET_GAME_STARTED", false);
            commit("ADD_TO_HISTORY", {
              result: doubleResult,
              playerHand: [...currentHand],
              dealerHand: [...state.dealerHand],
            });
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
            commit("ADD_TO_HISTORY", {
              result: "Player surrenders",
              playerHand: [...currentHand],
              dealerHand: [...state.dealerHand],
            });
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
    rebet({ commit, state, dispatch }) {
      if (state.balance >= state.lastBet) {
        commit("SET_BET", state.lastBet);
        commit("SET_BALANCE", state.balance - state.lastBet);
        dispatch("startGame");
      } else {
        commit("SET_MESSAGE", "Insufficient balance to rebet");
      }
    },
    newBet({ commit }) {
      commit("RESET_GAME");
    },
    checkForBlackjack({ commit, state }) {
      const playerValue = calculateHandValue(state.playerHands[0]);
      const dealerValue = calculateHandValue(state.dealerHand);

      if (playerValue === 21 && dealerValue !== 21) {
        commit("SET_MESSAGE", "Player wins with a Blackjack!");
        commit("SET_BALANCE", state.balance + state.bet * 2.5);
        commit("SET_GAME_STARTED", false);
        commit("ADD_TO_HISTORY", {
          result: "Player wins with a Blackjack",
          playerHand: [...state.playerHands[0]],
          dealerHand: [...state.dealerHand],
        });
      } else if (dealerValue === 21 && playerValue !== 21) {
        commit("SET_MESSAGE", "Dealer wins with a Blackjack!");
        commit("SET_GAME_STARTED", false);
        commit("ADD_TO_HISTORY", {
          result: "Dealer wins with a Blackjack",
          playerHand: [...state.playerHands[0]],
          dealerHand: [...state.dealerHand],
        });
      } else if (dealerValue === 21 && playerValue === 21) {
        commit("SET_MESSAGE", "Push! Both have Blackjack.");
        commit("SET_BALANCE", state.balance + state.bet);
        commit("SET_GAME_STARTED", false);
        commit("ADD_TO_HISTORY", {
          result: "Push! Both have Blackjack",
          playerHand: [...state.playerHands[0]],
          dealerHand: [...state.dealerHand],
        });
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
    toggleNightMode({ commit }) {
      commit("TOGGLE_NIGHT_MODE");
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
    getGameHistory: (state) => state.gameHistory,
    isNightMode: (state) => state.nightMode,
  },
});

export default store;
