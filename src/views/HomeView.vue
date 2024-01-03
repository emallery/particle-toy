<template>
  <P5Component :spawners="spawners" />
</template>

<script setup lang="ts">
import P5Component from '@/components/P5Component.vue';
import { getLeaves, respawnLeaf } from '@/ts/Leaves';
import { ParticleSpawner } from '@/ts/ParticleSpawner';
import { Settings } from '@/ts/PhysParticle';
import p5 from 'p5';

const settings = new Settings(false, 512, 512);

const spawners = [new ParticleSpawner(settings, new p5.Vector((settings.canvasX / 2), -(settings.canvasY / 2)), getLeaves(settings), respawnLeaf)];
</script>
