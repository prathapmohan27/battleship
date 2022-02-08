const gameLoop = require('./gameLoop');
const makeGrid = require('./makeGrid');

(() => {
  const gameContainer = document.querySelector('.gameContainer');
  gameContainer.append(makeGrid.createBoard('player', 'playerCell'));
  gameContainer.append(makeGrid.createBoard('computer', 'computerCell'));
  gameLoop.main();
})();
