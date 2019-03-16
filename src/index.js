window.onload = function () {
    drawGameBoard(3); //6 max
    let ticTacToeGame = new TicTacToeGame();
    ticTacToeGame.ticTacToeCells = ticTacToeGame.ticTacToeCells
        .map(e => {
            let eCopy = e;
            eCopy.addEventListener('click', function () {
                ticTacToeGame.makeMove(this.id);
            }, {
                once: true
            });
            return eCopy;
        });
};

function drawGameBoard(size) {
    let containerElement = document.getElementById('tic-tac-toe-container');
    containerElement.style.gridTemplateColumns = `repeat(${size},1fr)`;
    containerElement.style.gridTemplateRows = `repeat(${size},1fr)`;
    for (let i = 0; i < size * size; i++) {
        containerElement.innerHTML += '<div id="tic-tac-toe-cell' + i + '" class="tic-tac-toe-cell"></div>';

    }
}

class TicTacToeGame {
    constructor() {
        this.isXTurn = true;
        this.ticTacToeCells = Array.prototype.slice
            .call(document.getElementsByClassName('tic-tac-toe-cell'));
    }
    makeMove(id) {
        if (this.isXTurn) {
            document.getElementById(id).innerHTML = '<div class="tic-tac-toe-x"></div>';
        } else {
            document.getElementById(id).innerHTML = '<div class="tic-tac-toe-o"></div>';
        }
        this.isXTurn ^= true;
        this.hasSomebodyWon();
    }
    hasSomebodyWon() {
        //rows
        let victoriuosRow = this.getVictoriuosRow();
        if (victoriuosRow) {
            console.info(victoriuosRow[0].innerHTML[24] + ' wins!');
        }
        //columns
        let victoriuosColumn = this.getVictoriuosColumn();
        if (victoriuosColumn) {
            console.info(victoriuosColumn[0].innerHTML[24] + ' wins!');
        }
        //diagonals
        let victoriuosDiagonalRow = this.getVictoriuosDiagonalRow();
        if (victoriuosDiagonalRow) {
            console.info(victoriuosDiagonalRow[0].innerHTML[24] + ' wins!');
        }
        return false;
    }
    getVictoriuosDiagonalRow() {
        let ticTacToeSize = Math.sqrt(this.ticTacToeCells.length);
        let diagnalRows = [];
        let row = [];
        for (let i = 0, j = 0; i < this.ticTacToeCells.length; i += ticTacToeSize, j++) {
            row.push(this.ticTacToeCells[i + j]);
        }
        diagnalRows.push(row);
        row = [];
        for (let i = this.ticTacToeCells.length, j = ticTacToeSize; i > 0; i -= ticTacToeSize, j--) {
            row.push(this.ticTacToeCells[i - j]);
        }
        diagnalRows.push(row);
        let diagnalRowVictories = diagnalRows.map(arr => arr.every(e => e.innerHTML != '' && e.innerHTML == arr[0].innerHTML));
        if (diagnalRowVictories.includes(true)) {
            return diagnalRows[diagnalRowVictories.indexOf(true)];
        }
        return undefined;
    }
    getVictoriuosColumn() {
        let ticTacToeSize = Math.sqrt(this.ticTacToeCells.length);
        let columns = [];
        for (let i = 0; i < ticTacToeSize; i++) {
            let column = [];
            for (let j = 0; j < this.ticTacToeCells.length; j += ticTacToeSize) {
                column.push(this.ticTacToeCells[i + j]);
            }
            columns.push(column);
        }
        let columnVictories = columns.map(arr => arr.every(e => e.innerHTML != '' && e.innerHTML == arr[0].innerHTML));
        if (columnVictories.includes(true)) {
            return columns[columnVictories.indexOf(true)];
        }
        return undefined;
    }
    getVictoriuosRow() {
        let ticTacToeSize = Math.sqrt(this.ticTacToeCells.length);
        let rows = [];
        for (let i = 0; i < this.ticTacToeCells.length; i += ticTacToeSize) {
            rows.push(this.ticTacToeCells.slice(i, i + ticTacToeSize));
        }
        let rowVictories = rows.map(arr => arr.every(e => e.innerHTML != '' && e.innerHTML == arr[0].innerHTML));
        if (rowVictories.includes(true)) {
            return rows[rowVictories.indexOf(true)];
        }
        return undefined;
    }
}