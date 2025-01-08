import p5 from "p5";
import type { Drawable } from "./Drawable";
import type { Settings, UsesSettings } from "./Settings";
import { PhysParticle } from "./PhysParticle";

export class TwitchGenerator implements UsesSettings, Drawable {
    settings: Settings;
    
    // Twitch-related fields
    private channel: string | undefined = undefined;
    private static readonly EVENTSUB_WEBSOCKET_URL = 'wss://irc-ws.chat.twitch.tv:443';
    private readonly websocketClient = new WebSocket(TwitchGenerator.EVENTSUB_WEBSOCKET_URL);

    // Particle-related fields
    readonly particles: PhysParticle[] = [];
    private readonly imageMap: Map<string, p5.Image> = new Map();
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

            for (const entry of emoteInfo) {
                // Spawn the appropriate number of particles for each emote
                for (let i = 0; i < entry[1]; i++) {
                    this.spawnEmoteParticle(entry[0]);
                }
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

    private spawnEmoteParticle(emoteId: string): void {
        const emoteUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/light/2.0`;

        // Try to get the P5 Image for the given URL. Load it if it's not loaded already.
        let image = this.imageMap.get(emoteUrl);
        if (image === undefined) {
            // TODO: Use loadImage callback, and less janky way of referencing p5 instance
            if (this.p5) {
                image = this.p5.loadImage(emoteUrl, image);
                this.imageMap.set(emoteUrl, image);
            }
            else {
                console.error(`P5 instance not initialized, can't load emote: ${emoteId}`);
                return;
            }
        }

        if (this.p5) {
            // Create a particle for the emote
            const randX = this.p5.random(-12, 12);
            const randY = this.p5.random(-6, -1);
            const newParticle = new PhysParticle(new p5.Vector(0, this.p5.height / -4), new p5.Vector(randX, randY), new p5.Vector(0, 0.3), 0, randX / 260, 0, 0.95, 1.5, [255, 255, 255], image, this.settings);
            this.particles.push(newParticle);
        }
    }
    
    update(p: p5, deltaTime: number): void {
        this.p5 = p;
        this.particles.forEach(particle => particle.update());
    }

    draw(p: p5, deltaTime: number): void {
        if (this.websocketClient.readyState == WebSocket.CLOSED) {
            p.textAlign(p.CENTER, p.CENTER);
            p.fill('red');
            p.text("Connection to Twitch lost.\nPlease refresh the page!", 0, 0);
        }

        this.particles.forEach(particle => particle.draw(p));
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
        this.particles.length = 0;
    }
}
