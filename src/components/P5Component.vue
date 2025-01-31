<template>
  <div id="sketch-holder" class="p5Canvas noselect" />
</template>

<script setup lang="ts">
import { type PropType, onMounted, watch, isReactive } from 'vue';
import p5 from 'p5';
import { Settings } from '@/ts/Settings';
import type { Drawable } from '@/ts/Drawable';
import { ParticleSpawner } from '@/ts/ParticleSpawner';

const props = defineProps({
  spawners: Array as PropType<Array<Drawable>>,
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

if (isReactive(props.settings.spawnerSettings)) {
  watch(props.settings.spawnerSettings.imagePool, newPool => {
    if (props.spawners?.[0] && props.spawners?.[0] instanceof ParticleSpawner) {
      // FIXME: Use callbacks
      let newImages = newPool.map(s => p.loadImage(s));

      for (let particle of props.spawners[0].particles) {
        particle.image = p.random(newImages);
      }
    }
  });

  // Pass target frame rate updates to P5 component using lambda getter function
  watch(() => props.settings.windowSettings.frameRate, newFrameRate => {
    if (p) {
      p.frameRate(newFrameRate);
    }
  });
}

// Initialize the P5 instance in onMounted() because the sketch-holder element might not exist during setup.
onMounted(() => {
  const holder = document.getElementById("sketch-holder");

  p = new p5((s: p5) => {

    let myFont: p5.Font;

    s.preload = () => {
      myFont = s.loadFont(new URL("@/assets/JetBrainsMono-Regular.ttf", import.meta.url).href);
    };

    s.setup = () => {
      s.createCanvas(props.settings.windowSettings.width as number, props.settings.windowSettings.height as number, s.WEBGL);
      s.setAttributes('perPixelLighting', false); // fix issues with tint() on WEBGL canvas
      s.frameRate(60);
      s.textFont(myFont);
    };

    // Put lots of frame rate readings into a buffer so we can average over many frames
    let frameRateBuffer: number[] = new Array(30).fill(0);
    let displayFrameRate = 0;

    s.draw = () => {
      s.clear(0, 0, 0, 0);
      const frameTime = 1 / s.frameRate();

      props.spawners?.forEach(spawner => {
        spawner.update(s, frameTime);
        spawner.draw(s, frameTime);
      });

      frameRateBuffer.unshift(s.frameRate());
      frameRateBuffer.pop();

      if (props.settings.debug) {
        // Only update frame rate to show every couple of frames
        if (s.frameCount % 4 == 0) {
          displayFrameRate = frameRateBuffer.reduce((a, b) => a + b) / frameRateBuffer.length;
        }

        // Write FPS
        s.textSize(10);
        s.fill(0);
        s.stroke(255);
        s.strokeWeight(2);
        s.textAlign(s.LEFT, s.TOP);
        s.text(`FPS: ${displayFrameRate.toFixed(3)}`, s.width / -2 + 6, s.height / -2 + 6);

        // Write Frame Time for current frame
        s.text(`Frame Time: ${frameTime.toFixed(4)}`, s.width / -2 + 6, s.height / -2 + 18);

        // Write mouse position
        s.textAlign(s.RIGHT, s.TOP);
        s.text(`mouseX: ${s.mouseX.toFixed(3)}\nmouseY: ${s.mouseY.toFixed(3)}\nX: ${(s.mouseX - s.width / 2).toFixed(3)}\nY: ${(s.mouseY - s.height / 2).toFixed(3)}`, s.width / 2 - 6, s.height / -2 + 6);
      }
    };
  }, holder as HTMLElement);  
});
</script>

<style>
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
</style>