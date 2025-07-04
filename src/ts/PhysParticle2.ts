import p5 from 'p5';
import type { Settings, UsesSettings } from './Settings';
import type { Drawable } from './Drawable';
import type { PhysicsState } from './particle/PhysicsState';

export class PhysParticle2 implements Drawable, UsesSettings {
  physicsState: PhysicsState;
  scale: number;
  tint: number[];
  image: p5.Image;
  readonly settings: Settings;

  constructor(physicsState: PhysicsState, scale: number, tint: number[], image: p5.Image, settings: Settings) {
    this.physicsState = physicsState;
    this.scale = scale;
    this.tint = tint;
    this.image = image;
    this.settings = settings;
  }

  update(p: p5, deltaTime: number) {
    const state = this.physicsState;
    state.velocity.add(state.acceleration.x * deltaTime, state.acceleration.y * deltaTime);
    state.position.add(state.velocity.x * deltaTime, state.velocity.y * deltaTime);

    // Apply damping force to slow movement in the sprite's current direction
    const dampingToApply = state.velocity.x * state.damping;
    state.velocity.x -= dampingToApply * deltaTime; // TODO: Talk to Tyler again about modeling damping as a friction force / acceleration when it's not 3am and im a litlle less eeepy

    state.angularVelocity += state.angularAcceleration * deltaTime;
    state.angle += state.angularVelocity * deltaTime;
  }

  draw(p: p5, deltaTime: number) {
    const state = this.physicsState;

    // Setup for image and rectangle drawing
    p.imageMode(p.CENTER);
    p.rectMode(p.CENTER);

    // calculate alpha
    const distance = Math.pow(p.sq(state.position.x) + p.sq(state.position.y), 1 / 2);
    const distanceMapped = distance / (this.settings.windowSettings.width / 2) * 1.5; // Map [-1.5, 1.5] to the edges of the canvas
    const alphaValue = 255 / (1 + Math.pow(distanceMapped, 8)); // https://www.desmos.com/calculator/nh9k6jruzc

    p.tint(this.tint[0], this.tint[1], this.tint[2], alphaValue);
    //tint(255, alphaValue); // Uncomment to disable color tint

    // Transform the canvas appropriately
    p.push();

    p.translate(state.position.x, state.position.y);
    p.rotate(state.angle);
    p.scale(this.scale);

    // Draw the image at the (now transformed) origin
    p.image(this.image, 0, 0);

    p.pop();

    // Finally, draw debug lines
    if (this.settings.debug) {
      p.stroke(6);
      p.line(0, 0, state.position.x, state.position.y);
    }
  }
}
