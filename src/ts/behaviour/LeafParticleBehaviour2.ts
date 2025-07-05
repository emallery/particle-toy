import p5 from "p5";
import { PhysicsState } from "../particle/PhysicsState";

export class LeafParticleBehaviour2 {

    static spawn(positionOffset: p5.Vector = new p5.Vector(0, 0)): PhysicsState {

        const state = new PhysicsState(new p5.Vector(-400, 0), new p5.Vector(3000, 100), new p5.Vector(0, 60));
        state.damping = 5; // remove all velocity in 1/5 of a second

        return state;
    }
}
