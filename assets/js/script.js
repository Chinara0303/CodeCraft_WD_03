const cells = document.querySelectorAll(".cell");
const reset = document.getElementById("reset");
const statusText = document.getElementById('status');
const players = document.querySelectorAll('.player');
const winningCombinations = [
    [
        0, 1, 2
    ],
    [
        3, 4, 5
    ],
    [
        6, 7, 8
    ],
    [
        0, 3, 6
    ],
    [
        1, 4, 7
    ],
    [
        2, 5, 8
    ],
    [
        0, 4, 8
    ],
    [
        2, 4, 6
    ]
];
let currentPlayer = "";
let otherPlayer = "";
let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];
let isGameStarted = false;
const yesAnswer = document.querySelector('.yes-answer')
const noAnswer = document.querySelector('.no-answer');
const answers = document.querySelectorAll(".answer")
let isAi = false;

// Event listener for selecting players
// function selectPlayer() {
//     if (isGameStarted)  return;

//     else{
//         answers.forEach((answer)=>{
//             answer.addEventListener("click",function(){
//                 answers.forEach(a => a.classList.remove("selected-answer"))
//                 answer.classList.add("selected-answer")
//                 isGameStarted = true;

//             })
//         })
    
//         noAnswer.addEventListener('click', function () {
//             isAi = true;
//         })
    
//         yesAnswer.addEventListener("click", function () {
//             isAi = false;
//         })

//         players.forEach((player) => {
//             player.addEventListener("click", function () {
    
//                 players.forEach(p => p.classList.remove("selected-player"))
    
//                 player.classList.add("selected-player");
//                 currentPlayer = player.textContent;
//                 isGameStarted = true;
//             });
//         });
//     }
  

// }
function selectPlayer() {
    if (isGameStarted) return;

    answers.forEach((answer) => {
        answer.addEventListener("click", function () {
            if (isGameStarted) return; 
            answers.forEach((a) => a.classList.remove("selected-answer"));
            answer.classList.add("selected-answer");

            if (answer === noAnswer) {
                isAi = true;
            } else if (answer === yesAnswer) {
                isAi = false;
            }
        });
    });

    players.forEach((player) => {
        player.addEventListener("click", function () {
            if (isGameStarted || !isAnswerSelected()) return; 
            players.forEach((p) => p.classList.remove("selected-player"));

            player.classList.add("selected-player");
            currentPlayer = player.textContent;
            isGameStarted = true;

            disableSelection();
        });
    });
}

function disableSelection() {
    answers.forEach((answer) => (answer.style.pointerEvents = "none"));
    players.forEach((player) => (player.style.pointerEvents = "none"));
}

function enableSelection() {
    answers.forEach((answer) => (answer.style.pointerEvents = "auto"));
    players.forEach((player) => (player.style.pointerEvents = "auto"));
}

function isAnswerSelected() {
    return Array.from(answers).some((answer) =>
        answer.classList.contains("selected-answer")
    );
}

selectPlayer();

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
});


function handleCellClick(cell, index) {
    if (board[index] !== "" || !isGameStarted) 
        return;

    if (isAi) {
        players.forEach(player => {
            if (player.classList.contains("selected-player")) {
                currentPlayer = player.textContent
            }
        })
        setTimeout(aiMove, 1000);
    }


    if (currentPlayer != "" || !isAi) {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;

        if (checkWinner()) {
            statusText.textContent = `Winner: ${currentPlayer}`;
            launchConfetti();
            return;
        }

        if (board.every(val => val !== "")) {
            statusText.textContent = "It's a draw!";
            return;
        }
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Turn: ${currentPlayer}`;


    }
}

function aiMove() {
    if (!isGameStarted) 
        return;
    


    players.forEach(player => {
        if (!player.classList.contains("selected-player")) {
            currentPlayer = player.textContent
        }
    })

    let move = findBestMove(currentPlayer);
    board[move] = currentPlayer;
    cells[move].textContent = currentPlayer;


    if (checkWinner()) {
        statusText.textContent = `Winner: ${currentPlayer}`;
        launchConfetti();
        return;
    }

    if (board.every(val => val !== "")) {
        statusText.textContent = "It's a draw!";
        return;
    }

    statusText.textContent = `Turn: ${currentPlayer}`;
}

function checkWinner() {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === currentPlayer);
    });
}


function findBestMove(currentPlayer) { // Check if there's a winning move for the current player
    for (let [a, b, c] of winningCombinations) {
        if (board[a] === currentPlayer && board[b] === currentPlayer && board[c] === "") 
            return c;
        


        if (board[a] === currentPlayer && board[c] === currentPlayer && board[b] === "") 
            return b;
        


        if (board[b] === currentPlayer && board[c] === currentPlayer && board[a] === "") 
            return a;
        


    }


    // If no winning or blocking move, choose a random available move
    let availableMoves = board.map((val, index) => (val === "" ? index : null)).filter(val => val !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}


reset.addEventListener("click", resetGame)
function resetGame() {
    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];
    cells.forEach(cell => cell.textContent = "");
    players.forEach(player => player.classList.remove("selected-player"));
    answers.forEach(a=>a.classList.remove("selected-answer"));
    statusText.textContent = ""
    isGameStarted = false;
    enableSelection();
}

function launchConfetti() {
    confetti({
        particleCount: 2000,
        spread: 70,
        decay: 0.95,
        origin: {
            x: 0.5,
            y: 1
        }
    });
}
