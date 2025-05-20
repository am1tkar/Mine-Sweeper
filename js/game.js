'use strict'

var gBoard

const MINE = '💣'
const CELL = '🟦'
const MARK = '🚩'

const WIN = '😎'
const NORMAL = '😃'
const LOSE = '🤯'

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
    gGame.isOn = true
}

function reset() {
    onInit()
    zeroParams()
    gGame.secsPassed = 0
    gMinesLocations = []
    var elSpan = document.querySelector('.restart-btn span')
    return elSpan.innerText = `${NORMAL}`
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


    console.table(board)
    return board
}

//create mines random locations
function createMines(board) {

    for (var i = 0; i < gLevel.MINES; i++) {
        const randomI = getRandomInt(0, gLevel.SIZE - 1)
        const randomJ = getRandomInt(0, gLevel.SIZE - 1)

        gMinesLocations.push(`${randomI},${randomJ}`)

        board[randomI][randomJ] = {
            cellType: MINE,
            isRevealed: false,
            isMine: true,
            isMarked: false,
            location: `${randomI},${randomJ}`,
        }
    }

}

function isFirstClick() {
    if (gGame.revealedCount !== 0) return false
    return true
}


function findMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) console.log(gBoard[i][j].location);


        }
    }

}

// change the mines count value accoarding to countNegsMines function
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if (currCell.cellType === CELL) currCell.minesAroundCount = countNegsMines(board, i, j)
        }
    }
    return
}

// count neighbours
function countNegs(board, rowIdx, colIdx) {

    var countNegs = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.cellType === MINE) {
                countNegs++
            }
        }
    }
    return countNegs
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

//when flagging a cell
function onCellMarked(elCell, i, j) {

    const noContext = document.getElementById("noContextMenu");
    noContext.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });

    if (!gGame.isOn) return
    //  if (gBoard[i][j].isRevealed === true)
    if (gBoard[i][j].isMarked === true) {
        elCell.innerText = ""
        gBoard[i][j].isMarked = false
        decreaseMarkCount()
        return
    }

    gBoard[i][j].isMarked = true
    elCell.innerText = MARK
    updateMarkCount()

    checkVictory()

}

//when clicking a cell
function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    // console.log('click!');

    if (isFirstClick()) {
        createMines(gBoard)
        setMinesNegsCount(gBoard)
    }


    if (gBoard[i][j].isRevealed) return
    if (gBoard[i][j].isMarked) {
        elCell.innerText = ''
        revealCell(elCell, i, j)
        decreaseMarkCount()
    }


    if (gBoard[i][j].cellType === CELL) {
        revealCell(elCell, i, j)
        elCell.classList.add('clicked')
    }



    checkVictory()

    if (gBoard[i][j].cellType === MINE) {
        showAllMineCell(i, j)
        gameOver()
    }




}

//reveal cell
function revealCell(elCell, i, j) {

    if (elCell.innerText) return

    if (gBoard[i][j].isMine === true) {
        elCell.innerText += `${MINE}`
        showAllMineCell(i, j)
        gameOver()
        return

    } else {
        elCell.innerText += `${gBoard[i][j].minesAroundCount}`
        gBoard[i][j].isRevealed = true
        elCell.classList.add('revealed')
        if (gBoard[i][j].minesAroundCount === 0) {
            expandReveal(i, j)
        }

    }
    updateRevealedCount()
    return
}

function expandReveal(i, j) {

    for (var x = i - 1; x <= i + 1; x++) {
        for (var y = j - 1; y <= j + 1; y++) {
            if (x === i && y === j) continue
            if (x < 0 || x >= gBoard.length || y < 0 || y >= gBoard[0].length) continue

            if (!gBoard[x][y].isMine) {
                if (!gBoard[x][y].isRevealed) {
                    gBoard[x][y].isRevealed = true
                    updateRevealedCount()

                    checkVictory()


                    var elCell = document.querySelector(`.cell.cell-${x}-${y}`)
                    elCell.innerText = gBoard[x][y].minesAroundCount
                    elCell.classList.add('revealed')
                }
            }
        }
    }

    var elCenterCell = document.querySelector(`.cell.cell-${i}-${j}`)

    elCenterCell.innerText = gBoard[i][j].minesAroundCount
    gBoard[i][j].isRevealed = true
    elCenterCell.classList.add('revealed')
    return
}

//DOM mark count
function updateMarkCount() {
    gGame.markedCount++
    document.querySelector('.mark-count span').innerText = gGame.markedCount
}

//DOM mark count
function decreaseMarkCount() {
    gGame.markedCount--
    document.querySelector('.mark-count span').innerText = gGame.markedCount
}

//DOM reveal count
function updateRevealedCount() {
    gGame.revealedCount++
    document.querySelector('.revealed-count span').innerText = gGame.revealedCount
}

function zeroParams() {
    gGame.revealedCount = 0
    gGame.markedCount = 0
    document.querySelector('.revealed-count span').innerText = gGame.revealedCount
    document.querySelector('.mark-count span').innerText = gGame.markedCount

}

function checkVictory() {

    if (gGame.revealedCount !== gLevel.SIZE ** 2 - gLevel.MINES) return false
    if (gGame.markedCount !== gLevel.MINES) return false


    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (!gBoard[i][j].isMine && gBoard[i][j].isMarked) return false
        }
    }

    var elSpan = document.querySelector('.restart-btn span')
    elSpan.innerText = `${WIN}`
    gGame.isOn = false
    return true
}

//DOM reveal all mines
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

//when game is over
function gameOver() {
    gGame.isOn = false
    var elSpan = document.querySelector('.restart-btn span')
    elSpan.innerText = `${LOSE}`
}

