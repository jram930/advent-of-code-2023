const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

const map = [];
const expandedRowMap = [];
const expandedMap = [];
const galaxyLookup = [];

file.on('line', (line) => {
  const tokens = line.split('');
  map.push(tokens);
});

file.on('close', () => {
  // Expand the map
  for(let i=0; i<map.length; i++) {
    const row = map[i];
    expandedRowMap.push(row);
    const galaxiesInRow = row.filter((x) => x === '#').length;
    if(galaxiesInRow === 0) {
      expandedRowMap.push(row.map((x) => '.'));
    }
  }

  const colsWithNoGalaxies = [];
  for(let j=0; j<expandedRowMap[0].length; j++) {
    let galaxies = 0;
    for(let i=0; i<expandedRowMap.length; i++) {
      if(expandedRowMap[i][j] === '#') {
        galaxies++;
      }
    }
    if(galaxies === 0) {
      colsWithNoGalaxies.push(j);
    }
  }

  for(let i=0; i<expandedRowMap.length; i++) {
    const row = expandedRowMap[i];
    const newRow = [];
    for(let j=0; j<row.length; j++) {
      newRow.push(row[j]);
      if(colsWithNoGalaxies.includes(j)) {
        newRow.push('.');
      }
    }
    expandedMap.push(newRow);
  }

  // Build the galaxy lookup
  for(let i=0; i<expandedMap.length; i++) {
    const row = expandedMap[i];
    for(let j=0; j<row.length; j++) {
      const char = row[j];
      if(char === '#') {
        galaxyLookup.push({i, j});
      }
    }
  }

  const findShortestPath = (start, end) => {
    return Math.abs(end.j - start.j) + Math.abs(end.i - start.i);
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