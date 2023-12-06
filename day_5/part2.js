const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

let seeds = [];
let seedToSoilData = [];
let soilToFertilizerData = [];
let fertilizerToWaterData = [];
let waterToLightData = [];
let lightToTemperatureData = [];
let temperatureToHumidityData = [];
let humidityToLocationData = [];
let lineNumber = 0;

file.on('line', (line) => {
  if(lineNumber === 0) {
    seedData = line.split(/[ ]+/).slice(1).map((s) => parseInt(s));
    for(let i=0; i<seedData.length; i+=2) {
      seeds.push({
        start: seedData[i],
        stop: seedData[i] + seedData[i+1],
      });
    }
  }

  // Seed to soil data
  if(lineNumber >= 3 && lineNumber <= 39) {
    const tokens = line.split(/[ ]+/);
    seedToSoilData.push({
      destination: parseInt(tokens[0]),
      source: parseInt(tokens[1]),
      length: parseInt(tokens[2]),
    });
  }

  // Soil to fertilizer data
  if(lineNumber >= 42 && lineNumber <= 51) {
    const tokens = line.split(/[ ]+/);
    soilToFertilizerData.push({
      destination: parseInt(tokens[0]),
      source: parseInt(tokens[1]),
      length: parseInt(tokens[2]),
    });
  }

  // Fertilizer to water data
  if(lineNumber >= 54 && lineNumber <= 89) {
    const tokens = line.split(/[ ]+/);
    fertilizerToWaterData.push({
      destination: parseInt(tokens[0]),
      source: parseInt(tokens[1]),
      length: parseInt(tokens[2]),
    });
  }

  // Water to light data
  if(lineNumber >= 92 && lineNumber <= 137) {
    const tokens = line.split(/[ ]+/);
    waterToLightData.push({
      destination: parseInt(tokens[0]),
      source: parseInt(tokens[1]),
      length: parseInt(tokens[2]),
    });
  }

  // Light to temperature data
  if(lineNumber >= 140 && lineNumber <= 167) {
    const tokens = line.split(/[ ]+/);
    lightToTemperatureData.push({
      destination: parseInt(tokens[0]),
      source: parseInt(tokens[1]),
      length: parseInt(tokens[2]),
    });
  }

  // Temperature to humidity data
  if(lineNumber >= 170 && lineNumber <= 209) {
    const tokens = line.split(/[ ]+/);
    temperatureToHumidityData.push({
      destination: parseInt(tokens[0]),
      source: parseInt(tokens[1]),
      length: parseInt(tokens[2]),
    });
  }

  // Humidity to location data
  if(lineNumber >= 212 && lineNumber <= 253) {
    const tokens = line.split(/[ ]+/);
    humidityToLocationData.push({
      destination: parseInt(tokens[0]),
      source: parseInt(tokens[1]),
      length: parseInt(tokens[2]),
    });
  }

  lineNumber++;
});

let minLocation = 9999999999999;
let maxLocation = 0;

file.on('close', () => {

  // Find maximum location value
  humidityToLocationData.forEach((data) => {
    if(data.destination + data.length > maxLocation) {
      maxLocation = data.destination + data.length;
    }
  });

  for(let i=0; i<maxLocation; i++) {
    // If you can trace this location all the way back to a seed, then it's a valid location, othwerwise it's not
    let seedFound = false;
    let humidity = 0;
    let temperature = 0;
    let light = 0;
    let water = 0;
    let fertilizer = 0;
    let soil = 0;
    let seed = 0;

    // Find the humidity
    humidity = i;
    for(let j=0; j<humidityToLocationData.length; j++) {
      data = humidityToLocationData[j];
      if(data.destination <= i && data.destination + data.length > i) {
        // It's in this range.
        const diff = i - data.destination;
        humidity = data.source + diff;
        break;
      }
    }

    // Find the temperature
    temperature = humidity;
    for(let j=0; j<temperatureToHumidityData.length; j++) {
      data = temperatureToHumidityData[j];
      if(data.destination <= temperature && data.destination + data.length > temperature) {
        // It's in this range.
        const diff = temperature - data.destination;
        temperature = data.source + diff;
        break;
      }
    }

    // Find the light
    light = temperature;
    for(let j=0; j<lightToTemperatureData.length; j++) {
      data = lightToTemperatureData[j];
      if(data.destination <= light && data.destination + data.length > light) {
        // It's in this range.
        const diff = light - data.destination;
        light = data.source + diff;
        break;
      }
    }

    // Find the water
    water = light;
    for(let j=0; j<waterToLightData.length; j++) {
      data = waterToLightData[j];
      if(data.destination <= water && data.destination + data.length > water) {
        // It's in this range.
        const diff = water - data.destination;
        water = data.source + diff;
        break;
      }
    }

    // Find the fertilizer
    fertilizer = water;
    for(let j=0; j<fertilizerToWaterData.length; j++) {
      data = fertilizerToWaterData[j];
      if(data.destination <= fertilizer && data.destination + data.length > fertilizer) {
        // It's in this range.
        const diff = fertilizer - data.destination;
        fertilizer = data.source + diff;
        break;
      }
    }

    // Find the soil
    soil = fertilizer;
    for(let j=0; j<soilToFertilizerData.length; j++) {
      data = soilToFertilizerData[j];
      if(data.destination <= soil && data.destination + data.length > soil) {
        // It's in this range.
        const diff = soil - data.destination;
        soil = data.source + diff;
        break;
      }
    }

    // Find the seed
    seed = soil;
    for(let j=0; j<seedToSoilData.length; j++) {
      data = seedToSoilData[j];
      if(data.destination <= seed && data.destination + data.length > seed) {
        // It's in this range.
        const diff = seed - data.destination;
        seed = data.source + diff;
        break;
      }
    }

    // Check if this seed is in one of the original seed ranges
    for(let j=0; j<seeds.length; j++) {
      const seedRange = seeds[j];
      if(seed >= seedRange.start && seed < seedRange.stop) {
        seedFound = true;
        minLocation = i;
        break;
      }
    }

    if(seedFound) {
      break;
    }
  }

  console.log(minLocation);
});