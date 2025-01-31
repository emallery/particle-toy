import p5 from "p5";
import type { Drawable } from "./Drawable";
import type { Settings, UsesSettings } from "./Settings";
import { Sprite } from "./Sprite";

class TimedSprite extends Sprite {
    lifetime = 0.0;
    isMovingRight = false;
    isMovingDown = false;
}

export class DVDSpawner implements Drawable, UsesSettings {

    private readonly speed = 360;
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
            newSprite.isMovingRight = p.random([true, false]);
            newSprite.isMovingDown = p.random([true, false]);
            newSprite.scale = 0.33;
            this.particles.push(newSprite);
        }

        this.mousePrev = p.mouseIsPressed;

        // Move all the particles
        this.particles.forEach(o => {
            // Horizontal
            o.position.add(o.isMovingRight ? this.speed * deltaTime : this.speed * -deltaTime);
            const hOffset = o.image.width * o.scale / 2;
            const lOverlap = o.position.x - hOffset + (p.width / 2); // The number of pixels away from the edge of the screen that the left edge of the image is.
            const rOverlap = o.position.x + hOffset - (p.width / 2); // Pixels the right edge of the image is away from the right edge of the window
            
            if (lOverlap < 0) {
                o.isMovingRight = true;
                o.position.x -= 2 * lOverlap;
            }
            
            if (rOverlap > 0) {
                o.isMovingRight = false;
                o.position.x -= 2 * rOverlap;
            }

            // Vertical
            o.position.add(0, o.isMovingDown ? this.speed * deltaTime : this.speed * -deltaTime);
            const vOffset = o.image.height * o.scale / 2;
            const tOverlap = o.position.y - vOffset + (p.height / 2);
            const bOverlap = o.position.y + vOffset - (p.height / 2);

            if (tOverlap < 0) {
                o.isMovingDown = true;
                o.position.y -= 2 * tOverlap;
            }

            if (bOverlap > 0) {
                o.isMovingDown = false;
                o.position.y -= 2 * bOverlap;
            }
        });

        // TODO: Tint based on age (fade darker over time), fade opacity in and out
    }

    draw(p: p5, deltaTime: number): void {
        this.particles.forEach(particle => particle.draw(p, deltaTime));
    }
}
