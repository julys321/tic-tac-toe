import {
    $,
    constructNode,
    sleep
} from './helpers.js';
let ticTacToeStore = {
    cells: [],
    isXTurn: true,
    turnCount: 0,
    matchCount: 0,
    xVictoryCount: 0,
    oVictoryCount: 0,
    isGameRunning: true,
    victory: null
};

(function onInit() {
    addGameResetButtonEvent();
    startNewMatch();
})();

function startNewMatch() {
    if (ticTacToeStore.turnCount == 9 && !ticTacToeStore.isGameRunning) {
        removeTieContainer();
    } else if (ticTacToeStore.turnCount < 9 && !ticTacToeStore.isGameRunning) {
        removeVictoryContainer();
    } else if (ticTacToeStore.matchCount) {
        removeGameBoardContainer();
    }
    ticTacToeStore.matchCount++;
    ticTacToeStore.turnCount = 0;
    ticTacToeStore.isXTurn = true;
    ticTacToeStore.victory = null;
    ticTacToeStore.isGameRunning = true;
    //TODO:refactor
    setXTurnButtonActive();
    $('#x-turn-button').addEventListener('click', choosePlayer);
    $('#o-turn-button').addEventListener('click', choosePlayer);

    drawGameBoardContainer();
    addCellEvents();
}

function choosePlayer() {
    if (ticTacToeStore.turnCount == 0) {
        if (this.innerHTML[0] == 'O') {
            setOTurnButtonActive();
            ticTacToeStore.isXTurn = false;
        } else {
            setXTurnButtonActive();
            ticTacToeStore.isXTurn = true;
        }
    }
}

function setXTurnButtonActive() {
    $('#x-turn-button').classList.add('turn-button-is-active');
    $('#o-turn-button').classList.remove('turn-button-is-active');
}

function setOTurnButtonActive() {
    $('#o-turn-button').classList.add('turn-button-is-active');
    $('#x-turn-button').classList.remove('turn-button-is-active');
}

async function onMatchVictory() {
    ticTacToeStore.isGameRunning = false;
    await runVictoryAnimation();
    await sleep(200);
    console.log(ticTacToeStore.victory.player)
    ticTacToeStore[ticTacToeStore.victory.player + 'VictoryCount']++;
    $('#' + ticTacToeStore.victory.player + '-score').innerText = ticTacToeStore[ticTacToeStore.victory.player + 'VictoryCount'];
    removeGameBoardContainer();
    $('#tic-tac-toe-board').appendChild(constructVictoryContainer());
}

async function onMatchTie() {
    ticTacToeStore.isGameRunning = false;
    removeGameBoardContainer();
    $('#tic-tac-toe-board').appendChild(constructTieContainer());
}

function removeTieContainer() {
    $('#tic-tac-toe-board').removeChild($('#tie-container'));
}

function removeVictoryContainer() {
    $('#tic-tac-toe-board').removeChild($('#victory-container'));
}

function addGameResetButtonEvent() {
    $('#restart-button').addEventListener('click', startNewMatch);
}

function drawGameBoardContainer() {
    let ticTacToeElement = constructNode('div', undefined, 'tic-tac-toe-cells-container');
    ticTacToeElement = addCells(ticTacToeElement);
    $('#tic-tac-toe-board').appendChild(ticTacToeElement);
}

async function onCellClick() {
    if (ticTacToeStore.isGameRunning) {
        await makeMove(this.id[17]);
        let victory = getMatchVictory();
        if (victory) {
            ticTacToeStore.victory = victory;
            await onMatchVictory();
        } else if (ticTacToeStore.turnCount == 9) {
            await onMatchTie();
        }
    }
}

function removeGameBoardContainer() {
    $('#tic-tac-toe-cells-container').innerHTML = '';
    $('#tic-tac-toe-board').removeChild($('#tic-tac-toe-cells-container'));
}

function constructVictoryContainer() {
    let victoryContainer = constructNode('div', undefined, 'victory-container');
    victoryContainer.appendChild(constructBigOXContainer());
    victoryContainer.appendChild(constructMatchEndTextElement());
    victoryContainer.addEventListener('click', startNewMatch);
    return victoryContainer;
}

function constructTieContainer() {
    let tieContainer = constructNode('div', 'tie-container', 'tie-container');
    tieContainer.appendChild(constructNode('div', 'tic-tac-toe-o border-thiccc-solid area-o', 'tic-tac-toe-big-o'));
    tieContainer.appendChild(constructNode('div', 'tic-tac-toe-x area-x', 'tic-tac-toe-big-x'));
    let matchEndTextElement = constructMatchEndTextElement();
    matchEndTextElement.classList.add('area-text');
    tieContainer.appendChild(matchEndTextElement);
    tieContainer.addEventListener('click', startNewMatch);
    return tieContainer;
}

function constructBigOXContainer() {
    let bigOXContainer = constructNode('div', undefined, 'big-ox-container');
    if (ticTacToeStore.victory.player == 'o') {
        bigOXContainer.appendChild(constructNode('div', 'tic-tac-toe-o border-thiccccc-solid', 'tic-tac-toe-big-o'));
    } else {
        bigOXContainer.appendChild(constructNode('div', 'tic-tac-toe-x', 'tic-tac-toe-big-x'));
    }
    return bigOXContainer;
}

function constructMatchEndTextElement() {
    let matchEndTextElement = constructNode('div', 'match-end-text', 'match-end-text');
    matchEndTextElement.innerText = ticTacToeStore.victory ? 'LAIMĖTOJAS!' : 'LYGIOSIOS!';
    return matchEndTextElement;
}

function addCellEvents() {
    ticTacToeStore.cells = [...$('.tic-tac-toe-cell')];
    ticTacToeStore.cells.forEach(e => {
        e.addEventListener('click', onCellClick);
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
    if (ticTacToeStore.victory.type == 'row') {
        lineType = 'horizontal';
    } else if (ticTacToeStore.victory.type == 'column') {
        lineType = 'vertical';
    } else if (ticTacToeStore.victory.type == 'diagonalBackwardRow') {
        lineType = 'diagonal-backward';
    } else if (ticTacToeStore.victory.type == 'diagonalForwardRow') {
        lineType = 'diagonal-forward';
    }
    return lineType;
}

function getPlayerColor() {
    let color;
    if (ticTacToeStore.victory.player == 'x') {
        color = 'black';
    } else {
        color = 'white';
    }
    return color;
}

function addCells(containerElement) {
    let size = 9;
    for (let i = 0; i < size; i++) {
        containerElement.appendChild(constructNode('div', 'tic-tac-toe-cell', 'tic-tac-toe-cell-' + i));
    }
    return containerElement;
}

async function makeMove(index) {
    if (!isMoveAlreadyMade(index)) {
        let moveMaker = getMoveMakerSymbol();
        let moveElement = constructNode('div', 'tic-tac-toe-' + moveMaker, 'tic-tac-toe-move-' + ticTacToeStore.turnCount);
        $('#tic-tac-toe-cell-' + index).appendChild(moveElement);
        ticTacToeStore.turnCount++;
        await sleep(110);
    }
}

function isMoveAlreadyMade(index) {
    return $('#tic-tac-toe-cell-' + index).innerHTML == '' ? false : true;
}

function getMoveMakerSymbol() {
    let moveMaker = '';
    if (ticTacToeStore.isXTurn) {
        moveMaker = 'x';
        ticTacToeStore.isXTurn = false;
    } else {
        moveMaker = 'o';
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
    if (isVictoriuosFew('x', row)) {
        return {
            player: 'x',
            elements: row,
            type: 'diagonalBackwardRow'
        };
    }
    if (isVictoriuosFew('o', row)) {
        return {
            player: 'o',
            elements: row,
            type: 'diagonalBackwardRow'
        };
    }
    row = [
        ticTacToeStore.cells[2],
        ticTacToeStore.cells[4],
        ticTacToeStore.cells[6]
    ]
    if (isVictoriuosFew('x', row)) {
        return {
            player: 'x',
            elements: row,
            type: 'diagonalForwardRow'
        };
    }
    if (isVictoriuosFew('o', row)) {
        return {
            player: 'o',
            elements: row,
            type: 'diagonalForwardRow'
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
        if (isVictoriuosFew('x', column)) {
            return {
                player: 'x',
                elements: column,
                type: 'column'
            };
        }
        if (isVictoriuosFew('o', column)) {
            return {
                player: 'o',
                elements: column,
                type: 'column'
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
        if (isVictoriuosFew('x', row)) {
            return {
                player: 'x',
                elements: row,
                type: 'row'
            };
        }
        if (isVictoriuosFew('o', row)) {
            return {
                player: 'o',
                elements: row,
                type: 'row'
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