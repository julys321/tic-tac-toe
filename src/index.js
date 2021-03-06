import { $, constructNode, sleep, getRandomInt } from "./helpers.js";
import { getBestMove as getMiniMaxMove } from "./minimax.js";
import { getPossibleMoves } from "./gameLogic.js";
let ticTacToeStore = {
  cells: [],
  isXTurn: true,
  turnCount: 0,
  matchCount: 0,
  xVictoryCount: 0,
  oVictoryCount: 0,
  isGameRunning: true,
  victory: undefined,
  gameMode: $("#select-difficulty").value,
  lastMoveIndex: undefined
};

(function onInit() {
  $("#select-difficulty").addEventListener("change", function() {
    ticTacToeStore.gameMode = this.value;
    startNewMatch();
  });
  addGameResetButtonEvent();
  startNewMatch();
})();

function startNewMatch() {
  if (!ticTacToeStore.victory && ticTacToeStore.turnCount == 9) {
    removeTieContainer();
  } else if (!ticTacToeStore.isGameRunning) {
    removeVictoryContainer();
  } else if (ticTacToeStore.matchCount) {
    removeGameBoardContainer();
  }
  ticTacToeStore.matchCount++;
  initializeTicTacToeStore();
  setXTurnButtonActive();
  $("#o-turn-button").addEventListener("click", chooseOPlayer);
  $("#tic-tac-toe-information-text").innerText =
    "Pradekite zaidima arba pasirinkite zaideja";
  drawGameBoardContainer();
  addCellEvents();
}

function initializeTicTacToeStore() {
  ticTacToeStore.turnCount = 0;
  ticTacToeStore.isXTurn = true;
  ticTacToeStore.victory = undefined;
  ticTacToeStore.isGameRunning = true;
  ticTacToeStore.lastMoveIndex = undefined;
}

function chooseOPlayer() {
  if (ticTacToeStore.gameMode != "two-players") {
    if (ticTacToeStore.turnCount == 0) {
      setOTurnButtonActive();
      makeMove(getAIMove());
    }
  }
}

function isMoveAlreadyMade(index) {
  return $("#tic-tac-toe-cell-" + index).innerHTML == "" ? false : true;
}

function setXTurnButtonActive() {
  $("#x-turn-button").classList.add("turn-button-is-active");
  $("#o-turn-button").classList.remove("turn-button-is-active");
}

function setOTurnButtonActive() {
  $("#o-turn-button").classList.add("turn-button-is-active");
  $("#x-turn-button").classList.remove("turn-button-is-active");
}

async function onMatchVictory() {
  $("#tic-tac-toe-information-text").innerText = "Zaidimas baigtas";
  ticTacToeStore.isGameRunning = false;
  await runVictoryAnimation();
  await sleep(200);
  ticTacToeStore[ticTacToeStore.victory.player + "VictoryCount"]++;
  $("#" + ticTacToeStore.victory.player + "-score").innerText =
    ticTacToeStore[ticTacToeStore.victory.player + "VictoryCount"];
  removeGameBoardContainer();
  $("#tic-tac-toe-board").appendChild(constructVictoryContainer());
}

async function onMatchTie() {
  $("#tic-tac-toe-information-text").innerText = "Zaidimas baigtas";
  ticTacToeStore.isGameRunning = false;
  removeGameBoardContainer();
  $("#tic-tac-toe-board").appendChild(constructTieContainer());
}

function removeTieContainer() {
  $("#tic-tac-toe-board").removeChild($("#tie-container"));
}

function removeVictoryContainer() {
  $("#tic-tac-toe-board").removeChild($("#victory-container"));
}

function addGameResetButtonEvent() {
  $("#restart-button").addEventListener("click", startNewMatch);
}

function drawGameBoardContainer() {
  let ticTacToeElement = constructNode(
    "div",
    undefined,
    "tic-tac-toe-cells-container"
  );
  ticTacToeElement = addCells(ticTacToeElement);
  $("#tic-tac-toe-board").appendChild(ticTacToeElement);
}

async function onCellClick() {
  if (ticTacToeStore.isGameRunning) {
    if (!isMoveAlreadyMade(this.id[17])) {
      await makeMove(this.id[17]);
      if (isItMatchEnd()) {
        await endMatch();
      } else {
        if (ticTacToeStore.gameMode != "two-players") {
          await makeMove(getAIMove());
          if (isItMatchEnd()) {
            await endMatch();
          }
        }
      }
    }
  }
}

function getAIMove() {
  switch (ticTacToeStore.gameMode) {
    case "easy":
      return getEasyAIMove();
    case "medium":
      return getMediumAIMove();
    case "minimax":
      return getMiniMaxMove(getGameState());
    case "immposible":
      break;
  }
}

function getMediumAIMove() {
  let finishingMoveIndex = getLineCompletingIndex(getCurrentPlayer());
  if (finishingMoveIndex) {
    return finishingMoveIndex;
  }
  let defensiveMoveIndex = getLineCompletingIndex(getEnemyPlayer());
  if (defensiveMoveIndex) {
    return defensiveMoveIndex;
  }
  return getEasyAIMove();
}

function getCurrentPlayer() {
  return ticTacToeStore.isXTurn ? "x" : "o";
}

function getEnemyPlayer() {
  return ticTacToeStore.isXTurn ? "o" : "x";
}

function getLineCompletingIndex(player) {
  let possibleMoves = getPossibleMoves(getGameState().board);
  let playerCells = getPlayerCells(player);
  //rows
  for (let i = 0; i < 9; i += 3) {
    if ([i, i + 1, i + 2].filter(e => playerCells.includes(e)).length == 2) {
      let moveIndex = [i, i + 1, i + 2].filter(e => possibleMoves.includes(e));
      if (moveIndex.length != 0) {
        return moveIndex;
      }
    }
  }
  //columns
  for (let i = 0; i < 3; i++) {
    if ([i, i + 3, i + 6].filter(e => playerCells.includes(e)).length == 2) {
      let moveIndex = [i, i + 3, i + 6].filter(e => possibleMoves.includes(e));
      if (moveIndex.length != 0) {
        return moveIndex;
      }
    }
  }
  // /
  if ([2, 4, 6].filter(e => playerCells.includes(e)).length == 2) {
    let moveIndex = [2, 4, 6].filter(e => possibleMoves.includes(e));
    if (moveIndex.length != 0) {
      return moveIndex;
    }
  }
  // \
  if ([0, 4, 8].filter(e => playerCells.includes(e)).length == 2) {
    let moveIndex = [0, 4, 8].filter(e => possibleMoves.includes(e));
    if (moveIndex.length != 0) {
      return moveIndex;
    }
  }
}

function getPlayerCells(player) {
  let enemyCells = [...Array(9).keys()].filter(
    (e, i) => !isMoveAlreadyMadeByPlayer(i, player)
  );
  return enemyCells;
}

function getEasyAIMove() {
  let possibleMoves = getPossibleMoves(getGameState().board);
  return possibleMoves[getRandomInt(possibleMoves.length)];
}

function isItMatchEnd() {
  let victory = getMatchVictory();
  if (victory) {
    ticTacToeStore.victory = victory;
    return true;
  } else {
    if (ticTacToeStore.turnCount == 9) {
      return true;
    }
  }
  return false;
}

async function endMatch() {
  if (ticTacToeStore.victory) {
    await onMatchVictory();
  } else {
    if (ticTacToeStore.turnCount == 9) {
      await onMatchTie();
    }
  }
}

function removeGameBoardContainer() {
  $("#tic-tac-toe-cells-container").innerHTML = "";
  $("#tic-tac-toe-board").removeChild($("#tic-tac-toe-cells-container"));
}

function constructVictoryContainer() {
  let victoryContainer = constructNode("div", undefined, "victory-container");
  victoryContainer.appendChild(constructBigOXContainer());
  victoryContainer.appendChild(constructMatchEndTextElement());
  victoryContainer.addEventListener("click", startNewMatch);
  return victoryContainer;
}

function constructTieContainer() {
  let tieContainer = constructNode("div", "tie-container", "tie-container");
  tieContainer.appendChild(
    constructNode(
      "div",
      "tic-tac-toe-o border-thiccc-solid area-o",
      "tic-tac-toe-big-o"
    )
  );
  tieContainer.appendChild(
    constructNode("div", "tic-tac-toe-x area-x", "tic-tac-toe-big-x")
  );
  let matchEndTextElement = constructMatchEndTextElement();
  matchEndTextElement.classList.add("area-text");
  tieContainer.appendChild(matchEndTextElement);
  tieContainer.addEventListener("click", startNewMatch);
  return tieContainer;
}

function constructBigOXContainer() {
  let bigOXContainer = constructNode("div", undefined, "big-ox-container");
  if (ticTacToeStore.victory.player == "o") {
    bigOXContainer.appendChild(
      constructNode(
        "div",
        "tic-tac-toe-o border-thiccccc-solid",
        "tic-tac-toe-big-o"
      )
    );
  } else {
    bigOXContainer.appendChild(
      constructNode("div", "tic-tac-toe-x", "tic-tac-toe-big-x")
    );
  }
  return bigOXContainer;
}

function constructMatchEndTextElement() {
  let matchEndTextElement = constructNode(
    "div",
    "match-end-text",
    "match-end-text"
  );
  matchEndTextElement.innerText = ticTacToeStore.victory
    ? "LAIMĖTOJAS!"
    : "LYGIOSIOS!";
  return matchEndTextElement;
}

function addCellEvents() {
  ticTacToeStore.cells = [...$(".tic-tac-toe-cell")];
  ticTacToeStore.cells.forEach(e => {
    e.addEventListener("click", onCellClick);
    return e;
  });
}

async function runVictoryAnimation() {
  let color = getPlayerColor();
  let lineType = getVictoryAnimationLineType();
  ticTacToeStore.victory.elements[0].classList.add(`${lineType}-${color}-line`);
  await sleep(110);
}

function getVictoryAnimationLineType() {
  let lineType;
  if (ticTacToeStore.victory.type == "row") {
    lineType = "horizontal";
  } else if (ticTacToeStore.victory.type == "column") {
    lineType = "vertical";
  } else if (ticTacToeStore.victory.type == "diagonalBackwardRow") {
    lineType = "diagonal-backward";
  } else if (ticTacToeStore.victory.type == "diagonalForwardRow") {
    lineType = "diagonal-forward";
  }
  return lineType;
}

function getPlayerColor() {
  let color;
  if (ticTacToeStore.victory.player == "x") {
    color = "black";
  } else {
    color = "white";
  }
  return color;
}

function addCells(containerElement) {
  let size = 9;
  for (let i = 0; i < size; i++) {
    containerElement.appendChild(
      constructNode("div", "tic-tac-toe-cell", "tic-tac-toe-cell-" + i)
    );
  }
  return containerElement;
}

async function makeMove(index) {
  ticTacToeStore.lastMoveIndex = index;
  let moveMaker = getNextMoveMakerSymbol();
  if (moveMaker == "o") {
    setXTurnButtonActive();
    $("#tic-tac-toe-information-text").innerText = "X ejimas";
  } else {
    setOTurnButtonActive();
    $("#tic-tac-toe-information-text").innerText = "O ejimas";
  }
  let moveElement = constructNode(
    "div",
    "tic-tac-toe-" + moveMaker,
    "tic-tac-toe-move-" + ticTacToeStore.turnCount
  );
  $("#tic-tac-toe-cell-" + index).appendChild(moveElement);
  ticTacToeStore.turnCount++;
  await sleep(110);
}

function isMoveAlreadyMadeByPlayer(index, player) {
  return document.querySelector(
    `#tic-tac-toe-cell-${index} > .tic-tac-toe-${player}`
  )
    ? false
    : true;
}

function getGameState() {
  return {
    board: Array(9)
      .fill()
      .map((_, i) => getMoveMakerSymbol(ticTacToeStore.cells[i].firstChild)),
    playersTurn: getCurrentPlayer()
  };
}

function getMoveMakerSymbol(moveCell) {
  if (!moveCell) {
    return null;
  }
  switch (moveCell.className) {
    case "tic-tac-toe-x":
      return "x";
    case "tic-tac-toe-o":
      return "o";
  }
}

function getNextMoveMakerSymbol() {
  let moveMaker = "";
  if (ticTacToeStore.isXTurn) {
    moveMaker = "x";
    ticTacToeStore.isXTurn = false;
  } else {
    moveMaker = "o";
    ticTacToeStore.isXTurn = true;
  }
  return moveMaker;
}

function getMatchVictory() {
  let rowVictory = getRowVictory();
  if (rowVictory) {
    return rowVictory;
  }
  let columnVictory = getColumnVictory();
  if (columnVictory) {
    return columnVictory;
  }
  let diagonalRowVictory = getDiagonalRowVictory();
  if (diagonalRowVictory) {
    return diagonalRowVictory;
  }
  return undefined;
}

function getDiagonalRowVictory() {
  let row = [
    ticTacToeStore.cells[0],
    ticTacToeStore.cells[4],
    ticTacToeStore.cells[8]
  ];
  if (isVictoriuosFew("x", row)) {
    return {
      player: "x",
      elements: row,
      type: "diagonalBackwardRow"
    };
  }
  if (isVictoriuosFew("o", row)) {
    return {
      player: "o",
      elements: row,
      type: "diagonalBackwardRow"
    };
  }
  row = [
    ticTacToeStore.cells[2],
    ticTacToeStore.cells[4],
    ticTacToeStore.cells[6]
  ];
  if (isVictoriuosFew("x", row)) {
    return {
      player: "x",
      elements: row,
      type: "diagonalForwardRow"
    };
  }
  if (isVictoriuosFew("o", row)) {
    return {
      player: "o",
      elements: row,
      type: "diagonalForwardRow"
    };
  }
  return undefined;
}

function getColumnVictory() {
  let column = [];
  for (let i = 0; i < 3; i++) {
    column = [
      ticTacToeStore.cells[i],
      ticTacToeStore.cells[i + 3],
      ticTacToeStore.cells[i + 6]
    ];
    if (isVictoriuosFew("x", column)) {
      return {
        player: "x",
        elements: column,
        type: "column"
      };
    }
    if (isVictoriuosFew("o", column)) {
      return {
        player: "o",
        elements: column,
        type: "column"
      };
    }
  }
  return undefined;
}

function getRowVictory() {
  let row = [];
  for (let i = 0; i < 9; i += 3) {
    row = [
      ticTacToeStore.cells[i],
      ticTacToeStore.cells[i + 1],
      ticTacToeStore.cells[i + 2]
    ];
    if (isVictoriuosFew("x", row)) {
      return {
        player: "x",
        elements: row,
        type: "row"
      };
    }
    if (isVictoriuosFew("o", row)) {
      return {
        player: "o",
        elements: row,
        type: "row"
      };
    }
  }
  return undefined;
}

function isVictoriuosFew(player, elements) {
  let nulls = elements.filter(e => e.firstChild == null);
  if (nulls.length != 0) {
    return false;
  }
  let classes = elements.map(e => {
    return e.firstChild.className;
  });
  if (!classes[0].includes(`tic-tac-toe-${player}`)) {
    return false;
  }
  let notEquallClasses = classes.filter(e => e != classes[0]);
  if (notEquallClasses.length != 0) {
    return false;
  }
  return true;
}
