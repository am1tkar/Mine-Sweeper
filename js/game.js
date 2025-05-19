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
    if (gBoard[i][j].cellType === CELL) revealCell(elCell, i, j)
    if (gBoard[i][j].cellType === MINE) {
        revealAllBoard()
        gameOver()
    }
    if (gBoard[i][j].cellType === MARK) unRevealCell( i, j)

}

function unRevealCell(i, j) {
    
    // gBoard[i][j].isMarked = false
    // gGame.markedCount--
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

// function revealAllBoard() {

//     var elCells = document.querySelectorAll('.cell')
//     elCells.forEach(elCell => {

//         elCell.innerText += `${getCellDisplay()}`
//     });
// }

function getCellDisplay(i, j) {
    var cellDisplay = (gBoard[i][j].cellType === MINE) ? gBoard[i][j].cellType : gBoard[i][j].minesAroundCount
    return cellDisplay
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

function updateMarkCount(i, j) {
    gGame.markedCount++
    document.querySelector('.mark-count span').innerText = gGame.markedCount


}

function updateRevealedCount() {
    gGame.revealedCount++
    document.querySelector('.revealed-count span').innerText = gGame.revealedCount
}

// function checkVictory() {
//     if (gGame.revealedCount = gLevel.SIZE**2) {
//          gameOver()
//     } else {
//         gameOver()
//         playSound('win')
//         return true
//     }


function gameOver() {
    gGame.isOn = false
    showElement('.game-over')

    var elSpan = document.querySelector('.game-over span')
    elSpan.innerText = 'Game Over!'
}
