import p5 from "p5";
import type { Settings } from "../Settings";
import { PhysicsState } from "./PhysicsState";

export class FireworkParticleBehaviour {
    static spawn(p: p5, settings: Settings, positionOffset: p5.Vector = new p5.Vector(0, 0)): PhysicsState {
        // Position
        const initialPosition = positionOffset.copy();

        // Velocity
        const randX = p.random(-6, 6) * 60;
        const randY = p.random(-16,-6) * 60;

        // TODO: Acceleration is borked at non-60 FPS
        return new PhysicsState(initialPosition, new p5.Vector(randX, randY), new p5.Vector(0, 2160), 0, randX / 150, 0, 0);
    }
}
