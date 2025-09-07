import {
  ArcRotateCamera,
  Engine,
  Scene,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color3,
  HemisphericLight,
  type Nullable,
} from "@babylonjs/core";
import { Client, Room } from "colyseus.js";
import { setupInputControls } from "./inputController";

const createScene = (
  canvas: Nullable<
    | HTMLCanvasElement
    | OffscreenCanvas
    | WebGLRenderingContext
    | WebGL2RenderingContext
  >
) => {
  const engine = new Engine(canvas);
  const scene = new Scene(engine);

  const client = new Client("http://localhost:2567");
  console.log("client..", client);

  // const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  const camera = new ArcRotateCamera(
    "Camera",
    -Math.PI / 2,
    Math.PI / 4,
    10,
    Vector3.Zero(),
    scene
  );
  camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, true);

  new HemisphericLight("light", Vector3.Up(), scene);

  const ground = MeshBuilder.CreateGround(
    "ground",
    { height: 50, width: 50, subdivisions: 10 },
    scene
  );
  ground.position.y = 0; //-1.4;
  const groundMat = new StandardMaterial("groundMat");
  groundMat.backFaceCulling = false;
  groundMat.diffuseColor = new Color3(0, 0, 0);
  ground.material = groundMat;

  ground.checkCollisions = true;
  ground.receiveShadows = true;

  const boxRed = MeshBuilder.CreateBox("box-red", { size: 0.6 }, scene);
  const materialRed = new StandardMaterial("box-red-material", scene);
  materialRed.diffuseColor = Color3.Red();
  boxRed.material = materialRed;
  boxRed.position.x = -2;
  boxRed.position.y = 0.3;

  const boxYellow = MeshBuilder.CreateBox("box-yellow", { size: 0.6 }, scene);
  const materialYellow = new StandardMaterial("box-blue-material", scene);
  materialYellow.diffuseColor = Color3.Yellow();
  boxYellow.material = materialYellow;
  boxYellow.position.y = 0.3;
  boxYellow.position.x = -4;

  const box = MeshBuilder.CreateBox("box", { size: 0.6 }, scene);
  box.position.y = 0.25;
  const material = new StandardMaterial("box-material", scene);
  material.diffuseColor = Color3.Green();
  box.material = material;

  setupInputControls(scene, box);

  engine.runRenderLoop(() => {
    scene.render();
    // if (fpsCallback) {
    //   fpsCallback(engine.getFps().toFixed());
    // }
  });
};

export { createScene };
