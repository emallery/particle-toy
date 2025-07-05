<template>
  <div v-if="oopsie">
    <p>Oops!</p>
  </div>
  <P5Component @keyup.enter="console.log('AAAAAAAAAAA')" :spawners="spawners" :settings="settings" />
</template>

<script setup lang="ts">
import P5Component from '@/components/P5Component.vue';
import type { Drawable } from '@/ts/Drawable';
import { getDrops, respawnDrop } from '@/ts/particle/Drops';
import { getLeaves, respawnLeaf } from '@/ts/particle/Leaves';
import { ParticleSpawner } from '@/ts/ParticleSpawner';
import { Settings, SpawnerSettings, WindowSettings } from '@/ts/Settings';
import { TwitchGenerator } from '@/ts/TwitchGenerator';
import p5 from 'p5';
import { ref } from 'vue';

const oopsie = ref(false);
const settings = new Settings(false, new WindowSettings(512, 512, 60), new SpawnerSettings());

// URI Hash seems safe (in Chrome) to at least 50 million characters. Warn for IE + Edge at 2,025 (https://stackoverflow.com/questions/16247162/max-size-of-location-hash-in-browser)
// console.log(`Hash is: ${window.location.hash}`);

const spawners = new Array<Drawable>();

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
  let channel = window.location.hash.match(/channel=%22(.*?)%22/);
  if (channel) {
    settings.windowSettings.width = 1920;
    settings.windowSettings.height = 1080;
    let twitch = new TwitchGenerator(settings, channel[1]);
    spawners.push(twitch);
  }
  else {
    oopsie.value = true;
  }
}

</script>