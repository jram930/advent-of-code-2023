const fs = require('fs');
const readline = require('readline');

const file = readline.createInterface({
  input: fs.createReadStream('input.txt'),
  output: process.stdout,
  terminal: false
});

let winnings = 0;

const fiveOfAKinds = [];
const fourOfAKinds = [];
const fullHouses = [];
const threeOfAKinds = [];
const twoPairs = [];
const onePairs = [];
const highCards = [];

const ranks = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];

file.on('line', (line) => {
  const tokens = line.split(/[ ]+/);
  const hand = tokens[0].split('');
  const bid = parseInt(tokens[1]);
  
  let isFiveOfAKind = false;
  let isFourOfAKind = false;
  let isFullHouse = false;
  let isThreeOfAKind = false;
  let isTwoPair = false;
  let isOnePair = false;
  let isHighCard = false;

  let numJs = hand.filter((card) => card === 'J').length;

  // Check if five of a kind
  if((hand[0] === hand[1] || hand[1] === 'J') && 
  (hand[0] === hand[2]  || hand[2] === 'J') && 
  (hand[0] === hand[3] || hand[3] === 'J') && 
  (hand[0] === hand[4] || hand[4] === 'J')) {
    isFiveOfAKind = true;
  }
  if(!isFiveOfAKind) {
    if((hand[1] === hand[0] || hand[0] === 'J') && 
    (hand[1] === hand[2]  || hand[2] === 'J') && 
    (hand[1] === hand[3] || hand[3] === 'J') && 
    (hand[1] === hand[4] || hand[4] === 'J')) {
      isFiveOfAKind = true;
    }
  }

  if(!isFiveOfAKind) {
    // Check if four of a kind
    for(let i=0; i<hand.length; i++) {
      if(hand.filter((card) => card === hand[i]).length === 4 && hand[i] !== 'J') {
        isFourOfAKind = true;
        break;
      }
    }

    if(!isFiveOfAKind && !isFourOfAKind) {
      for(let i=0; i<hand.length; i++) {
        if((numJs=== 1 && hand.filter((card) => card === hand[i]).length === 3 && hand[i] !== 'J') |
          (numJs === 2 && hand.filter((card) => card === hand[i]).length === 2 && hand[i] !== 'J') |
          (numJs === 3 && hand.filter((card) => card === hand[i]).length === 1 && hand[i] !== 'J')) {
          isFourOfAKind = true;
          break;
        }
      }
    }
  }

  if(!isFiveOfAKind && !isFourOfAKind) {
    // Check if full house or three of a kind
    let hasThreeOfAKind = false;
    let numJsUsed = 0;
    let threeCard = '';
    for(let i=0; i<hand.length; i++) {
      if(hand.filter((card) => card === hand[i]).length === 3) {
        threeCard = hand[i];
        hasThreeOfAKind = true;
        break;
      }
    }

    if(!hasThreeOfAKind) {
      for(let i=0; i<hand.length; i++) {
        if((numJs === 1 && hand.filter((card) => card === hand[i]).length === 2) |
        (numJs === 2 && hand.filter((card) => card === hand[i]).length === 1) |
        (numJs === 3)) {
          numJsUsed = 3 - hand.filter((card) => card === hand[i]).length;
          threeCard = hand[i];
          hasThreeOfAKind = true;
          break;
        }
      }
    }

    let jsLeft = numJs - numJsUsed;

    if(hasThreeOfAKind) {
      for(let i=0; i<hand.length; i++) {
        if(hand.filter((card) => card === hand[i]).length === 2 && hand[i] !== threeCard && hand[i] !== 'J') {
          isFullHouse = true;
          break;
        } else if (hand.filter((card) => card === hand[i]).length === 1 && hand[i] !== threeCard && jsLeft >= 1 && hand[i] !== 'J') {
          isFullHouse = true;
          break;
        } else if (jsLeft === 2) {
          isFullHouse = true;
          break;
        }
      }
    }
    if(hasThreeOfAKind && !isFullHouse) {
      isThreeOfAKind = true;
    }
  }

  if(!isFiveOfAKind && !isFourOfAKind && !isFullHouse && !isThreeOfAKind) {
    let firstCardUsed = '';
    for(let i=0; i<hand.length; i++) {
      if(hand.filter((card) => card === hand[i]).length === 2 && numJs === 0 && firstCardUsed === '') {
        firstCardUsed = hand[i];
      } else if (hand.filter((card) => card === hand[i]).length === 2 && numJs === 0 && firstCardUsed !== hand[i]) {
        isTwoPair = true;
        break;
      }
    }
  }

  if(!isFiveOfAKind && !isFourOfAKind && !isFullHouse && !isThreeOfAKind && !isTwoPair) {
    // Check if one pair
    for(let i=0; i<hand.length; i++) {
      if(hand.filter((card) => card === hand[i]).length === 2 || numJs > 0) {
        isOnePair = true;
        break;
      }
    }
  }

  if(!isFiveOfAKind && !isFourOfAKind && !isFullHouse && !isThreeOfAKind && !isTwoPair && !isOnePair) {
    isHighCard = true;
  }

  if(isFiveOfAKind) {
    fiveOfAKinds.push({hand, bid});
  } else if(isFourOfAKind) {
    fourOfAKinds.push({hand, bid});
  } else if(isFullHouse) {
    fullHouses.push({hand, bid});
  } else if(isThreeOfAKind) {
    threeOfAKinds.push({hand, bid});
  } else if(isTwoPair) { 
    twoPairs.push({hand, bid});
  } else if(isOnePair) {
    onePairs.push({hand, bid});
  } else if(isHighCard) {
    highCards.push({hand, bid});
  }
});

const sortHands = (a, b) => {
  for(let i=0; i<a.hand.length; i++) {
    if(ranks.indexOf(a.hand[i]) < ranks.indexOf(b.hand[i])) {
      return -1;
    } else if(ranks.indexOf(a.hand[i]) > ranks.indexOf(b.hand[i])) {
      return 1;
    }
  }
  return 0;
};

file.on('close', () => {
  // Sort each array where hands are ordered by rank of first, then second, then third, etc card in each hand
  fiveOfAKinds.sort(sortHands);
  fourOfAKinds.sort(sortHands);
  fullHouses.sort(sortHands);
  threeOfAKinds.sort(sortHands);
  twoPairs.sort(sortHands);
  onePairs.sort(sortHands);
  highCards.sort(sortHands);

  const allHandsPlusBids = [...highCards, ...onePairs, ...twoPairs, ...threeOfAKinds, ...fullHouses, ...fourOfAKinds, ...fiveOfAKinds];

  allHandsPlusBids.forEach((handPlusBid, i) => {
    winnings += handPlusBid.bid * (i+1);
  });

  console.log(winnings);
});