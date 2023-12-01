const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

let sum = 0;
const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

file.on('line', (line) => {
  let numberStr = '';
  let number = 0;

  let firstWordIndex = 9999999;
  let lastWordIndex = -1;
  let firstWord = '';
  let firstDigitIndex = 9999999;
  let lastDigitIndex = -1;
  let lastWord = '';


  for(let i=0; i<words.length; i++) {
    const word = words[i];
    if(line.indexOf(word) > -1) {
      if(line.indexOf(word) < firstWordIndex) {
        firstWordIndex = line.indexOf(word);
        firstWord = word;
      }
    }
  }
  for(let i=0; i<words.length; i++) {
    const word = words[i];
    if(line.lastIndexOf(word) > -1) {
      if(line.lastIndexOf(word) > lastWordIndex && line.lastIndexOf(word) !== firstWordIndex) {
        lastWordIndex = line.lastIndexOf(word);
        lastWord = word;
      }
    }
  }

  for(let i=0; i<line.length; i++) {
    const char = line.charAt(i);
    if(/^\d+$/.test(char)) {
      firstDigitIndex = i;
      break;
    }
  }
  for(let i=line.length-1; i>-1; i--) {
    const char = line.charAt(i);
    if(/^\d+$/.test(char)) {
      lastDigitIndex = i;
      break;
    }
  }

  if(firstWordIndex === 9999999 && lastWordIndex !== -1) {
    firstWordIndex = lastWordIndex;
    firstWord = lastWord;
  }

  if(lastWordIndex === -1 && firstWordIndex !== 9999999) {
    lastWordIndex = firstWordIndex;
    lastWord = firstWord;
  }

  if(firstDigitIndex === 9999999 && lastDigitIndex !== -1) {
    firstDigitIndex = lastDigitIndex;
  }

  if(lastDigitIndex === -1 && firstDigitIndex !== 9999999) {
    lastDigitIndex = firstDigitIndex;
  }

  if(firstDigitIndex < firstWordIndex || firstWordIndex === 9999999) {
    numberStr += `${line.charAt(firstDigitIndex)}`;
  } else {
    numberStr += `${words.indexOf(firstWord)}`;
  }

  if(lastDigitIndex > lastWordIndex || lastWordIndex === -1) {
    numberStr += `${line.charAt(lastDigitIndex)}`;
  } else {
    numberStr += `${words.indexOf(lastWord)}`;
  }

  number = parseInt(numberStr);
  sum += number;
});

file.on('close', () => {
  console.log(sum);
});