import p5 from 'p5';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace old {
    const w = 512;
    const h = 512;

    const drawDebugLines = false;

    class PhysParticle {
        position;
        velocity;
        acceleration;
        angle;
        va;
        aa;
        damping;
        scale;
        colorVec;
        image;

        constructor(x, y, vx, vy, ax, ay, angle, va, aa, damping, scale, colorVec, image) {
            // Assign coordinates
            this.position = new p5.Vector(x, y);
            this.velocity = new p5.Vector(vx, vy);
            this.acceleration = new p5.Vector(ax, ay);
            this.angle = angle;
            this.va = va;
            this.aa = aa;
            this.damping = damping;
            this.scale = scale;
            this.colorVec = colorVec;
            this.image = image;
        }

        update() {
            this.velocity.add(this.acceleration);
            this.position.add(this.velocity);

            if (this.velocity.x > 0) {
                this.velocity.x -= this.damping;
            }
            else {
                this.velocity.x += this.damping;
            }

            this.va += this.aa;
            this.angle += this.va;
        }

        draw(p: p5) {
            // Setup for image drawing
            p.imageMode(p.CENTER);
            // noTint();

            const centerX = this.position.x + (this.image.width / 2);
            const centerY = this.position.y + (this.image.height / 2);

            if (drawDebugLines) {
                p.stroke(4);
                p.line(0, 0, centerX, centerY);
            }

            // calculate alpha
            const distance = Math.pow(p.sq(centerX) + p.sq(centerY), 1 / 2);
            const distanceMapped = distance / (w / 2) * 1.5; // Map [-1.5, 1.5] to the edges of the canvas
            const alphaValue = 255 / (1 + Math.pow(distanceMapped, 8)); // https://www.desmos.com/calculator/nh9k6jruzc

            p.tint(this.colorVec.x, this.colorVec.y, this.colorVec.z, alphaValue);
            //tint(255, alphaValue); // Uncomment to disable color tint

            // Transform the canvas appropriately
            p.push();

            p.translate(this.position.x + this.image.width / 2, this.position.y + this.image.height / 2);
            p.rotate(this.angle);
            p.scale(this.scale);

            // Draw the image at the (now transformed) origin
            p.image(this.image, 0, 0);

            p.pop();
        }

        reset(position: p5.Vector, p: p5) {
            console.log("Called the default PhysParticle::reset! You should override this!")
        }
    }

    class Feather extends PhysParticle {
        reset(position: p5.Vector, p: p5) {
            this.position.set(position);
            this.velocity.set(0, 0);
            this.acceleration.set(0, 0);

            // Fix the hardcoded values below with the appropriate conversion from 30fps (plus some jank w/ my monitor)
            const frameTimeOffset = p.frameRate() * 0.00595;

            const grav = 0.015;

            // Determine random attributes
            this.velocity.x = (-4 + (p.random() * 2.5)) * frameTimeOffset;
            this.position.x += (p.random() * 40) - 20;
            this.position.y += (p.random() * 250) - 200;
            this.damping = (p.random() * 0.05) * frameTimeOffset;
            this.acceleration.x += ((p.random() * 0.1) - 0.05) * frameTimeOffset;
            this.acceleration.y += grav;

            this.va = (p.random() * 0.02) - 0.01;
        }
    }

    class Leaf extends PhysParticle {
        reset(position: p5.Vector, p: p5) {
            this.position.set(position);
            this.velocity.set(0, 0);
            this.acceleration.set(0, 0);

            const v = 1 / p.frameRate(); // factor for velocity
            const a = (v * v);         // factor for acceleration

            this.position.x += (p.random() * 40) - 20;
            this.position.y += (p.random() * 250) - 200;

            this.velocity.x = (-200 + (p.random() * 150)) * v;
            this.velocity.y = ((p.random() * 50) - 25) * v;

            this.damping = (p.random() * 20) * a;

            this.acceleration.y += 30 * a; // gravity

            this.angle = 0;
            this.va = ((p.random() * 0.02) - 0.01) * 60 * v;

            //console.log(`Reset leaf to: x: ${this.position.x}, y: ${this.position.y}, vx: ${this.velocity.x}`);
        }
    }

    class WindGust extends PhysParticle {
        // TODO LMAO
    }

    class EigthNote extends PhysParticle {
        reset(position: p5.Vector, p: p5) {
            this.position.set(300, -150);
            this.velocity.set(0, 0);
            this.acceleration.set(0, 0);

            const v = 1 / p.frameRate(); // factor for velocity
            const a = (v * v);         // factor for acceleration

            this.position.y += (p.random() * 200) - 100;
            this.velocity.x = (-200 + (p.random() * 150)) * v;
        }
    }

    export class ParticleSpawner {
        particles;
        position;
        respawnsRemaining;
        leaf;
        maple;
        note;
        p: p5;

        constructor(x, y, numParticles, respawnsRemaining, p: p5) {
            this.particles = [];
            this.position = new p5.Vector(x, y);
            this.respawnsRemaining = respawnsRemaining;
            // this.leaf = p.loadImage("src/assets/leaf.png")
            // this.maple = p.loadImage("src/assets/maple.png");
            // this.note = p.loadImage("src/assets/note.png");

            // eslint-disable-next-line
            this.note = p.loadImage(require("@/assets/note.png"));
            // eslint-disable-next-line
            this.maple = p.loadImage(require("@/assets/maple.png"));
            // eslint-disable-next-line
            this.leaf = p.loadImage(require("@/assets/leaf.png"));
            
            this.p = p;

            for (let i = 0; i < numParticles; i++) {

                // let j = random([0, 1, 2, 3]);
                const j = p.random([0, 1]);

                let scale;
                let r;
                let g;
                let b;

                switch (j) {
                    case 0: // Green leaf

                        scale = 0.18 + (p.random() * 0.1);

                        r = 220 - (p.random() * 20);
                        g = 220 - (p.random() * 20);
                        b = 220 - (p.random() * 20);

                        this.particles.push(new Leaf(Infinity, 0, 0, 0, 0, 0, 0, 0, 0, 0, scale, new p5.Vector(r, g, b), this.leaf));

                        break;

                    case 1: // Maple leaf

                        scale = 0.3 + (p.random() * 0.2);

                        r = 240 - (p.random() * 80);
                        g = 90 - (p.random() * 20);
                        b = 10 - (p.random() * 10);

                        this.particles.push(new Leaf(Infinity, 0, 0, 0, 0, 0, 0, 0, 0, 0, scale, new p5.Vector(r, g, b), this.maple));

                        break;

                    case 2: // Eigth note
                    case 3:

                        scale = 0.3 + (p.random() * 0.2);

                        if (p.random() > 0.5) {
                            r = 90 - (p.random() * 20);
                            g = 240 - (p.random() * 80);
                            b = 80 - (p.random() * 20);
                            //this.particles.push(new EigthNote(Infinity, 0, 0, 0, 0, 0, 0, 0, 0, 0, scale, new p5.Vector(r, g, b), note));
                        }
                        else {
                            r = 100 - (p.random() * 30);
                            g = 90 - (p.random() * 20);
                            b = 240 - (p.random() * 80);
                            //this.particles.push(new EigthNote(Infinity, 0, 0, 0, 0, 0, 0, 0, 0, 0, scale, new p5.Vector(r, g, b), note));
                        }

                        r = 240 - (p.random() * 80);
                        g = 90 - (p.random() * 20);
                        b = 10 - (p.random() * 10);

                        this.particles.push(new EigthNote(Infinity, 0, 0, 0, 0, 0, 0, 0, 0, 0, scale, new p5.Vector(r, g, b), this.note));

                        break;

                }

                this.particles[i].reset(this.position, this.p);
            }
        }

        update() {
            this.particles.forEach(particle => {
                if ((this.respawnsRemaining > 0) && (particle.position.x > 1000 || particle.position.x < -1000 || particle.position.y > 1000 || particle.position.y < -1000)) {
                    particle.reset(this.position, this.p);
                }

                particle.update();
            });
        }

        draw() {
            this.particles.forEach(feather => { feather.draw(this.p) });

            if (this.respawnsRemaining <= 0) {
                globalBonus--;
            }

        }
    }

    // Draw some bonus frames after the last particle spawns because I'm too lazy to detect when the last particle dies
    let globalBonus = 300;

    // export const globalSpawner = new ParticleSpawner((w / 2), -(h / 2), 20, Infinity);
}
