#include <iostream>
#include <vector>

const int ROWS = 6;
const int COLS = 7;
std::vector<std::vector<char>> arr(ROWS, std::vector<char>(COLS, '0'));

void printBoard() {
    for (int r = 0; r < ROWS; ++r) {
        for (int c = 0; c < COLS; ++c) {
            char endChar = (COLS - 1 == c) ? '\n' : ' ';
            std::cout << arr[r][c] << " " << endChar;
        }
    }
}

bool placeCoin(int col, char coin) {
    int row = 0;
    if (arr[row][col] != '0') {
        std::cout << "Column is full, try again\n";
        return false;
    }

    while (arr[row][col] == '0') {
        if (row + 1 == ROWS || arr[row + 1][col] != '0') {
            arr[row][col] = coin;
            break;
        }
        ++row;
    }
    return true;
}

bool checkDraw() {
    for (int r = 0; r < ROWS; ++r) {
        for (int c = 0; c < COLS; ++c) {
            if (arr[r][c] == '0') {
                return false;
            }
        }
    }
    return true;
}

bool isOutOfBounds(int row, int col) {
    return row < 0 || col < 0 || col >= COLS || row >= ROWS;
}

bool checkIsWinner(char coin) {
    for (int r = 0; r < ROWS; ++r) {
        for (int c = 0; c < COLS; ++c) {
            if (arr[r][c] == coin) {
                std::vector<std::pair<int, int>> directions = {
                    {1, 0},    // Right
                    {-1, 0},   // Left
                    {0, 1},    // Up
                    {0, -1},   // Down
                    {1, 1},    // Up-Right
                    {-1, 1},   // Up-Left
                    {1, -1},   // Down-Right
                    {-1, -1}   // Down-Left
                };

                for (const auto& [dx, dy] : directions) {
                    int newR = dx + r;
                    int newC = dy + c;
                    int foundCoins = 1;

                    for (int i = 0; i < 3; ++i) {
                        if (isOutOfBounds(newR, newC)) {
                            break;
                        }

                        if (arr[newR][newC] == coin) {
                            ++foundCoins;
                        }

                        newR += dx;
                        newC += dy;
                    }

                    if (foundCoins == 4) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}

void play() {
    char currentTurn = 'R';
    while (true) {
        while (true) {
            system("cls");
            std::cout << "It's " << currentTurn << " Turn:\n";
            int columnInput;
            while (true) {
                std::cout << "Pick a column to place the coin (0-6):\n";
                printBoard();
                std::cin >> columnInput;

                if (isOutOfBounds(1, columnInput)) {
                    std::cout << "Column is out of bounds, please try again\n";
                } else {
                    break;
                }
            }

            bool isPlaced = placeCoin(columnInput, currentTurn);
            if (isPlaced) {
                currentTurn = (currentTurn == 'Y') ? 'R' : 'Y';
                break;
            }
        }

        if (checkIsWinner('Y')) {
            system("cls");
            std::cout << "Y won the game!\n";
            printBoard();
            break;
        }

        if (checkIsWinner('R')) {
            system("cls");
            std::cout << "R won the game!\n";
            printBoard();
            break;
        }

        if (checkDraw()) {
            system("cls");
            std::cout << "DRAW!\n";
            printBoard();
            break;
        }
    }
}

int main() {
    play();
    return 0;
}
