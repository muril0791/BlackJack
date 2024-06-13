<template>
    <div class="controls">
        <button @click="$emit('hit')" :disabled="!gameStarted" class="control-button">Hit</button>
        <button @click="$emit('stand')" :disabled="!gameStarted" class="control-button">Stand</button>
        <button @click="$emit('double')" :disabled="!canDouble || !gameStarted" class="control-button">Double</button>
        <button @click="$emit('split')" :disabled="!canSplit || !gameStarted" class="control-button">Split</button>
        <button @click="$emit('insurance')" :disabled="!canInsurance || !gameStarted"
            class="control-button">Insurance</button>
        <button @click="$emit('surrender')" :disabled="!canSurrender || !gameStarted"
            class="control-button">Surrender</button>
        <div class="bet-options">
            <button @click="$emit('bet', 10)" :disabled="balance < 10 || gameStarted" class="bet-button">$10</button>
            <button @click="$emit('bet', 20)" :disabled="balance < 20 || gameStarted" class="bet-button">$20</button>
            <button @click="$emit('bet', 50)" :disabled="balance < 50 || gameStarted" class="bet-button">$50</button>
            <button @click="$emit('bet', 100)" :disabled="balance < 100 || gameStarted" class="bet-button">$100</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Controls',
    props: {
        canDouble: Boolean,
        canSplit: Boolean,
        canInsurance: Boolean,
        canSurrender: Boolean,
        balance: Number,
        gameStarted: Boolean,
    },
};
</script>

<style scoped>
.controls {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.control-button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #2980b9;
    color: #ecf0f1;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.control-button:disabled {
    background-color: grey;
    cursor: not-allowed;
}

.control-button:hover:not(:disabled) {
    background-color: #3498db;
}

.bet-options {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.bet-button {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #27ae60;
    color: #ecf0f1;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.bet-button:disabled {
    background-color: grey;
    cursor: not-allowed;
}

.bet-button:hover:not(:disabled) {
    background-color: #2ecc71;
}
</style>
