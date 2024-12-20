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
let channelChangeTimer: number | undefined = undefined;

watch(channel, (newChannel, oldChannel) => {

    clearTimeout(channelChangeTimer);
    channelChangeTimer = setTimeout(() => {
        console.log("Changed")
        emoteList.value.length = 0;
        websocketClient.send(`PART #${oldChannel}`);
        websocketClient.send(`JOIN #${newChannel}`);
    }, 1000);
    
});

websocketClient.addEventListener('error', console.error);

websocketClient.addEventListener('open', () => {
    console.log('WebSocket connection opened to ' + EVENTSUB_WEBSOCKET_URL);

    websocketClient.send("PASS gamer");
    websocketClient.send("NICK justinfan1234");
    websocketClient.send("CAP REQ twitch.tv/tags")
    websocketClient.send(`JOIN #${channel.value}`);
});

websocketClient.addEventListener('message', (data) => {
    console.log(data.data);

    let msg = data.data as string;

    // Get messages
    if (msg.includes("PRIVMSG")) {

        // Parse emotes from chat message
        for (let entry of msg.matchAll(/emotes=(.*?);/g)) {
            if (entry[1]) {                
                let emoteId = entry[1].split(":")[0];
                let emoteUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/static/light/3.0`;
                emoteList.value.push(emoteUrl);
            }
            
        }
    }
});

</script>