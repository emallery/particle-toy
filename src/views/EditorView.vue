<template>
  <div class="home">
    <h1>Pretend this is the editor.</h1>
    <P5Component :spawners="spawners" />
    <label>Debug? <input type="checkbox" v-model="debugBox"></label>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>
  
<script setup lang="ts">
import { ref, watch } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import P5Component from '@/components/P5Component.vue';
import { Settings } from '@/ts/PhysParticle';
import { ParticleSpawner } from '@/ts/ParticleSpawner';
import p5 from 'p5';
import { getLeaves, respawnLeaf } from '@/ts/Leaves';

const debugBox = ref(false);

let settings = new Settings(debugBox.value, 512, 512);

watch(debugBox, newValue => {
  settings.debug = newValue;
});

const newSpawner = new ParticleSpawner(settings, new p5.Vector((settings.canvasX / 2), -(settings.canvasY / 2)), getLeaves(settings), respawnLeaf);

const spawners = [newSpawner];

// URI Hash seems safe (in Chrome) to at least 50 million characters. Warn for IE + Edge at 2,025 (https://stackoverflow.com/questions/16247162/max-size-of-location-hash-in-browser)
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

/* p5Canvas */
div.p5Canvas canvas {
  box-shadow: 5px 7px 6px -3px rgba(0, 0, 0, 0.75);
  border: 3px black solid;
  border-radius: 2%;
  margin: 10px;
  -webkit-box-shadow: 5px 7px 6px -3px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 5px 7px 6px -3px rgba(0, 0, 0, 0.75);
}
</style>
