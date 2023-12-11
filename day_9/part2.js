const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

let sum = 0;
const data = [];

file.on('line', (line) => {
  const tokens = line.split(/[ ]+/);
  data.push([tokens.map((token) => parseInt(token))]);
});

file.on('close', () => {
  let allDone = false;
  let index = 0;

  // Build the patterns
  while(!allDone) {
    allDone = true;
    for(let i=0; i<data.length; i++) {
      const row = data[i][index];
      const diffs = [];
      for(let j=1; j<row.length; j++) {
        if(row[j] - row[j-1] !== 0) {
          allDone = false;
        }
        diffs.push(row[j] - row[j-1]);
      }
      data[i].push(diffs);
    }
    index++;
  }

  // Fill the in the first values
  for(let i=0; i<data.length; i++) {
    for(let j=data[i].length-1; j>0; j--) {
      const diff = data[i][j][0];
      const firstElem = data[i][j-1][0];
      data[i][j-1] = [(firstElem - diff), ...data[i][j-1]];
    }
  }

  // Sum the first values
  for(let i=0; i<data.length; i++) {
    sum += data[i][0][0];
  }

  console.log(sum);
});