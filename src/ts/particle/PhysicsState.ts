import p5 from 'p5';

export class PhysicsState {
    position: p5.Vector;
    velocity: p5.Vector;
    acceleration: p5.Vector;
    angle: number;
    angularVelocity: number;
    angularAcceleration: number;
    damping: number;

    constructor(position: p5.Vector,
        velocity: p5.Vector,
        acceleration: p5.Vector,
        angle: number = 0,
        va: number = 0,
        aa: number = 0,
        damping: number = 0) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.angle = angle;
        this.angularVelocity = va;
        this.angularAcceleration = aa;
        this.damping = damping;
    }
}
