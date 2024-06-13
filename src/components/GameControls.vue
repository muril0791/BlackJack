<template>
  <div class="controls">
    <button @click="emitAction('hit')" :disabled="!availableActions.canHit">Hit</button>
    <button @click="emitAction('stand')" :disabled="!availableActions.canStand">Stand</button>
    <button @click="emitAction('double')" :disabled="!availableActions.canDouble">Double</button>
    <button @click="emitAction('split')" :disabled="!availableActions.canSplit">Split</button>
    <button @click="emitAction('insurance')" :disabled="!availableActions.canInsurance">Insurance</button>
    <button @click="emitAction('surrender')" :disabled="!availableActions.canSurrender">Surrender</button>
  </div>
</template>

<script>
export default {
  name: 'GameControls',
  props: {
    availableActions: Object,
  },
  methods: {
    emitAction(action) {
      this.$emit('action', action);
    },
  },
};
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #2980b9;
  color: #ecf0f1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: grey;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #3498db;
}
</style>
