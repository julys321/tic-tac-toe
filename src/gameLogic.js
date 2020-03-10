import { $, constructNode, sleep, getRandomInt } from "./helpers.js";

function getPossibleMoves(board) {
  return [...Array(9).keys()].filter((e, i) => !board[i]);
}

export { getPossibleMoves };
