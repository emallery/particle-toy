import p5 from "p5";
import type { Settings } from "../Settings";
import { TimedPhysParticle } from "../TimedSprite";
import { FireworkParticleBehaviour } from "../behaviour/Firework";

export class FireworkParticle extends TimedPhysParticle {
    constructor(p: p5, settings: Settings, image: p5.Image, positionOffset?: p5.Vector) {
        const state = FireworkParticleBehaviour.spawn(p, settings, positionOffset);
        super(state, 1.5, [255, 255, 255], image, settings);
    }
}
