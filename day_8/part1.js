const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

let steps = 0;
let lineNumber = 0;
let instructions = [];

const map = {};

file.on('line', (line) => {

  if(lineNumber === 0) {
    instructions = line.split('');
  }

  if(lineNumber > 1) {
    const tokens = line.split(/[ ]+/);
    const currentNode = tokens[0];
    const left = tokens[2].replace('(', '').replace(',', '');
    const right = tokens[3].replace(')', '');
    map[currentNode] = {left, right};
  }

  lineNumber++;
});

file.on('close', () => {

  let currentNode = 'AAA';
  
  while(currentNode !== 'ZZZ') {
    for(let i=0; i<instructions.length; i++) {
      const instruction = instructions[i];
      if(instruction === 'L') {
        currentNode = map[currentNode].left;
      } else if(instruction === 'R') {
        currentNode = map[currentNode].right;
      }
      steps++;
      if(currentNode === 'ZZZ') {
        break;
      }
    }
  }

  console.log(steps);
});