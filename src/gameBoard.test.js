/* eslint-disable no-undef */
const gameBoard = require('./gameBoard');

test('check place ship function', () => {
  const player = gameBoard('p2');
  expect(player.placeShip()).toEqual(true);
});

test('receiveAttack function successful', () => {
  const player = gameBoard('p1');
  player.filledPosition = [1, 2, 3, 4, 5];
  player.ships[0].position = [1, 2, 3, 4, 5];
  player.ships[0].result = [1, 2, 3, 4];
  expect(player.receiveAttack(5)).toEqual(true);
});

test.only('receiveAttack  already attack place', () => {
  const player = gameBoard('p1');
  player.filledPosition = [1, 2, 3, 4, 5];
  player.ships[0].position = [1, 2, 3, 4, 5];
  player.ships[0].result = [1, 2, 3, 4];
  player.missedArray = [2];
  expect(player.receiveAttack(2)).toEqual(false);
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
