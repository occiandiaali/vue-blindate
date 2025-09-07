<template>
  <section class="section">
    <div v-if="loading">Loading meetings...</div>
    <p v-else-if="Object.keys(currentUserMeetings).length === 0">
      You have no Meetings to show
    </p>
    <div v-else-if="error">Error: {{ error }}</div>
    <ul v-else>
      <li v-for="meeting in currentUserMeetings" :key="meeting.id">
        <div class="row item-wrap">
          <div class="col-md-2">
            <img
              src="https://picsum.photos/100/100?random=2"
              alt="placeholder"
              width="100%"
              height="140px"
            />
          </div>
          <div class="col-md-10">
            <div class="row" style="margin-left: 1px">
              <span>On: {{ meeting.meeting_date }}</span>
              <br />
              <span>
                With:
                <a
                  href="#"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Confirm your date is standing by.."
                  >{{
                    currentUser === requester
                      ? meeting.participant_username[1]
                      : meeting.participant_username[0]
                  }}</a
                >
              </span>
              <br />
              <span>Duration: {{ +meeting.duration / 60000 }} mins</span>
              <br />
              <span id="roomText"
                >Room ID: {{ meeting.room_id }} <a href="#">copy</a></span
              >
              <br />

              <div class="row">
                <button
                  class="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#meetingModal"
                  :disabled="isToday(new Date(meeting.meeting_date))"
                  @click="
                    joinMeet(
                      meeting.environment,
                      meeting.duration,
                      meeting.room_id
                    )
                  "
                >
                  Join
                </button>
                <button
                  class="btn btn-danger"
                  @click="
                    rejectMeet(
                      meeting.id,
                      meeting.participant_username[0],
                      meeting.participant_username[1]
                    )
                  "
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <room-modal
      :environ="theEnv"
      :duration="theDuration"
      :room="theRoom"
      :local-stream="localStream"
      :timeup="timeup"
    >
      <template #renderCanvas>
        <div class="blanket" id="blanket">
          {{ theDuration }}
        </div>
        <canvas ref="roomCanvas"></canvas>
      </template>
    </room-modal>
  </section>
</template>

<script setup>
import { onMounted, ref, useTemplateRef, watch } from "vue";
import { useMeetings } from "../composables/useMeetings";

import { supabase } from "../utils/supabase";
import RoomModal from "./RoomModal.vue";
import { DuplexeScene } from "../room-scenes/DuplexeScene";
import { useMinSecCountdown } from "../composables/useMinSecCountdown";
import { isToday } from "../utils/compareDateTime";

import { Client, getStateCallbacks } from "colyseus.js";

const { currentUserMeetings, loading, error, currentUser, requester } =
  useMeetings();

console.log("current", currentUserMeetings);

const bjsCanvas = useTemplateRef("roomCanvas");

let theEnv = ref("");
let theDuration = ref("");
let theRoom = ref("");
const lapsed = ref();
const localStream = ref();
const timeup = ref(false);

function countdownTimer(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let result = "";
  const blanket = document.getElementById("blanket");

  const interval = setInterval(() => {
    if (totalSeconds > 0) {
      blanket.style.display = "block";

      totalSeconds--;
      if (totalSeconds * 1000 < 60000) {
        blanket.style.color = "red";
      }
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      result = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

      theDuration.value = result;
    } else {
      result = "Done!";
      theDuration.value = result;

      timeup.value = true;

      clearInterval(interval);
    }
  }, 1000);
}

// async function copyContent() {
//   const text = document.getElementById("roomText").innerText;
//   try {
//     await navigator.clipboard.writeText(text);
//     console.log("Content copied to clipboard");
//   } catch (err) {
//     console.error("Failed to copy: ", err);
//   }
// }
// document.getElementById("roomText").addEventListener("click", () => {
//   event.preventDefault();
//   copyContent();
// });

const joinMeet = (envVal, durationVal, roomVal) => {
  theEnv.value = envVal;
  theDuration.value = durationVal;
  theRoom.value = roomVal;
  const { minutes, seconds } = useMinSecCountdown(theDuration.value);

  if (
    window.confirm(
      "Are you and your date ready to begin? The timer starts counting once you agree."
    )
  ) {
    lapsed.value = `${minutes.value}:${seconds.value}`;
    console.log(`Duration: ${minutes.value}:${seconds.value}`);

    const client = new Client("http://localhost:2567");
    const newRoom = new DuplexeScene(bjsCanvas.value, client);
    newRoom.connectToRoom(theEnv.value, theRoom.value, theDuration.value);

    const newRoomTime = newRoom.exportedTimer(+theDuration.value);

    console.log("newRoomTime: ", newRoomTime);
    //  countdownTimer(theDuration.value);
    countdownTimer(newRoomTime);
    // console.log("roomFull?", newRoom.roomFull);
    // console.log("playerCount", newRoom.playerCount);
    // if (newRoom.playerCount === 2) {
    //   console.log(">>>>>>BAZINGA!<<<<<<<");
    // }

    // watch(
    //   () => newRoom.roomFull,
    //   (val, prevVal) => {
    //     console.log(`val:${val} - prev:${prevVal}`);
    //   }
    // );

    // Get mic access
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      localStream.value = stream;
      // You can now add this stream to your WebRTC peer connection
    });
  } else {
    window.alert(
      "Make sure your partner is also ready to Join at the same time."
    );
    window.location.reload();
  }
}; // joinMeet()

const rejectMeet = async (id, user0, user1) => {
  if (
    window.confirm(
      `Are you sure you want to cancel the Meet with ${
        currentUser === requester ? user0 : user1
      }?`
    )
  ) {
    await supabase.from("meetings").delete().eq("id", id);
    window.location.reload();
  }
};
</script>

<style lang="css" scoped>
.blanket {
  width: 5%;
  height: 5%;
  position: absolute;
  text-align: center;
  top: 5%;
  right: 5%;
  z-index: 900;
  background-color: black;
  color: white;
  font-weight: bold;
  opacity: 0.4;
  display: none;
}
button {
  max-width: 68px;
  margin: 4px;
}
canvas {
  width: 100%;
  height: 100%;
}
.item-wrap {
  padding: 8px;
  background-color: rgb(230, 230, 225);
  margin: 4px;
}
li {
  list-style-type: none;
}
.section {
  margin-top: 10%;
  position: relative;
}
</style>
