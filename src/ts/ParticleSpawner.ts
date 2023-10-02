import p5 from "p5";
import { PhysParticle, Settings, UsesSettings } from "./PhysParticle";

export class ParticleSpawner implements UsesSettings {
    readonly settings: Settings;
    readonly position: p5.Vector;

    readonly particles: PhysParticle[] = [];

    constructor(settings: Settings, position: p5.Vector, img: Array<p5.Image>) {
        this.settings = settings;
        this.position = position;
        const numParticles = 20;

        for (let i = 0; i < numParticles; i++) {

            if (Math.random() > 0.5) {
                // Green leaf
                const scale = 0.18 + (Math.random() * 0.1);
                const r = 220 - (Math.random() * 20);
                const g = 220 - (Math.random() * 20);
                const b = 220 - (Math.random() * 20);

                this.particles.push(new PhysParticle(new p5.Vector(Infinity, 0), new p5.Vector(0, 0), new p5.Vector(10, 0), 0, 0, 0, 0, scale, [r, g, b], img[0], this.settings));
            }
            else {
                // Maple
                const scale = 0.3 + (Math.random() * 0.2);
                const r = 240 - (Math.random() * 80);
                const g = 90 - (Math.random() * 20);
                const b = 10 - (Math.random() * 10);

                this.particles.push(new PhysParticle(new p5.Vector(Infinity, 0), new p5.Vector(0, 0), new p5.Vector(10, 0), 0, 0, 0, 0, scale, [r, g, b], img[1], this.settings));
            }
        }
    }

    update(p: p5) {
        for (const particle of this.particles) {
            if (particle.position.x > 1000 || particle.position.x < -1000 || particle.position.y > 1000 || particle.position.y < -1000) {
                particle.reset(this.position, p);
            }

            particle.update();
        }
    }

    draw(p: p5) {
        p.angleMode(p.RADIANS);
        this.particles.forEach(particle => particle.draw(p));
    }
}