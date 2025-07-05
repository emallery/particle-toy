import type p5 from "p5";
import { PhysParticle } from "./particle/PhysParticle";

export class TimedPhysParticle extends PhysParticle {
    aliveTime = 0.0;

    update(p: p5, deltaTime: number): void {
        super.update(p, deltaTime);
        this.aliveTime += deltaTime;
    }
}
