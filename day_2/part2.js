const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

let sum = 0;

file.on('line', (line) => {
  const afterGameId = line.substring(line.indexOf(':')+1);
  const sets = afterGameId.split(';');
  let maxRed = 0;
  let maxBlue = 0;
  let maxGreen = 0;
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
    if(reds > maxRed) {
      maxRed = reds;
    }
    if(greens > maxGreen) {
      maxGreen = greens;
    }
    if(blues > maxBlue) {
      maxBlue = blues;
    }
  });
  const power = maxRed * maxGreen * maxBlue;
  sum += power;
});

file.on('close', () => {
  console.log(sum);
});