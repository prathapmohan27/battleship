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
      // eslint-disable-next-line no-console
      console.log(obj);
      if (obj.position.length === 0) {
        const index = getStart();
        const result = randomPlace.bind(this);
        result(obj, index);
      }
    });
  }

  // function shipSunk(arr) {
  //   for (let i = 0; i < 5; i += 1) {
  //     if (arr[i].isSunk(arr[i]) && arr[i].sunk) return true;
  //   }
  //   return false;
  // }

  // function shipHit(obj, index) {
  //   for (let i = 0; i < 5; i += 1) {
  //     if (obj.ships[i].hit(obj.ships[i], index)) return true;
  //   }
  //   return false;
  // }

  function display(shipName) {
    // eslint-disable-next-line no-console
    console.log(shipName);
  }

  function whichShip(pos) {
    this.ships.forEach((obj) => {
      obj.hit(pos);
      if (obj.isSunk()) {
        // eslint-disable-next-line no-param-reassign
        obj.sunk = true;
        display(obj.name);
      }
    });
  }

  function receiveAttack(x, y) {
    const currentPosition = gridArray[x][y];
    // eslint-disable-next-line no-console
    console.log(currentPosition);

    if (!this.markedAttack.includes(currentPosition)) {
      this.markedAttack.push(currentPosition);
      if (this.filledPosition.includes(currentPosition)) {
        this.whichShip(currentPosition);
        return true;
      }
    }
    return false;
  }

  return {
    name,
    ships,
    markedAttack: [],
    filledPosition: [],
    receiveAttack,
    // shipSunk,
    // shipHit,
    placeShip,
    whichShip,
  };
}

module.exports = gameBoard;
