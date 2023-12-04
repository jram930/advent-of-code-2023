const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

let sum = 0;
let input = [];

file.on('line', (line) => {
  const arr = [];
  for(let i=0; i<line.length; i++) {
    arr.push(line.charAt(i));
  }
  input.push(arr);
});

const figureOutNumber = (i, j) => {
  let numberStr = '';
  let firstIndex = 0;
  for(let k=j; k>-1; k--) {
    if(/[0-9]/.test(input[i][k])) {
      firstIndex = k;
    } else {
      break;
    }
  }
  for(let k=firstIndex; k<input[i].length; k++) {
    if(!/[0-9]/.test(input[i][k])) {
      break;
    }
    numberStr += input[i][k];
  }
  return parseInt(numberStr);
}

file.on('close', () => {
  for(let i=0; i<input.length; i++) {
    for(let j=0; j<input[i].length; j++) {
      const char = input[i][j];
      if(char === '*') {
        let numbers = [];

        // Look above
        if(i > 0) {
          if(j > 0) {
            if(/[0-9]/.test(input[i-1][j-1])) {
              if(numbers.indexOf(figureOutNumber(i-1, j-1)) === -1) {
                numbers.push(figureOutNumber(i-1, j-1));
              }
            }
          }
          if(/[0-9]/.test(input[i-1][j])) {
            if(numbers.indexOf(figureOutNumber(i-1, j)) === -1) {
              numbers.push(figureOutNumber(i-1, j));
            }
          }
          if(j < input[i].length-1) {
            if(/[0-9]/.test(input[i-1][j+1])) {
              if(numbers.indexOf(figureOutNumber(i-1, j+1)) === -1) {
                numbers.push(figureOutNumber(i-1, j+1));
              }
            }
          }
        }

        // Look to sides
        if(j > 0) {
          if(/[0-9]/.test(input[i][j-1])) {
            if(numbers.indexOf(figureOutNumber(i, j-1)) === -1) {
              numbers.push(figureOutNumber(i, j-1));
            }
          }
        }
        if(j < input[i].length-1) {
          if(/[0-9]/.test(input[i][j+1])) {
            if(numbers.indexOf(figureOutNumber(i, j+1)) === -1) {
              numbers.push(figureOutNumber(i, j+1));
            }
          }
        }

        // Look below
        if(i < input.length-1) {
          if(j > 0) {
            if(/[0-9]/.test(input[i+1][j-1])) {
              if(numbers.indexOf(figureOutNumber(i+1, j-1)) === -1) {
                numbers.push(figureOutNumber(i+1, j-1));
              }
            }
          }
          if(/[0-9]/.test(input[i+1][j])) {
            if(numbers.indexOf(figureOutNumber(i+1, j)) === -1) {
              numbers.push(figureOutNumber(i+1, j));
            }
          }
          if(j < input[i].length-1) {
            if(/[0-9]/.test(input[i+1][j+1])) {
              if(numbers.indexOf(figureOutNumber(i+1, j+1)) === -1) {
                numbers.push(figureOutNumber(i+1, j+1));
              }
            }
          }
        }

        if(numbers.length === 2) {
          sum += numbers[0] * numbers[1];
        }
      }
    }
  }
  console.log(sum);
});