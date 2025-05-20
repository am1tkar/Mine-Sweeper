'use strict'

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
    return Math.floor(Math.random() * (max - min + 1)) + min
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