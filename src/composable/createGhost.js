import { computed } from "vue";
import { randomTargetsForGhosts } from "./randomTargetsForGhosts";

export function createGhost(
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
  class Ghost {
    constructor(
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
      direction
    ) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.direction = direction.DIRECTION_RIGHT;
      this.imageX = imageX;
      this.imageY = imageY;
      this.imageHeight = imageHeight;
      this.imageWidth = imageWidth;
      this.range = range;
      this.randomTargetIndex = parseInt(Math.random() * 4);
      this.target = randomTargetsForGhosts(
        [this.randomTargetIndex],
        map,
        oneBlockSize
      );

      setInterval(() => {
        this.changeRandomDirection();
      }, 10000);
    }

    isInRange() {
      let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
      let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
      if (
        Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range
      ) {
        return true;
      }
      return false;
    }

    changeRandomDirection() {
      let addition = 1;
      this.randomTargetIndex += addition;
      this.randomTargetIndex = this.randomTargetIndex % 4;
    }

    moveProcess() {
      if (this.isInRange()) {
        this.target = pacman;
      } else {
        this.target = randomTargetsForGhosts(
          this.randomTargetIndex,
          map,
          oneBlockSize
        );
      }
      this.changeDirectionIfPossible();
      this.moveForwards();
      if (this.checkCollisions()) {
        this.moveBackwards();
      }
    }

    move(modifier) {
      switch (this.direction) {
        case direction.DIRECTION_RIGHT:
          this.x += this.speed * modifier;
          break;
        case direction.DIRECTION_UP:
          this.y -= this.speed * modifier;
          break;
        case direction.DIRECTION_LEFT:
          this.x -= this.speed * modifier;
          break;
        case direction.DIRECTION_BOTTOM:
          this.y += this.speed * modifier;
          break;
      }
    }
    moveForwards() {
      this.move(1);
    }

    moveBackwards() {
      this.move(-1);
    }

    checkCollisions() {
      let isCollided = false;
      if (
        map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize)] ==
          1 ||
        map[parseInt(this.y / oneBlockSize + 0.9999)][
          parseInt(this.x / oneBlockSize)
        ] == 1 ||
        map[parseInt(this.y / oneBlockSize)][
          parseInt(this.x / oneBlockSize + 0.9999)
        ] == 1 ||
        map[parseInt(this.y / oneBlockSize + 0.9999)][
          parseInt(this.x / oneBlockSize + 0.9999)
        ] == 1
      ) {
        isCollided = true;
      }
      return isCollided;
    }

    changeDirectionIfPossible() {
      let tempDirection = this.direction;

      this.direction = this.calculateNewDirection(
        map,
        parseInt(this.target.x / oneBlockSize),
        parseInt(this.target.y / oneBlockSize)
      );

      if (typeof this.direction == "undefined") {
        let possibleDirections = [
          direction.DIRECTION_UP,
          direction.DIRECTION_BOTTOM,
          direction.DIRECTION_LEFT,
          direction.DIRECTION_RIGHT,
        ];
        this.direction =
          possibleDirections[
            Math.floor(Math.random() * possibleDirections.length)
          ];
        return;
      }

      if (
        this.getMapY() != this.getMapYRightSide() &&
        (this.direction == direction.DIRECTION_LEFT ||
          this.direction == direction.DIRECTION_RIGHT)
      ) {
        this.direction = tempDirection;
        return;
      }

      if (
        this.getMapX() != this.getMapXRightSide() &&
        (this.direction == direction.DIRECTION_UP ||
          this.direction == direction.DIRECTION_BOTTOM)
      ) {
        this.direction = tempDirection;
        return;
      }

      this.moveForwards();

      if (this.checkCollisions()) {
        this.moveBackwards();
        this.direction = tempDirection;
      } else {
        this.moveBackwards();
      }
    }

    calculateNewDirection(map, destX, destY) {
      let mp = [];
      for (let i = 0; i < map.length; i++) {
        mp[i] = map[i].slice();
      }

      let queue = [
        {
          x: this.getMapX(),
          y: this.getMapY(),
          rightX: this.getMapXRightSide(),
          rightY: this.getMapYRightSide(),
          moves: [],
        },
      ];
      while (queue.length > 0) {
        let poped = queue.shift();
        if (poped.x == destX && poped.y == destY) {
          return poped.moves[0];
        } else {
          mp[poped.y][poped.x] = 1;
          let neighbors = this.addNeighbors(poped, mp);
          for (let i = 0; i < neighbors.length; i++) {
            queue.push(neighbors[i]);
          }
        }
      }

      return DIRECTION_RIGHT;
    }

    addNeighbors(poped, mp) {
      let queue = [];
      let numOfRows = mp.length;
      let numOfColumns = mp[0].length;

      if (
        poped.x - 1 >= 0 &&
        poped.x - 1 < numOfColumns &&
        mp[poped.y][poped.x - 1] != 1
      ) {
        queue.push({
          x: poped.x - 1,
          y: poped.y,
          moves: poped.moves.concat(direction.DIRECTION_LEFT),
        });
      }
      if (
        poped.x + 1 >= 0 &&
        poped.x + 1 < numOfColumns &&
        mp[poped.y][poped.x + 1] != 1
      ) {
        queue.push({
          x: poped.x + 1,
          y: poped.y,
          moves: poped.moves.concat(direction.DIRECTION_RIGHT),
        });
      }
      if (
        poped.y - 1 >= 0 &&
        poped.y - 1 < numOfRows &&
        mp[poped.y - 1][poped.x] != 1
      ) {
        queue.push({
          x: poped.x,
          y: poped.y - 1,
          moves: poped.moves.concat(direction.DIRECTION_UP),
        });
      }
      if (
        poped.y + 1 >= 0 &&
        poped.y + 1 < numOfRows &&
        mp[poped.y + 1][poped.x] != 1
      ) {
        queue.push({
          x: poped.x,
          y: poped.y + 1,
          moves: poped.moves.concat(direction.DIRECTION_BOTTOM),
        });
      }
      return queue;
    }

    getMapX() {
      let mapX = parseInt(this.x / oneBlockSize);
      return mapX;
    }

    getMapY() {
      let mapY = parseInt(this.y / oneBlockSize);
      return mapY;
    }

    getMapXRightSide() {
      let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
      return mapX;
    }

    getMapYRightSide() {
      let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
      return mapY;
    }

    changeAnimation() {
      if (this.frameCount > 1) {
        this.currentFrame =
          this.currentFrame === this.frameCount ? 1 : this.currentFrame + 1;
      }
    }

    draw() {
      canvasContext.value.save();
      canvasContext.value.drawImage(
        ghostFrames.value,
        this.imageX,
        this.imageY,
        this.imageWidth,
        this.imageHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );

      canvasContext.value.restore();
      canvasContext.value.beginPath();
      canvasContext.value.stroke();
    }
  }

  return new Ghost(
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
    canvasContext,
    ghostFrames
  );
}
