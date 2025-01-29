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
  class Pacman {
    constructor(x, y, width, height, speed) {
      Object.assign(this, { x, y, width, height, speed });
      this.direction = 4;
      this.nextDirection = 4;
      this.frameCount = 7;
      this.currentFrame = 1;

      setInterval(() => this.changeAnimation(), 100);
    }

    moveProcess() {
      this.changeDirectionIfPossible();
      this.moveForwards();
      if (this.checkCollisions()) this.moveBackwards();
    }

    eat() {
      const [mapX, mapY] = [this.getMapX(), this.getMapY()];
      if (map[mapY]?.[mapX] === 2) map[mapY][mapX] = 3;
    }

    checkGhostCollision(ghosts) {
      return ghosts.some(
        (ghost) =>
          ghost.getMapX() === this.getMapX() &&
          ghost.getMapY() === this.getMapY()
      );
    }

    moveForwards() {
      ({ x: this.x, y: this.y } = move(
        1,
        this.direction,
        this.x,
        this.y,
        this.speed
      ));
    }

    moveBackwards() {
      ({ x: this.x, y: this.y } = move(
        -1,
        this.direction,
        this.x,
        this.y,
        this.speed
      ));
    }

    checkCollisions() {
      const [x, y] = [this.x, this.y];
      return [0, this.width - 1].some((dx) =>
        [0, this.height - 1].some(
          (dy) =>
            map?.[Math.floor((y + dy) / oneBlockSize)]?.[
              Math.floor((x + dx) / oneBlockSize)
            ] === 1
        )
      );
    }

    changeDirectionIfPossible() {
      if (this.direction === this.nextDirection) return;

      const prevDirection = this.direction;
      this.direction = this.nextDirection;
      this.moveForwards();

      if (this.checkCollisions()) {
        this.moveBackwards();
        this.direction = prevDirection;
      } else {
        this.moveBackwards();
      }
    }

    getMapX() {
      return Math.floor(this.x / oneBlockSize);
    }

    getMapY() {
      return Math.floor(this.y / oneBlockSize);
    }

    changeAnimation() {
      if (this.frameCount > 1) {
        this.currentFrame = (this.currentFrame % this.frameCount) + 1;
      }
    }

    draw() {
      const ctx = canvasContext.value;
      if (!ctx) return;

      ctx.save();
      const [centerX, centerY] = [
        this.x + this.width / 2,
        this.y + this.height / 2,
      ];

      ctx.translate(centerX, centerY);
      ctx.rotate((this.direction * Math.PI) / 2);
      ctx.translate(-centerX, -centerY);

      ctx.drawImage(
        pacmanFrames.value,
        (this.currentFrame - 1) * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );

      ctx.restore();
    }
  }

  return new Pacman(x, y, width, height, speed);
}
