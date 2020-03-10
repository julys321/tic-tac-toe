import { getPossibleMoves } from "./gameLogic.js";
import { transposeMatrix } from "./helpers.js";
const { min, max } = Math;

const getBestMove = state => {
  const movesGraph = minimax(state, true);
  console.log(movesGraph);
  return movesGraph.sort((a, b) => a.value - b.value)[movesGraph.length - 1]
    .move;
};

const nextTurnPlayerSymbol = {
  x: "o",
  o: "x"
};

const minimax = (state, isMaximizing) => {
  const possibleMoves = getPossibleMoves(state.board);
  const nextPlayersTurn = nextTurnPlayerSymbol[state.playersTurn];

  const moves = possibleMoves.map(move => {
    let newBoard = [...state.board];
    newBoard[move] = state.playersTurn;

    const isWinningMove = isWinning(newBoard, state.playersTurn);

    const nextMoves = isWinningMove
      ? []
      : minimax(
          { playersTurn: nextPlayersTurn, board: newBoard },
          !isMaximizing
        );

    return {
      value: evaluateMove(nextMoves, isMaximizing, isWinningMove),
      move,
      nextMoves
    };
  });
  return moves;
};

const evaluateMove = (nextMoves, isMaximizing, isWinningMove) => {
  if (!nextMoves.length) {
    if (isWinningMove) {
      return isMaximizing ? 1 : -1;
    }
    return 0;
  } else if (isMaximizing) {
    return min(...nextMoves.map(e => e.value));
  } else {
    return max(...nextMoves.map(e => e.value));
  }
};

const isWinning = (board, playersTurn) => {
  const stringifiedBoard = stringifyBoard(board);
  const winningPattern = playersTurn.repeat(3);
  const hasWonByRow = stringifiedBoard.includes(winningPattern);
  const boardMatrix = stringifiedBoard
    .split("\n")
    .filter(e => e.length > 1)
    .map(e => e.split(""));
  const hasWonByColumn = stringifyBoard(
    transposeMatrix(boardMatrix).flat()
  ).includes(winningPattern);
  const hasWonByFwdDiag =
    boardMatrix[0][0] + boardMatrix[1][1] + boardMatrix[2][2] ===
    winningPattern;
  const hasWonByBwdDiag =
    boardMatrix[0][2] + boardMatrix[1][1] + boardMatrix[2][0] ===
    winningPattern;
  return hasWonByRow || hasWonByColumn || hasWonByFwdDiag || hasWonByBwdDiag;
};

const stringifyBoard = board => {
  return board
    .map(e => (e ? e : "-"))
    .map((e, i) => ((1 + i) % 3 === 0 ? e + "\n" : e))
    .join("");
};

export { getBestMove };
