<template>
  <div class="position-selection">
    <button v-for="position in ['left', 'middle', 'right']" :key="position" @click="selectPosition(position)">
      {{ position }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'PositionSelection',
  methods: {
    selectPosition(position) {
      this.$emit('select-positions', [position]);  // Envia um array contendo a posição selecionada
    },
  },
};
</script>

<style scoped>
.position-selection {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.position-selection button {
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

.position-selection button:hover {
  background-color: #3498db;
}
</style>
