<template>
  <P5Component :spawners="spawners" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5Component from '@/components/P5Component.vue';
import { ParticleSpawner } from '@/ts/ParticleSpawner';
import { Settings } from '@/ts/PhysParticle';
import p5 from 'p5';

export default defineComponent({
  name: 'HomeView',
  components: {
    P5Component,
  },
  setup() {

    const settings = new Settings(false, 512, 512);

    let leaf: p5.Image = undefined as unknown as p5.Image;
    let maple: p5.Image = undefined as unknown as p5.Image;

    // TODO: Find a way to load P5 images without an instnce, or rewrite P5Component to use a paramaterized instance
    const dummyP5 = new p5((s: p5) => {
      s.preload = () => {
        // eslint-disable-next-line
        maple = s.loadImage(require("@/assets/maple.png"));
        // eslint-disable-next-line
        leaf = s.loadImage(require("@/assets/leaf.png"));
      };
    });
    dummyP5.preload();

    const spawners = [new ParticleSpawner(settings, new p5.Vector((settings.canvasX / 2), -(settings.canvasY / 2)), [leaf, maple])];

    return {
      spawners
    };
  },
  // URI Hash seems safe (in Chrome) to at least 50 million characters. Warn for IE + Edge at 2,025 (https://stackoverflow.com/questions/16247162/max-size-of-location-hash-in-browser)
});
</script>
