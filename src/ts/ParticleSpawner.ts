import p5 from "p5";
import type { PhysParticle } from "./particle/PhysParticle";
import type { Settings, UsesSettings } from "./Settings";
import type { Drawable } from "./Drawable";

export class ParticleSpawner implements UsesSettings, Drawable {
    readonly settings: Settings;
    readonly position: p5.Vector;

    readonly particles: PhysParticle[] = [];
    readonly respawn: (s: PhysParticle, position: p5.Vector, frameRate: number) => void;

    constructor(settings: Settings, position: p5.Vector, particles: Array<PhysParticle>, respawn: (s: PhysParticle, position: p5.Vector, frameRate: number) => void) {
        this.settings = settings;
        this.position = position;
        this.particles = particles;
        this.respawn = respawn;
    }

    update(p: p5, deltaTime: number) {
        const frameRate = p.frameRate();

        for (const particle of this.particles) {
            const state = particle.physicsState;
            if (state.position.x > 1000 || state.position.x < -1000 || state.position.y > 1000 || state.position.y < -1000) {
                this.respawn(particle, this.position, frameRate);
            }

            particle.update(p, deltaTime);
        }
    }

    draw(p: p5, deltaTime: number) {
        p.angleMode(p.RADIANS);
        this.particles.forEach(particle => particle.draw(p, deltaTime));
    }
}
