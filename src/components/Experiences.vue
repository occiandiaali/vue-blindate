<template>
  <section class="section">
    <div v-if="loading">Loading experiences...</div>
    <p v-else-if="Object.keys(currentUserMeetings).length === 0">
      You have no Experiences to show
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

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { useMeetings } from "../composables/useMeetings";

import { supabase } from "../utils/supabase";
import RoomModal from "./RoomModal.vue";

import { useMinSecCountdown } from "../composables/useMinSecCountdown";
import { isToday } from "../utils/compareDateTime";

import { Client, getStateCallbacks, Room } from "colyseus.js";

const { currentUserMeetings, loading, error, currentUser, requester } =
  useMeetings();

console.log("current", currentUserMeetings);

const bjsCanvas = useTemplateRef("roomCanvas") || null;

let theEnv = ref("");
let theDuration = ref("");
let theRoom = ref("");
const lapsed = ref();
const localStream = ref();
const timeup = ref(false);

function countdownTimer(ms: number) {
  let totalSeconds = Math.floor(ms / 1000);
  let result = "";
  const blanket = document.getElementById("blanket");

  const interval = setInterval(() => {
    if (totalSeconds > 0) {
      blanket!.style.display = "block";

      totalSeconds--;
      if (totalSeconds * 1000 < 60000) {
        blanket!.style.color = "red";
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

const joinMeet = (envVal: string, durationVal: string, roomVal: string) => {
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

    const newRoom = new RoomScene(bjsCanvas.value, client);
    newRoom.connectToRoom(theEnv.value, theRoom.value, theDuration.value);

    // Get mic access
    // navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    //   localStream.value = stream;
    //   // You can now add this stream to your WebRTC peer connection

    // });
  } else {
    window.alert(
      "Make sure your partner is also ready to Join at the same time."
    );
    window.location.reload();
  }
}; // joinMeet()

const rejectMeet = async (id: any, user0: any, user1: any) => {
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

//======================================
import {
  ArcRotateCamera,
  Engine,
  Scene,
  //FreeCamera,
  HemisphericLight,
  //ImportMeshAsync,
  Mesh,
  MeshBuilder,
  Vector3,
  StandardMaterial,
  Color3,
  //UniversalCamera,
  // LoadAssetContainerAsync,
} from "@babylonjs/core";
import {
  AdvancedDynamicTexture,
  Button,
  InputText,
  TextBlock,
} from "@babylonjs/gui/2D";
import "@babylonjs/loaders";
//import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";

import { setupInputControls } from "../room-scenes/multiplayer-scene/inputController";
import {
  countdown,
  millisToMinutesAndSeconds,
} from "../utils/millisToMinsAndSecs";

class RoomScene {
  engine: Engine;
  scene: Scene;
  camera!: ArcRotateCamera; //FreeCamera;
  client!: Client;
  room!: Room;

  theTime!: number;
  roomFull!: boolean;
  playerCount = 0;

  cubes: { [sessionId: string]: Mesh } = {};
  canvas: HTMLCanvasElement | null;

  constructor(canvas: HTMLCanvasElement | null, thisClient: Client) {
    this.canvas = canvas;
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);
    this.client = thisClient;

    this.createCamera();
    this.createLight();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  createCamera() {
    //this.camera = new FreeCamera("camera", new Vector3(0, 5, -10), this.scene);
    this.camera = new ArcRotateCamera(
      "Camera",
      Math.PI / 2,
      Math.PI / 4,
      10,
      Vector3.Zero(),
      this.scene
    );
    //  this.camera.setTarget(Vector3.Zero());
    this.camera.attachControl(this.canvas, true);
  }

  createLight() {
    new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
  }

  createGround(roomName: string) {
    // registerBuiltInLoaders();
    // LoadAssetContainerAsync("/models/lowpoly_houses.glb", this.scene);
    // ImportMeshAsync("/models/lowpoly_houses.glb", this.scene, {});
    const ground = MeshBuilder.CreateGround(
      "ground",
      { height: 100, width: 100, subdivisions: 10 },
      this.scene
    );
    // ground.position.y = -1.5;
    const groundMat = new StandardMaterial("groundMat");
    groundMat.backFaceCulling = false;
    if (roomName == "green_room") {
      groundMat.diffuseColor = Color3.Green();
    }
    if (roomName == "my_room") {
      groundMat.diffuseColor = new Color3(0, 0, 0);
    }
    if (roomName == "maze_room") {
      groundMat.diffuseColor = new Color3(132, 115, 90);
    }
    ground.material = groundMat;

    // ground.checkCollisions = true;
    ground.receiveShadows = true;

    // Crates (jumpable boxes)
    const crateSizes = [0.4, 1.5, 2];
    crateSizes.forEach((size, i) => {
      const crate = MeshBuilder.CreateBox(
        `crate${i}`,
        { size: size },
        this.scene
      );
      crate.position = new Vector3(i * 5 - 10, size / 2, 5);
      crate.checkCollisions = true;

      const mat = new StandardMaterial(`crateMat${i}`, this.scene);
      mat.diffuseColor = new Color3(0.6, 0.4, 0.2); // Brownish
      crate.material = mat;
    });

    // Crates (jumpable boxes)
    const crateSizes2 = [0.4, 1.5, 2];
    crateSizes2.forEach((size, i) => {
      const crate = MeshBuilder.CreateBox(
        `crate${i}`,
        { size: size },
        this.scene
      );
      crate.position = new Vector3(i * -5 - 10, size / 2, -5);
      crate.checkCollisions = true;

      const mat = new StandardMaterial(`crateMat${i}`, this.scene);
      mat.diffuseColor = new Color3(0.3, 0.2, 0.1); // Brownish
      crate.material = mat;
    });

    //================

    //texture

    /**** World Objects *****/

    const boxYellow = MeshBuilder.CreateBox(
      "box-yellow",
      { size: 0.6 },
      this.scene
    );
    const materialYellow = new StandardMaterial(
      "box-yellow-material",
      this.scene
    );
    materialYellow.diffuseColor = Color3.Yellow();
    boxYellow.material = materialYellow;
    boxYellow.position.y = 0.3;
    boxYellow.position.x = -8;
  }

  exportedTimer = (val: number) => {
    this.theTime = val;
    return this.theTime;
  };

  async connectToRoom(roomName: string, cName: string, expiry: string) {
    this.createGround(roomName);
    this.room = await this.client.joinOrCreate(roomName, {
      custom_name: cName,
      expires: expiry,
    });

    const $ = getStateCallbacks(this.room);

    $(this.room.state).players.onAdd((player, sessionId) => {
      console.log("Player added!", player, sessionId);
      const cube = MeshBuilder.CreateBox(
        `cube-${sessionId}`,
        { size: 0.6 },
        this.scene
      );
      cube.position = new Vector3(player.x, player.y, player.z);
      cube.checkCollisions = true;
      this.camera.setTarget(cube.position);

      const mat = new StandardMaterial(`mat-${sessionId}`, this.scene);
      mat.diffuseColor =
        sessionId === this.room.sessionId ? Color3.Blue() : Color3.Red();
      cube.material = mat;

      if (sessionId === this.room.sessionId) {
        // GUI
        var plane = Mesh.CreatePlane("plane", 1, this.scene);
        plane.parent = cube;
        plane.position.y = 0.6;

        plane.billboardMode = Mesh.BILLBOARDMODE_ALL;

        const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);

        const button1 = Button.CreateSimpleButton("but1", "You");
        button1.width = 1;
        button1.height = 0.4;
        button1.color = "white";
        button1.cornerRadius = 24;
        button1.fontSize = 164;
        button1.background = "black";

        button1.onPointerUpObservable.add(function () {
          alert(`Session duration: ${millisToMinutesAndSeconds(+expiry)} mins`);
        });
        advancedTexture.addControl(button1);

        //===============
        // const boxTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // const chatBox = new TextBlock();
        // chatBox.text = "Chat Messages";
        // chatBox.height = "100px";
        // chatBox.width = "200px";
        // chatBox.color = "white";
        // chatBox.color = "black";
        // chatBox.paddingTop = "60px";
        // chatBox.paddingLeft = -400;

        // boxTexture.addControl(chatBox);

        // const input = new InputText();
        // input.width = "200px";
        // input.height = "40px";
        // input.color = "white";
        // input.background = "black";
        // input.placeholderText = "Type your message...";
        // input.left = -400;

        // boxTexture.addControl(input);

        //================
      }

      this.cubes[sessionId] = cube;
      // if (sessionId === this.room.sessionId) {
      //   this.camera = new UniversalCamera(
      //     "fp-camera",
      //     cube.position.clone(),
      //     this.scene
      //   );
      //   this.camera.attachControl(true);
      //   this.camera.speed = 0.1;
      //   this.camera.inertia = 0; // Optional: remove camera lag
      //   this.camera.checkCollisions = true;
      //   this.camera.applyGravity = true;

      //   // Lock camera to cube
      //   this.camera.parent = cube;

      //   this.scene.activeCamera = this.camera;
      // }

      // WebRTC setup
      const peerConnection = new RTCPeerConnection();
      let localStream;

      // Get mic access
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        localStream = stream;
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));
      });

      // Handle incoming audio
      peerConnection.ontrack = (event) => {
        const audio = document.createElement("audio");
        audio.srcObject = event.streams[0];
        audio.autoplay = true;
        // document.body.appendChild(audio);
        this.canvas?.appendChild(audio);
      };

      // Send ICE candidates via Colyseus
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          //  room.send("ice", event.candidate);
          this.room.send("ice", event.candidate);
        }
      };

      // Colyseus message handling
      this.room.onMessage("offer", async (offer) => {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        this.room.send("answer", answer);
      });

      this.room.onMessage("answer", async (answer) => {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      });

      this.room.onMessage("ice", async (candidate) => {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      });

      // Initiate offer if first to join
      this.room.onStateChange((state) => {
        if (Object.keys(state.players).length === 2) {
          peerConnection.createOffer().then((offer) => {
            peerConnection.setLocalDescription(offer);
            this.room.send("offer", offer);
          });
        }
      });

      // // sync remote player motion
      // player.onChange = () => {
      //   if (sessionId !== this.room.sessionId) {
      //     cube.position.set(player.x, player.y, player.z);
      //     console.log(
      //       `Remote player motion: ${[player.x, player.y, player.z]}`
      //     );
      //   }
      // };

      console.log(`stateTimeLeft: ${this.room.state.timeLeft}`);

      this.room.onMessage("playerMoved", (data) => {
        const { sessionId, x, y, z } = data;
        const movedCube = this.cubes[sessionId];
        if (movedCube && sessionId !== this.room.sessionId) {
          movedCube.position.set(x, y, z);
        }
      });

      this.room.onMessage("playerJoined", (playerId) => {
        console.log(`${playerId} joined..`);

        cube.position.set(player.x, player.y, player.z);
        this.playerCount++;
      });
      this.room.onMessage("startDate", (data) => {
        // console.log("Date started for(mins):", data / 1000 / 60);
        console.log("startDate for >>>>");
        console.log(data);
        // console.log(data / 1000 / 60, " minutes..");
      });
      this.room.onMessage("players", (data) => {
        console.log("room length: ", data);
        if (data === 2) {
          this.roomFull = true;
          console.log("Room Full!", this.roomFull);
          countdownTimer(this.room.state.timeLeft);
        }
      });

      this.room.onMessage("playerLeft", (playerId) => {
        console.log(`${playerId} left..`);
      });
    });

    $(this.room.state).players.onRemove((player, sessionId) => {
      console.log("Player removed!", player, sessionId);
      this.cubes[sessionId]?.dispose();
      delete this.cubes[sessionId];
    });
    setupInputControls(this.scene, this.room, this.cubes);
  }
}
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
