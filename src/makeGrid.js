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
