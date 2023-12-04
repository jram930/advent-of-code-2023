const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

const originalCards = [];
const cardsToProcess = [];
const cardsProcessed = [];

file.on('line', (line) => {
  const tokens = line.split(/[ ]+/);
  const card = {
    cardNum: parseInt(tokens[1].replace(':', ''))-1,
    wins: 0,
  };
  let lookingAtWinningNumbers = true;
  let winningNumbers = [];
  let numbersWeHave = [];
  let wins = 0;
  for(let i=2; i<tokens.length; i++) {
    const token = tokens[i];
    if(token === '|') {
      lookingAtWinningNumbers = false;
      continue;
    }
    if(lookingAtWinningNumbers) {
      winningNumbers.push(parseInt(tokens[i]));
    } else {
      numbersWeHave.push(parseInt(tokens[i]));
    }
  }

  numbersWeHave.forEach((number) => {
    if(winningNumbers.indexOf(number) > -1) {
      wins++;
    }
  });

  card.wins = wins;

  originalCards.push(card);
  cardsToProcess.push(card);
});

let memo = {};

const getTotalCountForCard = (card) => {
  if(card.wins === 0) {
    return 1;
  } else if(memo[card.cardNum] != undefined) {
    return memo[card.cardNum];
  } else {
    let wins = 1;
    for(let i=0; i<card.wins; i++) {
      wins += getTotalCountForCard(originalCards[card.cardNum+i+1]);
    }
    memo[card.cardNum] = wins;
    return wins;
  }
}

file.on('close', () => {
  let wins = 0;
  for(let i=0; i<originalCards.length; i++) {
    wins += getTotalCountForCard(originalCards[i]);
  }
  console.log(wins);
});