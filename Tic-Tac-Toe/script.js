let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function makeMove(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        document.getElementsByClassName('cell')[index].textContent = currentPlayer;
        document.getElementsByClassName('cell')[index].classList.add(currentPlayer === 'X' ? 'text-blue-600' : 'text-red-600');

        if (checkWin()) {
            document.getElementById('status').textContent = `Player ${currentPlayer} Wins!`;
            document.getElementById('status').classList.add('text-green-600', 'font-bold');
            gameActive = false;
            return;
        }

        if (checkDraw()) {
            document.getElementById('status').textContent = "It's a Draw!";
            document.getElementById('status').classList.add('text-yellow-600', 'font-bold');
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById('status').textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => gameBoard[index] === currentPlayer);
    });
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    document.getElementById('status').textContent = "Player X's Turn";
    document.getElementById('status').classList.remove('text-green-600', 'text-yellow-600', 'font-bold');
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = '';
        cells[i].classList.remove('text-blue-600', 'text-red-600');
    }
}