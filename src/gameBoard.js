/* eslint-disable operator-linebreak */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
const ship = require('./ship');

function gameBoard(name) {
  const carrier = ship('carrier', 5);
  const battleship = ship('battleship ', 4);
  const cruiser = ship('cruiser', 3);
  const submarine = ship('submarine', 3);
  const destroyer = ship('destroyer', 2);
  const ships = [carrier, battleship, cruiser, submarine, destroyer];
  let horizontalArray = [];
  let verticalArray = [];

  // it's create horizontal 2x2 matrix
  function horizontalValue() {
    const arr = [];
    let start = 0;
    for (let i = 0; i < 10; i += 1) {
      arr[i] = [];
      for (let j = 0; j < 10; j += 1) {
        arr[i][j] = start;
        start += 1;
      }
    }
    return arr;
  }
  // it's create vertical 2x2 matrix
  function verticalValue() {
    const arr = [];

    for (let i = 0; i < 10; i += 1) {
      arr[i] = [];
      let start = i;
      for (let j = 0; j < 10; j += 1) {
        arr[i][j] = start;
        start += 10;
      }
    }
    return arr;
  }
  horizontalArray = horizontalValue();
  verticalArray = verticalValue();

  // it's generate position
  function generateHorizontalPosition(n, index) {
    const temp = [];
    for (let i = 0; i < n; i += 1) {
      temp.push(index + i);
    }
    return temp;
  }
  function generateVerticalPosition(n, index) {
    const temp = [];
    let pos = index;
    for (let i = 0; i < n; i += 1) {
      temp.push(pos);
      pos += 10;
    }
    return temp;
  }

  function getStart() {
    return Math.floor(Math.random() * 99);
  }
  // it's place ship vertical
  function placeVertical(obj, index) {
    const temp = [];
    if (!this.filledPosition.includes(index)) {
      temp.push(...generateVerticalPosition(obj.length, index));
      const isTake = this.filledPosition.some((x) => temp.includes(x));
      const isOut = verticalArray.some((arr) =>
        temp.every((v) => arr.includes(v))
      );
      if (!isOut) {
        this.placeShip();
      }
      if (!isTake && isOut) {
        this.filledPosition.push(...temp);
        obj.position.push(...temp);
      }
    }
    this.placeShip();
  }
  function placeHorizontal(obj, index) {
    const temp = [];
    if (!this.filledPosition.includes(index)) {
      temp.push(...generateHorizontalPosition(obj.length, index));
      const isTake = this.filledPosition.some((x) => temp.includes(x));
      const isOut = horizontalArray.some((arr) =>
        temp.every((v) => arr.includes(v))
      );
      if (!isOut) {
        this.placeShip();
      }
      if (!isTake && isOut) {
        this.filledPosition.push(...temp);
        obj.position.push(...temp);
      }
    }
    this.placeShip();
  }

  // place the ship randomly
  function placeShip() {
    this.ships.forEach((obj) => {
      if (obj.position.length === 0) {
        const index = getStart();
        const d = this.direction[Math.floor(Math.random() * 2)];
        if (d === 'vertical') {
          const result = placeVertical.bind(this);
          result(obj, index);
        } else {
          const result = placeHorizontal.bind(this);
          result(obj, index);
        }
      }
    });
    const check = this.ships.every((obj) => obj.position.length !== 0);
    if (check) {
      return true;
    }
    return false;
  }
  // check all ship is sunk
  function allShipSunk() {
    const temp = this.filledPosition.every((ele) =>
      this.shipAttackArray.includes(ele)
    );
    return temp;
  }

  // check which ship hit
  function whichShip(pos) {
    this.ships.forEach((obj) => {
      if (obj.hit(pos)) {
        if (obj.isSunk()) {
          // eslint-disable-next-line no-param-reassign
          obj.sunk = true;
        }
      }
    });
  }

  function receiveAttack(currentPosition) {
    if (
      !this.shipAttackArray.includes(currentPosition) &&
      !this.missedArray.includes(currentPosition)
    ) {
      if (this.filledPosition.includes(currentPosition)) {
        this.shipAttackArray.push(currentPosition);
        this.whichShip(currentPosition);
        return true;
      }
      this.missedArray.push(currentPosition);
      return true;
    }
    return false;
  }

  return {
    name,
    ships,
    filledPosition: [],
    shipAttackArray: [],
    missedArray: [],
    direction: ['horizontal', 'vertical'],
    receiveAttack,
    placeShip,
    whichShip,
    allShipSunk,
  };
}

module.exports = gameBoard;
