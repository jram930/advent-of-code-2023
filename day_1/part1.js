const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

let sum = 0;

file.on('line', (line) => {
  let numberStr = '';
  let number = 0;
  for(let i=0; i<line.length; i++) {
    const char = line.charAt(i);
    if(/^\d+$/.test(char)) {
      numberStr += `${char}`;
      break;
    }
  }
  for(let i=line.length-1; i>-1; i--) {
    const char = line.charAt(i);
    if(/^\d+$/.test(char)) {
      numberStr += `${char}`;
      break;
    }
  }
  number = parseInt(numberStr);
  sum += number;
});

file.on('close', () => {
  console.log(sum);
});