<template>
  <div class="result-display">
    <div v-for="result in results" :key="result.hand" class="result">
      {{ result.hand }}: {{ result.message }}
    </div>
    <button @click="$emit('rebet')" class="result-button">Rebet</button>
    <button @click="$emit('new-bet')" class="result-button">New Bet</button>
  </div>
</template>

<script>
export default {
  name: 'ResultDisplay',
  props: {
    results: Array,
  },
};
</script>

<style scoped>
.result-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result {
  margin: 10px 0;
  font-size: 18px;
}

.result-button {
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

.result-button:hover {
  background-color: #3498db;
}
</style>
