document.addEventListener("DOMContentLoaded", () => {
    const playerBoard = document.getElementById("player-board");
    const enemyBoard = document.getElementById("enemy-board");
    const startGameButton = document.getElementById("start-game");
    const attackButton = document.getElementById("attack-button");
    const attackInput = document.getElementById("attack-input");
    const gameStatus = document.getElementById("game-status");

    const size = 5; // Matriz 5x5
    let playerGrid = createGrid(size);
    let enemyGrid = createGrid(size);
    let enemyAttacks = new Set();
    let playerShip = null;
    let enemyShip = null;
    let gameStarted = false;

    function createGrid(size) {
        return Array.from({ length: size }, () => Array(size).fill(0));
    }

    function placeRandomShip() {
        let row, col;
        do {
            row = Math.floor(Math.random() * size);
            col = Math.floor(Math.random() * size);
        } while (row === playerShip?.row && col === playerShip?.col);
        return { row, col };
    }

    function renderBoard(boardElement, grid, isEnemy = false) {
        boardElement.innerHTML = "";
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let cell = document.createElement("div");
                cell.className = "cell";
                cell.dataset.row = i;
                cell.dataset.col = j;

                if (!isEnemy && playerShip && i === playerShip.row && j === playerShip.col) {
                    cell.classList.add("ship");
                }

                if (isEnemy) {
                    cell.addEventListener("click", () => attackEnemy(i, j));
                }

                if (grid[i][j] === 2) cell.classList.add("hit");
                if (grid[i][j] === 3) cell.classList.add("miss");

                boardElement.appendChild(cell);
            }
        }
    }

    function attackEnemy(row, col) {
        if (!gameStarted) return;

        if (row === enemyShip.row && col === enemyShip.col) {
            gameStatus.textContent = "🎯 Você acertou o barco inimigo! VITÓRIA!";
            enemyGrid[row][col] = 2;
            renderBoard(enemyBoard, enemyGrid, true);
            disableGame();
        } else {
            gameStatus.textContent = "❌ Você errou!";
            enemyGrid[row][col] = 3;
            renderBoard(enemyBoard, enemyGrid, true);
            setTimeout(enemyTurn, 1000);
        }
    }

    function enemyTurn() {
        let row, col;
        do {
            row = Math.floor(Math.random() * size);
            col = Math.floor(Math.random() * size);
        } while (enemyAttacks.has(`${row},${col}`));

        enemyAttacks.add(`${row},${col}`);

        if (playerShip && row === playerShip.row && col === playerShip.col) {
            gameStatus.textContent = "💥 A máquina acertou seu barco! DERROTA!";
            playerGrid[row][col] = 2;
            renderBoard(playerBoard, playerGrid);
            disableGame();
        } else {
            gameStatus.textContent = "🚀 A máquina errou!";
            playerGrid[row][col] = 3;
            renderBoard(playerBoard, playerGrid);
        }
    }

    function disableGame() {
        attackButton.disabled = true;
        attackInput.disabled = true;
    }

    playerBoard.addEventListener("click", (event) => {
        if (playerShip) return;

        const cell = event.target;
        if (!cell.classList.contains("cell")) return;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        playerShip = { row, col };
        cell.classList.add("ship");

        gameStatus.textContent = "🔄 Aguardando a máquina posicionar o barco...";
        setTimeout(() => {
            enemyShip = placeRandomShip();
            gameStatus.textContent = "✅ Máquina posicionou o barco! Clique em 'Iniciar Jogo'";
            startGameButton.disabled = false;
        }, 1000);
    });

    startGameButton.addEventListener("click", () => {
        if (!playerShip || !enemyShip) return;

        gameStarted = true;
        startGameButton.disabled = true;
        attackButton.disabled = false;
        attackInput.disabled = false;
        gameStatus.textContent = "🔥 Jogo iniciado! Seu turno.";
        renderBoard(enemyBoard, enemyGrid, true);
    });

    attackButton.addEventListener("click", () => {
        let [row, col] = attackInput.value.split(",").map(Number);
        if (row >= 0 && row < size && col >= 0 && col < size) {
            attackEnemy(row, col);
        } else {
            gameStatus.textContent = "⚠️ Coordenada inválida!";
        }
        attackInput.value = "";
    });

    renderBoard(playerBoard, playerGrid);
});
