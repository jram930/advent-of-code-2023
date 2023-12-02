const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

let sum = 0;
const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

file.on('line', (line) => {
  const id = parseInt(line.substring(0, line.indexOf(':')).split(' ')[1]);
  const afterGameId = line.substring(line.indexOf(':')+1);
  const sets = afterGameId.split(';');
  let validGame = true;
  sets.forEach((set) => {
    let reds = 0;
    let greens = 0;
    let blues = 0;
    if(set.indexOf('red') > -1) {
      const redStr = set.split('red')[0].split(' ');
      reds = parseInt(redStr[redStr.length-2]);
    }
    if(set.indexOf('green') > -1) {
      const greenStr = set.split('green')[0].split(' ');
      greens = parseInt(greenStr[greenStr.length-2]);
    }
    if(set.indexOf('blue') > -1) {
      const blueStr = set.split('blue')[0].split(' ');
      blues = parseInt(blueStr[blueStr.length-2]);
    }
    if(reds > MAX_RED || greens > MAX_GREEN || blues > MAX_BLUE) {
      validGame = false;
    }
  });
  if(validGame) {
    sum += id;
  }
});

file.on('close', () => {
  console.log(sum);
});