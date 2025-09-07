<template>
  <div class="modal" id="meetingModal" tabindex="-1">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Room {{ meetingModalProps.room }} ({{
              meetingModalProps.duration
                ? +meetingModalProps.duration / 60000
                : "5"
            }}
            mins) {{ meetingModalProps.environ }}
          </h5>

          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <!-- <p>Meeting environment: {{ meetingModalProps.environ }}</p> -->
          <!-- <babylon-scene :floor="environ"></babylon-scene> -->
          <BabylonScene :floor="meetingModalProps.environ" />
          <!-- <canvas ref="bjsCanvas" width="500"></canvas> -->
          <!-- <canvas
            id="renderCanvas"
            ref="renderCanvas"
            width="600px"
            height="400px"
          ></canvas> -->
        </div>
        <!-- <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import BabylonScene from "./BabylonScene.vue";
//import BabylonScene from "../room-scenes/BabylonScene";
//import { MultiplayerScene } from "../room-scenes/multiplayer-scene/MultiplayerScene";

//const fps = ref(0);
//const theEnvironment = ref("");
const meetingModalProps = defineProps(["environ", "duration", "room"]);

const closeModal = () => window.location.reload();

// const meetingModalProps = defineProps({
//   environ: String,
//   duration: String,
//   room: String,
//   canvasTrigger: Boolean,
// });

// const fpsReceived = (fps: { value: any }) => {
//   fps.value = fps;
// };
//const bjsCanvas = useTemplateRef("bjsCanvas"); //r

// const triggerCanvas = () => {
//   if (meetingModalProps.environ === "my_room") {
//     const myRoom = new MultiplayerScene(bjsCanvas.value as HTMLCanvasElement);
//     myRoom.connectToRoom("my_room");
//   }
//   if (meetingModalProps.environ === "green_room") {
//     const greenRoom = new MultiplayerScene(
//       bjsCanvas.value as HTMLCanvasElement
//     );
//     greenRoom.connectToRoom("green_room");
//   }
// };

//const renderCanvas = useTemplateRef("renderCanvas");
onMounted(() => {
  console.log("MeetingModal mounted...");
  console.log(
    `Env: ${meetingModalProps.environ} for ${meetingModalProps.duration} mins`
  );
  // if (meetingModalProps.environ == "black") {
  //   new BabylonScene(renderCanvas.value as HTMLCanvasElement, "black");
  // } else if (meetingModalProps.environ == "green") {
  //   new BabylonScene(renderCanvas.value as HTMLCanvasElement, "green");
  // }
  // if (meetingModalProps.environ === "my_room") {
  //   new MultiplayerScene(bjsCanvas.value as HTMLCanvasElement, "my_room");

  //   console.log("Mounted ", meetingModalProps.environ);
  // }
  // if (meetingModalProps.environ === "green_room") {
  //   new MultiplayerScene(bjsCanvas.value as HTMLCanvasElement, "green_room");

  //   console.log("Mounted ", meetingModalProps.environ);
  // }

  // setTimeout(() => {
  //   theEnvironment.value = meetingModalProps.environ;
  //   console.log("meetingmodal-environ", meetingModalProps.environ);
  // }, 3000);
});
</script>

<style lang="css" scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
