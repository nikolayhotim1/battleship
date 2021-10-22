'use strict';
let view = {
    displayMessage: function (msg) {
        let messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },

    displayHit: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');
    },

    displayMiss: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute('class', 'miss');
    }
};

let model = {
    boardSize: 7,
    numShips: 4,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{ locations: [0, 0, 0], hits: ['', '', ''], border: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { locations: [0, 0, 0], hits: ['', '', ''], border: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { locations: [0, 0, 0], hits: ['', '', ''], border: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { locations: [0, 0, 0], hits: ['', '', ''], border: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],

    generateShipLocations: function () {
        let area;

        for (let i = 0; i < this.numShips; i++) {
            do {
                area = this.generateShip();
            } while (this.collision(area));

            this.ships[i].locations = area[0];
            this.ships[i].border = area[1];
        }
    },

    generateShip: function () {
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocations = [];
        let newShipBorder = [];
        let newShipArea = [newShipLocations, newShipBorder];

        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (col + i));

                if (i === 0) {
                    newShipBorder.push(row + '' + ((col + i) - 1));
                    newShipBorder.push((row + 1 + '') + (col + i));
                    newShipBorder.push((row + 1 + '') + ((col + i) - 1));
                    newShipBorder.push((row - 1 + '') + (col + i));
                    newShipBorder.push((row -1 + '') + ((col + i) - 1));
                } else if (i === this.shipLength - 1) {
                    newShipBorder.push(row + '' + ((col + i) + 1));
                    newShipBorder.push((row + 1 + '') + (col + i));
                    newShipBorder.push((row + 1 + '') + ((col + i) + 1));
                    newShipBorder.push((row - 1 + '') + (col + i));
                    newShipBorder.push((row - 1 + '') + ((col + i) + 1));
                } else {
                    newShipBorder.push((row + 1 + '') + (col + i));
                    newShipBorder.push((row - 1 + '') + (col + i));
                }
            } else {
                newShipLocations.push((row + i) + '' + col);

                if (i === 0) {
                    newShipBorder.push((((row + i) - 1) + '') + col);
                    newShipBorder.push(((row + i) + '') + (col + 1));
                    newShipBorder.push((((row + i) - 1) + '') + (col + 1));
                    newShipBorder.push(((row + i) + '') + (col - 1));
                    newShipBorder.push((((row + i) - 1) + '') + (col - 1));
                } else if (i === this.shipLength - 1) {
                    newShipBorder.push((((row + i) + 1) + '') + col);
                    newShipBorder.push(((row + i) + '') + (col + 1));
                    newShipBorder.push((((row + i) + 1) + '') + (col + 1));
                    newShipBorder.push(((row + i) + '') + (col - 1));
                    newShipBorder.push((((row + i) + 1) + '') + (col - 1));
                } else {
                    newShipBorder.push(((row + i) + '') + (col + 1));
                    newShipBorder.push(((row + i) + '') + (col - 1));
                }
            }
        }

        return newShipArea;
    },

    collision: function (area) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i];

            for (let j = 0; j < area[0].length; j++) {
                if (ship.locations.indexOf(area[0][j]) >= 0 ||
                    ship.border.indexOf(area[0][j]) >= 0) {
                    return true;
                }
            }
        }

        return false;
    },

    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);

            if (index >= 0 && ship.hits[index] !== 'hit') {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!');

                if (this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship!');
                    this.shipsSunk++;
                }

                return true;
            } else if (index >= 0 && ship.hits[index] === 'hit' && !this.isSunk(ship)) {
                view.displayMessage('You\'ve hits this area of the ship before!');
                return false;
            } else if (index >= 0 && ship.hits[index] === 'hit' && this.isSunk(ship)) {
                view.displayMessage('You\'ve sunk this ship before!');
                return false;
            }
        }

        view.displayMiss(guess);
        view.displayMessage('You missed.');
        return false;
    },

    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }

        return true;
    }
};

let controller = {
    guesses: 0,

    processGuess: function (guess) {
        let location = parseGuess(guess);

        if (location) {
            this.guesses++;
            let hit = model.fire(location);

            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage('You sank all my battleships, in ' +
                    this.guesses + ' guesses');
            }
        }
    }
};

function parseGuess(guess) {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    if (guess === null || guess.length !== 2) {
        alert('Oops, please enter a letter and a number on the board.');
    } else {
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert(`Oops, that isn't on the board.`);
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert(`Oops, that's off the board!`);
        } else {
            return row + column;
        }
    }

    return null;
}

function init() {
    let fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;

    let guessInput = document.getElementById('guessInput');
    guessInput.onkeydown = handleKeyPress;

    model.generateShipLocations();
}

window.onload = init;

function handleKeyPress(e) {
    let fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function handleFireButton() {
    let guessInput = document.getElementById('guessInput');
    let guess = guessInput.value;

    controller.processGuess(guess);
    guessInput.value = '';
}
