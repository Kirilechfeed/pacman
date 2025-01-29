import { computed } from "vue";

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
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.direction = 4;
      this.nextDirection = 4;
      this.frameCount = 7;
      this.currentFrame = 1;
      setInterval(() => {
        this.changeAnimation();
      }, 100);
    }
    moveProcess() {
      this.changeDirectionIfPossible();
      this.moveForwards();
      if (this.checkCollisions()) {
        this.moveBackwards();
        return;
      }
    }

    eat() {
      const mapX = this.getMapX();
      const mapY = this.getMapY();

      if (map[mapY][mapX] === 2) {
        map[mapY][mapX] = 3;
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
    checkGhostCollision(ghosts) {
      for (let i = 0; i < ghosts.length; i++) {
        let ghost = ghosts[i];
        if (
          ghost.getMapX() == this.getMapX() &&
          ghost.getMapY() == this.getMapY()
        ) {
          return true;
        }
      }
      return false;
    }
    moveForwards() {
      this.move(1);
    }

    moveBackwards() {
      this.move(-1);
    }

    checkCollisions() {
      const topLeft =
        map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize)];
      const topRight =
        map[parseInt(this.y / oneBlockSize)][
          parseInt((this.x + this.width - 1) / oneBlockSize)
        ];
      const bottomLeft =
        map[parseInt((this.y + this.height - 1) / oneBlockSize)][
          parseInt(this.x / oneBlockSize)
        ];
      const bottomRight =
        map[parseInt((this.y + this.height - 1) / oneBlockSize)][
          parseInt((this.x + this.width - 1) / oneBlockSize)
        ];
      return (
        topLeft === 1 || topRight === 1 || bottomLeft === 1 || bottomRight === 1
      );
    }

    changeDirectionIfPossible() {
      if (this.direction == this.nextDirection) return;
      let tempDirection = this.direction;
      this.direction = this.nextDirection;
      this.moveForwards();
      if (this.checkCollisions()) {
        this.moveBackwards();
        this.direction = tempDirection;
      } else {
        this.moveBackwards();
      }
    }
    getMapX() {
      let mapX = computed(() => {
        return parseInt(this.x / oneBlockSize);
      });
      return mapX.value;
    }

    getMapY() {
      let mapY = computed(() => {
        return parseInt(this.y / oneBlockSize);
      });

      return mapY.value;
    }
    getMapXRightSide() {
      let mapX = computed(() => {
        return parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
      });
      return mapX.value;
    }

    getMapYRightSide() {
      let mapY = computed(() => {
        return parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
      });
      return mapY.value;
    }
    changeAnimation() {
      if (this.frameCount > 1) {
        this.currentFrame =
          this.currentFrame === this.frameCount ? 1 : this.currentFrame + 1;
      }
    }
    draw() {
      canvasContext.value.save();

      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;

      canvasContext.value.translate(centerX, centerY);
      canvasContext.value.rotate((this.direction * Math.PI) / 2); // 90° * direction
      canvasContext.value.translate(-centerX, -centerY);

      canvasContext.value.drawImage(
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

      canvasContext.value.restore();
    }
  }

  return new Pacman(
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
  );
}
