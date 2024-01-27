<template>
  <div v-if="oopsie">
    <p>Oops!</p>
  </div>
  <P5Component :spawners="spawners" :settings="settings" />
</template>

<script setup lang="ts">
import P5Component from '@/components/P5Component.vue';
import { getDrops, respawnDrop } from '@/ts/Drops';
import { getLeaves, respawnLeaf } from '@/ts/Leaves';
import { ParticleSpawner } from '@/ts/ParticleSpawner';
import { Settings, WindowSettings } from '@/ts/Settings';
import p5 from 'p5';
import { ref } from 'vue';

const oopsie = ref(false);
const settings = new Settings(false, new WindowSettings(512, 512));

// URI Hash seems safe (in Chrome) to at least 50 million characters. Warn for IE + Edge at 2,025 (https://stackoverflow.com/questions/16247162/max-size-of-location-hash-in-browser)
// console.log(`Hash is: ${window.location.hash}`);

const spawners = new Array<ParticleSpawner>();

onhashchange = () => {
  location.reload();
};

// TODO: Look into ways of storing the spawner information in the hash, so I don't have to store user data
if (window.location.hash === "#leaves") {
  spawners.push(new ParticleSpawner(settings, new p5.Vector((settings.windowSettings.width / 2), -(settings.windowSettings.height / 2)), getLeaves(settings), respawnLeaf));
}
else if (window.location.hash === "#drops") {
  spawners.push(new ParticleSpawner(settings, new p5.Vector((settings.windowSettings.width / 2), -(settings.windowSettings.height / 2)), getDrops(settings), respawnDrop));
}
else {
  oopsie.value = true;
}

</script>
  