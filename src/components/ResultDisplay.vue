<template>
  <div class="result-display">
    <p>{{ results }}</p>
    <button @click="$emit('rebet')">Rebet</button>
    <button @click="$emit('new-bet')">New Bet</button>
  </div>
</template>

<script>
export default {
  name: 'ResultDisplay',
  props: {
    results: String,
  },
};
</script>

<style scoped>
.result-display {
  text-align: center;
  margin-top: 20px;
}

button {
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

button:hover {
  background-color: #3498db;
}
</style>
