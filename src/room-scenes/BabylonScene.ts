import * as BABYLON from "@babylonjs/core";

class BabylonScene {
  private scene: BABYLON.Scene;
  private engine: BABYLON.Engine;
  private scenario: string;

  constructor(canvas: HTMLCanvasElement, scenario: string) {
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = this.createScene(canvas);
    this.scenario = scenario;

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  private createScene(canvas: HTMLCanvasElement): BABYLON.Scene {
    const scene = new BABYLON.Scene(this.engine);
    const camera = new BABYLON.ArcRotateCamera(
      "Camera",
      Math.PI / 2,
      Math.PI / 4,
      10,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    new BABYLON.HemisphericLight(
      "hemisphericLight",
      new BABYLON.Vector3(1, 1, 0),
      scene
    );
    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { height: 50, width: 50, subdivisions: 10 },
      scene
    );
    ground.position.y = 0; //-1.4;
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.backFaceCulling = false;
    groundMat.diffuseColor =
      this.scenario !== "black"
        ? new BABYLON.Color3(0, 0, 0)
        : BABYLON.Color3.Green();
    ground.material = groundMat;

    ground.checkCollisions = true;
    ground.receiveShadows = true;

    const boxRed = BABYLON.MeshBuilder.CreateBox(
      "box-red",
      { size: 0.6 },
      scene
    );
    const materialRed = new BABYLON.StandardMaterial("box-red-material", scene);
    materialRed.diffuseColor = BABYLON.Color3.Red();
    boxRed.material = materialRed;
    boxRed.position.x = -2;
    boxRed.position.y = 0.3;
    boxRed.checkCollisions = true;
    boxRed.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    return scene;
  }
}

export default BabylonScene;
