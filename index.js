window.addEventListener('DOMContentLoaded', () => {
    createGameBoard();
    generate();
    generate();
});

const COLUMN = 4;
const ROWS = 4;
const scoreCount = 0;

const root = document.getElementById('root');
const score = document.getElementById('score');
const btnRestart = document.querySelector('.btn-restart');

//доска
let GAME_BOARD = [];

//ряд элементов доски
const boardRow = [];

//колонки элементов доски
const boardColumn = [];

let statusGame = {
    canMove: {
        prevMove: '',
        currentMove: '',
        count: 0,
    },
};

//
const checkedCanMove = (keyMove) => {
    let prev =
        statusGame.canMove.prevMove === keyMove
            ? keyMove
            : statusGame.canMove.prevMove;
    if (keyMove !== prev && statusGame.canMove.count == 1) {
        prev = keyMove;
    }
    if (statusGame.canMove.count <= 2) {
        generate();
    }
    return (statusGame.canMove = {
        prevMove: prev !== '' ? prev : keyMove,
        currentMove: keyMove,
        count:
            keyMove === prev
                ? (statusGame.canMove.count += 1)
                : ((statusGame.canMove.prevMove = keyMove),
                  (statusGame.canMove.count = 0)),
    });
};

const createGameBoard = () => {
    for (let i = 0; i < COLUMN * ROWS; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        GAME_BOARD.push(cell);
        root.append(cell);
    }
    score.innerHTML = scoreCount;

    createRows(GAME_BOARD, ROWS);
    createColumns(GAME_BOARD, COLUMN);
};

const generate = () => {
    const emptyCell = [];
    for (let i = 0; i < GAME_BOARD.length; i++) {
        if (GAME_BOARD[i].innerHTML == '') {
            emptyCell.push(GAME_BOARD[i]);
        }
    }
    if (emptyCell.length === 0) {
        checkedGameOver();
        return false;
    }
    const randomCell =
        emptyCell[Math.floor(Math.random() * Math.floor(emptyCell.length))];
    randomCell.innerHTML = Math.random() >= 0.3 ? 2 : 4;

    update(randomCell, randomCell.innerHTML, true);

    return randomCell;
};

const createRows = (GAME_BOARD, ROWS) => {
    let rows = [].concat(GAME_BOARD);
    for (let i = 0; i < ROWS; i++) {
        boardRow.push(rows.splice(0, ROWS));
    }
};

const createColumns = (GAME_BOARD, COLUMN) => {
    for (let i = 0; i < COLUMN; i++) {
        let arr = [];
        let index = i;
        for (let j = 0; j < GAME_BOARD.length; j++) {
            if (arr.length < COLUMN) {
                arr.push(GAME_BOARD[index]);
                index += COLUMN;
            } else {
                boardColumn.push(arr);
                arr = [];
                j = GAME_BOARD.length;
            }
        }
    }
};

const update = (cell, value, status) => {
    if (status) {
        cell.classList.value = '';
        cell.classList.add('cell');
        cell.classList.add('new');
        cell.classList.add('x' + value.toString());
    } else {
        value !== ''
            ? ((cell.classList.value = ''),
              cell.classList.add('cell'),
              cell.classList.add('x' + value.toString()))
            : ((cell.classList.value = ''), cell.classList.add('cell'));
    }
    if (value === 2048) {
        gameWin();
    }
};

const countingScore = (count) => {
    const scoreAnimate = document.createElement('b');
    scoreAnimate.classList.add('score-animate');
    scoreAnimate.innerHTML = '+' + count;

    score.innerHTML = parseInt(score.innerHTML) + count;
    score.append(scoreAnimate);
};

const sortingArray = (rows, right, left) => {
    let arr = rows.filter((cell) => cell !== '');
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === arr[i + 1]) {
            count += parseInt(arr[i + 1]) + parseInt(arr[i]);
            arr.splice(
                i,
                2,
                (arr[i + 1] = {
                    value: count,
                    update: true,
                })
            );
            i++;
        }
        if (arr[i] !== undefined) {
            arr[i] = {
                value: parseInt(arr[i]),
                update: false,
            };
        }
    }

    if (right) {
        arr.reverse();
    }

    if (count > 0) {
        countingScore(count);
    }

    //заполнение пропусков

    while (arr.length < ROWS) {
        if (right) {
            arr.unshift({
                value: '',
                update: false,
            });
        }
        if (left) {
            arr.push({
                value: '',
                update: false,
            });
        }
    }

    return arr;
};

const moveKey = (board, right, left, key) => {
    let checkUpdate = false;
    for (let i = 0; i < board.length; i++) {
        let cell = board[i].map((cell) => cell.innerHTML);
        if (right) {
            cell.reverse();
        }
        let arr = sortingArray(cell, right, left);
        for (let j = 0; j < board.length; j++) {
            board[i][j].innerHTML = arr[j].value;
            update(board[i][j], arr[j].value, arr[j].update);
            if (arr[j].update) {
                statusGame.canMove = {
                    ...statusGame.canMove,
                    count: 1,
                };
            }
        }
    }
};

const cellNotEqual = (cell, i, arr) => {
    return cell.innerHTML !== arr[i + 1]?.innerHTML;
};

const checkedGameOver = () => {
    let stack = [].concat(boardRow, boardColumn);
    let status = [];

    for (let i = 0; i <= stack.length - 1; i++) {
        status.push(stack[i].every(cellNotEqual));
    }

    if (status.indexOf(false) === -1) {
        return gameOver();
    }
};

const controlKey = (e) => {
    switch (e.keyCode) {
        case 37: //влево
            moveKey(boardRow, false, true);
            checkedCanMove(e.keyCode);
            break;
        case 65:
            moveKey(boardRow, false, true);
            checkedCanMove(e.keyCode);
            break;
        case 38: //вверх
            moveKey(boardColumn, false, true);
            checkedCanMove(e.keyCode);
            break;
        case 87:
            moveKey(boardColumn, false, true);
            checkedCanMove(e.keyCode);
            break;
        case 39: // вправо
            moveKey(boardRow, true, false);
            checkedCanMove(e.keyCode);
            break;
        case 68:
            moveKey(boardRow, true, false);
            checkedCanMove(e.keyCode);
            break;
        case 40: //вниз
            moveKey(boardColumn, true, false);
            checkedCanMove(e.keyCode);
            break;
        case 83:
            moveKey(boardColumn, true, false);
            checkedCanMove(e.keyCode);
            break;
    }
};

document.addEventListener('keyup', controlKey);

const gameOver = () => {
    document.removeEventListener('keyup', controlKey);
    setTimeout(() => {
        const btnAgain = document.createElement('button');
        const lose = document.createElement('div');

        lose.classList.add('game-over');
        lose.innerHTML = 'GAME OVER!';

        btnAgain.classList.add('btn-again');
        btnAgain.innerHTML = 'Try again';

        lose.append(btnAgain);
        root.append(lose);

        btnAgain.addEventListener('click', () => {
            return restartGame();
        });
    }, 1500);
};

const gameWin = () => {
    document.removeEventListener('keyup', controlKey);

    const win = document.createElement('div');
    win.classList.add('game-win');
    win.innerHTML = 'YOU WIN!';

    const btnConfirm = document.createElement('button');
    btnConfirm.classList.add('btn-confirm');
    btnConfirm.innerHTML = 'Continue';

    win.append(btnConfirm);
    root.append(win);

    btnConfirm.addEventListener('click', () => {
        document.addEventListener('keyup', controlKey);
        root.removeChild(win, btnConfirm);
    });
};

const restartGame = () => {
    const btnAgain = document.querySelector('.btn-again');
    const lose = document.querySelector('.game-over');

    const win = document.querySelector('.game-win');
    const btnConfirm = document.querySelector('.btn-confirm');

    if (root.contains(lose)) {
        root.removeChild(lose, btnAgain);
    }

    if (root.contains(win)) {
        root.removeChild(win, btnConfirm);
    }
    score.innerHTML = 0;

    document.removeEventListener('keyup', controlKey);
    document.addEventListener('keyup', controlKey);

    for (let i = 0; i < GAME_BOARD.length; i++) {
        GAME_BOARD[i].classList.value = '';
        GAME_BOARD[i].classList.add('cell');
        GAME_BOARD[i].innerHTML = '';
    }
    generate();
    generate();
};

btnRestart.addEventListener('click', () => {
    return restartGame();
});
