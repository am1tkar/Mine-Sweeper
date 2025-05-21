'use strict'

var gBoard

const EMPTY = ' '
const MINE = '💣'
const CELL = '🟦'
const MARK = '🚩'


const WIN = '😎'
const NORMAL = '😃'
const LOSE = '🤯'



const gGame = {
    isOn: false,
    lives: 3,
    revealedCount: 0,
    revealedMines: 0,
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
    zeroParams()
    gGame.isOn = true
}

function reset() {
    onInit()
    zeroParams()
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
function createMines(board, firstI, firstJ) {

    for (var i = 0; i < gLevel.MINES; i++) {
        const randomI = getRandomInt(0, gLevel.SIZE - 1)
        const randomJ = getRandomInt(0, gLevel.SIZE - 1)

        if (gBoard[firstI][firstJ].isMine) continue

        if (firstI === randomI && firstJ === randomJ) continue


        if (!gMinesLocations.includes(`${randomI},${randomJ}`)) {

            gMinesLocations.push(`${randomI},${randomJ}`)

            board[randomI][randomJ] = {
                cellType: MINE,
                isRevealed: false,
                isUnrevealed: false,
                isMine: true,
                isMarked: false,
                location: `${randomI},${randomJ}`,
            }

        }
    }
}


//check if it is first click
function isFirstClick() {
    if (gGame.revealedCount !== 0) return false
    return true
}

//prints all mines locations
function printMinesLocation() {
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

        createMines(gBoard, i, j)
        setMinesNegsCount(gBoard)
    }

    if (gBoard[i][j].isRevealed) return

    if (gBoard[i][j].isMarked === true) elCell.innerText = ''

    revealCell(elCell, i, j)

    checkVictory()

}

//reveal cell
function revealCell(elCell, i, j) {
    if (gBoard[i][j].isRevealed === true) return
    if (elCell.innerText) return
    if (elCell.classList.contains('revealed')) return

    gBoard[i][j].isRevealed = true
    elCell.classList.add('revealed')

    if (gBoard[i][j].isMine === true) {
        if (gGame.lives >= 0) {
            decreaseLiveCount()
            elCell.innerText += `${MINE}`
            setTimeout(() => {
                unreavealCell(elCell, i, j)
            }, 2000);
            return
        } else {
            showAllMineCell(i, j)
            gameOver()
            return
        }

    } else {
        elCell.innerText += `${gBoard[i][j].minesAroundCount}`


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

function unreavealCell(elCell, i, j) {
    if (gBoard[i][j].isRevealed === false) return
    gBoard[i][j].isRevealed = false

    elCell.innerText = EMPTY
    elCell.classList.remove('revealed')
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

function decreaseLiveCount() {
    if (gGame.lives === 0) return

    gGame.lives--
    return document.querySelector('.lives-count span').innerText = gGame.lives
}

//DOM reveal count
function updateRevealedCount() {
    gGame.revealedCount++
    document.querySelector('.revealed-count span').innerText = gGame.revealedCount
}

function zeroParams() {
    gGame.secsPassed = 0
    gGame.revealedCount = 0
    gGame.markedCount = 0
    document.querySelector('.lives-count span').innerText = gGame.lives
    document.querySelector('.revealed-count span').innerText = gGame.revealedCount
    document.querySelector('.mark-count span').innerText = gGame.markedCount

}

function checkVictory() {
    if (gGame.lives <= 0) return false
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

