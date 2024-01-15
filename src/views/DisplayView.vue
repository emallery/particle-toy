<template>
  <P5Component :spawners="spawners" />
</template>

<script setup lang="ts">
import P5Component from '@/components/P5Component.vue';
import { getDrops, respawnDrop } from '@/ts/Drops';
import { getLeaves, respawnLeaf } from '@/ts/Leaves';
import { ParticleSpawner } from '@/ts/ParticleSpawner';
import { Settings } from '@/ts/PhysParticle';
import p5 from 'p5';

const settings = new Settings(false, 512, 512);

// URI Hash seems safe (in Chrome) to at least 50 million characters. Warn for IE + Edge at 2,025 (https://stackoverflow.com/questions/16247162/max-size-of-location-hash-in-browser)
// console.log(`Hash is: ${window.location.hash}`);

const spawners = new Array<ParticleSpawner>();

// TODO: Look into ways of storing the spawner information in the hash, so I don't have to store user data
if (window.location.hash === "#leaves") {
  spawners.push(new ParticleSpawner(settings, new p5.Vector((settings.canvasX / 2), -(settings.canvasY / 2)), getLeaves(settings), respawnLeaf));
}
else if (window.location.hash === "#drops") {
  spawners.push(new ParticleSpawner(settings, new p5.Vector((settings.canvasX / 2), -(settings.canvasY / 2)), getDrops(settings), respawnDrop));
}
</script>
  