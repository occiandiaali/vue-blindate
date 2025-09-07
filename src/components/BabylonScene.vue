<template>
  <canvas ref="bjsCanvas" width="500"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from "@vue/runtime-core";
//import { createScene } from "../room-scenes/FirstScene";
//import BabylonScene from "../room-scenes/BabylonScene";
import { CubeScene } from "../room-scenes/CubeScene";
//import { MultiplayerScene } from "../room-scenes/multiplayer-scene/MultiplayerScene";
import { Client } from "colyseus.js";

const bjsCanvas = useTemplateRef("bjsCanvas"); //ref<HTMLCanvasElement | null>(null);
//const emit = defineEmits(["fps"]);
const client = ref();

const props = defineProps(["floor"]);
const groundColour = ref("");

onMounted(() => {
  console.log("BabylonScene.vue mounted..");
  // if (bjsCanvas.value) {
  //   // const fpsCallback = (fps: any) => {
  //   //   emit("fps", fps);
  //   // };
  //   createScene(bjsCanvas.value);
  // }

  client.value = new Client("http://localhost:2567");
  console.log("props.floor", props.floor);
  groundColour.value = props.floor;
  console.log("groundColour", groundColour.value);
  switch (props.floor) {
    case "my_room":
      const myRoom = new CubeScene(
        bjsCanvas.value as HTMLCanvasElement,
        "my_room",
        client.value
      );
      myRoom.connectToRoom("my_room");

      //new MultiplayerScene(bjsCanvas.value as HTMLCanvasElement, "my_room");

      break;
    case "green_room":
      const greenRoom = new CubeScene(
        bjsCanvas.value as HTMLCanvasElement,
        "green_room",
        client.value
      );
      greenRoom.connectToRoom("green_room");
      //new MultiplayerScene(bjsCanvas.value as HTMLCanvasElement, "green_room");

      break;
    default:
    //  new CubeScene(bjsCanvas.value as HTMLCanvasElement, "my_room");
    //new MultiplayerScene(bjsCanvas.value as HTMLCanvasElement, "my_room");
  }
});
</script>

<style>
canvas {
  width: 100%;
  height: 100%;
}
</style>
