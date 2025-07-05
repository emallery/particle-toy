import p5 from "p5";
import type { Drawable } from "./Drawable";
import type { Settings, UsesSettings } from "./Settings";
import { FireworkParticle as FireworkParticle } from "./particle/FireworkParticle";

export class TwitchGenerator implements Drawable, UsesSettings {
    readonly settings: Settings;

    // Twitch-related fields
    private channel: string | undefined = undefined;
    private static readonly EVENTSUB_WEBSOCKET_URL = 'wss://irc-ws.chat.twitch.tv:443';
    private readonly websocketClient = new WebSocket(TwitchGenerator.EVENTSUB_WEBSOCKET_URL);

    // Particle-related fields
    private handler: TwitchMessageHandler | undefined;
    private readonly imageCache: Map<string, p5.Image> = new Map();
    private p5: p5 | undefined = undefined;

    constructor(settings: Settings, channel: string | undefined = undefined) {
        this.settings = settings;
        this.channel = channel;
        console.log('Opening WebSocket connection to ' + TwitchGenerator.EVENTSUB_WEBSOCKET_URL);

        // Set up WebSocket event listeners
        this.websocketClient.addEventListener('open', () => this.handleOpen());
        this.websocketClient.addEventListener('close', (event) => this.handleClose(event));
        this.websocketClient.addEventListener('message', (event) => this.handleMessage(event));
        this.websocketClient.addEventListener('error', console.error);
    }

    private handleOpen(): void {
        console.log("Connected to Twitch. Logging in...");

        // Use "justinfan" account with randomly-generated ID and any password to log in anonymously
        const loginId = Math.floor(Math.random() * 9999999999);
        this.websocketClient.send("PASS gamer");
        this.websocketClient.send(`NICK justinfan${loginId}`);
        this.websocketClient.send("CAP REQ twitch.tv/tags")

        if (this.channel) {
            this.setChannel(this.channel);
        }
    }

    private handleClose(event: CloseEvent): void {
        console.log(`Connection closed with code [${event.code}]: ${event.reason}`);
    }

    private handleMessage(message: MessageEvent<string>) {
        // console.log(message.data);
        const msg = message.data as string;

        if (typeof message.data !== "string") {
            console.error(`Type of message.data [${typeof message.data}] is not 'string'. Continuing anyway...`);
        }

        // Check for PING message
        for (const entry of msg.matchAll(/PING :(.*)/g)) {
            const response = `PONG :${entry[1]}`;
            console.log(`Got PING message, sending "${response}"`);
            this.websocketClient.send(response);
        }

        // Check for emotes in the message.
        // Matches the <this> in "emotes=<this>;" if it is non-empty
        for (const match of msg.matchAll(/(?<=emotes=)[^;]+/g)) {
            const emoteText = match[0];
            const emoteInfo = this.parseEmoteText(emoteText);
            console.log("Emote text: " + emoteText);
            console.log(emoteInfo);

            // Load all images for the given message
            const emoteImageMap = new Map<p5.Image, number>();
            for (const entry of emoteInfo) {
                const image = this.getImageFromCache(entry[0]);
                if (image) {
                    emoteImageMap.set(image, entry[1]);
                }
            }

            // Pass parsed emote data to the renderer
            if (!this.handler && this.p5) {
                this.handler = new TwitchMessageHandler(this.p5, this.settings);
            }
            if (this.handler) {
                this.handler.handleMessage(emoteImageMap);
            }
        }
    }

    /**
     * Parse Twitch's IRC representation of emotes listed in a message.
     * @param emoteText Emote text, in the format: "<emoteId>:<position>,<position>/<emoteId>:<position>,<position>"
     * @returns A Map with a key for each emote ID present in the message, who's value is the number of occurrances of that emote.
     */
    private parseEmoteText(emoteText: string): Map<string, number> {
        const result = new Map();
        for (const entry of emoteText.split("/")) {
            const split = entry.split(":");
            const emoteId = split[0];
            const count = split[1].split(",").length;
            result.set(emoteId, count);
        }
        return result;
    }

    private getImageFromCache(emoteId: string): p5.Image | null {
        const emoteUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/light/2.0`;

        // Try to get the P5 Image for the given URL. Load it if it's not loaded already.
        let image = this.imageCache.get(emoteUrl);
        if (image === undefined) {
            // TODO: Use loadImage callback, and less janky way of referencing p5 instance
            if (this.p5) {
                image = this.p5.loadImage(emoteUrl, image);
                this.imageCache.set(emoteUrl, image);
            }
            else {
                console.error(`P5 instance not initialized, can't load emote: ${emoteId}`);
                return null;
            }
        }

        return image;
    }

    update(p: p5, deltaTime: number): void {
        this.p5 = p;

        if (!this.handler) {
            this.handler = new TwitchMessageHandler(this.p5, this.settings);
        }

        this.handler.update(p, deltaTime);

        // Debugging
        if (this.settings.debug && p.mouseIsPressed && this.handler.particles.length < 4) {
            const dummyMessage = {data: "@badge-info=subscriber/32;badges=broadcaster/1,subscriber/0;client-nonce=ccbb5763ccc35ba1214832781754f6f5;color=#FF4500;display-name=FeatherDerg;emote-only=1;emotes=emotesv2_416d93e1150d47979f1dd9c06aeab1cd:41-56/emotesv2_ee80f2dc06c24dc5bf53fa46d9970552:0-13/emotesv2_f52f89f394414cf58a709ce34c48da2e:15-26/emotesv2_36e1a690d62343358504f26aadff7fa7:28-39;first-msg=0;flags=;id=6bc71771-d641-44f3-8bcf-dd2d4aef7778;mod=0;returning-chatter=0;room-id=437073341;subscriber=1;tmi-sent-ts=1751384189035;turbo=0;user-id=437073341;user-type= :featherderg!featherderg@featherderg.tmi.twitch.tv PRIVMSG #featherderg :feathe99PetJam feathe99HYPE feathe99LOVE feathe99CugaWhat"} as MessageEvent<string>;
            this.handleMessage(dummyMessage);
        }
    }

    draw(p: p5, deltaTime: number): void {
        this.handler?.draw(p, deltaTime);
        
        // Draw warning when Twitch connection lost
        if (this.websocketClient.readyState == WebSocket.CLOSED) {
            p.textAlign(p.CENTER, p.CENTER);
            p.fill('red');
            p.text("Connection to Twitch lost.\nPlease refresh the page!", 0, 0);
        }
    }

    setChannel(newChannel: string) {
        // Disconnect from the old channel before connecting to a new one
        if (this.channel !== undefined) {
            console.log(`Leaving: ${this.channel}`);
            this.websocketClient.send(`PART #${this.channel}`);
        }
        console.log(`Joining: ${newChannel}`);
        this.websocketClient.send(`JOIN #${newChannel}`);

        this.channel = newChannel;
    }
}

enum ParticleType {
    Fireworks,
    Leaves,
    DVD,
}

export class TwitchMessageHandler implements Drawable, UsesSettings {
    readonly p5: p5;
    readonly settings: Settings;

    // Particle-related fields
    readonly particles: FireworkParticle[] = [];
    private readonly particleLifetime = 5.0; // seconds

    constructor(p5: p5, settings: Settings) {
        this.p5 = p5;
        this.settings = settings;
    }

    handleMessage(message: Map<p5.Image, number>): void {
        // Choose a spot to launch the fireworks at
        const w = this.settings.windowSettings.width;
        const h = this.settings.windowSettings.height;
        const x = this.p5.random(-w / 2, w / 2);
        const y = this.p5.random(-h / 2, h / 2);

        // Spawn all the emotes at once!
        for (const entry of message) {
            for (let i = 0; i < entry[1]; i++) {
                const newParticle = new FireworkParticle(this.p5, this.settings, entry[0], new p5.Vector(x, y))
                this.particles.push(newParticle);
            }
        }
    }

    update(p: p5, deltaTime: number): void {
        // Clear out old particles
        this.particles.forEach(o => {
            if (o.aliveTime > this.particleLifetime) {
                this.particles.shift(); // gnarly
            }
        });

        this.particles.forEach(particle => particle.update(p, deltaTime));
        // console.log(`Updated ${this.particles.length} particles.`)
    }

    draw(p: p5, deltaTime: number): void {
        this.particles.forEach(particle => particle.draw(p, deltaTime));
    }
}
