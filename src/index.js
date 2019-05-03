import {
    $,
    constructNode,
    sleep
} from './helpers.js';

let ticTacToeStore = {
    cells: [],
    isXTurn: true,
    turnCounter: 0,
    gameRunning: true
};

(function onInit() {
    drawGameBoard();
    addBoardEvents();
})();

function drawGameBoard() {
    let ticTacToeElement = constructNode('div', undefined, 'tic-tac-toe-cells-container');
    ticTacToeElement = addCells(ticTacToeElement);
    $('#tic-tac-toe-board').appendChild(ticTacToeElement);
}

async function onCellClick() {
    if (ticTacToeStore.gameRunning) {
        await makeMove(this.id[17]);
        let victory = getVictory();
        if (victory) {
            await onVictory(victory);
        }
    }
}

async function onVictory(victory) {
    ticTacToeStore.gameRunning = false;
    await runVictoryAnimation(victory);
    await sleep(200);
    $('#tic-tac-toe-board').removeChild($('#tic-tac-toe-cells-container'));
    let victoryContainer = constructNode('div', undefined, 'victory-container');
    let bigOXContainer = constructNode('div', undefined, 'big-ox-container');
    if (victory.player == 'o') {
        bigOXContainer.appendChild(constructNode('div', 'tic-tac-toe-o border-thiccc-solid', 'tic-tac-toe-big-o'));
    } else {
        bigOXContainer.appendChild(constructNode('div', 'tic-tac-toe-x', 'tic-tac-toe-big-x'));
    }
    victoryContainer.appendChild(bigOXContainer);
    let winnerText = constructNode('div', undefined, 'winner-text');
    winnerText.innerText = 'LAIMĖTOJAS!';
    victoryContainer.appendChild(winnerText);
    $('#tic-tac-toe-board').appendChild(victoryContainer);
}

function addBoardEvents() {
    ticTacToeStore.cells = [...$('.tic-tac-toe-cell')];
    ticTacToeStore.cells.forEach(e => {
        e.addEventListener('click', onCellClick, {
            once: true
        });
        return e;
    });
}

async function runVictoryAnimation(victory) {
    let color;
    if (victory.player == 'x') {
        color = 'black';
    } else {
        color = 'white';
    }
    let lineType;
    if (victory.type == 'row') {
        lineType = 'horizontal';
    } else if (victory.type == 'column') {
        lineType = 'vertical';
    } else if (victory.type == 'diagonalBackwardRow') {
        lineType = 'diagonal-backward';
    } else if (victory.type == 'diagonalForwardRow') {
        lineType = 'diagonal-forward';
    }
    victory.elements[0].classList.add(`${lineType}-${color}-line`);
    await sleep(110);
}



function addCells(containerElement) {
    let size = 9;
    for (let i = 0; i < size; i++) {
        containerElement.appendChild(constructNode('div', 'tic-tac-toe-cell', 'tic-tac-toe-cell-' + i));
    }
    return containerElement;
}

async function makeMove(index) {
    let moveMaker = '';
    if (ticTacToeStore.isXTurn) {
        moveMaker = 'x';
        ticTacToeStore.isXTurn = false;
    } else {
        moveMaker = 'o';
        ticTacToeStore.isXTurn = true;
    }
    // ticTacToeStore.cells[index] = moveMaker;
    let element = constructNode('div', 'tic-tac-toe-' + moveMaker, 'tic-tac-toe-move-' + ticTacToeStore.turnCounter);
    let cell = await $('#tic-tac-toe-cell-' + index);
    cell.appendChild(element);
    ticTacToeStore.turnCounter++;
    await sleep(110);
}

function getVictory() {
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