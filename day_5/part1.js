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
let seedToSoilMap = {};
let seedToFertilizerMap = {};
let seedToWaterMap = {};
let seedToLightMap = {};
let seedToTemperatureMap = {};
let seedToHumidityMap = {};
let seedToLocationMap = {};

file.on('line', (line) => {
  if(lineNumber === 0) {
    seeds = line.split(/[ ]+/).slice(1).map((s) => parseInt(s));
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

file.on('close', () => {
  // Build soil map
  seeds.forEach((seed) => {
    seedToSoilData.forEach((d) => {
      if(seed >= d.source && seed <= d.source + d.length) {
        const diff = seed - d.source;
        const destination = d.destination + diff;
        seedToSoilMap[seed] = destination;
      }
    });
  });

  // Build fertilizer map
  Object.keys(seedToSoilMap).forEach((seed) => {
    const soil = seedToSoilMap[seed];
    soilToFertilizerData.forEach((d) => {
      if(soil >= d.source && soil <= d.source + d.length) {
        const diff = soil - d.source;
        const destination = d.destination + diff;
        seedToFertilizerMap[seed] = destination;
      }
    });
  });

  // Build water map
  Object.keys(seedToFertilizerMap).forEach((seed) => {
    const fertilizer = seedToFertilizerMap[seed];
    fertilizerToWaterData.forEach((d) => {
      if(fertilizer >= d.source && fertilizer <= d.source + d.length) {
        const diff = fertilizer - d.source;
        const destination = d.destination + diff;
        seedToWaterMap[seed] = destination;
      }
    });
  });

  // Build light map
  Object.keys(seedToWaterMap).forEach((seed) => {
    const water = seedToWaterMap[seed];
    waterToLightData.forEach((d) => {
      if(water >= d.source && water <= d.source + d.length) {
        const diff = water - d.source;
        const destination = d.destination + diff;
        seedToLightMap[seed] = destination;
      }
    });
  });

  // Build temperature map
  Object.keys(seedToLightMap).forEach((seed) => {
    const light = seedToLightMap[seed];
    lightToTemperatureData.forEach((d) => {
      if(light >= d.source && light <= d.source + d.length) {
        const diff = light - d.source;
        const destination = d.destination + diff;
        seedToTemperatureMap[seed] = destination;
      }
    });
  });

  // Build humidity map
  Object.keys(seedToTemperatureMap).forEach((seed) => {
    const temperature = seedToTemperatureMap[seed];
    temperatureToHumidityData.forEach((d) => {
      if(temperature >= d.source && temperature <= d.source + d.length) {
        const diff = temperature - d.source;
        const destination = d.destination + diff;
        seedToHumidityMap[seed] = destination;
      }
    });
  });

  // Build location map
  Object.keys(seedToHumidityMap).forEach((seed) => {
    const humidity = seedToHumidityMap[seed];
    humidityToLocationData.forEach((d) => {
      if(humidity >= d.source && humidity <= d.source + d.length) {
        const diff = humidity - d.source;
        const destination = d.destination + diff;
        seedToLocationMap[seed] = destination;
      }
    });
  });

  Object.keys(seedToLocationMap).forEach((seed) => {
    if(seedToLocationMap[seed] < minLocation) {
      minLocation = seedToLocationMap[seed];
    }
  });

  console.log(minLocation);
});