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
