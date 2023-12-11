const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

let distance = 0;
let map = [];
let lineNumber = 0;
let startingPos = {row: 0, col: 0};
let currentPos = {row: 0, col: 0};
let previousPos = undefined;

file.on('line', (line) => {
  const tokens = line.split('');
  map.push(tokens);
  for(let i=0; i<tokens.length; i++) {
    if(tokens[i] === 'S') {
      startingPos.row = lineNumber;
      startingPos.col = i;
      currentPos.row = lineNumber;
      currentPos.col = i;
      // I looked at the input and know the S is actually a |, so just replace it
      map[startingPos.row][startingPos.col] = '|';
    }
  }
  lineNumber++;
});

file.on('close', () => {
  let backAtStart = false;
  do {

    const pipe = map[currentPos.row][currentPos.col];

    const copyOfCurrentPos = {...currentPos};

    if(pipe === 'F' && (previousPos === undefined || previousPos.row === currentPos.row)) {
      // Go down
      currentPos.row++;
    } else if(pipe === 'F') {
      // Go right
      currentPos.col++;
    } else if(pipe === '|' && (previousPos === undefined || previousPos.row === currentPos.row - 1)) {
      // Go down
      currentPos.row++;
    } else if (pipe === '|') {
      // Go up
      currentPos.row--;
    } else if(pipe === '7' && (previousPos === undefined || previousPos.row === currentPos.row)) {
      // Go down
      currentPos.row++;
    } else if(pipe === '7') {
      // Go left
      currentPos.col--;
    } else if(pipe === 'L' && (previousPos === undefined || previousPos.row === currentPos.row)) {
      // Go up
      currentPos.row--;
    } else if(pipe === 'L') {
      // Go right
      currentPos.col++;
    } else if(pipe === 'J' && (previousPos === undefined || previousPos.row === currentPos.row)) {
      // Go up
      currentPos.row--;
    } else if(pipe === 'J') {
      // Go left
      currentPos.col--;
    } else if(pipe === '-' && (previousPos === undefined || previousPos.col === currentPos.col - 1)) {
      // Go right
      currentPos.col++;
    } else if (pipe === '-') {
      // Go left
      currentPos.col--;
    }

    previousPos = {...copyOfCurrentPos};
    distance++;

    if(currentPos.row === startingPos.row && currentPos.col === startingPos.col) {
      backAtStart = true;
    }
  } while (!backAtStart);

  console.log(distance / 2);
});