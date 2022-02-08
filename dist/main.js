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
  const submarine = ship('submarine', 2);
  const destroyer = ship('destroyer', 1);
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

/* eslint-disable no-use-before-define */
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
  const random = document.querySelector('.random');
  const start = document.querySelector('.start');
  const restart = document.querySelector('.restart');
  // const personSunk = [];
  // const computerSunk = [];

  let computerCell;
  let personCell;

  // show hit pos
  function showShipHit(obj, list) {
    obj.shipAttackArray.forEach((v) => list[v].classList.add('hit'));
  }
  // show missed pos
  function showShipMiss(obj, list) {
    obj.missedArray.forEach((v) => list[v].classList.add('miss'));
  }

  // display the status
  function display(sen) {
    result.textContent = sen;
  }

  function restartGame() {
    restart.classList.remove('invisible');
    empty(person);
    empty(computer);
  }

  // check final result and display
  function finalResult() {
    if (computer.allShipSunk()) {
      display(`${person.name} Won!`);
      restartGame();
    }
    if (person.allShipSunk()) {
      display(`${computer.name} Won!`);
      restartGame();
    }
  }

  // function sunCount() {

  // }

  // get name of the sunk  ship
  // function getShip(obj) {
  //   obj.ships.forEach((sub) => {
  //     if (obj.name === 'Computer') {
  //       if (sub.sunk) {
  //         if (!computerSunk.includes(sub.name)) {
  //           computerSunk.push(sub.name);
  //         }
  //       }
  //     }
  //     if (obj.name === 'Player') {
  //       if (sub.sunk) {
  //         if (!personSunk.includes(sub.name)) {
  //           personSunk.push(sub.name);
  //         }
  //       }
  //     }
  //   });
  // }

  // start attack each other
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
      }
      finalResult();
      setTimeout(() => {
        if (!turn) {
          turn = player.aiTurn(person);
          while (!turn) {
            turn = player.aiTurn(person);
          }
          display(`${person.name} Turn!`);
          showShipHit(person, personCell);
          showShipMiss(person, personCell);
        }
      }, 1500);
    }
    finalResult();
  }

  // get pos of the  ai board
  function getData() {
    computerCell.forEach((cell) => {
      cell.onclick = (e) => {
        e.preventDefault();
        startAttack(Number(cell.dataset.index));
      };
    });
  }

  function showShip() {
    person.filledPosition.forEach((v) => personCell[v].classList.add('active'));
    computer.filledPosition.forEach((v) =>
      computerCell[v].classList.add('active')
    );
  }

  function removeClass(cell) {
    cell.forEach((v) => v.classList.remove('active'));
    cell.forEach((v) => v.classList.remove('hit'));
    cell.forEach((v) => v.classList.remove('miss'));
  }

  function empty(obj) {
    obj.filledPosition = [];
    obj.missedArray = [];
    obj.shipAttackArray = [];
    obj.ships.forEach((sub) => {
      sub.position = [];
      sub.result = [];
    });
  }

  function main() {
    computerCell = document.querySelectorAll('.computerCell');
    personCell = document.querySelectorAll('.playerCell');
    showShip();
  }
  random.addEventListener('click', () => {
    empty(person);
    person.placeShip();
    removeClass(personCell);
    showShip();
  });

  start.addEventListener('click', () => {
    getData();
    random.classList.add('invisible');
    start.classList.add('invisible');
  });

  restart.addEventListener('click', () => {
    random.classList.remove('invisible');
    start.classList.remove('invisible');
    restart.classList.add('invisible');
    person.placeShip();
    computer.placeShip();
    removeClass(personCell);
    removeClass(computerCell);
    showShip();
  });

  return {
    showShipHit,
    showShipMiss,
    main,
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
  gameLoop.main();
})();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsbUJBQU8sQ0FBQyw2QkFBUTs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFFBQVE7QUFDNUI7QUFDQSxzQkFBc0IsUUFBUTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLFFBQVE7QUFDNUI7QUFDQTtBQUNBLHNCQUFzQixRQUFRO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLE9BQU87QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsbUJBQU8sQ0FBQyx1Q0FBYTtBQUN2QyxlQUFlLG1CQUFPLENBQUMsaUNBQVU7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsYUFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsZUFBZTtBQUNoQztBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsYUFBYTtBQUNsQztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOzs7Ozs7Ozs7OztBQ25CQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7Ozs7Ozs7Ozs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztVQzlCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7QUN0QkEsaUJBQWlCLG1CQUFPLENBQUMscUNBQVk7QUFDckMsaUJBQWlCLG1CQUFPLENBQUMscUNBQVk7O0FBRXJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lTG9vcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21ha2VHcmlkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgb3BlcmF0b3ItbGluZWJyZWFrICovXG4vKiBlc2xpbnQtZGlzYWJsZSBmdW5jdGlvbi1wYXJlbi1uZXdsaW5lICovXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBsaWNpdC1hcnJvdy1saW5lYnJlYWsgKi9cbi8qIGVzbGludC1kaXNhYmxlIGNvbW1hLWRhbmdsZSAqL1xuY29uc3Qgc2hpcCA9IHJlcXVpcmUoJy4vc2hpcCcpO1xuXG5mdW5jdGlvbiBnYW1lQm9hcmQobmFtZSkge1xuICBjb25zdCBjYXJyaWVyID0gc2hpcCgnY2FycmllcicsIDUpO1xuICBjb25zdCBiYXR0bGVzaGlwID0gc2hpcCgnYmF0dGxlc2hpcCAnLCA0KTtcbiAgY29uc3QgY3J1aXNlciA9IHNoaXAoJ2NydWlzZXInLCAzKTtcbiAgY29uc3Qgc3VibWFyaW5lID0gc2hpcCgnc3VibWFyaW5lJywgMik7XG4gIGNvbnN0IGRlc3Ryb3llciA9IHNoaXAoJ2Rlc3Ryb3llcicsIDEpO1xuICBjb25zdCBzaGlwcyA9IFtjYXJyaWVyLCBiYXR0bGVzaGlwLCBjcnVpc2VyLCBzdWJtYXJpbmUsIGRlc3Ryb3llcl07XG4gIGxldCBob3Jpem9udGFsQXJyYXkgPSBbXTtcbiAgbGV0IHZlcnRpY2FsQXJyYXkgPSBbXTtcblxuICAvLyBpdCdzIGNyZWF0ZSBob3Jpem9udGFsIDJ4MiBtYXRyaXhcbiAgZnVuY3Rpb24gaG9yaXpvbnRhbFZhbHVlKCkge1xuICAgIGNvbnN0IGFyciA9IFtdO1xuICAgIGxldCBzdGFydCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSArPSAxKSB7XG4gICAgICBhcnJbaV0gPSBbXTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGogKz0gMSkge1xuICAgICAgICBhcnJbaV1bal0gPSBzdGFydDtcbiAgICAgICAgc3RhcnQgKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICAvLyBpdCdzIGNyZWF0ZSB2ZXJ0aWNhbCAyeDIgbWF0cml4XG4gIGZ1bmN0aW9uIHZlcnRpY2FsVmFsdWUoKSB7XG4gICAgY29uc3QgYXJyID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpICs9IDEpIHtcbiAgICAgIGFycltpXSA9IFtdO1xuICAgICAgbGV0IHN0YXJ0ID0gaTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGogKz0gMSkge1xuICAgICAgICBhcnJbaV1bal0gPSBzdGFydDtcbiAgICAgICAgc3RhcnQgKz0gMTA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgaG9yaXpvbnRhbEFycmF5ID0gaG9yaXpvbnRhbFZhbHVlKCk7XG4gIHZlcnRpY2FsQXJyYXkgPSB2ZXJ0aWNhbFZhbHVlKCk7XG5cbiAgLy8gaXQncyBnZW5lcmF0ZSBwb3NpdGlvblxuICBmdW5jdGlvbiBnZW5lcmF0ZUhvcml6b250YWxQb3NpdGlvbihuLCBpbmRleCkge1xuICAgIGNvbnN0IHRlbXAgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkgKz0gMSkge1xuICAgICAgdGVtcC5wdXNoKGluZGV4ICsgaSk7XG4gICAgfVxuICAgIHJldHVybiB0ZW1wO1xuICB9XG4gIGZ1bmN0aW9uIGdlbmVyYXRlVmVydGljYWxQb3NpdGlvbihuLCBpbmRleCkge1xuICAgIGNvbnN0IHRlbXAgPSBbXTtcbiAgICBsZXQgcG9zID0gaW5kZXg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpICs9IDEpIHtcbiAgICAgIHRlbXAucHVzaChwb3MpO1xuICAgICAgcG9zICs9IDEwO1xuICAgIH1cbiAgICByZXR1cm4gdGVtcDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFN0YXJ0KCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA5OSk7XG4gIH1cbiAgLy8gaXQncyBwbGFjZSBzaGlwIHZlcnRpY2FsXG4gIGZ1bmN0aW9uIHBsYWNlVmVydGljYWwob2JqLCBpbmRleCkge1xuICAgIGNvbnN0IHRlbXAgPSBbXTtcbiAgICBpZiAoIXRoaXMuZmlsbGVkUG9zaXRpb24uaW5jbHVkZXMoaW5kZXgpKSB7XG4gICAgICB0ZW1wLnB1c2goLi4uZ2VuZXJhdGVWZXJ0aWNhbFBvc2l0aW9uKG9iai5sZW5ndGgsIGluZGV4KSk7XG4gICAgICBjb25zdCBpc1Rha2UgPSB0aGlzLmZpbGxlZFBvc2l0aW9uLnNvbWUoKHgpID0+IHRlbXAuaW5jbHVkZXMoeCkpO1xuICAgICAgY29uc3QgaXNPdXQgPSB2ZXJ0aWNhbEFycmF5LnNvbWUoKGFycikgPT5cbiAgICAgICAgdGVtcC5ldmVyeSgodikgPT4gYXJyLmluY2x1ZGVzKHYpKVxuICAgICAgKTtcbiAgICAgIGlmICghaXNPdXQpIHtcbiAgICAgICAgdGhpcy5wbGFjZVNoaXAoKTtcbiAgICAgIH1cbiAgICAgIGlmICghaXNUYWtlICYmIGlzT3V0KSB7XG4gICAgICAgIHRoaXMuZmlsbGVkUG9zaXRpb24ucHVzaCguLi50ZW1wKTtcbiAgICAgICAgb2JqLnBvc2l0aW9uLnB1c2goLi4udGVtcCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucGxhY2VTaGlwKCk7XG4gIH1cbiAgZnVuY3Rpb24gcGxhY2VIb3Jpem9udGFsKG9iaiwgaW5kZXgpIHtcbiAgICBjb25zdCB0ZW1wID0gW107XG4gICAgaWYgKCF0aGlzLmZpbGxlZFBvc2l0aW9uLmluY2x1ZGVzKGluZGV4KSkge1xuICAgICAgdGVtcC5wdXNoKC4uLmdlbmVyYXRlSG9yaXpvbnRhbFBvc2l0aW9uKG9iai5sZW5ndGgsIGluZGV4KSk7XG4gICAgICBjb25zdCBpc1Rha2UgPSB0aGlzLmZpbGxlZFBvc2l0aW9uLnNvbWUoKHgpID0+IHRlbXAuaW5jbHVkZXMoeCkpO1xuICAgICAgY29uc3QgaXNPdXQgPSBob3Jpem9udGFsQXJyYXkuc29tZSgoYXJyKSA9PlxuICAgICAgICB0ZW1wLmV2ZXJ5KCh2KSA9PiBhcnIuaW5jbHVkZXModikpXG4gICAgICApO1xuICAgICAgaWYgKCFpc091dCkge1xuICAgICAgICB0aGlzLnBsYWNlU2hpcCgpO1xuICAgICAgfVxuICAgICAgaWYgKCFpc1Rha2UgJiYgaXNPdXQpIHtcbiAgICAgICAgdGhpcy5maWxsZWRQb3NpdGlvbi5wdXNoKC4uLnRlbXApO1xuICAgICAgICBvYmoucG9zaXRpb24ucHVzaCguLi50ZW1wKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wbGFjZVNoaXAoKTtcbiAgfVxuXG4gIC8vIHBsYWNlIHRoZSBzaGlwIHJhbmRvbWx5XG4gIGZ1bmN0aW9uIHBsYWNlU2hpcCgpIHtcbiAgICB0aGlzLnNoaXBzLmZvckVhY2goKG9iaikgPT4ge1xuICAgICAgaWYgKG9iai5wb3NpdGlvbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBnZXRTdGFydCgpO1xuICAgICAgICBjb25zdCBkID0gdGhpcy5kaXJlY3Rpb25bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMildO1xuICAgICAgICBpZiAoZCA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHBsYWNlVmVydGljYWwuYmluZCh0aGlzKTtcbiAgICAgICAgICByZXN1bHQob2JqLCBpbmRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gcGxhY2VIb3Jpem9udGFsLmJpbmQodGhpcyk7XG4gICAgICAgICAgcmVzdWx0KG9iaiwgaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgY2hlY2sgPSB0aGlzLnNoaXBzLmV2ZXJ5KChvYmopID0+IG9iai5wb3NpdGlvbi5sZW5ndGggIT09IDApO1xuICAgIGlmIChjaGVjaykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBjaGVjayBhbGwgc2hpcCBpcyBzdW5rXG4gIGZ1bmN0aW9uIGFsbFNoaXBTdW5rKCkge1xuICAgIGNvbnN0IHRlbXAgPSB0aGlzLmZpbGxlZFBvc2l0aW9uLmV2ZXJ5KChlbGUpID0+XG4gICAgICB0aGlzLnNoaXBBdHRhY2tBcnJheS5pbmNsdWRlcyhlbGUpXG4gICAgKTtcbiAgICByZXR1cm4gdGVtcDtcbiAgfVxuXG4gIC8vIGNoZWNrIHdoaWNoIHNoaXAgaGl0XG4gIGZ1bmN0aW9uIHdoaWNoU2hpcChwb3MpIHtcbiAgICB0aGlzLnNoaXBzLmZvckVhY2goKG9iaikgPT4ge1xuICAgICAgaWYgKG9iai5oaXQocG9zKSkge1xuICAgICAgICBpZiAob2JqLmlzU3VuaygpKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgICAgb2JqLnN1bmsgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWNlaXZlQXR0YWNrKGN1cnJlbnRQb3NpdGlvbikge1xuICAgIGlmIChcbiAgICAgICF0aGlzLnNoaXBBdHRhY2tBcnJheS5pbmNsdWRlcyhjdXJyZW50UG9zaXRpb24pICYmXG4gICAgICAhdGhpcy5taXNzZWRBcnJheS5pbmNsdWRlcyhjdXJyZW50UG9zaXRpb24pXG4gICAgKSB7XG4gICAgICBpZiAodGhpcy5maWxsZWRQb3NpdGlvbi5pbmNsdWRlcyhjdXJyZW50UG9zaXRpb24pKSB7XG4gICAgICAgIHRoaXMuc2hpcEF0dGFja0FycmF5LnB1c2goY3VycmVudFBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy53aGljaFNoaXAoY3VycmVudFBvc2l0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICB0aGlzLm1pc3NlZEFycmF5LnB1c2goY3VycmVudFBvc2l0aW9uKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5hbWUsXG4gICAgc2hpcHMsXG4gICAgZmlsbGVkUG9zaXRpb246IFtdLFxuICAgIHNoaXBBdHRhY2tBcnJheTogW10sXG4gICAgbWlzc2VkQXJyYXk6IFtdLFxuICAgIGRpcmVjdGlvbjogWydob3Jpem9udGFsJywgJ3ZlcnRpY2FsJ10sXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBwbGFjZVNoaXAsXG4gICAgd2hpY2hTaGlwLFxuICAgIGFsbFNoaXBTdW5rLFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdhbWVCb2FyZDtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVzZS1iZWZvcmUtZGVmaW5lICovXG4vKiBlc2xpbnQtZGlzYWJsZSBmdW5jdGlvbi1wYXJlbi1uZXdsaW5lICovXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBsaWNpdC1hcnJvdy1saW5lYnJlYWsgKi9cbi8qIGVzbGludC1kaXNhYmxlIGNvbW1hLWRhbmdsZSAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tYWxlcnQgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5jb25zdCBnYW1lQm9hcmQgPSByZXF1aXJlKCcuL2dhbWVCb2FyZCcpO1xuY29uc3QgcGxheWVyID0gcmVxdWlyZSgnLi9wbGF5ZXInKTtcblxuY29uc3QgZ2FtZUxvb3AgPSAoKCkgPT4ge1xuICBsZXQgdHVybiA9IHRydWU7XG4gIGNvbnN0IHBlcnNvbiA9IGdhbWVCb2FyZCgnUGxheWVyJyk7XG4gIGNvbnN0IGNvbXB1dGVyID0gZ2FtZUJvYXJkKCdDb21wdXRlcicpO1xuICBwZXJzb24ucGxhY2VTaGlwKCk7XG4gIGNvbXB1dGVyLnBsYWNlU2hpcCgpO1xuICBjb25zdCByZXN1bHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVzdWx0Jyk7XG4gIGNvbnN0IHJhbmRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yYW5kb20nKTtcbiAgY29uc3Qgc3RhcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhcnQnKTtcbiAgY29uc3QgcmVzdGFydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXN0YXJ0Jyk7XG4gIC8vIGNvbnN0IHBlcnNvblN1bmsgPSBbXTtcbiAgLy8gY29uc3QgY29tcHV0ZXJTdW5rID0gW107XG5cbiAgbGV0IGNvbXB1dGVyQ2VsbDtcbiAgbGV0IHBlcnNvbkNlbGw7XG5cbiAgLy8gc2hvdyBoaXQgcG9zXG4gIGZ1bmN0aW9uIHNob3dTaGlwSGl0KG9iaiwgbGlzdCkge1xuICAgIG9iai5zaGlwQXR0YWNrQXJyYXkuZm9yRWFjaCgodikgPT4gbGlzdFt2XS5jbGFzc0xpc3QuYWRkKCdoaXQnKSk7XG4gIH1cbiAgLy8gc2hvdyBtaXNzZWQgcG9zXG4gIGZ1bmN0aW9uIHNob3dTaGlwTWlzcyhvYmosIGxpc3QpIHtcbiAgICBvYmoubWlzc2VkQXJyYXkuZm9yRWFjaCgodikgPT4gbGlzdFt2XS5jbGFzc0xpc3QuYWRkKCdtaXNzJykpO1xuICB9XG5cbiAgLy8gZGlzcGxheSB0aGUgc3RhdHVzXG4gIGZ1bmN0aW9uIGRpc3BsYXkoc2VuKSB7XG4gICAgcmVzdWx0LnRleHRDb250ZW50ID0gc2VuO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzdGFydEdhbWUoKSB7XG4gICAgcmVzdGFydC5jbGFzc0xpc3QucmVtb3ZlKCdpbnZpc2libGUnKTtcbiAgICBlbXB0eShwZXJzb24pO1xuICAgIGVtcHR5KGNvbXB1dGVyKTtcbiAgfVxuXG4gIC8vIGNoZWNrIGZpbmFsIHJlc3VsdCBhbmQgZGlzcGxheVxuICBmdW5jdGlvbiBmaW5hbFJlc3VsdCgpIHtcbiAgICBpZiAoY29tcHV0ZXIuYWxsU2hpcFN1bmsoKSkge1xuICAgICAgZGlzcGxheShgJHtwZXJzb24ubmFtZX0gV29uIWApO1xuICAgICAgcmVzdGFydEdhbWUoKTtcbiAgICB9XG4gICAgaWYgKHBlcnNvbi5hbGxTaGlwU3VuaygpKSB7XG4gICAgICBkaXNwbGF5KGAke2NvbXB1dGVyLm5hbWV9IFdvbiFgKTtcbiAgICAgIHJlc3RhcnRHYW1lKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gZnVuY3Rpb24gc3VuQ291bnQoKSB7XG5cbiAgLy8gfVxuXG4gIC8vIGdldCBuYW1lIG9mIHRoZSBzdW5rICBzaGlwXG4gIC8vIGZ1bmN0aW9uIGdldFNoaXAob2JqKSB7XG4gIC8vICAgb2JqLnNoaXBzLmZvckVhY2goKHN1YikgPT4ge1xuICAvLyAgICAgaWYgKG9iai5uYW1lID09PSAnQ29tcHV0ZXInKSB7XG4gIC8vICAgICAgIGlmIChzdWIuc3Vuaykge1xuICAvLyAgICAgICAgIGlmICghY29tcHV0ZXJTdW5rLmluY2x1ZGVzKHN1Yi5uYW1lKSkge1xuICAvLyAgICAgICAgICAgY29tcHV0ZXJTdW5rLnB1c2goc3ViLm5hbWUpO1xuICAvLyAgICAgICAgIH1cbiAgLy8gICAgICAgfVxuICAvLyAgICAgfVxuICAvLyAgICAgaWYgKG9iai5uYW1lID09PSAnUGxheWVyJykge1xuICAvLyAgICAgICBpZiAoc3ViLnN1bmspIHtcbiAgLy8gICAgICAgICBpZiAoIXBlcnNvblN1bmsuaW5jbHVkZXMoc3ViLm5hbWUpKSB7XG4gIC8vICAgICAgICAgICBwZXJzb25TdW5rLnB1c2goc3ViLm5hbWUpO1xuICAvLyAgICAgICAgIH1cbiAgLy8gICAgICAgfVxuICAvLyAgICAgfVxuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgLy8gc3RhcnQgYXR0YWNrIGVhY2ggb3RoZXJcbiAgZnVuY3Rpb24gc3RhcnRBdHRhY2socG9zKSB7XG4gICAgaWYgKCFjb21wdXRlci5hbGxTaGlwU3VuaygpICYmICFwZXJzb24uYWxsU2hpcFN1bmsoKSkge1xuICAgICAgaWYgKHR1cm4pIHtcbiAgICAgICAgdHVybiA9IHBsYXllci5wbGF5ZXJUdXJuKGNvbXB1dGVyLCBwb3MpO1xuICAgICAgICBpZiAodHVybikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5KGAke2NvbXB1dGVyLm5hbWV9IFR1cm4hYCk7XG4gICAgICAgIHNob3dTaGlwSGl0KGNvbXB1dGVyLCBjb21wdXRlckNlbGwpO1xuICAgICAgICBzaG93U2hpcE1pc3MoY29tcHV0ZXIsIGNvbXB1dGVyQ2VsbCk7XG4gICAgICB9XG4gICAgICBmaW5hbFJlc3VsdCgpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICghdHVybikge1xuICAgICAgICAgIHR1cm4gPSBwbGF5ZXIuYWlUdXJuKHBlcnNvbik7XG4gICAgICAgICAgd2hpbGUgKCF0dXJuKSB7XG4gICAgICAgICAgICB0dXJuID0gcGxheWVyLmFpVHVybihwZXJzb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkaXNwbGF5KGAke3BlcnNvbi5uYW1lfSBUdXJuIWApO1xuICAgICAgICAgIHNob3dTaGlwSGl0KHBlcnNvbiwgcGVyc29uQ2VsbCk7XG4gICAgICAgICAgc2hvd1NoaXBNaXNzKHBlcnNvbiwgcGVyc29uQ2VsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDE1MDApO1xuICAgIH1cbiAgICBmaW5hbFJlc3VsdCgpO1xuICB9XG5cbiAgLy8gZ2V0IHBvcyBvZiB0aGUgIGFpIGJvYXJkXG4gIGZ1bmN0aW9uIGdldERhdGEoKSB7XG4gICAgY29tcHV0ZXJDZWxsLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgc3RhcnRBdHRhY2soTnVtYmVyKGNlbGwuZGF0YXNldC5pbmRleCkpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dTaGlwKCkge1xuICAgIHBlcnNvbi5maWxsZWRQb3NpdGlvbi5mb3JFYWNoKCh2KSA9PiBwZXJzb25DZWxsW3ZdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpKTtcbiAgICBjb21wdXRlci5maWxsZWRQb3NpdGlvbi5mb3JFYWNoKCh2KSA9PlxuICAgICAgY29tcHV0ZXJDZWxsW3ZdLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZUNsYXNzKGNlbGwpIHtcbiAgICBjZWxsLmZvckVhY2goKHYpID0+IHYuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJykpO1xuICAgIGNlbGwuZm9yRWFjaCgodikgPT4gdi5jbGFzc0xpc3QucmVtb3ZlKCdoaXQnKSk7XG4gICAgY2VsbC5mb3JFYWNoKCh2KSA9PiB2LmNsYXNzTGlzdC5yZW1vdmUoJ21pc3MnKSk7XG4gIH1cblxuICBmdW5jdGlvbiBlbXB0eShvYmopIHtcbiAgICBvYmouZmlsbGVkUG9zaXRpb24gPSBbXTtcbiAgICBvYmoubWlzc2VkQXJyYXkgPSBbXTtcbiAgICBvYmouc2hpcEF0dGFja0FycmF5ID0gW107XG4gICAgb2JqLnNoaXBzLmZvckVhY2goKHN1YikgPT4ge1xuICAgICAgc3ViLnBvc2l0aW9uID0gW107XG4gICAgICBzdWIucmVzdWx0ID0gW107XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBtYWluKCkge1xuICAgIGNvbXB1dGVyQ2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb21wdXRlckNlbGwnKTtcbiAgICBwZXJzb25DZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBsYXllckNlbGwnKTtcbiAgICBzaG93U2hpcCgpO1xuICB9XG4gIHJhbmRvbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBlbXB0eShwZXJzb24pO1xuICAgIHBlcnNvbi5wbGFjZVNoaXAoKTtcbiAgICByZW1vdmVDbGFzcyhwZXJzb25DZWxsKTtcbiAgICBzaG93U2hpcCgpO1xuICB9KTtcblxuICBzdGFydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBnZXREYXRhKCk7XG4gICAgcmFuZG9tLmNsYXNzTGlzdC5hZGQoJ2ludmlzaWJsZScpO1xuICAgIHN0YXJ0LmNsYXNzTGlzdC5hZGQoJ2ludmlzaWJsZScpO1xuICB9KTtcblxuICByZXN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIHJhbmRvbS5jbGFzc0xpc3QucmVtb3ZlKCdpbnZpc2libGUnKTtcbiAgICBzdGFydC5jbGFzc0xpc3QucmVtb3ZlKCdpbnZpc2libGUnKTtcbiAgICByZXN0YXJ0LmNsYXNzTGlzdC5hZGQoJ2ludmlzaWJsZScpO1xuICAgIHBlcnNvbi5wbGFjZVNoaXAoKTtcbiAgICBjb21wdXRlci5wbGFjZVNoaXAoKTtcbiAgICByZW1vdmVDbGFzcyhwZXJzb25DZWxsKTtcbiAgICByZW1vdmVDbGFzcyhjb21wdXRlckNlbGwpO1xuICAgIHNob3dTaGlwKCk7XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgc2hvd1NoaXBIaXQsXG4gICAgc2hvd1NoaXBNaXNzLFxuICAgIG1haW4sXG4gIH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdhbWVMb29wO1xuIiwiY29uc3QgbWFrZUdyaWQgPSAoKCkgPT4ge1xuICBmdW5jdGlvbiBjcmVhdGVCb2FyZChuYW1lLCBzdWIpIHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgnYm9hcmQnKTtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjZWxsLnNldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcsIGkpO1xuICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdjZWxsJyk7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoc3ViKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChjZWxsKTtcbiAgICB9XG4gICAgcmV0dXJuIGRpdjtcbiAgfVxuICByZXR1cm4ge1xuICAgIGNyZWF0ZUJvYXJkLFxuICB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBtYWtlR3JpZDtcbiIsIi8vIGNvbnN0IGdhbWVCb2FyZCA9IHJlcXVpcmUoJy4vZ2FtZUJvYXJkJyk7XG5cbmNvbnN0IHBsYXllciA9ICgoKSA9PiB7XG4gIGZ1bmN0aW9uIGFpKCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA5OSk7XG4gIH1cbiAgZnVuY3Rpb24gcGxheWVyVHVybihvYmosIHBvcykge1xuICAgIGlmIChvYmoucmVjZWl2ZUF0dGFjayhwb3MpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZ1bmN0aW9uIGFpVHVybihvYmopIHtcbiAgICBjb25zdCBwb3MgPSBhaSgpO1xuICAgIGlmIChvYmoucmVjZWl2ZUF0dGFjayhwb3MpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwbGF5ZXJUdXJuLFxuICAgIGFpVHVybixcbiAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcGxheWVyO1xuIiwiZnVuY3Rpb24gc2hpcChuYW1lLCBsZW5ndGgpIHtcbiAgZnVuY3Rpb24gaGl0KGN1cnJlbnRQb3MpIHtcbiAgICBpZiAoXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgb3BlcmF0b3ItbGluZWJyZWFrXG4gICAgICB0aGlzLnBvc2l0aW9uLmluY2x1ZGVzKGN1cnJlbnRQb3MpICYmXG4gICAgICAhdGhpcy5yZXN1bHQuaW5jbHVkZXMoY3VycmVudFBvcylcbiAgICApIHtcbiAgICAgIHRoaXMucmVzdWx0LnB1c2goY3VycmVudFBvcyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZ1bmN0aW9uIGlzU3VuaygpIHtcbiAgICBjb25zdCB0ZW1wID0gdGhpcy5yZXN1bHQuZXZlcnkoKGEpID0+IHRoaXMucG9zaXRpb24uaW5jbHVkZXMoYSkpO1xuICAgIGlmICh0aGlzLnBvc2l0aW9uLmxlbmd0aCA9PT0gdGhpcy5yZXN1bHQubGVuZ3RoICYmIHRlbXApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBuYW1lLFxuICAgIGxlbmd0aCxcbiAgICBwb3NpdGlvbjogW10sXG4gICAgc3VuazogZmFsc2UsXG4gICAgcmVzdWx0OiBbXSxcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNoaXA7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiY29uc3QgZ2FtZUxvb3AgPSByZXF1aXJlKCcuL2dhbWVMb29wJyk7XG5jb25zdCBtYWtlR3JpZCA9IHJlcXVpcmUoJy4vbWFrZUdyaWQnKTtcblxuKCgpID0+IHtcbiAgY29uc3QgZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nYW1lQ29udGFpbmVyJyk7XG4gIGdhbWVDb250YWluZXIuYXBwZW5kKG1ha2VHcmlkLmNyZWF0ZUJvYXJkKCdwbGF5ZXInLCAncGxheWVyQ2VsbCcpKTtcbiAgZ2FtZUNvbnRhaW5lci5hcHBlbmQobWFrZUdyaWQuY3JlYXRlQm9hcmQoJ2NvbXB1dGVyJywgJ2NvbXB1dGVyQ2VsbCcpKTtcbiAgZ2FtZUxvb3AubWFpbigpO1xufSkoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==