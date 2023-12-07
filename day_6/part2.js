const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input2.txt'),
  output: process.stdout,
  terminal: false
});

let lineNumber = 0;

let raceTime = 0;
let totalDistance = 0;

file.on('line', (line) => {

  const tokens = line.split(/[ ]+/);

  if(lineNumber === 0) {
    raceTime = tokens.slice(1).map((x) => parseInt(x))[0];
  } else if(lineNumber === 1) {
    totalDistance = tokens.slice(1).map((x) => parseInt(x))[0];
  }

  lineNumber++;
});

file.on('close', () => {
    let wins = 0;
    for(let j=1; j<=raceTime; j++) {
      const holdTime = j;
      const speed = holdTime;
      const timeToTravel = totalDistance / speed;
      if((timeToTravel + holdTime) < (raceTime)) {
        wins++;
      }
    }

  console.log(wins);
});