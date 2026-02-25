<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>Welcome to Electron + Vue 3!</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const msg = ref('Hello Vue!')
</script>

<style scoped>
.hello {
  text-align: center;
  padding-top: 50px;
}
</style>