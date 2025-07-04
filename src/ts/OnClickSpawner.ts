import p5 from "p5";
import type { Drawable } from "./Drawable";
import type { Settings, UsesSettings } from "./Settings";
import { PhysParticle } from "./PhysParticle";
import { PhysicsState } from "./particle/PhysicsState";

export class OnClickSpawner implements Drawable, UsesSettings {
  readonly particles: PhysParticle[] = []; 
  URLs: Array<string> = [
    "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_f38f6c5e0b68474c98b8be7385c61583/default/light/2.0",
    "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_271f568768fb4617804e29265fcf70ca/default/light/2.0",
    "https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_9e1108c7a86643e581e658bb1edc6263/default/light/2.0",
  ];
  private mousePrev: boolean = false;
  settings: Settings;
  private readonly imageMap: Map<string, p5.Image> = new Map();

  update(p: p5, deltaTime: number): void {
    if (this.mousePrev && !p.mouseIsPressed) {
      // Mouse released
      const url = p.random(this.URLs);
      let image = this.imageMap.get(url);

      if (image === undefined) {
        image = p.loadImage(url);
        this.imageMap.set(url, image);
      }

      const randX = p.random(-6, 6);
      const randY = p.random(-16, -6);

      const state = new PhysicsState(new p5.Vector(p.mouseX - p.width / 2, p.mouseY - p.height / 2), new p5.Vector(randX, randY), new p5.Vector(0, 0.6), 0, randX / 150, 0, 1);
      const newParticle = new PhysParticle(state, 1.5, [255, 255, 255], image, this.settings);
      this.particles.push(newParticle);
    }

    this.mousePrev = p.mouseIsPressed;
    this.particles.forEach(particle => particle.update(p, deltaTime));
  }

  draw(p: p5, deltaTime: number): void {
    this.particles.forEach(particle => particle.draw(p, deltaTime));

    if (this.settings.debug) {
      // Draw circle at mouse cursor
      p.push();
      p.ellipseMode(p.CENTER);
      p.translate(p.mouseX, p.mouseY);
      p.stroke('red');
      p.fill(0, 0, 0, 0);
      p.strokeWeight(2);
      p.circle(p.width / -2, p.height / -2, 10);
      p.pop();
    }
  }

  constructor(settings: Settings) {
    this.settings = settings;
  }
}
