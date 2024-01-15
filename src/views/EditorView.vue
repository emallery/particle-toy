<template>
  <title>CSS Template</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <header>
    <div class="flex-container">
      <label>Your Magic Link:<input readonly :value="magicLink"></label>
      <button>Copy!</button>

      <label>
        Preset:
        <select v-model="selectedPreset">
          <option>Leaves</option>
          <option>Drops</option>
        </select>
      </label>
    </div>
  </header>

  <div class="home">
    <h1>Pretend this is the editor.</h1>
    <P5Component :spawners="spawners" />

    <label>
      Preset:
      <select v-model="selectedPreset">
        <option>Leaves</option>
        <option>Drops</option>
      </select>
    </label>
    <br>

    <label>Debug? <input type="checkbox" v-model="debugBox"></label>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>
  
<script setup lang="ts">
import { ref, watch, defineModel } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import P5Component from '@/components/P5Component.vue';
import { Settings } from '@/ts/PhysParticle';
import { ParticleSpawner } from '@/ts/ParticleSpawner';
import p5 from 'p5';
import { getLeaves, respawnLeaf } from '@/ts/Leaves';
import { getDrops, respawnDrop } from '@/ts/Drops';

const debugBox = ref(false);
const selectedPreset = defineModel({ default: "Leaves" });
const magicLink = ref(`${window.location.origin}/view#leaves`)

let settings = new Settings(debugBox.value, 512, 512);
const spawners = new Array<ParticleSpawner>();

// Gaurantee that a spawner always exists
spawners[0] = new ParticleSpawner(settings, new p5.Vector((settings.canvasX / 2), -(settings.canvasY / 2)), getLeaves(settings), respawnLeaf);

watch(debugBox, newValue => {
  settings.debug = newValue;
});

watch(selectedPreset, newValue => {
  // FIXME: Use an enum for the v-model and this
  if (newValue === "Leaves") {
    const newSpawner = new ParticleSpawner(settings, new p5.Vector((settings.canvasX / 2), -(settings.canvasY / 2)), getLeaves(settings), respawnLeaf);
    spawners[0] = newSpawner;
  }
  else if (newValue === "Drops") {
    const newSpawner = new ParticleSpawner(settings, new p5.Vector((settings.canvasX / 2), -(settings.canvasY / 2)), getDrops(settings), respawnDrop);
    spawners[0] = newSpawner;
  }
});
</script>

<style>
.flex-container {
  display: flex;
  background-color: darkgreen;
}

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
