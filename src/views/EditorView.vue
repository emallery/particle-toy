<template>
  <div class="home">
    <h1>Pretend this is the editor.</h1>
    <img alt="Vue logo" src="../assets/logo.png">
    <P5Component />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import P5Component from '@/components/P5Component.vue';

export default defineComponent({
  name: 'EditorView',
  components: {
    HelloWorld,
    P5Component,
  },
  // URI Hash seems safe (in Chrome) to at least 50 million characters. Warn for IE + Edge at 2,025 (https://stackoverflow.com/questions/16247162/max-size-of-location-hash-in-browser)
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.p5Canvas {
  box-shadow: 5px 7px 6px -3px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 5px 7px 6px -3px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 5px 7px 6px -3px rgba(0, 0, 0, 0.75);
}
</style>
