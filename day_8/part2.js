const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

let lineNumber = 0;
let instructions = [];
let currentNodes = [];

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
    if(currentNode.endsWith('A')) {
      currentNodes.push(currentNode);
    }
  }

  lineNumber++;
});

const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

file.on('close', () => {

  const paths = [];

  currentNodes.forEach((currentNode) => {
    let steps = 0;
    while(!currentNode.endsWith('Z')) {
      for(let i=0; i<instructions.length; i++) {
        const instruction = instructions[i];
        if(instruction === 'L') {
          currentNode = map[currentNode].left;
        } else if(instruction === 'R') {
          currentNode = map[currentNode].right;
        }
        steps++;
        if(currentNode.endsWith('Z')) {
          break;
        }
      }
    }

    paths.push(steps);
  
  });

  console.log(`LCM of ${paths} is ${lcm(...paths)}`);
});