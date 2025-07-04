import p5 from "p5";
import type { Settings } from "../Settings";
import { PhysicsState } from "./PhysicsState";

export class FireworkParticleBehaviour {
    static spawn(p: p5, settings: Settings, positionOffset: p5.Vector = new p5.Vector(0, 0)): PhysicsState {
        // Position
        const initialPosition = new p5.Vector(0, settings.windowSettings.height / -4)
            .add(positionOffset);

        const v = 1 / settings.windowSettings.frameRate; // factor for velocity
        const a = (v * v);                               // factor for acceleration

        // Velocity
        const randX = p.random(-12, 12) * 60 * v;
        const randY = p.random(-6, -1) * 60 * v;

        // TODO: Acceleration is borked at non-60 FPS
        return new PhysicsState(initialPosition, new p5.Vector(randX, randY), new p5.Vector(0, 0.3 /** 3600 * a*/), 0, randX / 260 * 60 * v, 0, 0.95 /** 3600 * a */);
    }
}
