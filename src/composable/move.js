import {
  DIRECTION_RIGHT,
  DIRECTION_UP,
  DIRECTION_LEFT,
  DIRECTION_BOTTOM,
} from "../direction/direction";

export function move(modifier, direction, x, y, speed) {
  switch (direction) {
    case DIRECTION_RIGHT:
      return { x: x + speed * modifier, y };
    case DIRECTION_UP:
      return { x, y: y - speed * modifier };
    case DIRECTION_LEFT:
      return { x: x - speed * modifier, y };
    case DIRECTION_BOTTOM:
      return { x, y: y + speed * modifier };
  }
}
