<template>
  <div id="sketch-holder" class="p5Canvas" />
</template>

<script setup lang="ts">
import { type PropType, onMounted, watch, isReactive } from 'vue';
import p5 from 'p5';
import { ParticleSpawner } from '@/ts/ParticleSpawner';
import { Settings } from '@/ts/Settings';

const props = defineProps({
  // TODO: Update to Drawables
  spawners: Array as PropType<Array<ParticleSpawner>>,
  // TODO: Use parameterized instance?
  p5Sketch: Function as PropType<(s: p5) => void>,
  settings: {
    type: Settings,
    required: true,
  },
});

let p: p5;

if (isReactive(props.settings.windowSettings)) {
  watch(props.settings.windowSettings, newSettings => {
    if (p) {
      if (newSettings.width == 0 || newSettings.height == 0) {
        // resize to parent size
        // this is janky and needs work
        let canvasDiv = document.getElementById("sketch-holder") as HTMLElement;
        let w = canvasDiv.offsetWidth;
        let h = canvasDiv.offsetHeight;
        p.resizeCanvas(w ? w : 100, h ? h : 100);
        props.settings.windowSettings.width = w;
        props.settings.windowSettings.height = w;
      }
      else {
        p.resizeCanvas(newSettings.width, newSettings.height);
      }
    }
  });
}

onMounted(() => {
  const holder = document.getElementById("sketch-holder");

  p = new p5((s: p5) => {

    let myFont: p5.Font;

    s.preload = () => {
      myFont = s.loadFont(new URL("@/assets/JetBrainsMono-Regular.ttf", import.meta.url).href);
    };

    s.setup = () => {
      s.createCanvas(props.spawners?.[0]?.settings.windowSettings.width as number, props.spawners?.[0]?.settings.windowSettings.height as number, s.WEBGL);
      s.setAttributes('perPixelLighting', false); // fix issues with tint() on WEBGL canvas
      s.frameRate(60);
      s.textFont(myFont);
    };

    // Put lots of frame rate readings into a buffer so we can average over many frames
    let frameRateBuffer: number[] = new Array(30).fill(0);
    let displayFrameRate = 0;

    s.draw = () => {
      s.clear(0, 0, 0, 0);

      props.spawners?.forEach(spawner => {
        spawner.update(s);
        spawner.draw(s);
      });

      frameRateBuffer.unshift(s.frameRate());
      frameRateBuffer.pop();

      if (props.spawners?.[0]?.settings.debug) {
        // Only update frame rate to show every couple of frames
        if (s.frameCount % 4 == 0) {
          displayFrameRate = frameRateBuffer.reduce((a, b) => a + b) / frameRateBuffer.length;
        }

        s.textSize(10);
        s.fill(0);
        s.stroke(255);
        s.strokeWeight(2);
        s.text(`FPS: ${displayFrameRate.toFixed(3)}`, -240, -240);
      }
    };
  }, holder as HTMLElement);
});
</script>
