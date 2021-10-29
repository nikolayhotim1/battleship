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
    shipsSunk: 0,

    ships: [{ locations: new Array(3), hits: [], border: [] },
    { locations: new Array(3), hits: [], border: [] },
    { locations: new Array(2), hits: [], border: [] },
    { locations: new Array(2), hits: [], border: [] },
    { locations: new Array(2), hits: [], border: [] },
    { locations: new Array(1), hits: [], border: [] },
    { locations: new Array(1), hits: [], border: [] },
    { locations: new Array(1), hits: [], border: [] }],

    numShips: function () {
        return this.ships.length;
    },

    shipLength: function (index) {
        return this.ships[index].locations.length;
    },

    generateShipLocations: function () {
        let newShip;

        for (let i = 0; i < this.numShips(); i++) {
            do {
                newShip = this.generateShip(i);
            } while (this.collision(newShip));

            this.ships[i].locations = newShip.locations;
            this.ships[i].border = newShip.border;
        }
    },

    generateShip: function (index) {
        let direction = Math.floor(Math.random() * 2);
        let row, col;
        let newShip = { locations: [], border: [] };

        if (this.shipLength(index) === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * this.boardSize);
        } else if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength(index)));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength(index)));
            col = Math.floor(Math.random() * this.boardSize);
        }

        for (let i = 0; i < this.shipLength(index); i++) {
            if (this.shipLength(index) === 1) {
                newShip.locations.push(row + '' + (col + i));
                newShip.border.push(row + '' + (col + i - 1));
                newShip.border.push(row + '' + (col + i + 1));
                newShip.border.push(row + 1 + '' + (col + i));
                newShip.border.push(row + 1 + '' + (col + i - 1));
                newShip.border.push(row + 1 + '' + (col + i + 1));
                newShip.border.push(row - 1 + '' + (col + i));
                newShip.border.push(row - 1 + '' + (col + i - 1));
                newShip.border.push(row - 1 + '' + (col + i + 1));
            } else if (direction === 1) {
                newShip.locations.push(row + '' + (col + i));

                if (i === 0) {
                    newShip.border.push(row + '' + (col + i - 1));
                    newShip.border.push(row + 1 + '' + (col + i));
                    newShip.border.push(row + 1 + '' + (col + i - 1));
                    newShip.border.push(row - 1 + '' + (col + i));
                    newShip.border.push(row - 1 + '' + (col + i - 1));
                } else if (i === this.shipLength(index) - 1) {
                    newShip.border.push(row + '' + (col + i + 1));
                    newShip.border.push(row + 1 + '' + (col + i));
                    newShip.border.push(row + 1 + '' + (col + i + 1));
                    newShip.border.push(row - 1 + '' + (col + i));
                    newShip.border.push(row - 1 + '' + (col + i + 1));
                } else {
                    newShip.border.push(row + 1 + '' + (col + i));
                    newShip.border.push(row - 1 + '' + (col + i));
                }
            } else {
                newShip.locations.push(row + i + '' + col);

                if (i === 0) {
                    newShip.border.push(row + i - 1 + '' + col);
                    newShip.border.push(row + i + '' + (col + 1));
                    newShip.border.push(row + i - 1 + '' + (col + 1));
                    newShip.border.push(row + i + '' + (col - 1));
                    newShip.border.push(row + i - 1 + '' + (col - 1));
                } else if (i === this.shipLength(index) - 1) {
                    newShip.border.push(row + i + 1 + '' + col);
                    newShip.border.push(row + i + '' + (col + 1));
                    newShip.border.push(row + i + 1 + '' + (col + 1));
                    newShip.border.push(row + i + '' + (col - 1));
                    newShip.border.push(row + i + 1 + '' + (col - 1));
                } else {
                    newShip.border.push(row + i + '' + (col + 1));
                    newShip.border.push(row + i + '' + (col - 1));
                }
            }
        }

        return newShip;
    },

    collision: function (newShip) {
        for (let i = 0; i < this.numShips(); i++) {
            let ship = model.ships[i];

            for (let j = 0; j < newShip.locations.length; j++) {
                if (ship.locations.indexOf(newShip.locations[j]) >= 0 ||
                    ship.border.indexOf(newShip.locations[j]) >= 0) {
                    return true;
                }
            }
        }

        return false;
    },

    fire: function (guess) {
        for (let i = 0; i < this.numShips(); i++) {
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
            } else if (index >= 0 && ship.hits[index] === 'hit') {
                view.displayMessage('You\'ve hits this area of the ship before.');

                if (this.isSunk(ship)) {
                    view.displayMessage('You\'ve sunk this ship before.');
                }

                return false;
            }
        }

        view.displayMiss(guess);
        view.displayMessage('You missed.');
        return false;
    },

    isSunk: function (ship) {
        for (let i = 0; i < ship.locations.length; i++) {
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

            if (hit && model.shipsSunk === model.numShips()) {
                view.displayMessage('You sank all my battleships in ' +
                    this.guesses + ' guesses!');
            }
        }
    }
};

function parseGuess(guess) {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    if (guess === null || guess.length !== 2) {
        alert('Oops, please enter a letter and a number on the board.');
    } else {
        let firstChar = guess.charAt(0).toUpperCase();
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
    let guessInput = document.getElementById('guessInput');
    guessInput.onkeydown = handleKeyPress;

    let fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;

    model.generateShipLocations();
}

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
    guessInput.focus();
}

window.onload = init;
