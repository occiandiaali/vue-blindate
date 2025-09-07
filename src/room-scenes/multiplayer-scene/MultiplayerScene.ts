import {
  ArcRotateCamera,
  Engine,
  Scene,
  //FreeCamera,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Vector3,
  StandardMaterial,
  Color3,
} from "@babylonjs/core";
import { Client, Room } from "colyseus.js";
import { setupInputControls } from "./inputController";

export class MultiplayerScene {
  private engine: Engine;
  private scene: Scene;
  private camera!: ArcRotateCamera; //FreeCamera;
  private client!: Client;
  private room!: Room;
  private roomName: string;
  private cubes: { [sessionId: string]: Mesh } = {};
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, roomName: string) {
    this.canvas = canvas;
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);
    this.client = new Client("ws://localhost:2567");
    this.roomName = roomName;

    this.createCamera();
    this.createLight();
    //  this.createGround();
    this.connectToRoom(this.roomName);

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
    this.camera.setTarget(Vector3.Zero());
    this.camera.attachControl(this.canvas, true);
  }

  private createLight() {
    new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
  }

  private createGround(roomName: string) {
    const ground = MeshBuilder.CreateGround(
      "ground",
      { height: 50, width: 50, subdivisions: 10 },
      this.scene
    );
    ground.position.y = 0; //-1.4;
    const groundMat = new StandardMaterial("groundMat");
    groundMat.backFaceCulling = false;
    if (roomName == "green_room") {
      groundMat.diffuseColor = Color3.Green();
    }
    if (roomName == "my_room") {
      groundMat.diffuseColor = new Color3(0, 0, 0);
    }
    ground.material = groundMat;

    ground.checkCollisions = true;
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
  }

  private async connectToRoom(roomName: string) {
    this.createGround(roomName);
    // this.client = new Client("ws://localhost:2567");
    // this.room = await this.client.joinOrCreate(roomName);
    this.client
      .joinOrCreate(roomName)
      .then((room) => {
        this.room = room;
        // Create cube for each player
        this.room.state.players.onAdd = (player: any, sessionId: string) => {
          const cube = MeshBuilder.CreateBox(
            `cube-${sessionId}`,
            { size: 2 },
            this.scene
          );
          cube.position = new Vector3(player.x, player.y, player.z);
          cube.checkCollisions = true;

          const mat = new StandardMaterial(`mat-${sessionId}`, this.scene);
          mat.diffuseColor =
            sessionId === this.room.sessionId ? Color3.Blue() : Color3.Red();
          cube.material = mat;

          this.cubes[sessionId] = cube;

          // Sync remote player movement
          player.onChange = () => {
            if (sessionId !== this.room.sessionId) {
              cube.position.set(player.x, player.y, player.z);
            }
          };
        };
        // Remove cube when player leaves
        this.room.state.players.onRemove = (
          _player: any,
          sessionId: string
        ) => {
          this.cubes[sessionId]?.dispose();
          delete this.cubes[sessionId];
        };

        // Setup input for local player
        setupInputControls(this.scene, this.room, this.cubes);
      })
      .catch((e) => console.error(e));
  }
}
