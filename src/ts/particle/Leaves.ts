import { LeafParticleBehaviour } from "../behaviour/Leaf";
import { PhysicsState } from "./PhysicsState";
import { PhysParticle } from "./PhysParticle";
import type { Settings } from "../Settings";
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

            const state = new PhysicsState(new p5.Vector(Infinity, 0), new p5.Vector(0, 0), new p5.Vector(10, 0));
            particles.push(new PhysParticle(state, scale, [r, g, b], leaf, settings));
        }
        else {
            // Maple
            const scale = 0.3 + (Math.random() * 0.2);
            const r = 240 - (Math.random() * 80);
            const g = 90 - (Math.random() * 20);
            const b = 10 - (Math.random() * 10);

            const state = new PhysicsState(new p5.Vector(Infinity, 0), new p5.Vector(0, 0), new p5.Vector(10, 0));
            particles.push(new PhysParticle(state, scale, [r, g, b], maple, settings));
        }
    }

    return particles;
}

export function respawnLeaf(s: PhysParticle, position: p5.Vector, frameRate: number) {
    s.physicsState = LeafParticleBehaviour.spawn(frameRate, position);
}
