'use strict'

var gBoard
const MINE = '💣'
const CELL = '🟦'

const gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}

const gLevel = {
    SIZE: 4,
    MINES: 2
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')

    // setMinesNegsCount(gBoard)
    // hideElement('.game-over')
    // gGame.isOn = true
}

function buildBoard() {
    const size = gLevel.SIZE
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {

            board[i][j] = {
                minesAroundCount: 4,
                isRevealed: false,
                isMine: false,
                isMarked: false,
                cellType: CELL,
            }

        }
    }

    createMines(board)
    setMinesNegsCount(board)
    console.table(board)
    return board
}

//create mines random locations
function createMines(board) {
    var numOfMines

    switch (gLevel.SIZE) {
        case 4:
            numOfMines = 2
            break
        case 8:
            numOfMines = 14
            break
        case 32:
            numOfMines = 32
            break
    }

    for (var i = 0; i < numOfMines; i++) {
        createMine(board)
    }
}

//create single mine
function createMine(board) {
    const randomI = getRandomInt(0, gLevel.SIZE - 1)
    const randomJ = getRandomInt(0, gLevel.SIZE - 1)

    return board[randomI][randomJ] = {
        minesAroundCount: 4,
        isRevealed: false,
        isMine: true,
        isMarked: false,
        cellType: MINE,
    }

}

// change the mines count value accoarding to countNEgsMines function
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if (currCell.cellType === CELL) currCell.minesAroundCount = countNegsMines(board, i, j)
        }
    }
    return
}

//count negs cells only if it's type is MINE
function countNegsMines(board, rowIdx, colIdx) {

    var countMines = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.cellType === MINE) {
                countMines++
            }
        }
    }
    return countMines
}

function updateScore(diff) {
    // TODO: update model 
    gGame.score += diff
    console.log(gGame.score);


    // TODO: update dom
    const elScore = document.querySelector('.score span')
    elScore.innerText = gGame.score
}


function checkVictory() {
    if (countFood() !== 0) {
        return false
    } else {
        gameOver()
        playSound('win')
        return true
    }
}

function gameOver() {
    gGame.isOn = false
    showElement('.game-over')

    var elSpan = document.querySelector('.game-over span')
    if (countFood() === 0) {
        elSpan.innerText = 'Victorious'
        playSound('win')
    } else {
        elSpan.innerText = 'Game Over!'
    }

    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)
    // TODO

    // clearInterval(gGhostsInterval)
}


