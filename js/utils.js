'use strict'

//DOM
function renderBoard(mat, selector) {

    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td id="noContextMenu" class="${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j})"> </td>`
        }

        strHTML += '</tr>'
    }

    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}


function onCellMarked(elCell, i, j) {

    const noContext = document.getElementById("noContextMenu");
    noContext.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });


    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked === true) return

    gBoard[i][j].isMarked = true
    gGame.markedCount++
    elCell.innerText = MARK
}


function onCellClicked(elCell, i, j) {
console.log('click!');

    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked === true) return

    if (gBoard[i][j].cellType === CELL) revealCell(elCell, i, j)
    if (gBoard[i][j].cellType === MINE) gameOver()
    if (gBoard[i][j].cellType === MARK) unRevealCell(elCell, i, j)

}

function unRevealCell(elCell, i, j) {
    elCell.innerText = ''
    gBoard[i][j].isMarked = false
    gGame.markedCount--
}

============
function revealCell(elCell, i, j) {
    if (elCell.innerText === CELL) {
        if (gBoard[i][j].minesAroundCount) {
            // expandReveal(elCell, i, j)

            console.log('expand!');
        }
        return elCell.innerText = gBoard[i][j].minesAroundCount
    }
}

function revealAllBoard() {
    var cellDisplay = (cell.cellType === MINE) ? cell.cellType : cell.minesAroundCount

    var elCells = document.querySelectorAll('.cell')
    elCells.forEach(elCell => {
        elCell.innerText = cellDisplay
    });
}

function expandReveal(board, elCell, i, j) {

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