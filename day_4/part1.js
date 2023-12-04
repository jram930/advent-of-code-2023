const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

let sum = 0;

file.on('line', (line) => {
  const tokens = line.split(/[ ]+/);
  const winningNumbers = [];
  const numbersWeHave = [];
  let score = 0;
  let lookingAtWinningNumbers = true;
  for(let i=2; i<tokens.length; i++) {
    const token = tokens[i];
    if(token === '|') {
      lookingAtWinningNumbers = false;
      continue;
    }
    if(lookingAtWinningNumbers) {
      winningNumbers.push(parseInt(tokens[i]));
    } else {
      numbersWeHave.push(parseInt(tokens[i]));
    }
  }
  numbersWeHave.forEach((number) => {
    if(winningNumbers.indexOf(number) > -1) {
      if(score === 0) {
        score = 1;
      } else {
        score *= 2;
      }
    }
  });
  sum += score;
});

file.on('close', () => {
  console.log(sum);
});