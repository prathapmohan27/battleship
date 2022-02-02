/* eslint-disable no-undef */
const gameBoard = require('./gameBoard');

test('check place ship function', () => {
  const player = gameBoard('p2');
  expect(player.placeShip()).toEqual(true);
});

test('receiveAttack function hit ship work', () => {
  const player = gameBoard('p1');
  player.filledPosition = [1, 2, 3, 4, 5];
  player.ships[0].position = [1, 2, 3, 4, 5];
  player.ships[0].result = [1, 2, 3, 4];
  expect(player.receiveAttack(0, 5)).toEqual(true);
});

test('receiveAttack  miss ship position', () => {
  const player = gameBoard('p1');
  player.filledPosition = [1, 2, 3, 4, 5];
  player.ships[0].position = [1, 2, 3, 4, 5];
  player.ships[0].result = [1, 2, 3, 4];
  expect(player.receiveAttack(0, 7)).toEqual(false);
});

test('check is all ship sunk', () => {
  const player = gameBoard('p2');
  player.ships[0].sunk = true;
  player.ships[1].sunk = true;
  player.ships[2].sunk = true;
  player.ships[3].sunk = true;
  player.ships[4].sunk = true;
  expect(player.allShipSunk()).toEqual(true);
});
