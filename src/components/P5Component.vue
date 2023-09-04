<template>
  <div id="sketch-holder" class="p5Canvas" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import p5 from 'p5';
import { old } from '../ts/old';

export default defineComponent({
  name: "P5Component",
  setup() {
    onMounted(() => {
      const holder = document.getElementById("sketch-holder");
      let spawner;

      const s = (sketch: p5) => {
        sketch.setup = () => {
          sketch.createCanvas(512, 512, sketch.WEBGL);
          sketch.rectMode(sketch.CENTER);
          sketch.frameRate(60);
          sketch.angleMode(sketch.RADIANS);
          sketch.setAttributes('perPixelLighting', false); // fix issues with tint() on WEBGL canvas
          sketch.background(0, 0, 0, 0);
        };

        sketch.draw = () => {
          // sketch.background(255, 0, 255);
          // sketch.fill(255);
          // sketch.rect(myp5.mouseX, myp5.mouseY, 50, 50);
          sketch.clear(0, 0, 0, 0);
          spawner.update();
          spawner.draw();
        };
      };

      let myp5 = new p5(s, holder as HTMLElement);
      let w = 512;
      let h = 512;
      spawner = new old.ParticleSpawner((w / 2), -(h / 2), 20, Infinity, myp5);
    });
  }
});
</script>
