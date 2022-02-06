/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
const gameBoard = require('./gameBoard');
const player = require('./player');

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
