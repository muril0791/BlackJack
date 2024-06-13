<!--App.vue.vue -->
<template>
    <BlackjackGame />
</template>

<script>
import BlackjackGame from './components/BlackjackGame.vue';

export default {
  name: 'App',
  components: {
    BlackjackGame,
  },
};
</script>

<style>
#app {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2c3e50;
  overflow: hidden;
}
</style>
