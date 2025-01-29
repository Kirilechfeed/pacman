export function randomTargetsForGhosts(index, map, oneBlockSize) {
  const randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    {
      x: (map[0].length - 2) * oneBlockSize,
      y: (map.length - 2) * oneBlockSize,
    },
  ];

  return randomTargetsForGhosts[index];
}
