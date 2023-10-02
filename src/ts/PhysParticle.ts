import p5 from 'p5';

export interface Sprite {
  update(): void;
  draw(p5Instance: p5): void;
}

export interface UsesSettings {
  readonly settings: Settings;
}

export class Settings {
  debug = false;
  canvasX = 512;
  canvasY = 512;

  constructor(debug: boolean, canvasX: number, canvasY: number) {
    this.debug = debug;
    this.canvasX = canvasX;
    this.canvasY = canvasY;
  }
}

export class PhysParticle implements Sprite, UsesSettings {
  position: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  angle: number;
  angularVelocity: number;
  angularAcceleration: number;
  damping: number;
  scale: number;
  tint: number[];
  readonly image: p5.Image;
  readonly settings: Settings;

  constructor(position: p5.Vector, velocity: p5.Vector, acceleration: p5.Vector, angle: number, va: number, aa: number, damping: number, scale: number, tint: number[], image: p5.Image, settings: Settings) {
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.angle = angle;
    this.angularVelocity = va;
    this.angularAcceleration = aa;
    this.damping = damping;
    this.scale = scale;
    this.tint = tint;
    this.image = image;
    this.settings = settings;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);

    // Apply damping force to slow movement in the sprite's current direction
    // this.velocity.mult(this.damping);
    this.velocity.x *= this.damping;

    this.angularVelocity += this.angularAcceleration;
    this.angle += this.angularVelocity;
  }

  draw(p: p5) {
    // Setup for image and rectangle drawing
    p.imageMode(p.CENTER);
    p.rectMode(p.CENTER);

    // calculate alpha
    const distance = Math.pow(p.sq(this.position.x) + p.sq(this.position.y), 1 / 2);
    const distanceMapped = distance / (this.settings.canvasX / 2) * 1.5; // Map [-1.5, 1.5] to the edges of the canvas
    const alphaValue = 255 / (1 + Math.pow(distanceMapped, 8)); // https://www.desmos.com/calculator/nh9k6jruzc

    p.tint(this.tint[0], this.tint[1], this.tint[2], alphaValue);
    //tint(255, alphaValue); // Uncomment to disable color tint

    // Transform the canvas appropriately
    p.push();

    p.translate(this.position.x, this.position.y);
    p.rotate(this.angle);
    p.scale(this.scale);

    // Draw the image at the (now transformed) origin
    p.image(this.image, 0, 0);

    p.pop();

    // Finally, draw debug lines
    if (this.settings.debug) {
      p.stroke(6);
      p.line(0, 0, this.position.x, this.position.y);
    }
  }

  reset(position: p5.Vector, p: p5) {
    // TODO: This is the reset function specifically for leaves.... make it parameterized?

    this.position.set(position);
    this.velocity.set(0, 0);
    this.acceleration.set(0, 0);

    const v = 1 / p.frameRate(); // factor for velocity
    const a = (v * v);         // factor for acceleration

    this.position.x += (Math.random() * 40) - 20;
    this.position.y += (Math.random() * 250) - 200;

    this.velocity.x = (-200 + (Math.random() * 150)) * v;
    this.velocity.y = ((Math.random() * 50) - 25) * v;

    this.damping = 1 - (Math.random() * 30) * a; //(Math.random() * 20) * a;

    this.acceleration.y += 30 * a; // gravity

    this.angle = 0;
    this.angularVelocity = ((Math.random() * 0.02) - 0.01) * 60 * v;
  }
}