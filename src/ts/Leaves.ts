import { PhysParticle } from "./PhysParticle";
import type { Settings } from "./Settings";
import p5 from 'p5';

export function getLeaves(settings: Settings): Array<PhysParticle> {
    let leaf: p5.Image = undefined as unknown as p5.Image;
    let maple: p5.Image = undefined as unknown as p5.Image;

    // TODO: Find a way to load P5 images without an instnce, or rewrite P5Component to use a paramaterized instance
    const dummyP5 = new p5((s: p5) => {
        s.preload = () => {
            maple = s.loadImage(new URL("@/assets/maple.png", import.meta.url).href);
            leaf = s.loadImage(new URL("@/assets/leaf.png", import.meta.url).href);
        };
    });
    dummyP5.preload();
    dummyP5.remove();

    const particles = new Array<PhysParticle>();

    for (let i = 0; i < 20; i++) {
        if (Math.random() > 0.5) {
            // Green leaf
            const scale = 0.18 + (Math.random() * 0.1);
            const r = 220 - (Math.random() * 20);
            const g = 220 - (Math.random() * 20);
            const b = 220 - (Math.random() * 20);

            particles.push(new PhysParticle(new p5.Vector(Infinity, 0), new p5.Vector(0, 0), new p5.Vector(10, 0), 0, 0, 0, 0, scale, [r, g, b], leaf, settings));
        }
        else {
            // Maple
            const scale = 0.3 + (Math.random() * 0.2);
            const r = 240 - (Math.random() * 80);
            const g = 90 - (Math.random() * 20);
            const b = 10 - (Math.random() * 10);

            particles.push(new PhysParticle(new p5.Vector(Infinity, 0), new p5.Vector(0, 0), new p5.Vector(10, 0), 0, 0, 0, 0, scale, [r, g, b], maple, settings));
        }
    }

    return particles;
}

export function respawnLeaf(s: PhysParticle, position: p5.Vector, frameRate: number) {
    s.position.set(position);
    s.velocity.set(0, 0);
    s.acceleration.set(0, 0);

    const v = 1 / frameRate;   // factor for velocity
    const a = (v * v);         // factor for acceleration

    s.position.x += (Math.random() * 40) - 20;
    s.position.y += (Math.random() * 250) - 200;

    s.velocity.x = (-200 + (Math.random() * 150)) * v;
    s.velocity.y = ((Math.random() * 50) - 25) * v;

    s.damping = 1 - (Math.random() * 30) * a; //(Math.random() * 20) * a;

    s.acceleration.y += 30 * a; // gravity

    s.angle = 0;
    s.angularVelocity = ((Math.random() * 0.02) - 0.01) * 60 * v;
}