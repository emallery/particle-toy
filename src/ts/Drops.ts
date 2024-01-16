import { PhysParticle, Settings } from "./PhysParticle";
import p5 from 'p5';

export function getDrops(settings: Settings): Array<PhysParticle> {
    let drop: p5.Image = undefined as unknown as p5.Image;

    // TODO: Find a way to load P5 images without an instnce, or rewrite P5Component to use a paramaterized instance
    const dummyP5 = new p5((s: p5) => {
        s.preload = () => {
            drop = s.loadImage(new URL("@/assets/drop.png", import.meta.url).href);
        };
    });
    dummyP5.preload();

    const particles = new Array<PhysParticle>();

    for (let i = 0; i < 60; i++) {
        const scale = 0.33 + (Math.random() * 0.2);

        const r = 220 - (Math.random() * 20);
        const g = 220 - (Math.random() * 20);
        const b = 220 - (Math.random() * 20);

        particles.push(new PhysParticle(new p5.Vector(Infinity, 0), new p5.Vector(0, 0), new p5.Vector(0, 0), 0, 0, 0, 1, scale, [r, g, b], drop, settings));
    }

    return particles;
}

export function respawnDrop(s: PhysParticle, position: p5.Vector, frameRate: number) {
    const v = 1 / frameRate;   // factor for velocity
    const a = (v * v);         // factor for acceleration

    const heck = 512;

    s.position.set(20, (-2 * heck) + (Math.random() * heck / 2));
    s.velocity.set((-80 + (Math.random() * 130)) * v, ((Math.random() * 80) - 60) * v);
    s.acceleration.set(0, 150 * a);
}