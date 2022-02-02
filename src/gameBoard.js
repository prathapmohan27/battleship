const ship = require('./ship');

function gameBoard(name) {
  const carrier = ship('carrier', 5);
  const battleship = ship('battleship ', 4);
  const cruiser = ship('cruiser', 3);
  const submarine = ship('submarine', 3);
  const destroyer = ship('destroyer', 2);
  const ships = [carrier, battleship, cruiser, submarine, destroyer];
  const gridArray = [];

  function gridValue() {
    let start = 0;
    for (let i = 0; i < 10; i += 1) {
      gridArray[i] = [];
      for (let j = 0; j < 10; j += 1) {
        gridArray[i][j] = start;
        start += 1;
      }
    }
  }
  gridValue();

  function generatePosition(n, index) {
    const temp = [];
    for (let i = 0; i < n; i += 1) {
      temp.push(index + i);
    }
    return temp;
  }

  function getStart() {
    return Math.floor(Math.random() * 99);
  }

  function randomPlace(obj, index) {
    const temp = [];
    if (!this.filledPosition.includes(index)) {
      temp.push(...generatePosition(obj.length, index));
      const isTake = this.filledPosition.some((x) => temp.includes(x));
      const isOut = gridArray.some((arr) => temp.every((v) => arr.includes(v)));
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

  function placeShip() {
    this.ships.forEach((obj) => {
      if (obj.position.length === 0) {
        const index = getStart();
        const result = randomPlace.bind(this);
        result(obj, index);
      }
    });
    const check = this.ships.every((obj) => obj.position.length !== 0);
    if (check) {
      return true;
    }
    return false;
  }

  function allShipSunk() {
    return this.ships.every((obj) => obj.sunk);
  }

  function display(shipName) {
    // eslint-disable-next-line no-console
    console.log(shipName);
  }

  function whichShip(pos) {
    this.ships.forEach((obj) => {
      if (obj.hit(pos)) {
        if (obj.isSunk()) {
          // eslint-disable-next-line no-param-reassign
          obj.sunk = true;
          this.allShipSunk();
          display(obj.name);
        }
      }
    });
  }

  function hitShip() {
    // eslint-disable-next-line no-console
    console.log('X');
  }

  function markMiss() {
    // eslint-disable-next-line no-console
    console.log('*');
  }

  function receiveAttack(x, y) {
    const currentPosition = gridArray[x][y];
    if (
      // eslint-disable-next-line operator-linebreak
      !this.shipAttackArray.includes(currentPosition) &&
      !this.missedArray.includes(currentPosition)
    ) {
      if (this.filledPosition.includes(currentPosition)) {
        this.shipAttackArray.push(currentPosition);
        this.hitShip();
        this.whichShip(currentPosition);
        return true;
      }
      this.missedArray.push(currentPosition);
      this.markMiss();
    }
    return false;
  }

  return {
    name,
    ships,
    filledPosition: [],
    shipAttackArray: [],
    missedArray: [],
    receiveAttack,
    placeShip,
    whichShip,
    hitShip,
    markMiss,
    allShipSunk,
  };
}

module.exports = gameBoard;
