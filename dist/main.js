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
  const person = gameBoard('Player');
  const computer = gameBoard('Computer');
  person.placeShip();
  computer.placeShip();
  const result = document.querySelector('.result');
  const personSunk = [];
  const computerSunk = [];

  let computerCell;
  let personCell;

  function showShipHit(obj, list) {
    obj.shipAttackArray.forEach((v) => list[v].classList.add('hit'));
  }
  function showShipMiss(obj, list) {
    obj.missedArray.forEach((v) => list[v].classList.add('miss'));
  }

  function display(sen) {
    result.textContent = sen;
  }

  function finalResult() {
    if (computer.allShipSunk()) {
      display(`${person.name} Won!`);
    }
    if (person.allShipSunk()) {
      display(`${computer.name} Won!`);
    }
  }

  function getShip(obj) {
    obj.ships.forEach((sub) => {
      if (obj.name === 'Computer') {
        if (sub.sunk) {
          if (!computerSunk.includes(sub.name)) {
            computerSunk.push(sub.name);
            display(`${computer.name} ${sub.name} was sunk`);
          }
        }
      }
      if (obj.name === 'Player') {
        if (sub.sunk) {
          if (!personSunk.includes(sub.name)) {
            personSunk.push(sub.name);
            display(`${person.name} ${sub.name} was sunk`);
          }
        }
      }
    });
  }

  function startAttack(pos) {
    if (!computer.allShipSunk() && !person.allShipSunk()) {
      if (turn) {
        turn = player.playerTurn(computer, pos);
        if (turn) {
          return;
        }
        display(`${computer.name} Turn!`);
        showShipHit(computer, computerCell);
        showShipMiss(computer, computerCell);
        getShip(computer);
      }
      setTimeout(() => {
        if (!turn) {
          turn = player.aiTurn(person);
          while (!turn) {
            turn = player.aiTurn(person);
          }
          getShip(person);
          display(`${person.name} Turn!`);
          showShipHit(person, personCell);
          showShipMiss(person, personCell);
        }
      }, 1000);
    }
    finalResult();
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
    showShipHit,
    showShipMiss,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7OztBQ25CQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztVQzlCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7QUN0QkEsaUJBQWlCLG1CQUFPLENBQUMscUNBQVk7QUFDckMsaUJBQWlCLG1CQUFPLENBQUMscUNBQVk7O0FBRXJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVMb29wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbWFrZUdyaWQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBvcGVyYXRvci1saW5lYnJlYWsgKi9cbi8qIGVzbGludC1kaXNhYmxlIGZ1bmN0aW9uLXBhcmVuLW5ld2xpbmUgKi9cbi8qIGVzbGludC1kaXNhYmxlIGltcGxpY2l0LWFycm93LWxpbmVicmVhayAqL1xuLyogZXNsaW50LWRpc2FibGUgY29tbWEtZGFuZ2xlICovXG5jb25zdCBzaGlwID0gcmVxdWlyZSgnLi9zaGlwJyk7XG5cbmZ1bmN0aW9uIGdhbWVCb2FyZChuYW1lKSB7XG4gIGNvbnN0IGNhcnJpZXIgPSBzaGlwKCdjYXJyaWVyJywgNSk7XG4gIGNvbnN0IGJhdHRsZXNoaXAgPSBzaGlwKCdiYXR0bGVzaGlwICcsIDQpO1xuICBjb25zdCBjcnVpc2VyID0gc2hpcCgnY3J1aXNlcicsIDMpO1xuICBjb25zdCBzdWJtYXJpbmUgPSBzaGlwKCdzdWJtYXJpbmUnLCAzKTtcbiAgY29uc3QgZGVzdHJveWVyID0gc2hpcCgnZGVzdHJveWVyJywgMik7XG4gIGNvbnN0IHNoaXBzID0gW2NhcnJpZXIsIGJhdHRsZXNoaXAsIGNydWlzZXIsIHN1Ym1hcmluZSwgZGVzdHJveWVyXTtcbiAgbGV0IGhvcml6b250YWxBcnJheSA9IFtdO1xuICBsZXQgdmVydGljYWxBcnJheSA9IFtdO1xuXG4gIC8vIGl0J3MgY3JlYXRlIGhvcml6b250YWwgMngyIG1hdHJpeFxuICBmdW5jdGlvbiBob3Jpem9udGFsVmFsdWUoKSB7XG4gICAgY29uc3QgYXJyID0gW107XG4gICAgbGV0IHN0YXJ0ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpICs9IDEpIHtcbiAgICAgIGFycltpXSA9IFtdO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaiArPSAxKSB7XG4gICAgICAgIGFycltpXVtqXSA9IHN0YXJ0O1xuICAgICAgICBzdGFydCArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIC8vIGl0J3MgY3JlYXRlIHZlcnRpY2FsIDJ4MiBtYXRyaXhcbiAgZnVuY3Rpb24gdmVydGljYWxWYWx1ZSgpIHtcbiAgICBjb25zdCBhcnIgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkgKz0gMSkge1xuICAgICAgYXJyW2ldID0gW107XG4gICAgICBsZXQgc3RhcnQgPSBpO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaiArPSAxKSB7XG4gICAgICAgIGFycltpXVtqXSA9IHN0YXJ0O1xuICAgICAgICBzdGFydCArPSAxMDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBob3Jpem9udGFsQXJyYXkgPSBob3Jpem9udGFsVmFsdWUoKTtcbiAgdmVydGljYWxBcnJheSA9IHZlcnRpY2FsVmFsdWUoKTtcblxuICAvLyBpdCdzIGdlbmVyYXRlIHBvc2l0aW9uXG4gIGZ1bmN0aW9uIGdlbmVyYXRlSG9yaXpvbnRhbFBvc2l0aW9uKG4sIGluZGV4KSB7XG4gICAgY29uc3QgdGVtcCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSArPSAxKSB7XG4gICAgICB0ZW1wLnB1c2goaW5kZXggKyBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHRlbXA7XG4gIH1cbiAgZnVuY3Rpb24gZ2VuZXJhdGVWZXJ0aWNhbFBvc2l0aW9uKG4sIGluZGV4KSB7XG4gICAgY29uc3QgdGVtcCA9IFtdO1xuICAgIGxldCBwb3MgPSBpbmRleDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkgKz0gMSkge1xuICAgICAgdGVtcC5wdXNoKHBvcyk7XG4gICAgICBwb3MgKz0gMTA7XG4gICAgfVxuICAgIHJldHVybiB0ZW1wO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U3RhcnQoKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDk5KTtcbiAgfVxuICAvLyBpdCdzIHBsYWNlIHNoaXAgdmVydGljYWxcbiAgZnVuY3Rpb24gcGxhY2VWZXJ0aWNhbChvYmosIGluZGV4KSB7XG4gICAgY29uc3QgdGVtcCA9IFtdO1xuICAgIGlmICghdGhpcy5maWxsZWRQb3NpdGlvbi5pbmNsdWRlcyhpbmRleCkpIHtcbiAgICAgIHRlbXAucHVzaCguLi5nZW5lcmF0ZVZlcnRpY2FsUG9zaXRpb24ob2JqLmxlbmd0aCwgaW5kZXgpKTtcbiAgICAgIGNvbnN0IGlzVGFrZSA9IHRoaXMuZmlsbGVkUG9zaXRpb24uc29tZSgoeCkgPT4gdGVtcC5pbmNsdWRlcyh4KSk7XG4gICAgICBjb25zdCBpc091dCA9IHZlcnRpY2FsQXJyYXkuc29tZSgoYXJyKSA9PlxuICAgICAgICB0ZW1wLmV2ZXJ5KCh2KSA9PiBhcnIuaW5jbHVkZXModikpXG4gICAgICApO1xuICAgICAgaWYgKCFpc091dCkge1xuICAgICAgICB0aGlzLnBsYWNlU2hpcCgpO1xuICAgICAgfVxuICAgICAgaWYgKCFpc1Rha2UgJiYgaXNPdXQpIHtcbiAgICAgICAgdGhpcy5maWxsZWRQb3NpdGlvbi5wdXNoKC4uLnRlbXApO1xuICAgICAgICBvYmoucG9zaXRpb24ucHVzaCguLi50ZW1wKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wbGFjZVNoaXAoKTtcbiAgfVxuICBmdW5jdGlvbiBwbGFjZUhvcml6b250YWwob2JqLCBpbmRleCkge1xuICAgIGNvbnN0IHRlbXAgPSBbXTtcbiAgICBpZiAoIXRoaXMuZmlsbGVkUG9zaXRpb24uaW5jbHVkZXMoaW5kZXgpKSB7XG4gICAgICB0ZW1wLnB1c2goLi4uZ2VuZXJhdGVIb3Jpem9udGFsUG9zaXRpb24ob2JqLmxlbmd0aCwgaW5kZXgpKTtcbiAgICAgIGNvbnN0IGlzVGFrZSA9IHRoaXMuZmlsbGVkUG9zaXRpb24uc29tZSgoeCkgPT4gdGVtcC5pbmNsdWRlcyh4KSk7XG4gICAgICBjb25zdCBpc091dCA9IGhvcml6b250YWxBcnJheS5zb21lKChhcnIpID0+XG4gICAgICAgIHRlbXAuZXZlcnkoKHYpID0+IGFyci5pbmNsdWRlcyh2KSlcbiAgICAgICk7XG4gICAgICBpZiAoIWlzT3V0KSB7XG4gICAgICAgIHRoaXMucGxhY2VTaGlwKCk7XG4gICAgICB9XG4gICAgICBpZiAoIWlzVGFrZSAmJiBpc091dCkge1xuICAgICAgICB0aGlzLmZpbGxlZFBvc2l0aW9uLnB1c2goLi4udGVtcCk7XG4gICAgICAgIG9iai5wb3NpdGlvbi5wdXNoKC4uLnRlbXApO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnBsYWNlU2hpcCgpO1xuICB9XG5cbiAgLy8gcGxhY2UgdGhlIHNoaXAgcmFuZG9tbHlcbiAgZnVuY3Rpb24gcGxhY2VTaGlwKCkge1xuICAgIHRoaXMuc2hpcHMuZm9yRWFjaCgob2JqKSA9PiB7XG4gICAgICBpZiAob2JqLnBvc2l0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IGdldFN0YXJ0KCk7XG4gICAgICAgIGNvbnN0IGQgPSB0aGlzLmRpcmVjdGlvbltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKV07XG4gICAgICAgIGlmIChkID09PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gcGxhY2VWZXJ0aWNhbC5iaW5kKHRoaXMpO1xuICAgICAgICAgIHJlc3VsdChvYmosIGluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBwbGFjZUhvcml6b250YWwuYmluZCh0aGlzKTtcbiAgICAgICAgICByZXN1bHQob2JqLCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBjaGVjayA9IHRoaXMuc2hpcHMuZXZlcnkoKG9iaikgPT4gb2JqLnBvc2l0aW9uLmxlbmd0aCAhPT0gMCk7XG4gICAgaWYgKGNoZWNrKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIGNoZWNrIGFsbCBzaGlwIGlzIHN1bmtcbiAgZnVuY3Rpb24gYWxsU2hpcFN1bmsoKSB7XG4gICAgY29uc3QgdGVtcCA9IHRoaXMuZmlsbGVkUG9zaXRpb24uZXZlcnkoKGVsZSkgPT5cbiAgICAgIHRoaXMuc2hpcEF0dGFja0FycmF5LmluY2x1ZGVzKGVsZSlcbiAgICApO1xuICAgIHJldHVybiB0ZW1wO1xuICB9XG5cbiAgLy8gY2hlY2sgd2hpY2ggc2hpcCBoaXRcbiAgZnVuY3Rpb24gd2hpY2hTaGlwKHBvcykge1xuICAgIHRoaXMuc2hpcHMuZm9yRWFjaCgob2JqKSA9PiB7XG4gICAgICBpZiAob2JqLmhpdChwb3MpKSB7XG4gICAgICAgIGlmIChvYmouaXNTdW5rKCkpIHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgICBvYmouc3VuayA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soY3VycmVudFBvc2l0aW9uKSB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuc2hpcEF0dGFja0FycmF5LmluY2x1ZGVzKGN1cnJlbnRQb3NpdGlvbikgJiZcbiAgICAgICF0aGlzLm1pc3NlZEFycmF5LmluY2x1ZGVzKGN1cnJlbnRQb3NpdGlvbilcbiAgICApIHtcbiAgICAgIGlmICh0aGlzLmZpbGxlZFBvc2l0aW9uLmluY2x1ZGVzKGN1cnJlbnRQb3NpdGlvbikpIHtcbiAgICAgICAgdGhpcy5zaGlwQXR0YWNrQXJyYXkucHVzaChjdXJyZW50UG9zaXRpb24pO1xuICAgICAgICB0aGlzLndoaWNoU2hpcChjdXJyZW50UG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMubWlzc2VkQXJyYXkucHVzaChjdXJyZW50UG9zaXRpb24pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZSxcbiAgICBzaGlwcyxcbiAgICBmaWxsZWRQb3NpdGlvbjogW10sXG4gICAgc2hpcEF0dGFja0FycmF5OiBbXSxcbiAgICBtaXNzZWRBcnJheTogW10sXG4gICAgZGlyZWN0aW9uOiBbJ2hvcml6b250YWwnLCAndmVydGljYWwnXSxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIHBsYWNlU2hpcCxcbiAgICB3aGljaFNoaXAsXG4gICAgYWxsU2hpcFN1bmssXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2FtZUJvYXJkO1xuIiwiLyogZXNsaW50LWRpc2FibGUgZnVuY3Rpb24tcGFyZW4tbmV3bGluZSAqL1xuLyogZXNsaW50LWRpc2FibGUgaW1wbGljaXQtYXJyb3ctbGluZWJyZWFrICovXG4vKiBlc2xpbnQtZGlzYWJsZSBjb21tYS1kYW5nbGUgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLWFsZXJ0ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuY29uc3QgZ2FtZUJvYXJkID0gcmVxdWlyZSgnLi9nYW1lQm9hcmQnKTtcbmNvbnN0IHBsYXllciA9IHJlcXVpcmUoJy4vcGxheWVyJyk7XG5cbmNvbnN0IGdhbWVMb29wID0gKCgpID0+IHtcbiAgbGV0IHR1cm4gPSB0cnVlO1xuICBjb25zdCBwZXJzb24gPSBnYW1lQm9hcmQoJ1BsYXllcicpO1xuICBjb25zdCBjb21wdXRlciA9IGdhbWVCb2FyZCgnQ29tcHV0ZXInKTtcbiAgcGVyc29uLnBsYWNlU2hpcCgpO1xuICBjb21wdXRlci5wbGFjZVNoaXAoKTtcbiAgY29uc3QgcmVzdWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc3VsdCcpO1xuICBjb25zdCBwZXJzb25TdW5rID0gW107XG4gIGNvbnN0IGNvbXB1dGVyU3VuayA9IFtdO1xuXG4gIGxldCBjb21wdXRlckNlbGw7XG4gIGxldCBwZXJzb25DZWxsO1xuXG4gIGZ1bmN0aW9uIHNob3dTaGlwSGl0KG9iaiwgbGlzdCkge1xuICAgIG9iai5zaGlwQXR0YWNrQXJyYXkuZm9yRWFjaCgodikgPT4gbGlzdFt2XS5jbGFzc0xpc3QuYWRkKCdoaXQnKSk7XG4gIH1cbiAgZnVuY3Rpb24gc2hvd1NoaXBNaXNzKG9iaiwgbGlzdCkge1xuICAgIG9iai5taXNzZWRBcnJheS5mb3JFYWNoKCh2KSA9PiBsaXN0W3ZdLmNsYXNzTGlzdC5hZGQoJ21pc3MnKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkaXNwbGF5KHNlbikge1xuICAgIHJlc3VsdC50ZXh0Q29udGVudCA9IHNlbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmFsUmVzdWx0KCkge1xuICAgIGlmIChjb21wdXRlci5hbGxTaGlwU3VuaygpKSB7XG4gICAgICBkaXNwbGF5KGAke3BlcnNvbi5uYW1lfSBXb24hYCk7XG4gICAgfVxuICAgIGlmIChwZXJzb24uYWxsU2hpcFN1bmsoKSkge1xuICAgICAgZGlzcGxheShgJHtjb21wdXRlci5uYW1lfSBXb24hYCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2hpcChvYmopIHtcbiAgICBvYmouc2hpcHMuZm9yRWFjaCgoc3ViKSA9PiB7XG4gICAgICBpZiAob2JqLm5hbWUgPT09ICdDb21wdXRlcicpIHtcbiAgICAgICAgaWYgKHN1Yi5zdW5rKSB7XG4gICAgICAgICAgaWYgKCFjb21wdXRlclN1bmsuaW5jbHVkZXMoc3ViLm5hbWUpKSB7XG4gICAgICAgICAgICBjb21wdXRlclN1bmsucHVzaChzdWIubmFtZSk7XG4gICAgICAgICAgICBkaXNwbGF5KGAke2NvbXB1dGVyLm5hbWV9ICR7c3ViLm5hbWV9IHdhcyBzdW5rYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAob2JqLm5hbWUgPT09ICdQbGF5ZXInKSB7XG4gICAgICAgIGlmIChzdWIuc3Vuaykge1xuICAgICAgICAgIGlmICghcGVyc29uU3Vuay5pbmNsdWRlcyhzdWIubmFtZSkpIHtcbiAgICAgICAgICAgIHBlcnNvblN1bmsucHVzaChzdWIubmFtZSk7XG4gICAgICAgICAgICBkaXNwbGF5KGAke3BlcnNvbi5uYW1lfSAke3N1Yi5uYW1lfSB3YXMgc3Vua2ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RhcnRBdHRhY2socG9zKSB7XG4gICAgaWYgKCFjb21wdXRlci5hbGxTaGlwU3VuaygpICYmICFwZXJzb24uYWxsU2hpcFN1bmsoKSkge1xuICAgICAgaWYgKHR1cm4pIHtcbiAgICAgICAgdHVybiA9IHBsYXllci5wbGF5ZXJUdXJuKGNvbXB1dGVyLCBwb3MpO1xuICAgICAgICBpZiAodHVybikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5KGAke2NvbXB1dGVyLm5hbWV9IFR1cm4hYCk7XG4gICAgICAgIHNob3dTaGlwSGl0KGNvbXB1dGVyLCBjb21wdXRlckNlbGwpO1xuICAgICAgICBzaG93U2hpcE1pc3MoY29tcHV0ZXIsIGNvbXB1dGVyQ2VsbCk7XG4gICAgICAgIGdldFNoaXAoY29tcHV0ZXIpO1xuICAgICAgfVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICghdHVybikge1xuICAgICAgICAgIHR1cm4gPSBwbGF5ZXIuYWlUdXJuKHBlcnNvbik7XG4gICAgICAgICAgd2hpbGUgKCF0dXJuKSB7XG4gICAgICAgICAgICB0dXJuID0gcGxheWVyLmFpVHVybihwZXJzb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBnZXRTaGlwKHBlcnNvbik7XG4gICAgICAgICAgZGlzcGxheShgJHtwZXJzb24ubmFtZX0gVHVybiFgKTtcbiAgICAgICAgICBzaG93U2hpcEhpdChwZXJzb24sIHBlcnNvbkNlbGwpO1xuICAgICAgICAgIHNob3dTaGlwTWlzcyhwZXJzb24sIHBlcnNvbkNlbGwpO1xuICAgICAgICB9XG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG4gICAgZmluYWxSZXN1bHQoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldERhdGEoKSB7XG4gICAgY29tcHV0ZXJDZWxsLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgc3RhcnRBdHRhY2soTnVtYmVyKGNlbGwuZGF0YXNldC5pbmRleCkpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dTaGlwKCkge1xuICAgIGNvbXB1dGVyQ2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb21wdXRlckNlbGwnKTtcbiAgICBwZXJzb25DZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYXllckNlbGwnKTtcbiAgICBwZXJzb24uZmlsbGVkUG9zaXRpb24uZm9yRWFjaCgodikgPT4gcGVyc29uQ2VsbFt2XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSk7XG4gICAgY29tcHV0ZXIuZmlsbGVkUG9zaXRpb24uZm9yRWFjaCgodikgPT5cbiAgICAgIGNvbXB1dGVyQ2VsbFt2XS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHNob3dTaGlwSGl0LFxuICAgIHNob3dTaGlwTWlzcyxcbiAgICBnZXREYXRhLFxuICAgIHNob3dTaGlwLFxuICB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBnYW1lTG9vcDtcbiIsImNvbnN0IG1ha2VHcmlkID0gKCgpID0+IHtcbiAgZnVuY3Rpb24gY3JlYXRlQm9hcmQobmFtZSwgc3ViKSB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2JvYXJkJyk7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQobmFtZSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDA7IGkgKz0gMSkge1xuICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCBpKTtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbCcpO1xuICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKHN1Yik7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoY2VsbCk7XG4gICAgfVxuICAgIHJldHVybiBkaXY7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBjcmVhdGVCb2FyZCxcbiAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbWFrZUdyaWQ7XG4iLCIvLyBjb25zdCBnYW1lQm9hcmQgPSByZXF1aXJlKCcuL2dhbWVCb2FyZCcpO1xuXG5jb25zdCBwbGF5ZXIgPSAoKCkgPT4ge1xuICBmdW5jdGlvbiBhaSgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogOTkpO1xuICB9XG4gIGZ1bmN0aW9uIHBsYXllclR1cm4ob2JqLCBwb3MpIHtcbiAgICBpZiAob2JqLnJlY2VpdmVBdHRhY2socG9zKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmdW5jdGlvbiBhaVR1cm4ob2JqKSB7XG4gICAgY29uc3QgcG9zID0gYWkoKTtcbiAgICBpZiAob2JqLnJlY2VpdmVBdHRhY2socG9zKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcGxheWVyVHVybixcbiAgICBhaVR1cm4sXG4gIH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBsYXllcjtcbiIsImZ1bmN0aW9uIHNoaXAobmFtZSwgbGVuZ3RoKSB7XG4gIGZ1bmN0aW9uIGhpdChjdXJyZW50UG9zKSB7XG4gICAgaWYgKFxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG9wZXJhdG9yLWxpbmVicmVha1xuICAgICAgdGhpcy5wb3NpdGlvbi5pbmNsdWRlcyhjdXJyZW50UG9zKSAmJlxuICAgICAgIXRoaXMucmVzdWx0LmluY2x1ZGVzKGN1cnJlbnRQb3MpXG4gICAgKSB7XG4gICAgICB0aGlzLnJlc3VsdC5wdXNoKGN1cnJlbnRQb3MpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBpc1N1bmsoKSB7XG4gICAgY29uc3QgdGVtcCA9IHRoaXMucmVzdWx0LmV2ZXJ5KChhKSA9PiB0aGlzLnBvc2l0aW9uLmluY2x1ZGVzKGEpKTtcbiAgICBpZiAodGhpcy5wb3NpdGlvbi5sZW5ndGggPT09IHRoaXMucmVzdWx0Lmxlbmd0aCAmJiB0ZW1wKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB7XG4gICAgbmFtZSxcbiAgICBsZW5ndGgsXG4gICAgcG9zaXRpb246IFtdLFxuICAgIHN1bms6IGZhbHNlLFxuICAgIHJlc3VsdDogW10sXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaGlwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImNvbnN0IGdhbWVMb29wID0gcmVxdWlyZSgnLi9nYW1lTG9vcCcpO1xuY29uc3QgbWFrZUdyaWQgPSByZXF1aXJlKCcuL21ha2VHcmlkJyk7XG5cbigoKSA9PiB7XG4gIGNvbnN0IGdhbWVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZUNvbnRhaW5lcicpO1xuICBnYW1lQ29udGFpbmVyLmFwcGVuZChtYWtlR3JpZC5jcmVhdGVCb2FyZCgncGxheWVyJywgJ3BsYXllckNlbGwnKSk7XG4gIGdhbWVDb250YWluZXIuYXBwZW5kKG1ha2VHcmlkLmNyZWF0ZUJvYXJkKCdjb21wdXRlcicsICdjb21wdXRlckNlbGwnKSk7XG4gIGdhbWVMb29wLnNob3dTaGlwKCk7XG4gIGdhbWVMb29wLmdldERhdGEoKTtcbn0pKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=