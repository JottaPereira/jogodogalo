const statusDisplay = document.querySelector('.game--status');
const restartButton = document.querySelector('.game--restart');

let gameActive = true;
let players = [
    {value: "X", name:"você"},
    {value: "O", name: "bot"}  
]
let firstPlayer = 0;
let currentPlayer = firstPlayer;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `${players[currentPlayer].name} ganhou`;
const drawMessage = () => `Empatado`;
const currentPlayerTurn = () => `${players[currentPlayer].name} a jogar`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = players[currentPlayer].name;
    clickedCell.innerHTML = players[currentPlayer].value;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        restartButton.style.display = "inline-block";
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        restartButton.style.display = "inline-block";
        return;
    }

    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    firstPlayer = firstPlayer === 0 ? 1 : 0; 
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    restartButton.style.display = "none";
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);