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
