import p5 from "p5";
import { PhysicsState } from "../particle/PhysicsState";

export class LeafParticleBehaviour {
    static spawn(frameRate: number, positionOffset: p5.Vector = new p5.Vector(0, 0)): PhysicsState {
        // Create result physics state object
        const position = new p5.Vector(0, 0);
        const velocity = new p5.Vector(0, 0);
        const acceleration = new p5.Vector(0, 0);
        const state = new PhysicsState(position, velocity, acceleration);

        state.position.x += (Math.random() * 40) - 20;
        state.position.y += (Math.random() * 250) - 200;
        state.position.add(positionOffset);

        state.velocity.x = (-200 + (Math.random() * 150));
        state.velocity.y = ((Math.random() * 50) - 25);

        state.damping = (Math.random() * 0.2) + 0.1;

        state.acceleration.y += 30; // gravity

        state.angle = 0;
        state.angularVelocity = ((Math.random() * 0.02) - 0.01) * 60;

        return state;
    }
}
