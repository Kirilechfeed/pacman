import { reactive, computed, watchEffect } from "vue";
import { move } from "./move";

export function createPacman(
  x,
  y,
  width,
  height,
  speed,
  direction,
  map,
  oneBlockSize,
  canvasContext,
  pacmanFrames
) {
  const pacman = reactive({
    x,
    y,
    width,
    height,
    speed,
    direction: 4,
    nextDirection: 4,
    frameCount: 7,
    currentFrame: 1,
  });

  function moveProcess() {
    changeDirectionIfPossible();
    moveForwards();
    if (checkCollisions()) moveBackwards();
  }

  function eat() {
    const mapX = getMapX();
    const mapY = getMapY();
    if (map[mapY]?.[mapX] === 2) map[mapY][mapX] = 3;
  }

  function checkGhostCollision(ghosts) {
    return ghosts.some(
      (ghost) => ghost.getMapX() === getMapX() && ghost.getMapY() === getMapY()
    );
  }

  function moveForwards() {
    const { x, y } = move(
      1,
      pacman.direction,
      pacman.x,
      pacman.y,
      pacman.speed
    );
    pacman.x = x;
    pacman.y = y;
  }

  function moveBackwards() {
    const { x, y } = move(
      -1,
      pacman.direction,
      pacman.x,
      pacman.y,
      pacman.speed
    );
    pacman.x = x;
    pacman.y = y;
  }

  function checkCollisions() {
    return [0, pacman.width - 1].some((dx) =>
      [0, pacman.height - 1].some(
        (dy) =>
          map?.[Math.floor((pacman.y + dy) / oneBlockSize)]?.[
            Math.floor((pacman.x + dx) / oneBlockSize)
          ] === 1
      )
    );
  }

  function changeDirectionIfPossible() {
    if (pacman.direction === pacman.nextDirection) return;

    const prevDirection = pacman.direction;
    pacman.direction = pacman.nextDirection;
    moveForwards();

    if (checkCollisions()) {
      moveBackwards();
      pacman.direction = prevDirection;
    } else {
      moveBackwards();
    }
  }

  function getMapX() {
    return Math.floor(pacman.x / oneBlockSize);
  }

  function getMapY() {
    return Math.floor(pacman.y / oneBlockSize);
  }

  function changeAnimation() {
    if (pacman.frameCount > 1) {
      pacman.currentFrame = (pacman.currentFrame % pacman.frameCount) + 1;
    }
    requestAnimationFrame(changeAnimation);
  }

  requestAnimationFrame(changeAnimation);

  function draw() {
    const ctx = canvasContext.value;
    if (!ctx) return;

    ctx.save();
    const centerX = pacman.x + pacman.width / 2;
    const centerY = pacman.y + pacman.height / 2;

    ctx.translate(centerX, centerY);
    ctx.rotate((pacman.direction * Math.PI) / 2);
    ctx.translate(-centerX, -centerY);

    ctx.drawImage(
      pacmanFrames.value,
      (pacman.currentFrame - 1) * pacman.width,
      0,
      pacman.width,
      pacman.height,
      pacman.x,
      pacman.y,
      pacman.width,
      pacman.height
    );

    ctx.restore();
  }

  return {
    pacman,
    moveProcess,
    eat,
    checkGhostCollision,
    draw,
  };
}
