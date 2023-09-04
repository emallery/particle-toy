<template>
  <P5Component/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5Component from '@/components/P5Component.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    P5Component,
  },
  // URI Hash seems safe (in Chrome) to at least 50 million characters. Warn for IE + Edge at 2,025 (https://stackoverflow.com/questions/16247162/max-size-of-location-hash-in-browser)
});
</script>
