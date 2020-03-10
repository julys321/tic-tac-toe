function $(selector) {
  let elements = document.querySelectorAll(selector);
  return elements.length == 1 ? elements[0] : elements;
}

function constructNode(tag, className, id = tag) {
  let ticTacToeElement = document.createElement(tag);
  ticTacToeElement.id = id;
  if (className) {
    ticTacToeElement.className += className;
  }
  return ticTacToeElement;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function transposeMatrix(matrix) {
  return matrix.map((e, i) => matrix.map(row => row[i]));
}
export { $, constructNode, sleep, getRandomInt, transposeMatrix };
