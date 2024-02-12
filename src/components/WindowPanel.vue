<template>
    <div class="heck">
        <p>Window Settings!</p>
        <ul>
            <li><label>Width: <input v-model="settings.windowSettings.width" type="number" min="1" max="3840" step="1"></label></li>
            <li><label>Height: <input v-model="settings.windowSettings.height" type="number" min="1" max="2160" step="1"></label></li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { Settings } from '@/ts/Settings';

defineProps({
    settings: {
        type: Settings,
        required: true,
    },
});

</script>

<style scoped>
div.heck {
    border-radius: 8px;
    background-color: #f0f0f0;
    box-shadow: 3px 4px 24px -10px rgba(0, 0, 0, 0.35);
}

li {
    display: inline;
    padding-inline: 10px;
}
</style>