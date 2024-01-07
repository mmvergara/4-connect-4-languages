const ROWS = 6;
const COLS = 7;
const arr = Array.from({ length: ROWS }, () => Array(COLS).fill("0"));

function printBoard() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const endStr = COLS - 1 === c ? "\n" : "";
      process.stdout.write(arr[r][c] + " " + endStr);
    }
  }
}

function placeCoin(col, coin) {
  let row = 0;
  if (arr[row][col] !== "0") {
    console.log("Column is full, try again");
    return false;
  }

  while (arr[row][col] === "0") {
    if (row + 1 === ROWS || arr[row + 1][col] !== "0") {
      arr[row][col] = coin;
      break;
    }
    row++;
  }
  return true;
}

function checkDraw() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (arr[r][c] === "0") {
        return false;
      }
    }
  }
  return true;
}

function isOutOfBounds(row, col) {
  return row < 0 || col < 0 || col >= COLS || row >= ROWS;
}

function checkIsWinner(coin) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (arr[r][c] === coin) {
        const directions = [
          [1, 0], // Right
          [-1, 0], // Left
          [0, 1], // Up
          [0, -1], // Down
          [1, 1], // Up-Right
          [-1, 1], // Up-Left
          [1, -1], // Down-Right
          [-1, -1], // Down-Left
        ];

        for (const [dx, dy] of directions) {
          let newR = dx + r;
          let newC = dy + c;
          let foundCoins = 1;

          for (let i = 0; i < 3; i++) {
            if (isOutOfBounds(newR, newC)) {
              break;
            }

            if (arr[newR][newC] === coin) {
              foundCoins++;
            }

            newR += dx;
            newC += dy;
          }

          if (foundCoins === 4) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function play() {
  let currentTurn = "R";
  while (true) {
    console.clear();
    console.log(`It's ${currentTurn} Turn:`);
    printBoard()

    let columnInput = await getColumnInput();

    while (!columnInput.match(/^\d+$/) || isOutOfBounds(1, parseInt(columnInput))) {
      console.log("Invalid input. Pick a column to place the coin (0-6):");
      printBoard();
      columnInput = await getColumnInput();
    }

    const column = parseInt(columnInput);
    const isPlaced = placeCoin(column, currentTurn);

    if (isPlaced) {
      currentTurn = currentTurn === "Y" ? "R" : "Y";
    }

    if (checkIsWinner("Y")) {
      console.clear();
      console.log("Y won the game!");
      printBoard();
      break;
    }

    if (checkIsWinner("R")) {
      console.clear();
      console.log("R won the game!");
      printBoard();
      break;
    }

    if (checkDraw()) {
      console.clear();
      console.log("DRAW!");
      printBoard();
      break;
    }
  }

  rl.close(); // Close the readline interface when the game ends
}

async function getColumnInput() {
  return new Promise((resolve) => {
    rl.question("Pick a column to place the coin (0-6): ", (input) => {
      resolve(input);
    });
  });
}

play();