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
let mainLoop = [];

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
    mainLoop.push({...currentPos});

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

  // Scan the map and replace any squares that aren't part of main loop with .
  for(let i=0; i<map.length; i++) {
    for(let j=0; j<map[0].length; j++) {
      let partOfMainLoop = false;
      for(let k=0; k<mainLoop.length; k++) {
        if(mainLoop[k].row === i && mainLoop[k].col === j) {
          partOfMainLoop = true;
          break;
        }
      }
      if(!partOfMainLoop) {
        map[i][j] = '.';
      }
    }
  }

  // Surround the map with ground (O means it's outside, . means we haven't determined yet, I means inside)
  for(let i=0; i<map.length; i++) {
    map[i].unshift('O');
    map[i].push('O');
  }
  map.unshift(Array(map[0].length).fill('O'));
  map.push(Array(map[0].length).fill('O'));



  // Blow up the rows in the map so that there are gaps between parallel horizontal pipes
  const newRowsMap = [];
  newRowsMap.push(map[0]);
  for(let i=1; i<map.length-1; i ++) {
    newRowsMap.push(map[i]);
    const extraRow = [];
    extraRow.push('O');
    for(let j=1; j<map[0].length-1; j++) {
      const squareBeingConsidered = map[i][j];
      if(squareBeingConsidered === '7' || squareBeingConsidered === 'F' || squareBeingConsidered === '|') {
        extraRow.push('|');
      } else {
        extraRow.push('X');
      }
    }
    extraRow.push('O');
    newRowsMap.push(extraRow);
  }
  newRowsMap.push(map[map.length-1]);

  // Blow up the columns in the map so that there are gaps between parallel vertical pipes
  const newMap = [];
  for(let i=0; i<newRowsMap.length; i++) {
    const newRow = [];
    for(let j=0; j<newRowsMap[0].length; j++) {
      const squareBeingConsidered = newRowsMap[i][j];
      newRow.push(squareBeingConsidered);
      if(squareBeingConsidered === 'O') {
        newRow.push('O');
      } else if(squareBeingConsidered === '.' || squareBeingConsidered === 'X' || squareBeingConsidered === '|' || squareBeingConsidered === 'J' || squareBeingConsidered === '7') {
        newRow.push('X');
      } else {
        newRow.push('-');
      }
    }
    newMap.push(newRow);
  }

  map = newMap;

  let insideCount = 0;
  let newCount = 0;
  do {
    insideCount = newCount;
    newCount = 0;
    // Start in the top left and mark any ground we can reach with an O
    for(let i=1; i<map.length-1; i++) {
      for(let j=1; j<map[0].length-1; j++) {
        const squareBeingConsidered = map[i][j];
        if(squareBeingConsidered === '.' || squareBeingConsidered === 'X') {
          const toLeft = map[i][j-1];
          const toRight = map[i][j+1];
          const above = map[i-1][j];
          const below = map[i+1][j];
          if(toLeft === 'O' || toRight === 'O' || above === 'O' || below === 'O') {
            map[i][j] = 'O';
          }
        }
      }
    }

    // Start in bottom right and mark any ground we can reach with an O
    for(let i=map.length-1; i>0; i--) {
      for(let j=map[0].length-1; j>0; j--) {
        const squareBeingConsidered = map[i][j];
        if(squareBeingConsidered === '.' || squareBeingConsidered === 'X') {
          const toLeft = map[i][j-1];
          const toRight = map[i][j+1];
          const above = map[i-1][j];
          const below = map[i+1][j];
          if(toLeft === 'O' || toRight === 'O' || above === 'O' || below === 'O') {
            map[i][j] = 'O';
          }
        }
      }
    }

    // Count the number of .'s in the map
    for(let i=0; i<map.length; i++) {
      for(let j=0; j<map[0].length; j++) {
        if(map[i][j] === '.') {
          newCount++;
        }
      }
    }

  } while (newCount !== insideCount)

  console.log(insideCount);
});