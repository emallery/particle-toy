import p5 from "p5";
import { PhysParticle, Settings, UsesSettings } from "./PhysParticle";



export class ParticleSpawner implements UsesSettings {
    readonly settings: Settings;
    readonly p: p5;
    readonly position: p5.Vector;

    readonly particles: PhysParticle[] = [];

    constructor(settings: Settings, p: p5, position: p5.Vector, img: Array<p5.Image>) {
        this.settings = settings;
        this.p = p;
        this.position = position;
        const numParticles = 20;

        let scale;
        let r;
        let g;
        let b;

        for (let i = 0; i < numParticles; i++) {

            switch (p.random([0, 1])) {
                case 0: // Green leaf
                    scale = 0.18 + (p.random() * 0.1);
                    r = 220 - (p.random() * 20);
                    g = 220 - (p.random() * 20);
                    b = 220 - (p.random() * 20);

                    this.particles.push(new PhysParticle(new p5.Vector(Infinity, 0), new p5.Vector(0, 0), new p5.Vector(10, 0), 0, 0, 0, 0, scale, p.color(r, g, b), img[0], this.settings));
                    break;
                case 1: // Maple leaf
                    scale = 0.3 + (p.random() * 0.2);
                    r = 240 - (p.random() * 80);
                    g = 90 - (p.random() * 20);
                    b = 10 - (p.random() * 10);
        
                    this.particles.push(new PhysParticle(new p5.Vector(Infinity, 0), new p5.Vector(0, 0), new p5.Vector(10, 0), 0, 0, 0, 0, scale, p.color(r, g, b), img[1], this.settings));
                    break;
            }

            
        }
    }

    update() {
        for (const particle of this.particles) {
            if (particle.position.x > 1000 || particle.position.x < -1000 || particle.position.y > 1000 || particle.position.y < -1000) {
                particle.reset(this.position, this.p);
            }

            particle.update();
        }
    }

    draw() {
        this.particles.forEach(particle => particle.draw(this.p));
    }
}