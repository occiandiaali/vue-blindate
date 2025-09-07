import { KeyboardEventTypes, Scene, Mesh, Vector3 } from "@babylonjs/core";
import { Room } from "colyseus.js";

export function setupInputControls(
  scene: Scene,
  room: Room,
  cubes: { [sessionId: string]: Mesh }
) {
  const inputMap: { [key: string]: boolean } = {};
  const localCube = () => cubes[room.sessionId];

  scene.onKeyboardObservable.add((kbInfo) => {
    const key = kbInfo.event.key.toLowerCase();
    if (kbInfo.type === KeyboardEventTypes.KEYDOWN) inputMap[key] = true;
    if (kbInfo.type === KeyboardEventTypes.KEYUP) inputMap[key] = false;
  });

  scene.onBeforeRenderObservable.add(() => {
    const speed = 0.1;
    let dx = 0,
      dy = 0,
      dz = 0;

    if (inputMap["w"]) dz = -speed;
    if (inputMap["s"]) dz = speed;
    if (inputMap["a"]) dx = -speed;
    if (inputMap["d"]) dx = speed;

    if ((dx !== 0 || dz !== 0) && localCube()) {
      localCube().moveWithCollisions(new Vector3(dx, dy, dz));
      // const pos = localCube().position;
      // console.log(pos);
      // room.send("move", { x: dx, y: dy, z: dz });
      const pos = localCube().position;
      console.log(pos);
      room.send("move", { x: pos.x, y: pos.y, z: pos.z });
    }
  });
  // scene.onBeforeRenderObservable.add(() => {
  //   const speed = 0.1;
  //   const cube = localCube();
  //   if (!cube) return;

  //   const forward = scene.activeCamera?.getDirection(Vector3.Forward());
  //   const right = scene.activeCamera?.getDirection(Vector3.Right());

  //   let move = Vector3.Zero();

  //   if (inputMap["w"]) move = move.add(forward!);
  //   if (inputMap["s"]) move = move.subtract(forward!);
  //   if (inputMap["a"]) move = move.subtract(right!);
  //   if (inputMap["d"]) move = move.add(right!);

  //   if (!move.equals(Vector3.Zero())) {
  //     move.normalize().scaleInPlace(speed);
  //     cube.moveWithCollisions(move);
  //     room.send("move", {
  //       x: cube.position.x,
  //       y: cube.position.y,
  //       z: cube.position.z,
  //     });
  //   }
  // });
}
