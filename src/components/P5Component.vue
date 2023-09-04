<template>
  <div id="sketch-holder" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import p5 from 'p5';

export default defineComponent({
  name: "P5Component",
  setup() {
    onMounted(() => {
      const holder = document.getElementById("sketch-holder");

      const s = (sketch: p5) => {
        sketch.setup = () => {
          sketch.createCanvas(200, 200);
          sketch.rectMode("center");
          sketch.frameRate(60);
        };

        sketch.draw = () => {
          sketch.background(255, 0, 255);
          sketch.fill(255);
          sketch.rect(myp5.mouseX, myp5.mouseY, 50, 50);

        };
      };

      let myp5 = new p5(s, holder as HTMLElement);
    });
  }
});
</script>
