document.addEventListener("DOMContentLoaded", () => {
    const playerBoard = document.getElementById("player-board");
    const enemyBoard = document.getElementById("enemy-board");
    const startGameButton = document.getElementById("start-game");
    const attackButton = document.getElementById("attack-button");
    const attackInput = document.getElementById("attack-input");
    const gameStatus = document.getElementById("game-status");

    const size = 5; // Matriz 5x5
    const shipCount = 3; // Cada jogador tem 3 barcos
    let playerGrid = createGrid(size);
    let enemyGrid = createGrid(size);
    let enemyAttacks = new Set();
    let playerShipsLeft = shipCount;
    let enemyShipsLeft = shipCount;

    function createGrid(size) {
        return Array.from({ length: size }, () => Array(size).fill(0));
    }

    function renderBoard(boardElement, grid, isEnemy = false) {
        boardElement.innerHTML = "";
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let cell = document.createElement("div");
                cell.className = "cell";
                cell.dataset.row = i;
                cell.dataset.col = j;

                if (!isEnemy) {
                    if (grid[i][j] === 1) cell.classList.add("ship");
                } else {
                    cell.addEventListener("click", () => attackEnemy(i, j));
                }

                if (grid[i][j] === 2) cell.classList.add("hit");
                if (grid[i][j] === 3) cell.classList.add("miss");

                boardElement.appendChild(cell);
            }
        }
    }

    function placeShips(grid, count) {
        let placed = 0;
        while (placed < count) {
            let row = Math.floor(Math.random() * size);
            let col = Math.floor(Math.random() * size);
            if (grid[row][col] === 0) {
                grid[row][col] = 1;
                placed++;
            }
        }
    }

    function attackEnemy(row, col) {
        if (enemyGrid[row][col] === 1) {
            gameStatus.textContent = "Você acertou um barco!";
            enemyGrid[row][col] = 2;
            enemyShipsLeft--;
        } else if (enemyGrid[row][col] === 0) {
            gameStatus.textContent = "Você errou!";
            enemyGrid[row][col] = 3;
        } else {
            gameStatus.textContent = "Você já atacou esse local!";
            return;
        }

        renderBoard(enemyBoard, enemyGrid, true);
        checkGameOver();
        enemyTurn();
    }

    function enemyTurn() {
        let row, col;
        do {
            row = Math.floor(Math.random() * size);
            col = Math.floor(Math.random() * size);
        } while (enemyAttacks.has(`${row},${col}`));

        enemyAttacks.add(`${row},${col}`);

        if (playerGrid[row][col] === 1) {
            gameStatus.textContent = "A máquina acertou um dos seus barcos!";
            playerGrid[row][col] = 2;
            playerShipsLeft--;
        } else {
            gameStatus.textContent = "A máquina errou!";
            playerGrid[row][col] = 3;
        }

        renderBoard(playerBoard, playerGrid);
        checkGameOver();
    }

    function checkGameOver() {
        if (playerShipsLeft === 0) {
            gameStatus.textContent = "Você perdeu! Todos os seus barcos foram destruídos.";
            disableGame();
        } else if (enemyShipsLeft === 0) {
            gameStatus.textContent = "Você venceu! Todos os barcos inimigos foram destruídos.";
            disableGame();
        }
    }

    function disableGame() {
        attackButton.disabled = true;
        attackInput.disabled = true;
    }

    startGameButton.addEventListener("click", () => {
        playerGrid = createGrid(size);
        enemyGrid = createGrid(size);
        enemyAttacks.clear();
        playerShipsLeft = shipCount;
        enemyShipsLeft = shipCount;
        attackButton.disabled = false;
        attackInput.disabled = false;

        for (let i = 0; i < shipCount; i++) {
            let row = prompt(`Escolha a linha para seu barco ${i+1} (0-${size-1}):`);
            let col = prompt(`Escolha a coluna para seu barco ${i+1} (0-${size-1}):`);
            playerGrid[row][col] = 1;
        }

        placeShips(enemyGrid, shipCount);
        renderBoard(playerBoard, playerGrid);
        renderBoard(enemyBoard, enemyGrid, true);
        gameStatus.textContent = "Jogo iniciado! Seu turno.";
    });

    attackButton.addEventListener("click", () => {
        let [row, col] = attackInput.value.split(",").map(Number);
        if (row >= 0 && row < size && col >= 0 && col < size) {
            attackEnemy(row, col);
        } else {
            gameStatus.textContent = "Coordenada inválida!";
        }
        attackInput.value = "";
    });
});
