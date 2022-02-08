/* eslint-disable no-use-before-define */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
const gameBoard = require('./gameBoard');
const player = require('./player');

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
