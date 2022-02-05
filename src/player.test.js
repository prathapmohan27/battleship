/* eslint-disable no-undef */
const player = require('./player');
const gameBoard = require('./gameBoard');

test('check players attack work', () => {
  const p = gameBoard('p1');
  p.filledPosition = [1, 2, 3, 4, 5];
  p.ships[0].position = [1, 2, 3, 4, 5];
  p.placeShip();
  expect(player.startAttack(p, 4)).toBe(false);
});
