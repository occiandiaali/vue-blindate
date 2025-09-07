import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Vector3,
  StandardMaterial,
  Color3,
  //  FreeCamera,
} from "@babylonjs/core";
import { setupInputControls } from "./inputController";
import { Client, Room } from "colyseus.js";

export class CubeScene {
  private engine: Engine;
  private scene: Scene;
  private camera!: ArcRotateCamera; //FreeCamera;
  private cube!: Mesh;
  private client!: Client;
  // private roomName!: Room;
  // //private scenario: string;
  // private cubes: { [sessionId: string]: Mesh } = {};

  constructor(canvas: HTMLCanvasElement, r: string, c: Client) {
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);
    this.scene.gravity = new Vector3(0, -0.9, 0);
    // this.scenario = scenario;

    this.createCamera(canvas);
    this.createLight();
    //this.createCube(cubeName);
    this.createCube();
    setupInputControls(this.scene, this.cube);
    this.createGround(r);
    // this.createWarehouseTerrain();
    // this.connectToRoom(this.scenario, this.client)
    this.client = c;
    this.connectToRoom(r, this.client);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  private createCamera(canvas: HTMLCanvasElement) {
    //this.camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);
    this.camera = new ArcRotateCamera(
      "Camera",
      Math.PI / 2,
      Math.PI / 4,
      10,
      Vector3.Zero(),
      this.scene
    );

    this.camera.setTarget(Vector3.Zero());
    this.camera.attachControl(canvas, true);
  }

  private createLight() {
    new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);
  }

  private createCube() {
    this.cube = MeshBuilder.CreateBox("player", { size: 0.6 }, this.scene);
    this.cube.position.y = 0.25;

    const material = new StandardMaterial("cubeMat", this.scene);
    material.diffuseColor = Color3.Random();
    this.cube.material = material;

    // Enable collisions
    this.scene.collisionsEnabled = true;
    this.cube.checkCollisions = true;
    this.cube.ellipsoid = new Vector3(1, 0.3, 1);
  }

  private createGround(s: string) {
    const ground = MeshBuilder.CreateGround(
      "ground",
      { height: 50, width: 50, subdivisions: 10 },
      this.scene
    );
    ground.position.y = 0; //-1.4;
    const groundMat = new StandardMaterial("groundMat");
    groundMat.backFaceCulling = false;
    groundMat.diffuseColor =
      //this.scenario == "black" ? new Color3(0, 0, 0) : Color3.Green();
      s == "my_room" ? new Color3(0, 0, 0) : Color3.Green();
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

  async connectToRoom(r: string, c: Client) {
    // this.client = new Client("ws://localhost:2567");
    c.joinOrCreate(r)
      .then((room) => {
        console.log("thisRoomNameState", room.state);
        console.log("Client: ", c);
        // this.createGround(r);
        // this.createCube();

        // this.roomName.state.players.onAdd = (
        //   player: any,
        //   sessionId: string
        // ) => {
        //   const cube = MeshBuilder.CreateBox(
        //     `cube-${sessionId}`,
        //     { size: 2 },
        //     this.scene
        //   );
        //   cube.position = new Vector3(player.x, player.y, player.z);
        //   cube.checkCollisions = true;

        //   const mat = new StandardMaterial(`mat-${sessionId}`, this.scene);
        //   mat.diffuseColor =
        //     sessionId === this.roomName.sessionId
        //       ? Color3.Random()
        //       : Color3.Random();
        //   cube.material = mat;

        //   this.cubes[sessionId] = cube;

        //   // Sync remote player movement
        //   player.onChange = () => {
        //     if (sessionId !== this.roomName.sessionId) {
        //       cube.position.set(player.x, player.y, player.z);
        //     }
        //   };
        // };
      })
      .catch((e) => console.error(e));
  }
  //   private createWarehouseTerrain() {
  //     // Ground
  //     const ground = MeshBuilder.CreateGround(
  //       "ground",
  //       { width: 50, height: 50 },
  //       this.scene
  //     );
  //     ground.checkCollisions = true;

  //     // Crates (jumpable boxes)
  //     const crateSizes = [2, 3, 4];
  //     crateSizes.forEach((size, i) => {
  //       const crate = MeshBuilder.CreateBox(
  //         `crate${i}`,
  //         { size: size },
  //         this.scene
  //       );
  //       crate.position = new Vector3(i * 5 - 10, size / 2, 5);
  //       crate.checkCollisions = true;

  //       const mat = new StandardMaterial(`crateMat${i}`, this.scene);
  //       mat.diffuseColor = new Color3(0.6, 0.4, 0.2); // Brownish
  //       crate.material = mat;
  //     });

  //     // Ramps
  //     const ramp = MeshBuilder.CreateBox(
  //       "ramp",
  //       { width: 6, height: 0.5, depth: 3 },
  //       this.scene
  //     );
  //     ramp.rotation.x = Math.PI / 6; // Tilted
  //     ramp.position = new Vector3(-5, 0.25, -5);
  //     ramp.checkCollisions = true;

  //     // Walls
  //     const wallMat = new StandardMaterial("wallMat", this.scene);
  //     wallMat.diffuseColor = new Color3(0.3, 0.3, 0.3);

  //     const wallPositions = [
  //       { x: 0, y: 5, z: -25 },
  //       { x: 0, y: 5, z: 25 },
  //       { x: -25, y: 5, z: 0 },
  //       { x: 25, y: 5, z: 0 },
  //     ];

  //     wallPositions.forEach((pos, i) => {
  //       const wall = MeshBuilder.CreateBox(
  //         `wall${i}`,
  //         { width: 50, height: 10, depth: 1 },
  //         this.scene
  //       );
  //       wall.position = new Vector3(pos.x, pos.y, pos.z);
  //       wall.checkCollisions = true;
  //       wall.material = wallMat;
  //     });
  //   }
}
