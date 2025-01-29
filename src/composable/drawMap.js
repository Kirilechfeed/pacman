export function drawMap(
  canva,
  canvasContext,
  map,
  oneBlockSize,
  pacman,
  ghosts
) {
  const wallSpaceWidth = oneBlockSize / 1.6;
  const wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
  const wallInnerColor = "#181717";

  const createRect = (x, y, width, height, color) => {
    canvasContext.value.fillStyle = color;
    canvasContext.value.fillRect(x, y, width, height);
  };

  const createRoundedRect = (x, y, width, height, radius, color) => {
    canvasContext.value.fillStyle = color;
    canvasContext.value.beginPath();
    canvasContext.value.moveTo(x + radius, y);
    canvasContext.value.lineTo(x + width - radius, y);
    canvasContext.value.quadraticCurveTo(x + width, y, x + width, y + radius);
    canvasContext.value.lineTo(x + width, y + height - radius);
    canvasContext.value.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius,
      y + height
    );
    canvasContext.value.lineTo(x + radius, y + height);
    canvasContext.value.quadraticCurveTo(x, y + height, x, y + height - radius);
    canvasContext.value.lineTo(x, y + radius);
    canvasContext.value.quadraticCurveTo(x, y, x + radius, y);
    canvasContext.value.closePath();
    canvasContext.value.fill();
  };

  const drawFoods = () => {
    canvasContext.value.shadowColor = "rgba(54, 201, 223, 0.8)";
    canvasContext.value.shadowBlur = 10;
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] === 2) {
          createRect(
            j * oneBlockSize + oneBlockSize / 3,
            i * oneBlockSize + oneBlockSize / 3,
            oneBlockSize / 3,
            oneBlockSize / 3,
            "#36C9DF"
          );
        }
      }
    }
    canvasContext.value.shadowBlur = 0;
  };

  const drawWallSegments = (i, j) => {
    if (j > 0 && map[i][j - 1] === 1) {
      createRoundedRect(
        j * oneBlockSize,
        i * oneBlockSize + wallOffset,
        wallSpaceWidth + wallOffset,
        wallSpaceWidth,
        0,
        wallInnerColor
      );
    }
    if (j < map[0].length - 1 && map[i][j + 1] === 1) {
      createRoundedRect(
        j * oneBlockSize + wallOffset,
        i * oneBlockSize + wallOffset,
        wallSpaceWidth + wallOffset,
        wallSpaceWidth,
        0,
        wallInnerColor
      );
    }
    if (i > 0 && map[i - 1][j] === 1) {
      createRoundedRect(
        j * oneBlockSize + wallOffset,
        i * oneBlockSize,
        wallSpaceWidth,
        wallSpaceWidth + wallOffset,
        0,
        wallInnerColor
      );
    }
    if (i < map.length - 1 && map[i + 1][j] === 1) {
      createRoundedRect(
        j * oneBlockSize + wallOffset,
        i * oneBlockSize + wallOffset,
        wallSpaceWidth,
        wallSpaceWidth + wallOffset,
        0,
        wallInnerColor
      );
    }
  };

  const drawWalls = () => {
    canvasContext.value.shadowColor = "rgba(215, 70, 80, 0.8)";
    canvasContext.value.shadowBlur = 2;
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] === 1) {
          createRoundedRect(
            j * oneBlockSize,
            i * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            5,
            "#D74650"
          );
          drawWallSegments(i, j);
        }
      }
    }
    canvasContext.value.shadowBlur = 0;
  };

  const draw = () => {
    canvasContext.value.clearRect(0, 0, canva.value.width, canva.value.height);
    createRect(0, 0, canva.width, canva.height, "#181717");
    drawWalls();
    drawFoods();
    pacman.draw();
    for (let i = 0; i < ghosts.value.length; i++) {
      ghosts.value[i].draw();
    }
  };

  return draw;
}
