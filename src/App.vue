<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import { createTunnel } from "./composable/createTunel.js";
import { createPacman } from "./composable/createPacman.js";
import createGhost from "./composable/createGhost.js";
import { drawMap } from "./composable/drawMap.js";
import {
  DIRECTION_RIGHT,
  DIRECTION_UP,
  DIRECTION_LEFT,
  DIRECTION_BOTTOM,
} from "./direction/direction.js";

const directions = {
  DIRECTION_RIGHT,
  DIRECTION_UP,
  DIRECTION_LEFT,
  DIRECTION_BOTTOM,
};
const oneBlockSize = 20;
const fps = 30;
const ghostImageLocations = [
  { x: 0, y: 0 },
  { x: 178, y: 0 },
  { x: 0, y: 121 },
  { x: 178, y: 121 },
];

const canva = ref(null);
const canvasContext = ref(null);
const pacmanFrames = ref(null);
const ghostFrames = ref(null);
const totalBits = ref(0);
const ghostCount = 3;
const ghosts = ref([]);
const gameState = reactive({
  map: [],
  pacman: null,
  draw: null,
});

let animationFrameId;

const initGhosts = () => {
  ghosts.value = Array.from({ length: ghostCount }, (_, i) =>
    createGhost(
      9 * oneBlockSize + (i % 2 === 0 ? 0 : 1) * oneBlockSize,
      10 * oneBlockSize + (i % 2 === 0 ? 0 : 1) * oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      5,
      ghostImageLocations[i % 4].x,
      ghostImageLocations[i % 4].y,
      124,
      116,
      6 + i,
      directions,
      gameState.map,
      oneBlockSize,
      gameState.pacman,
      canvasContext,
      ghostFrames
    )
  );
};

const initGame = () => {
  canvasContext.value = canva.value.getContext("2d");
  const tunnelData = createTunnel(23, 21);
  gameState.map = tunnelData.matrix;
  totalBits.value = tunnelData.totalBits;
  gameState.pacman = createPacman(
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 5,
    directions,
    gameState.map,
    oneBlockSize,
    canvasContext,
    pacmanFrames
  );
  initGhosts();
  gameState.draw = drawMap(
    canva,
    canvasContext,
    gameState.map,
    oneBlockSize,
    gameState.pacman,
    ghosts
  );
  startGameLoop();
};

const startGameLoop = () => {
  let lastFrameTime = 0;
  const frameDuration = 1000 / fps;

  const gameLoop = (timestamp) => {
    if (timestamp - lastFrameTime >= frameDuration) {
      updateGame();
      gameState.draw();
      ghosts.value.forEach((ghost) => ghost.moveProcess());
      if (gameState.pacman.checkGhostCollision(ghosts.value)) {
        onGhostCollision();
      }
      lastFrameTime = timestamp;
    }
    animationFrameId = requestAnimationFrame(gameLoop);
  };

  animationFrameId = requestAnimationFrame(gameLoop);
};

const updateGame = () => {
  gameState.pacman.moveProcess();
  gameState.pacman.eat();
};

const handleKeyDown = (event) => {
  const keyMap = {
    37: DIRECTION_LEFT,
    65: DIRECTION_LEFT,
    38: DIRECTION_UP,
    87: DIRECTION_UP,
    39: DIRECTION_RIGHT,
    68: DIRECTION_RIGHT,
    40: DIRECTION_BOTTOM,
    83: DIRECTION_BOTTOM,
  };
  if (keyMap[event.keyCode] !== undefined) {
    gameState.pacman.nextDirection = keyMap[event.keyCode];
  }
};

onMounted(() => {
  initGame();
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <div>
    <canvas class="canvas" ref="canva" width="500" height="500"></canvas>
    <div style="display: none">
      <img
        ref="pacmanFrames"
        src="./assets/animations.gif"
        width="140"
        height="20"
      />
      <img ref="ghostFrames" src="./assets/ghost.png" width="140" height="20" />
    </div>
  </div>
</template>

<style>
body {
  position: relative;
  height: 100vh;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #181717;
}
</style>
