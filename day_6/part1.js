const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

let lineNumber = 0;

let times = [];
let distances = [];

file.on('line', (line) => {

  const tokens = line.split(/[ ]+/);

  if(lineNumber === 0) {
    times = tokens.slice(1).map((x) => parseInt(x));
  } else if(lineNumber === 1) {
    distances = tokens.slice(1).map((x) => parseInt(x));;
  }

  lineNumber++;
});

let result = 1;

file.on('close', () => {
  for(let i=0; i<times.length; i++) {
    let wins = 0;
    const raceTime = times[i];
    const totalDistance = distances[i];
    for(let j=1; j<raceTime; j++) {
      const holdTime = j;
      const speed = holdTime;
      const timeToTravel = totalDistance / speed;
      if((timeToTravel + holdTime) < (raceTime)) {
        wins++;
      }
    }
    result *= wins;
  }

  console.log(result);
});