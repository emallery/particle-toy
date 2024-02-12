<template>
  <div>
    <p>Hi :&rpar;</p>
    <input type="file" accept="image/*" multiple ref="currentUpload" @input="uploadFiles" />
    <ul>
      <template v-for="(item, index) in settings.spawnerSettings.imagePool" :key="item">
        <button @click="settings.spawnerSettings.imagePool.splice(index, 1)">Delete</button>
        <li>{{ item }}</li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Settings } from '@/ts/Settings';
import { ref } from 'vue';

const props = defineProps({
  settings: {
    type: Settings,
    required: true,
  },
});

const currentUpload = ref<HTMLInputElement | null>(null);

function uploadFiles() {
  // console.log(currentUpload.value?.files);

  if (currentUpload.value?.files) {
    for (let file of currentUpload.value.files) {
      let reader = new FileReader();
      reader.onloadend = function () {
        if (reader.result) {
          props.settings.spawnerSettings.imagePool.push(reader.result.toString());
        }
      }
      reader.readAsDataURL(file);
    }

    currentUpload.value.value = '';
  }
}
</script>

<style scoped>
div {
  width: 500px;
  height: 500px;
  border: 3px black solid;
  border-radius: 2%;
}

li {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
