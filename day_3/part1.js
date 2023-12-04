const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

let sum = 0;
let input = [];

const isSymbol = (char) => {
  return !/[0-9|.]/.test(char);
}

file.on('line', (line) => {
  const arr = [];
  for(let i=0; i<line.length; i++) {
    arr.push(line.charAt(i));
  }
  input.push(arr);
});

file.on('close', () => {
  let numberStr = '';
  let inNumber = false;
  let isPart = false;
  for(let i=0; i<input.length; i++) {
    for(let j=0; j<input[i].length; j++) {
      const char = input[i][j];
      if(char === '.' || isSymbol(char)) {
        if (inNumber) {
          if(isPart) {
            sum += parseInt(numberStr);
          }
          inNumber = false;
          isPart = false;
          numberStr = '';
        }
      }
      if(/[0-9]/.test(char)) {
        inNumber = true;
        numberStr += char;
        // Look above
        if(i > 0) {
          if(j > 0) {
            if(isSymbol(input[i-1][j-1])) {
              isPart = true;
            }
          }
          if(isSymbol(input[i-1][j])) {
            isPart = true;
          }
          if(j < input[i].length-1) {
            if(isSymbol(input[i-1][j+1])) {
              isPart = true;
            }
          }
        }

        // Look to sides
        if(j > 0) {
          if(isSymbol(input[i][j-1])) {
            isPart = true;
          }
        }
        if(j < input[i].length-1) {
          if(isSymbol(input[i][j+1])) {
            isPart = true;
          }
        }

        // Look below
        if(i < input.length-1) {
          if(j > 0) {
            if(isSymbol(input[i+1][j-1])) {
              isPart = true;
            }
          }
          if(isSymbol(input[i+1][j])) {
            isPart = true;
          }
          if(j < input[i].length-1) {
            if(isSymbol(input[i+1][j+1])) {
              isPart = true;
            }
          }
        }
      }
    }
    if(inNumber && isPart) {
      sum += parseInt(numberStr);
      inNumber = false;
      isPart = false;
      numberStr = '';
    } else if(inNumber) {
      inNumber = false;
      isPart = false;
      numberStr = '';
    }
  }
  console.log(sum);
});