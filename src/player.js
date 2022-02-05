// const gameBoard = require('./gameBoard');

const player = (() => {
  let turn = true;
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
    // eslint-disable-next-line no-console
    console.log('ai=>', pos);
    if (obj.receiveAttack(pos)) {
      return true;
    }
    return false;
  }

  function startAttack(obj, pos) {
    if (!obj.allShipSunk()) {
      if (turn) {
        turn = playerTurn(obj, pos);
        return turn;
      }
      turn = aiTurn(obj);
      return turn;
    }
    return false;
  }

  return {
    startAttack,
  };
})();

module.exports = player;
