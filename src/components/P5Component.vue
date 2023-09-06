<template>
  <div id="sketch-holder" class="p5Canvas" />
  <div id="sketch-holder1" class="p5Canvas" />
  <label>Debug? <input type="checkbox" v-model="debugBox"></label>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import p5 from 'p5';
import { old } from '../ts/old';
import { PhysParticle, Settings } from '@/ts/PhysParticle';

export default defineComponent({
  name: "P5Component",
  setup() {
    const debugBox = ref(false);
    let settings = new Settings(debugBox.value, 512, 512);

    watch(debugBox, (nV, _oV) => {
      settings.debug = nV;
      console.log(nV);
    });

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


      // Create a new system
      const holder1 = document.getElementById("sketch-holder1");

      let anotherP5 = new p5((s: p5) => {

        let particle = new PhysParticle(new p5.Vector(0, 0), new p5.Vector(0, -30), new p5.Vector(0, 2.0), 0, 0, 0, 1.0, 1.0, s.color(255, 255, 255), s.loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEABAMAAACuXLVVAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9Ti1IqDmYQdchQnSyIiugmVSyChdJWaNXB5NIvaNKQtLg4Cq4FBz8Wqw4uzro6uAqC4AeIo5OToouU+L+k0CLGg+N+vLv3uHsHCI0y06yucUDTq2YyFpUy2VWp+xVBDEHELAIys4x4ajENz/F1Dx9f7yI8y/vcn6NXzVkM8EnEc8wwq8QbxNObVYPzPrHIirJKfE48ZtIFiR+5rrj8xrngsMAzRTOdnCcWiaVCBysdzIqmRjxFHFY1nfKFjMsq5y3OWrnGWvfkLwzl9JUU12kOI4YlxJGABAU1lFBGFRFadVIsJGk/6uEfdPwJcinkKoGRYwEVaJAdP/gf/O7Wyk9OuEmhKBB4se2PEaB7F2jWbfv72LabJ4D/GbjS2/5KA5j5JL3e1sJHQN82cHHd1pQ94HIHGHgyZFN2JD9NIZ8H3s/om7JA/y0QXHN7a+3j9AFIU1fLN8DBITBaoOx1j3f3dPb275lWfz+5DXLDI162swAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+YKGxUBCbtLcn4AAAAPUExURQAAAM4AAM4xAP9jAP////UR5/kAAAABdFJOUwBA5thmAAAAAWJLR0QEj2jZUQAAAOBJREFUeNrt3LEJgDAQQNGs4AbqBKIj6P4zWZkIWgiSU/T9MkXulYGQpCRJd5q2BgAAAAAAAAAAgKcBuwAAAAAAAAAAAAAeB4RSAAAAAAAAAAAA3gMY+1wB5KUWAAAAAAAAAACgPmB3ed0fAwAAAAAAAAAAAIgFnFAAAAAAAAAAAAB+CwgIAAAAAAAAAAAAAAAAAAAAAAAAIAAwXQsAAAAAAAAAAOBzgLLzsjWfza12PQ0AAAAAAAAAAHDxJAgAAAAAAAAAAAAQ8d1NHtE1ufKiOdUPAAAAAAAAAAAAQFL1ViXFxlqWbFFAAAAAAElFTkSuQmCC"), settings);
        let myFont;

        s.preload = () => {
          // myFont = s.loadFont("https://fonts.googleapis.com/css2?family=Inconsolata&display=swap");
          // eslint-disable-next-line
          // https://www.google.com/search?q=vue+router+return+file+in+assets+folder
          // eslint-disable-next-line
          myFont = s.loadFont(require("@/assets/JetBrainsMono-Regular.ttf"));
        };

        s.setup = () => {
          s.createCanvas(settings.canvasX, settings.canvasY, s.WEBGL);
          s.frameRate(60);
          s.angleMode(s.RADIANS);
          s.setAttributes('perPixelLighting', false); // fix issues with tint() on WEBGL canvas
          s.background(0, 0, 0, 0);
          s.textFont(myFont);
        };

        s.draw = () => {
          s.clear(0, 0, 0, 0);

          particle.update();
          particle.draw(s);

          if (particle.position.y > settings.canvasY / 1.5)
          {
            particle.position.set(0, 0);
            let randX = s.random(-20, 20);
            let randY = s.random(-30, -10);
            particle.velocity.set(randX, randY);
          }
        };
      }, holder1 as HTMLElement);

    });

    return {
      debugBox
    }
  }
});
</script>
