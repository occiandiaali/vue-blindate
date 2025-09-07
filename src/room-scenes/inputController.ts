import {
  ActionManager,
  KeyboardEventTypes,
  Scene,
  Mesh,
  Vector3,
} from "@babylonjs/core";

export function setupInputControls(scene: Scene, cube: Mesh) {
  const inputMap: { [key: string]: boolean } = {};

  scene.actionManager = new ActionManager(scene);

  scene.onKeyboardObservable.add((kbInfo) => {
    const key = kbInfo.event.key.toLowerCase();
    if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
      inputMap[key] = true;
    } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
      inputMap[key] = false;
    }
  });

  scene.onBeforeRenderObservable.add(() => {
    const speed = 0.1;
    if (inputMap["w"]) cube.moveWithCollisions(new Vector3(0, 0, -speed));
    if (inputMap["s"]) cube.moveWithCollisions(new Vector3(0, 0, speed));
    if (inputMap["a"]) cube.moveWithCollisions(new Vector3(-speed, 0, 0));
    if (inputMap["d"]) cube.moveWithCollisions(new Vector3(speed, 0, 0));
    if (inputMap[" "]) {
      cube.moveWithCollisions(new Vector3(0, speed, 0)); // Simple jump impulse
      setTimeout(() => {
        cube.moveWithCollisions(new Vector3(0, -speed, 0)); // Simple jump impulse
      }, 250);
    }
  });
  //   let canJump = true;

  //   scene.onBeforeRenderObservable.add(() => {
  //     const speed = 0.1;
  //     if (inputMap["w"]) cube.moveWithCollisions(new Vector3(0, 0, -speed));
  //     if (inputMap["s"]) cube.moveWithCollisions(new Vector3(0, 0, speed));
  //     if (inputMap["a"]) cube.moveWithCollisions(new Vector3(-speed, 0, 0));
  //     if (inputMap["d"]) cube.moveWithCollisions(new Vector3(speed, 0, 0));

  //     // Jump
  //     if (inputMap[" "] && canJump) {
  //       cube.moveWithCollisions(new Vector3(0, 0.5, 0));
  //       canJump = false;
  //       setTimeout(() => (canJump = true), 500); // Cooldown
  //     }
  //   });
}
