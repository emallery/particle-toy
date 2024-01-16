<template>
  <div id="sketch-holder" class="p5Canvas" />
</template>

<script setup lang="ts">
import { type PropType, defineProps, onMounted } from 'vue';
import p5 from 'p5';
import { ParticleSpawner } from '@/ts/ParticleSpawner';

const props = defineProps({
  // TODO: Update to Drawables
  spawners: Array as PropType<Array<ParticleSpawner>>,
  // TODO: Use parameterized instance?
  p5Sketch: Function as PropType<(s: p5) => void>,
});

onMounted(() => {
  const holder = document.getElementById("sketch-holder");

  new p5((s: p5) => {
    
    let myFont: p5.Font;

    s.preload = () => {
      myFont = s.loadFont(new URL("@/assets/JetBrainsMono-Regular.ttf", import.meta.url).href);
    };

    s.setup = () => {
      s.createCanvas(props.spawners?.[0]?.settings.canvasX as number, props.spawners?.[0]?.settings.canvasY as number, s.WEBGL);
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
