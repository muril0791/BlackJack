<template>
  <div class="info-container">
    <div class="message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: 'GameInfo',
  props: {
    message: String,
  },
};
</script>

<style scoped>
.info-container {
  text-align: center;
  margin-top: 20px;
}

.message {
  font-size: 24px;
  margin-bottom: 10px;
}
</style>
