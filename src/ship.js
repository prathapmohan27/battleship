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
