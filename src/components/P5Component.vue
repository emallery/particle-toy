<template>
  <div id="sketch-holder" class="p5Canvas" />
  <div id="sketch-holder1" class="p5Canvas" />
  <label>Debug? <input type="checkbox" v-model="debugBox"></label>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import p5 from 'p5';
import { old } from '../ts/old';
import { Settings } from '@/ts/PhysParticle';
import { ParticleSpawner } from '@/ts/ParticleSpawner';

export default defineComponent({
  name: "P5Component",
  // props: {
    
  // },
  setup() {
    const debugBox = ref(false);
    let settings = new Settings(debugBox.value, 512, 512);

    watch(debugBox, newValue => {
      settings.debug = newValue;
    });

    onMounted(() => {
      const holder = document.getElementById("sketch-holder") as HTMLElement;
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
          sketch.clear(0, 0, 0, 0);
          // sketch.rect(myp5.mouseX, myp5.mouseY, 50, 50);
          spawner.update();
          spawner.draw();
        };
      };

      let myp5 = new p5(s, holder);
      let w = 512;
      let h = 512;
      spawner = new old.ParticleSpawner((w / 2), -(h / 2), 20, Infinity, myp5);


      // Create a new system
      const holder1 = document.getElementById("sketch-holder1");

      let anotherP5 = new p5((s: p5) => {
        
        let myFont: p5.Font;
        let maple: p5.Image;
        let leaf: p5.Image;

        let newSpawner: ParticleSpawner;

        s.preload = () => {
          // myFont = s.loadFont("https://fonts.googleapis.com/css2?family=Inconsolata&display=swap");
          // eslint-disable-next-line
          // https://www.google.com/search?q=vue+router+return+file+in+assets+folder
          // eslint-disable-next-line
          myFont = s.loadFont(require("@/assets/JetBrainsMono-Regular.ttf"));
          // eslint-disable-next-line
          maple = s.loadImage(require("@/assets/maple.png"));
          // eslint-disable-next-line
          leaf = s.loadImage(require("@/assets/leaf.png"));
        };

        s.setup = () => {
          s.createCanvas(settings.canvasX, settings.canvasY, s.WEBGL);
          s.frameRate(60);
          s.angleMode(s.RADIANS);
          s.setAttributes('perPixelLighting', false); // fix issues with tint() on WEBGL canvas
          s.background(0, 0, 0, 0);
          s.textFont(myFont);

          newSpawner = new ParticleSpawner(settings, s, new p5.Vector((settings.canvasX / 2), -(settings.canvasY / 2)), [leaf, maple]);
        };

        // Put lots of frame rate readings into a buffer so we can average over many frames
        let frameRateBuffer: number[] = new Array(30).fill(0);
        let displayFrameRate = 0;

        s.draw = () => {
          s.clear(0, 0, 0, 0);

          frameRateBuffer.unshift(s.frameRate());
          frameRateBuffer.pop();

          newSpawner.update();
          newSpawner.draw();

          if (settings.debug) {
            // Only update frame rate to show every couple of frames
            if (s.frameCount % 4 == 0) {
              displayFrameRate = frameRateBuffer.reduce((a, b) => a + b) / frameRateBuffer.length;
            }

            s.textSize(10);
            s.fill(0);
            s.text(`FPS: ${displayFrameRate.toFixed(3)}`, -240, -240);
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
