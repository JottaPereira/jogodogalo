//DOM
const statusDisplay = document.querySelector('.game--status');
const restartButton = document.querySelector('.game--restart');

//variables
let gameActive = true;
let players = [
    {value: "X", name:"You"},
    {value: "O", name: "Computer"}  
]
let firstPlayer = 0;
let currentPlayer = firstPlayer;
let gameState = ["", "", "", "", "", "", "", "", ""];
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
const bot_playing_time = 800 // (ms)


//algortim to return the next move
function Algoritm(){
    let wining = false;
    let losing = false;
    //check for bot or user winnig
    for(wining_position of winningConditions){
        //check if two is checked by the bot
        //check if two is checked by the user
        let user_ative_cells = []
        let bot_ative_cells = []
        for(i=0; i<4; i++){
            if(gameState[wining_position[i]] ===  'X') user_ative_cells.push(wining_position[i])
            if(gameState[wining_position[i]] ===  'O') bot_ative_cells.push(wining_position[i])
        }
        let bot_rest = wining_position.filter(n => !bot_ative_cells.includes(n)) || false
        let user_rest = wining_position.filter(n => !user_ative_cells.includes(n)) || false
        //subtract arrays if user is to win or bot is to win
        if(bot_ative_cells.length === 2 && gameState[bot_rest[0]] === "") wining = bot_rest
        if(user_ative_cells.length === 2 && gameState[user_rest[0]] === "") losing = user_rest
    }
    if(wining) return wining
    if(losing) return losing

    //create two in line
        //horizontal read
        for(i=0; i<9; i=i+3){
            console.log("loopy!")
            if(gameState[i+1] === "O"){
                if(gameState[i+2] === "") return i+2
                if(gameState[i] === "") return i
            }else if((gameState[i]==="0" || gameState[i+2]==="O") && gameState[i]==="") return i+1
        }
        //vertical read
        for(i=0; i<3; i++){
            if(gameState[i+3] === "O"){
                if(gameState[i] === "") return i
                if(gameState[i+6] === "") return i
            }else if((gameState[i]==="0" || gameState[i+6]==="O") && gameState[i]==="") return i+3
        }
        //horizontal read
        if(gameState[4] === "O"){
            if(gameState[0] === "") return 0
            if(gameState[8] === "") return 8
            if(gameState[2] === "") return 2
            if(gameState[6] === "") return 6
        }else if((gameState[0]==="0" || gameState[8]==="O") && gameState[4]==="") return 4
    

    //play in the middle
    if(gameState[4]==="") return 4

    //ver cantos
    if(gameState[0]==="X" && gameState[8]==="") return 8
    if(gameState[0]==="" && gameState[8]==="X") return 0
    if(gameState[2]==="X" && gameState[6]==="") return 6
    if(gameState[2]==="" && gameState[6]==="X") return 2

    //ocupar um canto livre
    if(gameState[0]==="") return 0
    if(gameState[2]==="") return 2
    if(gameState[6]==="") return 6
    if(gameState[8]==="") return 8

    //ocupar um espaço livre
    for(i=0; i<9; i++) if(gameState[i]==="") return i 
}

//display messages
const winningMessage = () => players[currentPlayer].value === 'O' ?  `&#128532 You Lose` : `&#128551 You Win. Congradulations!`;
const drawMessage = () => `&#128527 Tie`;
const currentPlayerTurn = () => `${players[currentPlayer].name} playing`;

statusDisplay.innerHTML = currentPlayerTurn();

//game functions
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = players[currentPlayer].value;
    clickedCell.innerHTML = players[currentPlayer].value;
}
function handlePlayerChange() {
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    statusDisplay.innerHTML = currentPlayerTurn();
    
    //bot a jogar
    if(currentPlayer === 1){
        gameActive = false;
        let nextMove = Algoritm()
        setTimeout(()=>{
            gameActive = true;
            document.querySelector('.game--container').children[nextMove].click()
        }, bot_playing_time)
    }
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
    //firstPlayer = firstPlayer === 0 ? 1 : 0;
    firstPlayer = 0
    currentPlayer = firstPlayer; 
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    restartButton.style.display = "none";
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);


