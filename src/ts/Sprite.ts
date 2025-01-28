import p5 from "p5";
import type { Drawable } from "./Drawable";
import type { Settings, UsesSettings } from "./Settings";

export class Sprite implements Drawable, UsesSettings {
    position: p5.Vector = new p5.Vector(0, 0);
    scale: number = 1;
    angle: number = 0;
    tint: number[] = [255, 255, 255];
    readonly image: p5.Image;
    settings: Settings;

    // TODO: Scale image / normalize size?

    constructor(image: p5.Image, settings: Settings) {
        this.image = image;
        this.settings = settings;
    }

    update(p: p5, deltaTime: number): void {
        // Nothing to do
    }

    draw(p: p5, deltaTime: number): void {
        // Setup for image and rectangle drawing
        p.imageMode(p.CENTER);
        p.rectMode(p.CENTER);

        p.tint(this.tint[0], this.tint[1], this.tint[2], 255);

        // Transform the canvas appropriately
        p.push();

        p.translate(this.position.x, this.position.y);
        p.rotate(this.angle);
        p.scale(this.scale);

        // Draw the image at the (now transformed) origin
        p.image(this.image, 0, 0);

        p.pop();

        // Finally, draw debug lines
        if (this.settings.debug) {
            p.stroke(6);
            p.line(0, 0, this.position.x, this.position.y);
        }
    }
}