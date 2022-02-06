/* eslint-disable no-undef */
const ship = require('../ship');

test('check if object creation work', () => {
  const carrier = ship('carrier', 5);
  expect(carrier.name).toBe('carrier');
  expect(carrier.length).toBe(5);
});

test('check if hit function work', () => {
  const carrier = ship('carrier', 5);
  carrier.position = [1];
  expect(carrier.hit(1)).toEqual(true);
});
test('check if hit function fail work', () => {
  const carrier = ship('carrier', 5);
  carrier.position = [1];
  expect(carrier.hit(carrier, 3)).toEqual(false);
});

test('check if isSunk function work', () => {
  const carrier = ship('battleShip', 4);
  carrier.result = [5, 4, 2, 3, 1];
  carrier.position = [1, 2, 3, 4, 5];
  expect(carrier.isSunk()).toEqual(true);
});

test('check if isSunk  function fail work', () => {
  const carrier = ship('battleShip', 4);
  carrier.result = [true, true, true];
  expect(carrier.isSunk()).toEqual(false);
});
