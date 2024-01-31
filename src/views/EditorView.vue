<template>
  <!-- <title>CSS Template</title> -->
  <meta charset="utf-8">
  <!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
  <div class="app-container">

    <header>
      <div class="flex-container">
        <label>Your Magic Link:<input readonly :value="magicLink"></label>
        <button @click="magicLink = encodeURIComponent(toString(settings))">Copy!</button>
        <button @click="applyButton()">Apply!</button>
        <button @click="reset()">Reset!</button>

        <label>
          Preset:
          <select v-model="selectedPreset">
            <option>Leaves</option>
            <option>Drops</option>
          </select>
        </label>
      </div>
    </header>

    <div class="main-container">
      <div class="particle-editor">

        <!-- Sidebar Menu -->
        <div class="sidebar">
          <ul>
            <li v-for="section in Object.values(SectionEnum)" :key="section" @click="changeSection(section)">
              {{ section }}
            </li>
          </ul>
        </div>

        <!-- Main Content Area -->
        <div class="main-content">

          <div>
            <h1>Pretend this is the editor.</h1>

            <label>
              Preset:
              <select v-model="selectedPreset">
                <option>Leaves</option>
                <option>Drops</option>
              </select>
            </label>
            <br>

            <label>Debug? <input type="checkbox" v-model="settings.debug"></label>
            <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" /> -->
          </div>


          <h2>{{ currentSection }}</h2>

          <!-- Additional content based on the selected section -->
          <div v-if="currentSection === SectionEnum.Window">
            <WindowPanel :settings="settings" />
          </div>
          <div v-else>
            <h2>Not implemented!</h2>
          </div>

          <P5Component :spawners="spawners" :settings="settings" />

        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref, watch, defineModel, reactive } from 'vue';
import P5Component from '@/components/P5Component.vue'; // @ is an alias to /src
import WindowPanel from '@/components/WindowPanel.vue';
import { Settings, WindowSettings, applyFromString, toString } from '@/ts/Settings';
import { ParticleSpawner } from '@/ts/ParticleSpawner';
import p5 from 'p5';
import { getLeaves, respawnLeaf } from '@/ts/Leaves';
import { getDrops, respawnDrop } from '@/ts/Drops';

enum SectionEnum {
  Window = "Window Settings",
  Image = "Manage Particles",
  Save = "Save/Load",
  Preset = "Manage Presets",
  OBS = "Add to OBS",
  Help = "Help!",
}

const selectedPreset = defineModel({ default: "Leaves" });
const magicLink = ref(`${window.location.origin}/view#leaves`)

const currentSection = ref(SectionEnum.Window);

function changeSection(section: SectionEnum): void {
  currentSection.value = section;
}

const settings = reactive(new Settings(false, new WindowSettings(512, 512)));
const spawners = new Array<ParticleSpawner>();

function applyButton() {
  window.location.hash = magicLink.value;
  window.location.reload();
}

try {
  let settingsData = window.location.hash.substring(1);
  settingsData = decodeURIComponent(settingsData);
  applyFromString(settings, settingsData);
}
catch (err) {
  // console.log(err);
}

function reset() {
  window.location.hash = "";
  window.location.reload();
}

// Gaurantee that a spawner always exists
spawners[0] = new ParticleSpawner(settings, new p5.Vector((settings.windowSettings.width / 2), -(settings.windowSettings.height / 2)), getLeaves(settings), respawnLeaf);


watch(selectedPreset, newValue => {
  // FIXME: Use an enum for the v-model and this
  if (newValue === "Leaves") {
    const newSpawner = new ParticleSpawner(settings, new p5.Vector((settings.windowSettings.width / 2), -(settings.windowSettings.height / 2)), getLeaves(settings), respawnLeaf);
    spawners[0] = newSpawner;
  }
  else if (newValue === "Drops") {
    const newSpawner = new ParticleSpawner(settings, new p5.Vector((settings.windowSettings.width / 2), -(settings.windowSettings.height / 2)), getDrops(settings), respawnDrop);
    spawners[0] = newSpawner;
  }
});
</script>

<style>
body {
  /* Use a colored background for the editor */
  background: var(--color-background);
}

.app-container {
  /* max-width: 1280px; */
  margin: 0 auto;
  /* padding: 2rem; */
  font-weight: normal;
  height: 100vh;
}

header {
  text-align: center;
  /* margin-bottom: 20px; */
}

.main-container {
  display: flex;
  flex-direction: column;
}

.flex-container {
  display: flex;
  background-color: darkgreen;
}

.particle-editor {
  display: flex;
  flex-grow: 1;
  /* height: calc(100vh - 240px); */
}

.sidebar {
  width: 150px;
  background-color: #f0f0f0;
  padding: 20px;

}

.main-content {
  flex-grow: 1;
  padding: 20px;
}

#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
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

.sidebar ul {
  list-style-type: none;
  padding: 0;
  cursor: pointer;
}

.sidebar li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s;
  border-radius: 7px;
}

@media (hover: hover) {
  .sidebar li:hover {
    background-color: #e6e6e6;
  }
}
</style>
