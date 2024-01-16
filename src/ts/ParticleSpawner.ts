import p5 from "p5";
import type { PhysParticle, Settings, UsesSettings } from "./PhysParticle";

export class ParticleSpawner implements UsesSettings {
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

    update(p: p5) {
        const frameRate = p.frameRate();

        for (const particle of this.particles) {
            if (particle.position.x > 1000 || particle.position.x < -1000 || particle.position.y > 1000 || particle.position.y < -1000) {
                this.respawn(particle, this.position, frameRate);
            }

            particle.update();
        }
    }

    draw(p: p5) {
        p.angleMode(p.RADIANS);
        this.particles.forEach(particle => particle.draw(p));
    }
}