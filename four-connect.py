import sys, os


ROWS = 6
COLS = 7
arr = [["0"] * COLS for _ in range(ROWS)]


def print_board():
    for r in range(ROWS):
        for c in range(COLS):
            end_str = "\n" if (COLS - 1) == c else ""
            print(arr[r][c] + " ", end=end_str)


def place_coin(col, coin):
    row = 0
    if arr[row][col] != "0":
        print("Column is full, try again")
        return False

    while arr[row][col] == "0":
        # place if the next row is the end or the next is one is != 0
        if row + 1 == ROWS or arr[row + 1][col] != "0":
            arr[row][col] = coin
            break
        row += 1
    return True


def check_draw():
    for r in range(ROWS):
        for c in range(COLS):
            if arr[r][c] == "0":
                return False
    return True


def is_out_of_bounds(row, col):
    return row < 0 or col < 0 or col >= COLS or row >= ROWS


def check_is_winner(coin):
    for r in range(ROWS):
        for c in range(COLS):
            if arr[r][c] == coin:
                directions = [
                    (1, 0),  # Right
                    (-1, 0),  # Left
                    (0, 1),  # Up
                    (0, -1),  # Down
                    (1, 1),  # Up-Right
                    (-1, 1),  # Up-Left
                    (1, -1),  # Down-Right
                    (-1, -1),  # Down-Left
                ]
                for dx, dy in directions:
                    newR = dx + r
                    newC = dy + c
                    found_coins = 1
                    for _ in range(3):
                        # if out of bounds, break
                        if is_out_of_bounds(newR, newC):
                            break
                        if arr[newR][newC] == coin:
                            found_coins += 1
                        newR += dx
                        newC += dy
                    if found_coins == 4:
                        return True

    return False


def play():
    current_turn = "R"
    while True:
        while True:
            os.system("cls")
            print(f"Its {current_turn} Turn:")
            column_input = ""
            while not column_input.isnumeric():
                print("pick a column to place the coin 0-5")
                print_board()
                column_input = input()
                if is_out_of_bounds(1, int(column_input)):
                    column_input = ""
                    os.system("cls")
                    print("Column is out of bounds please try again")
            column_input = int(column_input)
            is_placed = place_coin(column_input, current_turn)
            if is_placed:
                current_turn = "R" if current_turn == "Y" else "Y"
                break
        if check_is_winner("Y"):
            os.system("cls")
            print("Y won the game!")
            print_board()
            break
        if check_is_winner("R"):
            os.system("cls")
            print("R won the game!")
            print_board()
            break
        if check_draw():
            os.system("cls")
            print("DRAW!")
            print_board()
            break


play()
