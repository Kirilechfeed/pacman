import { reactive, watchEffect, computed } from "vue";
import { randomTargetsForGhosts } from "./randomTargetsForGhosts";
import { move } from "./move";

export default function useGhost(
  x,
  y,
  width,
  height,
  speed,
  imageX,
  imageY,
  imageWidth,
  imageHeight,
  range,
  direction,
  map,
  oneBlockSize,
  pacman,
  canvasContext,
  ghostFrames
) {
  const ghost = reactive({
    x,
    y,
    width,
    height,
    speed,
    direction: direction.DIRECTION_RIGHT,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    range,
    randomTargetIndex: Math.floor(Math.random() * 4),
    target: computed(() =>
      ghost.isInRange
        ? pacman
        : randomTargetsForGhosts(ghost.randomTargetIndex, map, oneBlockSize)
    ),
  });
  console.log(ghost);
  ghost.isInRange = computed(() => {
    const xDistance = Math.abs(pacman.x / oneBlockSize - getMapX());
    const yDistance = Math.abs(pacman.y / oneBlockSize - getMapY());

    return Math.sqrt(xDistance ** 2 + yDistance ** 2) <= ghost.range;
  });

  function changeRandomDirection() {
    ghost.randomTargetIndex = (ghost.randomTargetIndex + 1) % 4;
  }

  function moveProcess() {
    changeDirectionIfPossible();
    moveForwards();
    if (checkCollisions()) {
      moveBackwards();
    }
  }

  function moveForwards() {
    const { x, y } = move(1, ghost.direction, ghost.x, ghost.y, ghost.speed);
    ghost.x = x;
    ghost.y = y;
  }

  function moveBackwards() {
    const { x, y } = move(-1, ghost.direction, ghost.x, ghost.y, ghost.speed);
    ghost.x = x;
    ghost.y = y;
  }

  function checkCollisions() {
    return (
      map[Math.floor(ghost.y / oneBlockSize)][
        Math.floor(ghost.x / oneBlockSize)
      ] === 1 ||
      map[Math.floor(ghost.y / oneBlockSize + 0.9999)][
        Math.floor(ghost.x / oneBlockSize)
      ] === 1 ||
      map[Math.floor(ghost.y / oneBlockSize)][
        Math.floor(ghost.x / oneBlockSize + 0.9999)
      ] === 1 ||
      map[Math.floor(ghost.y / oneBlockSize + 0.9999)][
        Math.floor(ghost.x / oneBlockSize + 0.9999)
      ] === 1
    );
  }

  function changeDirectionIfPossible() {
    let tempDirection = ghost.direction;
    ghost.direction = calculateNewDirection(
      map,
      Math.floor(ghost.target.x / oneBlockSize),
      Math.floor(ghost.target.y / oneBlockSize)
    );
    if (!ghost.direction) {
      ghost.direction =
        direction[Object.keys(direction)[Math.floor(Math.random() * 4)]];
    }
    moveForwards();
    if (checkCollisions()) {
      moveBackwards();
      ghost.direction = tempDirection;
    } else {
      moveBackwards();
    }
  }

  function calculateNewDirection(map, destX, destY) {
    let queue = [{ x: getMapX(), y: getMapY(), moves: [] }];
    let visited = new Set();

    while (queue.length > 0) {
      let node = queue.shift();
      let key = `${node.x},${node.y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (node.x === destX && node.y === destY) return node.moves[0];
      queue.push(...addNeighbors(node, map));
    }
    return direction.DIRECTION_RIGHT;
  }

  function addNeighbors(node, map) {
    let directions = [
      { dx: -1, dy: 0, dir: direction.DIRECTION_LEFT },
      { dx: 1, dy: 0, dir: direction.DIRECTION_RIGHT },
      { dx: 0, dy: -1, dir: direction.DIRECTION_UP },
      { dx: 0, dy: 1, dir: direction.DIRECTION_BOTTOM },
    ];

    return directions
      .map(({ dx, dy, dir }) => ({
        x: node.x + dx,
        y: node.y + dy,
        moves: [...node.moves, dir],
      }))
      .filter(({ x, y }) => map[y]?.[x] !== 1);
  }

  function getMapX() {
    return Math.floor(ghost.x / oneBlockSize);
  }

  function getMapY() {
    return Math.floor(ghost.y / oneBlockSize);
  }

  function draw() {
    canvasContext.value.drawImage(
      ghostFrames.value,
      ghost.imageX,
      ghost.imageY,
      ghost.imageWidth,
      ghost.imageHeight,
      ghost.x,
      ghost.y,
      ghost.width,
      ghost.height
    );
  }

  setInterval(changeRandomDirection, 10000);

  watchEffect(moveProcess);

  return { ghost, draw, moveProcess, getMapX, getMapY };
}
