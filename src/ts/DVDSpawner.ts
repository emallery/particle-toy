import p5 from "p5";
import type { Drawable } from "./Drawable";
import type { Settings, UsesSettings } from "./Settings";
import { Sprite } from "./Sprite";

export class DVDSpawner implements Drawable, UsesSettings {

    private readonly speed = 1.0;
    settings: Settings;
    private readonly imageMap: Map<string, p5.Image> = new Map();
    private mousePrev: boolean = false;

    private tempImage: p5.Image | undefined = undefined;

    private readonly particles: Sprite[] = []; 

    constructor(settings: Settings) {
        this.settings = settings;
    }

    update(p: p5, deltaTime: number): void {
        if (this.tempImage === undefined) {
            console.log("Loading image...");
            this.tempImage = p.loadImage(new URL("@/assets/maple.png", import.meta.url).href);
        }

        if (this.mousePrev && !p.mouseIsPressed) {
            // Mouse released
            const randX = p.random(-6, 6);
            const randY = p.random(-16, -6);

            const newSprite = new Sprite(this.tempImage as p5.Image /*not undefined*/, this.settings);
            newSprite.position = new p5.Vector(randX, randY);
            this.particles.push(newSprite);
        }

        this.mousePrev = p.mouseIsPressed;
    }

    draw(p: p5, deltaTime: number): void {
        this.particles.forEach(particle => particle.draw(p, deltaTime));
    }
}
