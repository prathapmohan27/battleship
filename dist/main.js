/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gameBoard.js":
/*!**************************!*\
  !*** ./src/gameBoard.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable operator-linebreak */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
const ship = __webpack_require__(/*! ./ship */ "./src/ship.js");

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

  function display(shipName) {
    // eslint-disable-next-line no-console
    console.log(shipName);
  }

  // check which ship hit
  function whichShip(pos) {
    this.ships.forEach((obj) => {
      if (obj.hit(pos)) {
        if (obj.isSunk()) {
          // eslint-disable-next-line no-param-reassign
          obj.sunk = true;
          display(obj.name);
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


/***/ }),

/***/ "./src/gameLoop.js":
/*!*************************!*\
  !*** ./src/gameLoop.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
const gameBoard = __webpack_require__(/*! ./gameBoard */ "./src/gameBoard.js");
const player = __webpack_require__(/*! ./player */ "./src/player.js");

const gameLoop = (() => {
  let turn = true;
  const person = gameBoard('player');
  const computer = gameBoard('computer');
  person.placeShip();
  computer.placeShip();

  let computerCell;
  let personCell;

  function showShipHit(obj, list) {
    obj.shipAttackArray.forEach((v) => list[v].classList.add('hit'));
  }
  function showShipMiss(obj, list) {
    obj.missedArray.forEach((v) => list[v].classList.add('miss'));
  }

  function startAttack(pos) {
    // eslint-disable-next-line no-console
    console.log(computer.allShipSunk());
    if (!computer.allShipSunk() && !person.allShipSunk()) {
      if (turn) {
        turn = player.playerTurn(computer, pos);
        if (turn) {
          return;
        }
        showShipHit(computer, computerCell);
        showShipMiss(computer, computerCell);
      }
      if (!turn) {
        turn = player.aiTurn(person);
        while (!turn) {
          turn = player.aiTurn(person);
          showShipHit(person, personCell);
          showShipMiss(person, personCell);
        }
        showShipHit(person, personCell);
        showShipMiss(person, personCell);
      }
    }
  }

  function getData() {
    computerCell.forEach((cell) => {
      cell.onclick = (e) => {
        e.preventDefault();
        startAttack(Number(cell.dataset.index));
      };
    });
  }

  function showShip() {
    computerCell = document.querySelectorAll('.computerCell');
    personCell = document.querySelectorAll('.playerCell');
    person.filledPosition.forEach((v) => personCell[v].classList.add('active'));
    computer.filledPosition.forEach((v) =>
      computerCell[v].classList.add('active')
    );
  }

  return {
    getData,
    showShip,
  };
})();

module.exports = gameLoop;


/***/ }),

/***/ "./src/makeGrid.js":
/*!*************************!*\
  !*** ./src/makeGrid.js ***!
  \*************************/
/***/ ((module) => {

const makeGrid = (() => {
  function createBoard(name, sub) {
    const div = document.createElement('div');
    div.classList.add('board');
    div.classList.add(name);
    for (let i = 0; i < 100; i += 1) {
      const cell = document.createElement('div');
      cell.setAttribute('data-index', i);
      cell.classList.add('cell');
      cell.classList.add(sub);
      div.appendChild(cell);
    }
    return div;
  }
  return {
    createBoard,
  };
})();

module.exports = makeGrid;


/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((module) => {

// const gameBoard = require('./gameBoard');

const player = (() => {
  function ai() {
    return Math.floor(Math.random() * 99);
  }
  function playerTurn(obj, pos) {
    if (obj.receiveAttack(pos)) {
      return false;
    }
    return true;
  }
  function aiTurn(obj) {
    const pos = ai();
    if (obj.receiveAttack(pos)) {
      return true;
    }
    return false;
  }

  return {
    playerTurn,
    aiTurn,
  };
})();

module.exports = player;


/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((module) => {

function ship(name, length) {
  function hit(currentPos) {
    if (
      // eslint-disable-next-line operator-linebreak
      this.position.includes(currentPos) &&
      !this.result.includes(currentPos)
    ) {
      this.result.push(currentPos);
      return true;
    }
    return false;
  }
  function isSunk() {
    const temp = this.result.every((a) => this.position.includes(a));
    if (this.position.length === this.result.length && temp) {
      return true;
    }
    return false;
  }
  return {
    name,
    length,
    position: [],
    sunk: false,
    result: [],
    hit,
    isSunk,
  };
}

module.exports = ship;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const gameLoop = __webpack_require__(/*! ./gameLoop */ "./src/gameLoop.js");
const makeGrid = __webpack_require__(/*! ./makeGrid */ "./src/makeGrid.js");

(() => {
  const gameContainer = document.querySelector('.gameContainer');
  gameContainer.append(makeGrid.createBoard('player', 'playerCell'));
  gameContainer.append(makeGrid.createBoard('computer', 'computerCell'));
  gameLoop.showShip();
  gameLoop.getData();
})();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsbUJBQU8sQ0FBQyw2QkFBUTs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFFBQVE7QUFDNUI7QUFDQSxzQkFBc0IsUUFBUTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLFFBQVE7QUFDNUI7QUFDQTtBQUNBLHNCQUFzQixRQUFRO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLE9BQU87QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDdExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsbUJBQU8sQ0FBQyx1Q0FBYTtBQUN2QyxlQUFlLG1CQUFPLENBQUMsaUNBQVU7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7OztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7Ozs7Ozs7Ozs7O0FDbkJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O1VDOUJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7OztBQ3RCQSxpQkFBaUIsbUJBQU8sQ0FBQyxxQ0FBWTtBQUNyQyxpQkFBaUIsbUJBQU8sQ0FBQyxxQ0FBWTs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZUxvb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tYWtlR3JpZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG9wZXJhdG9yLWxpbmVicmVhayAqL1xuLyogZXNsaW50LWRpc2FibGUgZnVuY3Rpb24tcGFyZW4tbmV3bGluZSAqL1xuLyogZXNsaW50LWRpc2FibGUgaW1wbGljaXQtYXJyb3ctbGluZWJyZWFrICovXG4vKiBlc2xpbnQtZGlzYWJsZSBjb21tYS1kYW5nbGUgKi9cbmNvbnN0IHNoaXAgPSByZXF1aXJlKCcuL3NoaXAnKTtcblxuZnVuY3Rpb24gZ2FtZUJvYXJkKG5hbWUpIHtcbiAgY29uc3QgY2FycmllciA9IHNoaXAoJ2NhcnJpZXInLCA1KTtcbiAgY29uc3QgYmF0dGxlc2hpcCA9IHNoaXAoJ2JhdHRsZXNoaXAgJywgNCk7XG4gIGNvbnN0IGNydWlzZXIgPSBzaGlwKCdjcnVpc2VyJywgMyk7XG4gIGNvbnN0IHN1Ym1hcmluZSA9IHNoaXAoJ3N1Ym1hcmluZScsIDMpO1xuICBjb25zdCBkZXN0cm95ZXIgPSBzaGlwKCdkZXN0cm95ZXInLCAyKTtcbiAgY29uc3Qgc2hpcHMgPSBbY2FycmllciwgYmF0dGxlc2hpcCwgY3J1aXNlciwgc3VibWFyaW5lLCBkZXN0cm95ZXJdO1xuICBsZXQgaG9yaXpvbnRhbEFycmF5ID0gW107XG4gIGxldCB2ZXJ0aWNhbEFycmF5ID0gW107XG5cbiAgLy8gaXQncyBjcmVhdGUgaG9yaXpvbnRhbCAyeDIgbWF0cml4XG4gIGZ1bmN0aW9uIGhvcml6b250YWxWYWx1ZSgpIHtcbiAgICBjb25zdCBhcnIgPSBbXTtcbiAgICBsZXQgc3RhcnQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkgKz0gMSkge1xuICAgICAgYXJyW2ldID0gW107XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqICs9IDEpIHtcbiAgICAgICAgYXJyW2ldW2pdID0gc3RhcnQ7XG4gICAgICAgIHN0YXJ0ICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgLy8gaXQncyBjcmVhdGUgdmVydGljYWwgMngyIG1hdHJpeFxuICBmdW5jdGlvbiB2ZXJ0aWNhbFZhbHVlKCkge1xuICAgIGNvbnN0IGFyciA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSArPSAxKSB7XG4gICAgICBhcnJbaV0gPSBbXTtcbiAgICAgIGxldCBzdGFydCA9IGk7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqICs9IDEpIHtcbiAgICAgICAgYXJyW2ldW2pdID0gc3RhcnQ7XG4gICAgICAgIHN0YXJ0ICs9IDEwO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIGhvcml6b250YWxBcnJheSA9IGhvcml6b250YWxWYWx1ZSgpO1xuICB2ZXJ0aWNhbEFycmF5ID0gdmVydGljYWxWYWx1ZSgpO1xuXG4gIC8vIGl0J3MgZ2VuZXJhdGUgcG9zaXRpb25cbiAgZnVuY3Rpb24gZ2VuZXJhdGVIb3Jpem9udGFsUG9zaXRpb24obiwgaW5kZXgpIHtcbiAgICBjb25zdCB0ZW1wID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpICs9IDEpIHtcbiAgICAgIHRlbXAucHVzaChpbmRleCArIGkpO1xuICAgIH1cbiAgICByZXR1cm4gdGVtcDtcbiAgfVxuICBmdW5jdGlvbiBnZW5lcmF0ZVZlcnRpY2FsUG9zaXRpb24obiwgaW5kZXgpIHtcbiAgICBjb25zdCB0ZW1wID0gW107XG4gICAgbGV0IHBvcyA9IGluZGV4O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSArPSAxKSB7XG4gICAgICB0ZW1wLnB1c2gocG9zKTtcbiAgICAgIHBvcyArPSAxMDtcbiAgICB9XG4gICAgcmV0dXJuIHRlbXA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRTdGFydCgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogOTkpO1xuICB9XG4gIC8vIGl0J3MgcGxhY2Ugc2hpcCB2ZXJ0aWNhbFxuICBmdW5jdGlvbiBwbGFjZVZlcnRpY2FsKG9iaiwgaW5kZXgpIHtcbiAgICBjb25zdCB0ZW1wID0gW107XG4gICAgaWYgKCF0aGlzLmZpbGxlZFBvc2l0aW9uLmluY2x1ZGVzKGluZGV4KSkge1xuICAgICAgdGVtcC5wdXNoKC4uLmdlbmVyYXRlVmVydGljYWxQb3NpdGlvbihvYmoubGVuZ3RoLCBpbmRleCkpO1xuICAgICAgY29uc3QgaXNUYWtlID0gdGhpcy5maWxsZWRQb3NpdGlvbi5zb21lKCh4KSA9PiB0ZW1wLmluY2x1ZGVzKHgpKTtcbiAgICAgIGNvbnN0IGlzT3V0ID0gdmVydGljYWxBcnJheS5zb21lKChhcnIpID0+XG4gICAgICAgIHRlbXAuZXZlcnkoKHYpID0+IGFyci5pbmNsdWRlcyh2KSlcbiAgICAgICk7XG4gICAgICBpZiAoIWlzT3V0KSB7XG4gICAgICAgIHRoaXMucGxhY2VTaGlwKCk7XG4gICAgICB9XG4gICAgICBpZiAoIWlzVGFrZSAmJiBpc091dCkge1xuICAgICAgICB0aGlzLmZpbGxlZFBvc2l0aW9uLnB1c2goLi4udGVtcCk7XG4gICAgICAgIG9iai5wb3NpdGlvbi5wdXNoKC4uLnRlbXApO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBsYWNlU2hpcCgpO1xuICB9XG4gIGZ1bmN0aW9uIHBsYWNlSG9yaXpvbnRhbChvYmosIGluZGV4KSB7XG4gICAgY29uc3QgdGVtcCA9IFtdO1xuICAgIGlmICghdGhpcy5maWxsZWRQb3NpdGlvbi5pbmNsdWRlcyhpbmRleCkpIHtcbiAgICAgIHRlbXAucHVzaCguLi5nZW5lcmF0ZUhvcml6b250YWxQb3NpdGlvbihvYmoubGVuZ3RoLCBpbmRleCkpO1xuICAgICAgY29uc3QgaXNUYWtlID0gdGhpcy5maWxsZWRQb3NpdGlvbi5zb21lKCh4KSA9PiB0ZW1wLmluY2x1ZGVzKHgpKTtcbiAgICAgIGNvbnN0IGlzT3V0ID0gaG9yaXpvbnRhbEFycmF5LnNvbWUoKGFycikgPT5cbiAgICAgICAgdGVtcC5ldmVyeSgodikgPT4gYXJyLmluY2x1ZGVzKHYpKVxuICAgICAgKTtcbiAgICAgIGlmICghaXNPdXQpIHtcbiAgICAgICAgdGhpcy5wbGFjZVNoaXAoKTtcbiAgICAgIH1cbiAgICAgIGlmICghaXNUYWtlICYmIGlzT3V0KSB7XG4gICAgICAgIHRoaXMuZmlsbGVkUG9zaXRpb24ucHVzaCguLi50ZW1wKTtcbiAgICAgICAgb2JqLnBvc2l0aW9uLnB1c2goLi4udGVtcCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucGxhY2VTaGlwKCk7XG4gIH1cblxuICAvLyBwbGFjZSB0aGUgc2hpcCByYW5kb21seVxuICBmdW5jdGlvbiBwbGFjZVNoaXAoKSB7XG4gICAgdGhpcy5zaGlwcy5mb3JFYWNoKChvYmopID0+IHtcbiAgICAgIGlmIChvYmoucG9zaXRpb24ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gZ2V0U3RhcnQoKTtcbiAgICAgICAgY29uc3QgZCA9IHRoaXMuZGlyZWN0aW9uW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpXTtcbiAgICAgICAgaWYgKGQgPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBwbGFjZVZlcnRpY2FsLmJpbmQodGhpcyk7XG4gICAgICAgICAgcmVzdWx0KG9iaiwgaW5kZXgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHBsYWNlSG9yaXpvbnRhbC5iaW5kKHRoaXMpO1xuICAgICAgICAgIHJlc3VsdChvYmosIGluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGNoZWNrID0gdGhpcy5zaGlwcy5ldmVyeSgob2JqKSA9PiBvYmoucG9zaXRpb24ubGVuZ3RoICE9PSAwKTtcbiAgICBpZiAoY2hlY2spIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gY2hlY2sgYWxsIHNoaXAgaXMgc3Vua1xuICBmdW5jdGlvbiBhbGxTaGlwU3VuaygpIHtcbiAgICBjb25zdCB0ZW1wID0gdGhpcy5maWxsZWRQb3NpdGlvbi5ldmVyeSgoZWxlKSA9PlxuICAgICAgdGhpcy5zaGlwQXR0YWNrQXJyYXkuaW5jbHVkZXMoZWxlKVxuICAgICk7XG4gICAgcmV0dXJuIHRlbXA7XG4gIH1cblxuICBmdW5jdGlvbiBkaXNwbGF5KHNoaXBOYW1lKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZyhzaGlwTmFtZSk7XG4gIH1cblxuICAvLyBjaGVjayB3aGljaCBzaGlwIGhpdFxuICBmdW5jdGlvbiB3aGljaFNoaXAocG9zKSB7XG4gICAgdGhpcy5zaGlwcy5mb3JFYWNoKChvYmopID0+IHtcbiAgICAgIGlmIChvYmouaGl0KHBvcykpIHtcbiAgICAgICAgaWYgKG9iai5pc1N1bmsoKSkge1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgICAgIG9iai5zdW5rID0gdHJ1ZTtcbiAgICAgICAgICBkaXNwbGF5KG9iai5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayhjdXJyZW50UG9zaXRpb24pIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5zaGlwQXR0YWNrQXJyYXkuaW5jbHVkZXMoY3VycmVudFBvc2l0aW9uKSAmJlxuICAgICAgIXRoaXMubWlzc2VkQXJyYXkuaW5jbHVkZXMoY3VycmVudFBvc2l0aW9uKVxuICAgICkge1xuICAgICAgaWYgKHRoaXMuZmlsbGVkUG9zaXRpb24uaW5jbHVkZXMoY3VycmVudFBvc2l0aW9uKSkge1xuICAgICAgICB0aGlzLnNoaXBBdHRhY2tBcnJheS5wdXNoKGN1cnJlbnRQb3NpdGlvbik7XG4gICAgICAgIHRoaXMud2hpY2hTaGlwKGN1cnJlbnRQb3NpdGlvbik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5taXNzZWRBcnJheS5wdXNoKGN1cnJlbnRQb3NpdGlvbik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lLFxuICAgIHNoaXBzLFxuICAgIGZpbGxlZFBvc2l0aW9uOiBbXSxcbiAgICBzaGlwQXR0YWNrQXJyYXk6IFtdLFxuICAgIG1pc3NlZEFycmF5OiBbXSxcbiAgICBkaXJlY3Rpb246IFsnaG9yaXpvbnRhbCcsICd2ZXJ0aWNhbCddLFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgcGxhY2VTaGlwLFxuICAgIHdoaWNoU2hpcCxcbiAgICBhbGxTaGlwU3VuayxcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnYW1lQm9hcmQ7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBmdW5jdGlvbi1wYXJlbi1uZXdsaW5lICovXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBsaWNpdC1hcnJvdy1saW5lYnJlYWsgKi9cbi8qIGVzbGludC1kaXNhYmxlIGNvbW1hLWRhbmdsZSAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tYWxlcnQgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5jb25zdCBnYW1lQm9hcmQgPSByZXF1aXJlKCcuL2dhbWVCb2FyZCcpO1xuY29uc3QgcGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKTtcblxuY29uc3QgZ2FtZUxvb3AgPSAoKCkgPT4ge1xuICBsZXQgdHVybiA9IHRydWU7XG4gIGNvbnN0IHBlcnNvbiA9IGdhbWVCb2FyZCgncGxheWVyJyk7XG4gIGNvbnN0IGNvbXB1dGVyID0gZ2FtZUJvYXJkKCdjb21wdXRlcicpO1xuICBwZXJzb24ucGxhY2VTaGlwKCk7XG4gIGNvbXB1dGVyLnBsYWNlU2hpcCgpO1xuXG4gIGxldCBjb21wdXRlckNlbGw7XG4gIGxldCBwZXJzb25DZWxsO1xuXG4gIGZ1bmN0aW9uIHNob3dTaGlwSGl0KG9iaiwgbGlzdCkge1xuICAgIG9iai5zaGlwQXR0YWNrQXJyYXkuZm9yRWFjaCgodikgPT4gbGlzdFt2XS5jbGFzc0xpc3QuYWRkKCdoaXQnKSk7XG4gIH1cbiAgZnVuY3Rpb24gc2hvd1NoaXBNaXNzKG9iaiwgbGlzdCkge1xuICAgIG9iai5taXNzZWRBcnJheS5mb3JFYWNoKCh2KSA9PiBsaXN0W3ZdLmNsYXNzTGlzdC5hZGQoJ21pc3MnKSk7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydEF0dGFjayhwb3MpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUubG9nKGNvbXB1dGVyLmFsbFNoaXBTdW5rKCkpO1xuICAgIGlmICghY29tcHV0ZXIuYWxsU2hpcFN1bmsoKSAmJiAhcGVyc29uLmFsbFNoaXBTdW5rKCkpIHtcbiAgICAgIGlmICh0dXJuKSB7XG4gICAgICAgIHR1cm4gPSBwbGF5ZXIucGxheWVyVHVybihjb21wdXRlciwgcG9zKTtcbiAgICAgICAgaWYgKHR1cm4pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc2hvd1NoaXBIaXQoY29tcHV0ZXIsIGNvbXB1dGVyQ2VsbCk7XG4gICAgICAgIHNob3dTaGlwTWlzcyhjb21wdXRlciwgY29tcHV0ZXJDZWxsKTtcbiAgICAgIH1cbiAgICAgIGlmICghdHVybikge1xuICAgICAgICB0dXJuID0gcGxheWVyLmFpVHVybihwZXJzb24pO1xuICAgICAgICB3aGlsZSAoIXR1cm4pIHtcbiAgICAgICAgICB0dXJuID0gcGxheWVyLmFpVHVybihwZXJzb24pO1xuICAgICAgICAgIHNob3dTaGlwSGl0KHBlcnNvbiwgcGVyc29uQ2VsbCk7XG4gICAgICAgICAgc2hvd1NoaXBNaXNzKHBlcnNvbiwgcGVyc29uQ2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgc2hvd1NoaXBIaXQocGVyc29uLCBwZXJzb25DZWxsKTtcbiAgICAgICAgc2hvd1NoaXBNaXNzKHBlcnNvbiwgcGVyc29uQ2VsbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgICBjb21wdXRlckNlbGwuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzdGFydEF0dGFjayhOdW1iZXIoY2VsbC5kYXRhc2V0LmluZGV4KSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvd1NoaXAoKSB7XG4gICAgY29tcHV0ZXJDZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbXB1dGVyQ2VsbCcpO1xuICAgIHBlcnNvbkNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyQ2VsbCcpO1xuICAgIHBlcnNvbi5maWxsZWRQb3NpdGlvbi5mb3JFYWNoKCh2KSA9PiBwZXJzb25DZWxsW3ZdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpKTtcbiAgICBjb21wdXRlci5maWxsZWRQb3NpdGlvbi5mb3JFYWNoKCh2KSA9PlxuICAgICAgY29tcHV0ZXJDZWxsW3ZdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0RGF0YSxcbiAgICBzaG93U2hpcCxcbiAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2FtZUxvb3A7XG4iLCJjb25zdCBtYWtlR3JpZCA9ICgoKSA9PiB7XG4gIGZ1bmN0aW9uIGNyZWF0ZUJvYXJkKG5hbWUsIHN1Yikge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdib2FyZCcpO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKG5hbWUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNlbGwuc2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JywgaSk7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChzdWIpO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGNlbGwpO1xuICAgIH1cbiAgICByZXR1cm4gZGl2O1xuICB9XG4gIHJldHVybiB7XG4gICAgY3JlYXRlQm9hcmQsXG4gIH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2VHcmlkO1xuIiwiLy8gY29uc3QgZ2FtZUJvYXJkID0gcmVxdWlyZSgnLi9nYW1lQm9hcmQnKTtcblxuY29uc3QgcGxheWVyID0gKCgpID0+IHtcbiAgZnVuY3Rpb24gYWkoKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDk5KTtcbiAgfVxuICBmdW5jdGlvbiBwbGF5ZXJUdXJuKG9iaiwgcG9zKSB7XG4gICAgaWYgKG9iai5yZWNlaXZlQXR0YWNrKHBvcykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZnVuY3Rpb24gYWlUdXJuKG9iaikge1xuICAgIGNvbnN0IHBvcyA9IGFpKCk7XG4gICAgaWYgKG9iai5yZWNlaXZlQXR0YWNrKHBvcykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBsYXllclR1cm4sXG4gICAgYWlUdXJuLFxuICB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBwbGF5ZXI7XG4iLCJmdW5jdGlvbiBzaGlwKG5hbWUsIGxlbmd0aCkge1xuICBmdW5jdGlvbiBoaXQoY3VycmVudFBvcykge1xuICAgIGlmIChcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBvcGVyYXRvci1saW5lYnJlYWtcbiAgICAgIHRoaXMucG9zaXRpb24uaW5jbHVkZXMoY3VycmVudFBvcykgJiZcbiAgICAgICF0aGlzLnJlc3VsdC5pbmNsdWRlcyhjdXJyZW50UG9zKVxuICAgICkge1xuICAgICAgdGhpcy5yZXN1bHQucHVzaChjdXJyZW50UG9zKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gaXNTdW5rKCkge1xuICAgIGNvbnN0IHRlbXAgPSB0aGlzLnJlc3VsdC5ldmVyeSgoYSkgPT4gdGhpcy5wb3NpdGlvbi5pbmNsdWRlcyhhKSk7XG4gICAgaWYgKHRoaXMucG9zaXRpb24ubGVuZ3RoID09PSB0aGlzLnJlc3VsdC5sZW5ndGggJiYgdGVtcCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4ge1xuICAgIG5hbWUsXG4gICAgbGVuZ3RoLFxuICAgIHBvc2l0aW9uOiBbXSxcbiAgICBzdW5rOiBmYWxzZSxcbiAgICByZXN1bHQ6IFtdLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hpcDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJjb25zdCBnYW1lTG9vcCA9IHJlcXVpcmUoJy4vZ2FtZUxvb3AnKTtcbmNvbnN0IG1ha2VHcmlkID0gcmVxdWlyZSgnLi9tYWtlR3JpZCcpO1xuXG4oKCkgPT4ge1xuICBjb25zdCBnYW1lQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWVDb250YWluZXInKTtcbiAgZ2FtZUNvbnRhaW5lci5hcHBlbmQobWFrZUdyaWQuY3JlYXRlQm9hcmQoJ3BsYXllcicsICdwbGF5ZXJDZWxsJykpO1xuICBnYW1lQ29udGFpbmVyLmFwcGVuZChtYWtlR3JpZC5jcmVhdGVCb2FyZCgnY29tcHV0ZXInLCAnY29tcHV0ZXJDZWxsJykpO1xuICBnYW1lTG9vcC5zaG93U2hpcCgpO1xuICBnYW1lTG9vcC5nZXREYXRhKCk7XG59KSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9