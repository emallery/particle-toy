import type p5 from "p5";

export interface Drawable {
    update(p: p5, deltaTime: number): void;
    draw(p: p5, deltaTime: number): void;
}
