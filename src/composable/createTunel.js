export function createTunnel(rows, cols) {
  let matrix = Array.from({ length: rows }, () => Array(cols).fill(1))
  let emptyRowIndex = rows - 2
  for (let row = 1; row < rows - 1; row++) {
    for (let col = 1; col < cols - 1; col++) {
      let prev = matrix[row][col - 1]
      //   let next = matrix[row][col + 1]
      let above = matrix[row - 1][col]
      let prevDiag = matrix[row - 1][col - 1]
      let nextDiag = matrix[row - 1][col + 1]
      //   let twoNextDiag = matrix[row - 1][col + 2]
      //   let twoPrevDiag = matrix[row - 1][col - 2]
      //   let twoPrev = matrix[row][col - 2]

      if ((nextDiag == 1 || prevDiag == 1) && above == 0) {
        matrix[row][col] = 0
        continue
      }

      if ((above == 1 && prevDiag == 1 && prev == 1) || (nextDiag == 1 && prevDiag == 1)) {
        matrix[row][col] = 0
        continue
      }

      if (prev == 1 && nextDiag == 1) {
        matrix[row][col] = 0
        continue
      }

      if (above == 1) {
        if (Math.random() < 0.5) {
          matrix[row][col] = 0
        }
        continue
      }
      if (Math.random() < 0.3) {
        matrix[row][col] = 0
        continue
      }
    }
  }
  for (let row = 1; row < rows - 1; row++) {
    for (let col = 1; col < cols - 1; col++) {
      let prev = matrix[row][col - 1]
      let next = matrix[row][col + 1]
      let above = matrix[row - 1][col]
      let prevDiag = matrix[row - 1][col - 1]
      let nextDiag = matrix[row - 1][col + 1]
      let twoNextDiag = matrix[row - 1][col + 2]
      let twoPrevDiag = matrix[row - 1][col - 2]
      let twoPrev = matrix[row][col - 2]
      let twoNext = matrix[row][col + 2]
      let twoTop
      let twoBottom
      if (row > 1 && col > 1) {
        twoTop = matrix[row - 2][col]
      }
      if (row < rows - 2 && col < cols - 2) {
        twoBottom = matrix[row + 2][col]
      }

      let bottomPrev = matrix[row + 1][col - 1]
      let bottomNext = matrix[row + 1][col + 1]
      let bottom = matrix[row + 1][col]

      if (matrix[row][col] == 0) {
        if (
          prev == 0 &&
          next == 0 &&
          above == 0 &&
          bottom == 0 &&
          prevDiag == 0 &&
          nextDiag == 0 &&
          bottomPrev == 0 &&
          bottomNext == 0
        ) {
          matrix[row][col] = 1
        }
      }

      if (matrix[row][col] == 1) {
        if (prev == 0 && next == 0 && above == 0 && bottom == 0) {
          if (twoBottom != undefined && twoBottom == 1) {
            matrix[row + 1][col] = 1
            continue
          }
          if (twoTop != undefined && twoTop == 1) {
            matrix[row - 1][col] = 1
            continue
          }
          if (twoPrev != undefined && twoPrev == 1) {
            matrix[row][col - 1] = 1
            continue
          }
          if (twoNext != undefined && twoNext == 1) {
            matrix[row][col + 1] = 1
            continue
          }
        }
      }
    }
  }
  if (emptyRowIndex !== null) {
    matrix[emptyRowIndex].fill(0)
    matrix[emptyRowIndex][0] = 1
    matrix[emptyRowIndex][matrix[emptyRowIndex].length - 1] = 1
  }
  const pattern = [
    [2, 2, 2, 2, 2, 2, 2],
    [2, 1, 1, 0, 1, 1, 2],
    [2, 1, 0, 0, 0, 1, 2],
    [2, 1, 0, 0, 0, 1, 2],
    [2, 1, 1, 1, 1, 1, 2],
    [2, 2, 2, 2, 2, 2, 2]
  ]
  const patternRows = pattern.length
  const patternCols = pattern[0].length
  const startRow = Math.floor((rows - patternRows) / 2)
  const startCol = Math.floor((cols - patternCols) / 2)

  for (let i = 0; i < patternRows; i++) {
    for (let j = 0; j < patternCols; j++) {
      matrix[startRow + i][startCol + j] = pattern[i][j]
    }
  }

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] === 0) {
        matrix[row][col] = 2
      }
    }
  }
  const totalBits = matrix.flat().filter((value) => value === 2).length
  return { matrix, totalBits }
}
