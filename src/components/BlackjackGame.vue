<template>
    <div class="game-container">
        <!-- <div class="loading-screen" v-if="loading">
            <div class="spinner"></div>
        </div> -->
        <div class="dealer-hand">
            <Card v-for="(card, index) in dealerHand" :key="index" :card="card" />
            <div class="hand-value">Total: {{ calculateHandValue(dealerHand) }}</div>
        </div>
        <div class="player-hand">
            <Card v-for="(card, index) in playerHand" :key="index" :card="card" />
            <div class="hand-value">Total: {{ calculateHandValue(playerHand) }}</div>
        </div>
        <div class="controls-container">
            <Controls @hit="hit" @stand="stand" @bet="placeBet" :canDouble="canDouble" :canSplit="canSplit"
                :canInsurance="canInsurance" :canSurrender="canSurrender" :balance="balance" :bet="bet"
                :gameStarted="gameStarted" />
        </div>
        <div class="info-container">
            <div class="message">{{ message }}</div>
            <div class="balance">Balance: ${{ balance }}</div>
            <div class="bet">Current Bet: ${{ bet }}</div>
            <button @click="restartGame" class="restart-button">Restart Game</button>
        </div>
    </div>
</template>

<script>
import { createDeck, shuffleDeck, drawCard } from '../logic/deck';
import { initialDeal, dealerPlay, checkWinner, doubleDown, splitHand, offerInsurance, surrender } from '../logic/game';
import { calculateHandValue } from '../logic/utils';
import Card from './Card.vue';
import Controls from './Controls.vue';

export default {
    name: 'BlackjackGame',
    components: { Card, Controls },
    data() {
        return {
            deck: [],
            playerHand: [],
            dealerHand: [],
            splitHands: [],
            currentHandIndex: 0,
            message: '',
            balance: 1000,
            bet: 0,
            gameStarted: false,
            loading: true,
        };
    },
    methods: {
        startGame() {
            if (this.bet <= 0) {
                this.message = 'Please place a bet to start the game';
                return;
            }

            this.loading = true;
            setTimeout(() => {
                this.deck = shuffleDeck(createDeck());
                this.playerHand = [];
                this.dealerHand = [];
                this.splitHands = [];
                this.currentHandIndex = 0;
                this.message = '';
                this.gameStarted = true;
                initialDeal(this.deck, this.playerHand, this.dealerHand);
                this.checkForBlackjack();
                this.loading = false;
            }, 1000);
        },
        hit() {
            if (!this.gameStarted) {
                this.message = 'Please place a bet to start the game';
                return;
            }

            this.playerHand.push(drawCard(this.deck));
            if (calculateHandValue(this.playerHand) > 21) {
                this.message = 'Player busts! Dealer wins.';
                this.gameStarted = false;
            }
        },
        stand() {
            if (!this.gameStarted) {
                this.message = 'Please place a bet to start the game';
                return;
            }

            dealerPlay(this.deck, this.dealerHand);
            this.message = checkWinner(this.playerHand, this.dealerHand);
            this.updateBalance();
            this.gameStarted = false;
        },
        double() {
            if (!this.gameStarted) {
                this.message = 'Please place a bet to start the game';
                return;
            }

            if (doubleDown(this.deck, this.playerHand)) {
                this.bet *= 2;
                dealerPlay(this.deck, this.dealerHand);
                this.message = checkWinner(this.playerHand, this.dealerHand);
                this.updateBalance();
                this.gameStarted = false;
            }
        },
        split() {
            if (!this.gameStarted) {
                this.message = 'Please place a bet to start the game';
                return;
            }

            const splitResult = splitHand(this.deck, this.playerHand);
            if (splitResult) {
                this.splitHands = splitResult;
                this.playerHand = this.splitHands[this.currentHandIndex];
            }
        },
        insurance() {
            if (!this.gameStarted) {
                this.message = 'Please place a bet to start the game';
                return;
            }

            if (offerInsurance(this.dealerHand)) {
                this.message = 'Insurance offered';
            }
        },
        surrender() {
            if (!this.gameStarted) {
                this.message = 'Please place a bet to start the game';
                return;
            }

            if (surrender(this.playerHand)) {
                this.message = 'Player surrenders. Half bet returned.';
                this.balance += this.bet / 2;
                this.bet = 0;
                this.gameStarted = false;
            }
        },
        placeBet(amount) {
            if (this.gameStarted) {
                this.message = 'Finish the current game before placing a new bet';
                return;
            }

            if (this.balance >= amount) {
                this.bet = amount;
                this.balance -= amount;
                this.startGame();
            } else {
                this.message = 'Insufficient balance to place bet';
            }
        },
        updateBalance() {
            if (this.message === 'Player wins') {
                this.balance += this.bet * 2;
            } else if (this.message === 'Push') {
                this.balance += this.bet;
            }
            this.bet = 0;
        },
        restartGame() {
            this.balance = 1000;
            this.bet = 0;
            this.message = '';
            this.gameStarted = false;
            this.startGame();
        },
        checkForBlackjack() {
            const playerValue = calculateHandValue(this.playerHand);
            const dealerValue = calculateHandValue(this.dealerHand);

            if (playerValue === 21 && dealerValue !== 21) {
                this.message = 'Player wins with a Blackjack!';
                this.balance += this.bet * 2.5;
                this.bet = 0;
                this.gameStarted = false;
            } else if (dealerValue === 21 && playerValue !== 21) {
                this.message = 'Dealer wins with a Blackjack!';
                this.bet = 0;
                this.gameStarted = false;
            } else if (dealerValue === 21 && playerValue === 21) {
                this.message = 'Push! Both have Blackjack.';
                this.balance += this.bet;
                this.bet = 0;
                this.gameStarted = false;
            }
        },
        calculateHandValue(hand) {
            return calculateHandValue(hand);
        }
    },
    computed: {
        canDouble() {
            return this.playerHand.length === 2 && this.bet <= this.balance;
        },
        canSplit() {
            return this.playerHand.length === 2 && this.playerHand[0].value === this.playerHand[1].value && this.bet <= this.balance;
        },
        canInsurance() {
            return offerInsurance(this.dealerHand);
        },
        canSurrender() {
            return surrender(this.playerHand);
        },
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
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
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
