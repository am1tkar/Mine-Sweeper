'use strict'

var gBoard

const MINE = '💣'
const CELL = '🟦'
const MARK = '🚩'

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


var gMinesLocations = []


function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')
    hideElement('.game-over')
    gGame.isOn = true
}
//model
function buildBoard() {
    const size = gLevel.SIZE
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {

            board[i][j] = {
                cellType: CELL,
                minesAroundCount: 4,
                isRevealed: false,
                isMine: false,
                isMarked: false,
                location: `${i},${j}`,
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

    for (var i = 0; i < gLevel.MINES; i++) {
        createMine(board)
    }
}

//create single mine
function createMine(board) {
    const randomI = getRandomInt(0, gLevel.SIZE - 1)
    const randomJ = getRandomInt(0, gLevel.SIZE - 1)

    gMinesLocations.push(`${randomI},${randomJ}`)

    return board[randomI][randomJ] = {
        cellType: MINE,
        minesAroundCount: 4,
        isRevealed: false,
        isMine: true,
        isMarked: false,
        location: `${randomI},${randomJ}`,
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


function onCellMarked(elCell, i, j) {

    const noContext = document.getElementById("noContextMenu");
    noContext.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });

    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked === true) return

    gBoard[i][j].isMarked = true
    elCell.innerText = MARK
    updateMarkCount()
}

function onCellClicked(elCell, i, j) {
    console.log('click!');

    if (!gGame.isOn) return
    if (gBoard[i][j].isRevealed) return
    if (gBoard[i][j].isMarked === true) elCell.innerText = ''
    revealCell(elCell, i, j)



    if (gBoard[i][j].isMarked === true) {
        gGame.revealedCount--
    }

    if (gBoard[i][j].cellType === CELL || gBoard[i][j].cellType === MARK) {
        revealCell(elCell, i, j)
    }
    if (gBoard[i][j].cellType === MINE) {
        showAllMineCell(i, j)
        gameOver()
    }



}

function revealCell(elCell, i, j) {

    if (elCell.innerText) return

    if (gBoard[i][j].isMine === true) {
        elCell.innerText += `${MINE}`
        gameOver()
    } else {
        elCell.innerText += `${gBoard[i][j].minesAroundCount}`
        gBoard[i][j].isRevealed = true
        updateRevealedCount()

    }
}

function expandReveal(board, elCell, i, j) {

}

// function updateScore(diff) {
//     // TODO: update model 
//     gGame.score += diff
//     console.log(gGame.score);


//     // TODO: update dom
//     const elScore = document.querySelector('.score span')
//     elScore.innerText = gGame.score
// }

function updateMarkCount() {
    gGame.markedCount++
    document.querySelector('.mark-count span').innerText = gGame.markedCount


}

function updateRevealedCount() {
    gGame.revealedCount++
    document.querySelector('.revealed-count span').innerText = gGame.revealedCount
}

function checkVictory(i, j) {
    if (gGame.revealedCount !== gLevel.SIZE ** 2 - gLevel.MINES) return false
    if (gBoard[i][j].isMine && gBoard[i][j].isMine) return false

    return true
}


function showAllMineCell() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const elCell = document.querySelector(`.cell-${i}-${j}`)
            if (gMinesLocations.includes(gBoard[i][j].location)) {
                elCell.innerText = MINE
            }
        }
    }
}






function gameOver() {
    gGame.isOn = false
    showElement('.game-over')
    var elSpan = document.querySelector('.game-over span')
    elSpan.innerText = 'Game Over!'


}
