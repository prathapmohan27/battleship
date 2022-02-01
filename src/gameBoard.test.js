/* eslint-disable no-undef */
const gameBoard = require('./gameBoard');

test('check place ship function', () => {
  const player = gameBoard('p2');
  expect(player.placeShip()).toEqual(true);
});

test.only('receiveAttack function work', () => {
  const player = gameBoard('p1');
  player.filledPosition = [1, 2, 3, 4];
  player.ships[0].position = [1, 2, 3, 4, 5];
  player.ships[4].position = [85, 86];
  player.ships[4].result = [85, 86];
  // player.placeShip();
  expect(player.receiveAttack(0, 2)).toEqual(true);
});
