'usestrict';
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
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{ locations: ['06', '16', '26'], hits: ['', '', ''] },
    { locations: ['24', '34', '44'], hits: ['', '', ''] },
    { locations: ['10', '11', '12'], hits: ['', '', ''] }]
};

// let ships = [{ locations: ["31", "41", "51"], hits: ["", "", ""] },
// { locations: ["14", "24", "34"], hits: ["", "hit", ""] },
// { locations: ["00", "01", "02"], hits: ["hit", "", ""] }];

// Какие корабли уже были «подстрелены»? 2-й и 3-й 
// В каких позициях ? '24' (C4) и '00' (A0)
// Игрок стреляет по клетке "D4", попадет ли он в корабль ? да 
// Если да, то в какой ? во 2-й ('34')
// Игрок стреляет по клетке "B3", попадет ли он в корабль ? нет 
// Если да, то в какой ? -
// Допишите следующий код, чтобы он определял позицию средней клетки корабля 
// и выводил ее методом console.log:
// var ship2 = ships[1];
// var locations = ship2.locations;
// console.log("Location is " + locations[1]); // '24'
// Допишите следующий код, чтобы он определял, было ли попадание в первой 
// клетке третьего корабля:
// var ship3 = ships[2];
// var hits = ship3.hits[0];
// if (hits === "hit") {
//     console.log("Ouch, hit on third ship at location one");
// }
// Допишите следующий код, чтобы он записывал попадание в третью клетку 
// первого корабля:
// var ship1 = ships[0];
// var hits = ship1.hits;
// hits[2] = 'hit';

// view.displayMiss('00');
// view.displayHit('34');
// view.displayMiss('55');
// view.displayHit('12');
// view.displayMiss('25');
// view.displayHit('26');
// view.displayMessage('Tap tap, is this thing on?');
