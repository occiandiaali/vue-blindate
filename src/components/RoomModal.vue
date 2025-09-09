<template>
  <div class="modal" id="meetingModal" tabindex="-1">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Room {{ meetingModalProps.room }} ({{ meetingModalProps.environ }})
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
          <button
            @click="toggleMute"
            style="position: absolute; top: 5px; left: 5px"
          >
            {{ isMuted ? "Unmute" : "Mute" }}
          </button>

          <!-- <div
            id="chatBox"
            style="position: absolute; bottom: 10px; left: 10px; width: 200px"
          >
            <textarea id="chatInput" rows="4" style="width: 100%"></textarea>
            <button onclick="sendMessage()">Send</button>
          </div> -->

          <slot name="renderCanvas"></slot>
          <p id="instructions">Use W-A-S-D keys to move</p>
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
import { ref, watch } from "vue";

const meetingModalProps = defineProps([
  "environ",
  "duration",
  "room",
  "localStream",
  "timeup",
]);
const closeModal = () => window.location.reload();

// function countdown(ms: number): void {
//   let totalSeconds = Math.floor(ms / 1000);
//   const countdownElement = document.getElementById("countdown");

//   const interval = setInterval(() => {
//     if (totalSeconds > 0) {
//       totalSeconds--;
//       const mins = Math.floor(totalSeconds / 60);
//       const secs = totalSeconds % 60;
//       const result = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

//       if (countdownElement) {
//         countdownElement.textContent = result;
//       }
//     } else {
//       clearInterval(interval);
//       if (countdownElement) {
//         countdownElement.textContent = "Done!";
//         closeModal();
//       }
//     }
//   }, 1000);
// }
watch(
  () => meetingModalProps.timeup,
  (newValue, oldValue) => {
    console.log(`timeup changed from ${oldValue} to ${newValue}`);
    closeModal();
  }
);

const isMuted = ref(false);

function toggleMute() {
  console.log("localstream", meetingModalProps.localStream);
  if (!meetingModalProps.localStream) return;

  const audioTracks = meetingModalProps.localStream.getAudioTracks();
  if (audioTracks.length > 0) {
    isMuted.value = !isMuted.value;
    console.log("Muted..", isMuted.value);
    audioTracks[0].enabled = !isMuted.value;
  }
}
</script>

<style lang="css" scoped>
canvas {
  width: 100%;
  height: 100%;
}
#instructions {
  color: white;
  opacity: 0.6;
  position: absolute;
  bottom: 5%;
  left: 5%;
  margin: 2%;
}
</style>
