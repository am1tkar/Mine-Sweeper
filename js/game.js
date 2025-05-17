'use strict'

const WALL = '🧱'
const FOOD = '🔹'
const SUPERFOOD = '💫'
const CHERRY = '🍒'
const EMPTY = ' '
var gCountFood = 0
var gBoard
var gEmptyCells = []

const gGame = {
    score: 0,
    isOn: false
}


function init() {
    gGhosts = []
    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)
    hideElement('.game-over')
    renderBoard(gBoard, '.board-container')
    setInterval(() => { placeCherry() }, 15000);
    gGame.isOn = true
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            }

            if (i === 1 && j === 1 ||
                i === size - 2 && j === size - 2 ||
                i === size - 2 && j === 1 ||
                i === 1 && j === size - 2) {
                board[i][j] = SUPERFOOD
            }
        }
    }
    return board
}

function updateScore(diff) {
    // TODO: update model 
    gGame.score += diff
    console.log(gGame.score);


    // TODO: update dom
    const elScore = document.querySelector('.score span')
    elScore.innerText = gGame.score
}


function countFood() {
    gCountFood = 0 //because we don't want to sum all existing food from the last step withing th current
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j] === FOOD) gCountFood++
        }
    }
    return gCountFood
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




function placeCherry() {
    const emptyCells = getEmptyCells()
    if (!emptyCells.length) return

    const randIdx = getRandomIntInclusive(0, emptyCells.length - 1)

    const randCherryLocation = emptyCells[randIdx]
    if (!randCherryLocation) return

    gBoard[randCherryLocation.i][randCherryLocation.j] = CHERRY
    renderCell(randCherryLocation, CHERRY)
}



function getEmptyCells() {
    var emptyCells = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] === EMPTY) {
                emptyCells.push({ i, j })
            }
        }
    }

    return emptyCells
}
