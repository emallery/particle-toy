<template>
    <header>Emotes for: <input type="text" v-model="channel"/></header>
    <body>
        <ul>
            <li v-for="emote in emoteList" :key="emote">
                <img :src="emote"/>
                 {{ emote }}
            </li>
        </ul>
    </body>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const emoteList = ref([] as Array<string>);
const channel = ref("gamesdonequick");
const EVENTSUB_WEBSOCKET_URL = 'wss://irc-ws.chat.twitch.tv:443';

let websocketClient = new WebSocket(EVENTSUB_WEBSOCKET_URL);
/** Object to keep track of state related to changing the channel */ 
const channelChanger: {timerId: number | undefined, prevChannel: string} = {timerId: undefined, prevChannel: channel.value};

watch(channel, (newChannel) => {
    // Prevent spamming join/leave requests by only changing channel if text isn't updated for a long enough duration.
    clearTimeout(channelChanger.timerId);
    channelChanger.timerId = setTimeout(() => {
        console.log(`Disconnecting from [${channelChanger.prevChannel}, connecting to [${newChannel}]...`);
        websocketClient.send(`PART #${channelChanger.prevChannel}`);
        websocketClient.send(`JOIN #${newChannel}`);
        channelChanger.prevChannel = newChannel;
        emoteList.value.length = 0;
    }, 1000);
});

websocketClient.addEventListener('error', console.error);

websocketClient.addEventListener('open', () => {
    console.log('WebSocket connection opened to ' + EVENTSUB_WEBSOCKET_URL);
    const loginId = Math.floor(Math.random() * 9999999999);

    // Use "justinfan" account with randomly-generated ID and any password to log in anonymously
    websocketClient.send("PASS gamer");
    websocketClient.send(`NICK justinfan${loginId}`);
    websocketClient.send("CAP REQ twitch.tv/tags")
    websocketClient.send(`JOIN #${channel.value}`);
});

websocketClient.addEventListener('close', event => {
    console.log(`Connection closed with code [${event.code}]: ${event.reason}`);
});

websocketClient.addEventListener('message', (data) => {
    console.log(data.data);

    let msg = data.data as string;

    // Handle chat messages
    if (msg.includes("PRIVMSG")) {
        // Parse emotes from chat message
        for (let entry of msg.matchAll(/emotes=(.*?);/g)) {
            if (entry[1]) {                
                let emoteId = entry[1].split(":")[0];
                let emoteUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/light/2.0`;
                emoteList.value.push(emoteUrl);
            }
        }
    }

    // Check for PING message
    for (let entry of msg.matchAll(/PING :(.*)/g)) {
        const response = `PONG :${entry[1]}`;
        console.log(`Got PING message, sending "${response}"`);
        websocketClient.send(response);
    }
});

</script>
