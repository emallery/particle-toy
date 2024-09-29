<template>
    <header>Not found</header>
</template>

<script setup lang="ts">

// let client = new IRC.Client();

const EVENTSUB_WEBSOCKET_URL = 'wss://irc-ws.chat.twitch.tv:443';

let websocketClient = new WebSocket(EVENTSUB_WEBSOCKET_URL);

websocketClient.addEventListener('error', console.error);

websocketClient.addEventListener('open', () => {
    console.log('WebSocket connection opened to ' + EVENTSUB_WEBSOCKET_URL);

    websocketClient.send("PASS gamer");
    websocketClient.send("NICK justinfan1234");
    websocketClient.send("CAP REQ twitch.tv/tags")
    websocketClient.send("JOIN #gamesdonequick");
    
});

websocketClient.addEventListener('message', (data) => {
    console.log(data.data);
});

</script>