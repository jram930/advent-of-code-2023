const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

const map = [];
const galaxyLookup = [];
const colsWithNoGalaxies = [];
const rowsWithNoGalaxies = [];

file.on('line', (line) => {
  const tokens = line.split('');
  map.push(tokens);
});

file.on('close', () => {
  // Expand the map
  for(let i=0; i<map.length; i++) {
    const row = map[i];
    const galaxiesInRow = row.filter((x) => x === '#').length;
    if(galaxiesInRow === 0) {
      rowsWithNoGalaxies.push(i);
    }
  }

  for(let j=0; j<map[0].length; j++) {
    let galaxies = 0;
    for(let i=0; i<map.length; i++) {
      if(map[i][j] === '#') {
        galaxies++;
      }
    }
    if(galaxies === 0) {
      colsWithNoGalaxies.push(j);
    }
  }

  // Build the galaxy lookup
  for(let i=0; i<map.length; i++) {
    const row = map[i];
    for(let j=0; j<row.length; j++) {
      const char = row[j];
      if(char === '#') {
        galaxyLookup.push({i, j});
      }
    }
  }

  const findShortestPath = (start, end) => {
    let iDiff = 0;
    let jDiff = 0;
    let numExpansionsBetweenRows = 0;
    let numExpansionsBetweenCols = 0;
    rowsWithNoGalaxies.forEach((row) => {
      if(start.i < row && row < end.i || end.i < row && row < start.i) {
        numExpansionsBetweenRows++;
      }
    });
    colsWithNoGalaxies.forEach((col) => {
      if(start.j < col && col < end.j || end.j < col && col < start.j) {
        numExpansionsBetweenCols++;
      }
    });
    iDiff = Math.abs(end.i - start.i);
    jDiff = Math.abs(end.j - start.j);
    for(let i=0; i<numExpansionsBetweenRows; i++) {
      iDiff += 999999;
    }
    for(let j=0; j<numExpansionsBetweenCols; j++) {
      jDiff += 999999;
    }
    return iDiff + jDiff;
  }

  // Find the shortest paths between each pair of galaxies
  const shortestPaths = [];
  for(let i=0; i<galaxyLookup.length; i++) {
    const start = galaxyLookup[i];
    for(let j=i+1; j<galaxyLookup.length; j++) {
      const end = galaxyLookup[j];
      const path = findShortestPath(start, end);
      shortestPaths.push(path);
    }
  }

  // Sum all the shortest paths
  const sum = shortestPaths.reduce((acc, val) => acc + val, 0);
  console.log(sum);
});