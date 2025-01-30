import p5 from "p5";
import type { Drawable } from "./Drawable";
import type { Settings, UsesSettings } from "./Settings";
import { Sprite } from "./Sprite";

class TimedSprite extends Sprite {
    lifetime = 0.0;
    isMovingLeft = false;
    isMovingUp = false;
}

export class DVDSpawner implements Drawable, UsesSettings {

    private readonly speed = 4.5;
    private readonly particleLifetime = 5.0; // seconds
    settings: Settings;
    private readonly imageMap: Map<string, p5.Image> = new Map();
    private mousePrev: boolean = false;

    private readonly particles: TimedSprite[] = []; 

    constructor(settings: Settings) {
        this.settings = settings;
    }

    update(p: p5, deltaTime: number): void {
        // Update lifetimes for each particle, and clear out old ones.
        this.particles.forEach(o => {
            o.lifetime += deltaTime;
            if (o.lifetime > this.particleLifetime) {
                this.particles.shift(); // gnarly
            }
        });

        if (this.imageMap.get("leaf") === undefined) {
            console.log("Loading image...");
            const tempImage = p.loadImage(new URL("@/assets/maple.png", import.meta.url).href);
            this.imageMap.set("leaf", tempImage);
        }

        if (this.mousePrev && !p.mouseIsPressed) {
            // Mouse released
            const w = this.settings.windowSettings.width;
            const h = this.settings.windowSettings.height;
            const randX = p.random(-w/3, w/3);
            const randY = p.random(-h/3, h/3);

            const newSprite = new TimedSprite(this.imageMap.get("leaf") as p5.Image /*not undefined*/, this.settings);
            newSprite.position = new p5.Vector(randX, randY);
            newSprite.isMovingLeft = p.random([true, false]);
            newSprite.isMovingUp = p.random([true, false]);
            newSprite.scale = 0.33;
            this.particles.push(newSprite);
        }

        this.mousePrev = p.mouseIsPressed;

        // Move all the particles
        this.particles.forEach(o => {
            // Horizontal
            o.position.add(o.isMovingLeft ? this.speed : -1 * this.speed);
            const hOffset = o.image.width * o.scale / 2;
            if (o.position.x - hOffset < p.width / -2 || o.position.x + hOffset > p.width / 2) {
                o.isMovingLeft = !o.isMovingLeft;
            }

            // Vertical
            o.position.add(0, o.isMovingUp ? this.speed : -1 * this.speed);
            const vOffset = o.image.height * o.scale / 2;
            if (o.position.y - vOffset < p.height / -2 || o.position.y + vOffset > p.height / 2) {
                o.isMovingUp = !o.isMovingUp;
            }
        });
    }

    draw(p: p5, deltaTime: number): void {
        this.particles.forEach(particle => particle.draw(p, deltaTime));
    }
}
