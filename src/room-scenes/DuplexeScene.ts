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
import { Client, getStateCallbacks, Room } from "colyseus.js";
import { setupInputControls } from "../room-scenes/multiplayer-scene/inputController";
import {
  countdown,
  millisToMinutesAndSeconds,
} from "../utils/millisToMinsAndSecs";

export class DuplexeScene {
  private engine: Engine;
  private scene: Scene;
  private camera!: ArcRotateCamera; //FreeCamera;
  private client!: Client;
  private room!: Room;

  theTime!: number;
  roomFull!: boolean;
  playerCount = 0;

  private cubes: { [sessionId: string]: Mesh } = {};
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, thisClient: Client) {
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

  private createCamera() {
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

  private createLight() {
    new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
  }

  private createGround(roomName: string) {
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
      "box-blue-material",
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

  async connectToRoom(roomName: string, cName: string, expiry: number) {
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
        button1.fontSize = 150;
        button1.background = "black";

        button1.onPointerUpObservable.add(function () {
          alert(`Session duration: ${millisToMinutesAndSeconds(expiry)} mins`);
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
        this.canvas.appendChild(audio);
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
        // console.log("startDate for >>>>");
        // console.log(data / 1000 / 60, " minutes..");
        this.exportedTimer(+data.time);
      });
      this.room.onMessage("players", (data) => {
        console.log("room length: ", data);
        if (data === 2) {
          this.roomFull = true;
          console.log("Room Full!", this.roomFull);
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
