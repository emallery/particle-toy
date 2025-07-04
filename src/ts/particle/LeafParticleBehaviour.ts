import p5 from "p5";
import { PhysicsState } from "./PhysicsState";

export class LeafParticleBehaviour {
    static spawn(frameRate: number, positionOffset: p5.Vector = new p5.Vector(0, 0)): PhysicsState {
        // Create result physics state object
        const position = new p5.Vector(0, 0);
        const velocity = new p5.Vector(0, 0);
        const acceleration = new p5.Vector(0, 0);
        const state = new PhysicsState(position, velocity, acceleration);

        // Set physics properties
        const v = 1 / frameRate;   // factor for velocity
        const a = (v * v);         // factor for acceleration

        state.position.x += (Math.random() * 40) - 20;
        state.position.y += (Math.random() * 250) - 200;
        state.position.add(positionOffset);

        state.velocity.x = (-200 + (Math.random() * 150)) * v;
        state.velocity.y = ((Math.random() * 50) - 25) * v;

        state.damping = 1 - (Math.random() * 30) * a; //(Math.random() * 20) * a;

        state.acceleration.y += 30 * a; // gravity

        state.angle = 0;
        state.angularVelocity = ((Math.random() * 0.02) - 0.01) * 60 * v;


        // // AAAA
        // state.velocity.mult(60);
        // state.acceleration.mult(60);
        // state.angularVelocity *= 60;
        // state.angularAcceleration *= 60;

        return state;
    }
}
