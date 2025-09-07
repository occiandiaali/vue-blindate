// class BlackgroundScene {
//   canvas: any;
//   room: any;
//   engine: any;
//   scene: any;
//   players: {};
//   camera: any;
//   ground: any;
//   socket: any;
//   localPlayer: any;
//   position: any;
//   speed = 0.1;
//   direction: any;
//   keys: {} | undefined;
//   constructor(canvas: HTMLCanvasElement, room: string) {
//     this.canvas = canvas;

//     this.room = room;
//     this.engine = new BABYLON.Engine(canvas, true);
//     this.scene = new BABYLON.Scene(this.engine);
//     this.players = {};

//     this._setupCamera();
//     this._setupLights();
//     this._setupGround();
//     this._setupSocketEvents();
//     this._createLocalPlayer();

//     this.engine.runRenderLoop(() => {
//       this._handleInput();
//       this.scene.render();
//     });

//     window.addEventListener("resize", () => {
//       this.engine.resize();
//     });
//   }

//   // _setupCamera() {
//   //   this.camera = new BABYLON.ArcRotateCamera(
//   //     "Camera",
//   //     -Math.PI / 2,
//   //     Math.PI / 4,
//   //     10,
//   //     BABYLON.Vector3.Zero(),
//   //     this.scene
//   //   );
//   //   this.camera.attachControl(this.canvas, true);
//   // }
//   _setupCamera() {
//     this.camera = new BABYLON.UniversalCamera(
//       "FirstPersonCamera",
//       new BABYLON.Vector3(0, 0.4, 0),
//       this.scene
//     );
//     this.camera.attachControl(this.canvas, true);

//     // Enable collisions and gravity
//     this.camera.checkCollisions = true;
//     this.camera.applyGravity = true;

//     // Define collision shape
//     this.camera.ellipsoid = new BABYLON.Vector3(0.3, 0.6, 0.3);

//     // Restrict movement to ground level
//     this.camera.minZ = 0.1;
//   }

//   _setupLights() {
//     const light = new BABYLON.HemisphericLight(
//       "light",
//       new BABYLON.Vector3(0, 1, 0),
//       this.scene
//     );
//     light.intensity = 0.7;
//     const directionalLight = new BABYLON.DirectionalLight(
//       "dirLight",
//       new BABYLON.Vector3(-1, -2, -1),
//       this.scene
//     );
//     directionalLight.position = new BABYLON.Vector3(20, 40, 20);
//     // Optional: enable shadows
//     const shadowGenerator = new BABYLON.ShadowGenerator(1024, directionalLight);
//     shadowGenerator.useBlurExponentialShadowMap = true;
//     shadowGenerator.blurKernel = 32;
//   }

//   _setupGround() {
//     //  BABYLON.MeshBuilder.CreateGround("ground", { width: 120, height: 120 }, this.scene);
//     this.ground = BABYLON.MeshBuilder.CreateGround(
//       "ground",
//       { height: 50, width: 50, subdivisions: 10 },
//       this.scene
//     );
//     this.ground.position.y = 0; //-1.4;
//     const groundMat = new BABYLON.StandardMaterial("groundMat");
//     groundMat.backFaceCulling = false;
//     groundMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
//     this.ground.material = groundMat;

//     this.ground.checkCollisions = true;
//     this.ground.receiveShadows = true;

//     createMaze(this.scene);
//   }

//   _getSpawnPosition(playerId: string) {
//     const spawnPoints = [
//       new BABYLON.Vector3(-2, 0.25, -2), // Player 1
//       new BABYLON.Vector3(2, 0.25, 2), // Player 2
//     ];

//     // Use socket ID or index to assign a spawn point
//     const index = Object.keys(this.players).length % spawnPoints.length;
//     return spawnPoints[index];
//   }

//   _createCube(id: string, color = "orange") {
//     const spawnPos = this._getSpawnPosition(id);
//     const box = BABYLON.MeshBuilder.CreateBox(id, { size: 0.4 }, this.scene);
//     box.position.copyFrom(spawnPos);
//     box.position.y = 0.25;

//     const mat = new BABYLON.StandardMaterial(`${id}-mat`, this.scene);
//     // mat.diffuseColor =
//     //   BABYLON.Color3[color.toUpperCase()] || BABYLON.Color3.Blue();
//     mat.diffuseColor = BABYLON.Color3.Random();
//     box.material = mat;
//     box.checkCollisions = true;

//     // Define collision shape and offset
//     box.ellipsoid = new BABYLON.Vector3(0.3, 0.3, 0.3);
//     box.ellipsoidOffset = new BABYLON.Vector3(0, 0.25, 0);

//     this.players[id] = box;
//     return box;
//   }

//   _createLocalPlayer() {
//     // Enable collision system in the scene
//     this.scene.collisionsEnabled = true;

//     const spawnPos = this._getSpawnPosition(this.socket.id);

//     this.localPlayer = this._createCube("localPlayer", "green");
//     this.localPlayer.position.copyFrom(spawnPos);
//    // this.players[this.socket.id] = this.localPlayer;
//     this.position = this.localPlayer.position.clone();
//     this.speed = 0.1;
//     this.direction = new BABYLON.Vector3();

//     this.keys = {};
//     window.addEventListener("keydown", (e) => (this.keys[e.key] = true));
//     window.addEventListener("keyup", (e) => (this.keys[e.key] = false));
//   }

//   // _handleInput() {
//   //   let moved = false;
//   //   if (this.keys["w"] || this.keys["ArrowUp"]) {
//   //     this.position.z -= this.speed;
//   //     moved = true;
//   //   }
//   //   if (this.keys["s"] || this.keys["ArrowDown"]) {
//   //     this.position.z += this.speed;
//   //     moved = true;
//   //   }
//   //   if (this.keys["a"] || this.keys["ArrowLeft"]) {
//   //     this.position.x -= this.speed;
//   //     moved = true;
//   //   }
//   //   if (this.keys["d"] || this.keys["ArrowRight"]) {
//   //     this.position.x += this.speed;
//   //     moved = true;
//   //   }

//   //   if (moved) {
//   //     this.localPlayer.position.copyFrom(this.position);
//   //     this.socket.emit("move", this.position);
//   //   }
//   // }

//   _handleInput() {
//     this.direction.set(0, 0, 0);

//     if (this.keys["w"] || this.keys["ArrowUp"]) {
//       this.direction.z -= this.speed;
//     }
//     if (this.keys["s"] || this.keys["ArrowDown"]) {
//       this.direction.z += this.speed;
//     }
//     if (this.keys["a"] || this.keys["ArrowLeft"]) {
//       this.direction.x -= this.speed;
//     }
//     if (this.keys["d"] || this.keys["ArrowRight"]) {
//       this.direction.x += this.speed;
//     }

//     if (!this.direction.equals(BABYLON.Vector3.Zero())) {
//       this.localPlayer.moveWithCollisions(this.direction);
//       // Move camera to follow the player
//       const camOffset = new BABYLON.Vector3(0, 0.3, 0); // Eye level
//       this.camera.position = this.localPlayer.position.add(camOffset);
//       this.socket.emit("move", this.localPlayer.position.clone());
//     }
//   }

//   _setupSocketEvents() {
//     const peerConnection = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     let localStream;

//     // 1. Get microphone access
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         localStream = stream;
//         stream
//           .getTracks()
//           .forEach((track) => peerConnection.addTrack(track, stream));
//       })
//       .catch((err) => console.error("Microphone access error:", err));

//     // 2. Handle ICE candidates
//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         this.socket.emit("ice-candidate", {
//           room: this.room,
//           candidate: event.candidate.candidate,
//           sdpMid: event.candidate.sdpMid,
//           sdpMLineIndex: event.candidate.sdpMLineIndex,
//         });
//       }
//     };

//     // 3. Receive remote audio and play it
//     peerConnection.ontrack = (event) => {
//       const remoteStream = event.streams[0];
//       const audio = new Audio();
//       audio.srcObject = remoteStream;
//       audio.play();
//     };

//     // this.socket.on("start_chat", async () => {
//     //   const offer = await peerConnection.createOffer();
//     //   await peerConnection.setLocalDescription(offer);
//     //   this.socket.emit("offer", { room: this.room, offer: offer });
//     // });
//   }
// }

// function createMaze(
//   scene: any,
//   groundSize = 20,
//   wallHeight = 2,
//   wallThickness = 0.5
// ) {
//   const wallMaterial = new BABYLON.StandardMaterial("wallMat", scene);
//   wallMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6); // Cement-like gray
//   wallMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

//   const walls: any[] = [];

//   // Outer boundaries
//   const positions = [
//     { x: 0, z: -groundSize / 2 }, // Top
//     { x: 0, z: groundSize / 2 }, // Bottom
//     { x: -groundSize / 2, z: 0 }, // Left
//     { x: groundSize / 2, z: 0 }, // Right
//   ];

//   positions.forEach((pos, i) => {
//     const isHorizontal = i < 2;
//     const wall = BABYLON.MeshBuilder.CreateBox(
//       `wall-${i}`,
//       {
//         width: isHorizontal ? groundSize : wallThickness,
//         height: wallHeight,
//         depth: isHorizontal ? wallThickness : groundSize,
//       },
//       scene
//     );

//     wall.position.set(pos.x, wallHeight / 2, pos.z);
//     wall.material = wallMaterial;
//     wall.checkCollisions = true;

//     walls.push(wall);
//   });

//   // Internal maze walls (example layout)
//   const mazeLayout = [
//     { x: -5, z: -5, width: 10, depth: wallThickness },
//     { x: -5, z: 0, width: wallThickness, depth: 10 },
//     { x: 5, z: 5, width: 10, depth: wallThickness },
//     { x: 5, z: 0, width: wallThickness, depth: 10 },
//   ];

//   mazeLayout.forEach((config, i) => {
//     const wall = BABYLON.MeshBuilder.CreateBox(
//       `maze-wall-${i}`,
//       {
//         width: config.width,
//         height: wallHeight,
//         depth: config.depth,
//       },
//       scene
//     );

//     wall.position.set(config.x, wallHeight / 2, config.z);
//     wall.material = wallMaterial;
//     wall.checkCollisions = true;

//     walls.push(wall);
//   });

//   return walls;
// }
