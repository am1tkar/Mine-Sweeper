'use strict'

    var gElTimer = document.querySelector('.game-timer span')

var gStartTime
var gTimerInterval

//DOM
function renderBoard(mat, selector) {

    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td id="noContextMenu" class="${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j})"></td>`
        }

        strHTML += '</tr>'
    }

    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML


}

function renderLevel(elBth) {

var elRestartBtn = document.querySelector(elRestartBtn)

    if (!gGame.isOn && (elRestartBtn !== NORMAL)) return

    switch (elBth.innerText) {
        case 'Beginner':
            gLevel.SIZE = 4
            gLevel.MINES = 2
            break;

        case 'Medium':
            gLevel.SIZE = 8
            gLevel.MINES = 14

            break;
        case 'Expert':
            gLevel.SIZE = 12
            gLevel.MINES = 32
            break;
    }
    onInit()
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




function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function showElement(selector) {
    var el = document.querySelector(selector)
    el.classList.remove('hide')

}

function hideElement(selector) {
    var el = document.querySelector(selector)
    el.classList.add('hide')

}

function playSound(snd) {
    var audio = new Audio(`snd/${snd}.mp3`);
    audio.play()
}

function startTimer() {
    gStartTime = Date.now()
    gTimerInterval = setInterval(updateTimer, 100)
}

function updateTimer() {
    var now = Date.now()
    var diff = (now - gStartTime) / 1000
    gElTimer.innerText = diff.toFixed(3)
}

function stopTimer() {
    clearInterval(gTimerInterval)
}
