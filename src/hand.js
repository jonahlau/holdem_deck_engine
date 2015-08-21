'use strict';

var Card = require('./card'),
    _ = require('lodash');

/**
 * Hand constructor - creates a new hand given an array of cards.
 * @constructor
 * @param {Array} cards - Array of 7 cards in object form or represented as a string (e.g. '7h')
 * */

function Hand(cards) {
  this.allCards = [];
  this.bestHand = [];
  this.suits = {};
  this.values = [];
  //the _isPossible property is a flag for whether the isPossible function for a particular instance of Hand has already been called
  this._isPossible = null;

  generateCardsInHand(this, cards);
  sortCardsInHand(this);
  populateValuesSuits(this);
}

/**
 * Hand.prototype.compare - method available on all instances of Hand / instances that inherit from Hand, compares 'this' hand against one other Hand
 * @param {Object} compareHand - this parameter must be an instance of Hand otherwise it will not work
 * */

Hand.prototype.compare = function(compareHand) {
  var i = 4,
      result = 0;

  //first compare which hand's rank is higher, if one is higher than the other, return the comparison result
  //result of 1 means 'this' hand is higher than the other hand and vice versa means 'this' hand is lower rank than the other hand
  if (this.rank < compareHand.rank) {
    return -1;
  } else if (this.rank > compareHand.rank) {
    return 1;
  }

  //this loop only runs if the two hands' ranks are the same.  If the same, loop from the last item from both hands and the first hand to have a card lower than the other wins.
  //if there is no winner, return 0
  while (i >= 0) {
    if (this.bestHand[i].rank < compareHand.bestHand[i].rank) {
      result = -1;
      break;
    } else if (this.bestHand[i].rank > compareHand.bestHand[i].rank) {
      result = 1;
      break;
    }
    i--;
  }

  //return 1 (if 'this' hand wins), -1 (if 'this' hand loses) or 0 if it is a tie
  return result;
};

Hand.prototype.beats = function(compareHand) {
  if (this.compare(compareHand) > 0) {
    return true;
  }
  return false;
};

Hand.prototype.losesTo = function(compareHand) {
  if (this.compare(compareHand) < 0) {
    return true;
  }
  return false;
};

Hand.prototype.ties = function(compareHand) {
  if (this.compare(compareHand) === 0) {
    return true;
  }
  return false;
};

//sample output - 'Ac,Ad,Kc,5s,3d,9s,10h'
Hand.prototype.toString = function() {
  return this.bestHand.map(function(card) {
    return card.value + card.suit;
  }).join(',');
};

/**
 * Hand.make takes an array of cards and goes through to find the highest possible hand
 * @param {Array} cards - takes an array of strings (accepted format: 'Ac' for 'Ace of Clubs') or an array of 7 instances of Cards
 * @returns {Object} returns a hand
 * */

Hand.make = function(cards) {
  var handTypes = [StraightFlush, FourOfAKind, FullHouse, Flush, Straight, ThreeOfAKind, TwoPair, OnePair, HighCard];

  for (var i = 0; i < handTypes.length; i++) {
    var hand = handTypes[i];
    hand = new hand(cards);

    if (hand.isPossible()) {
      return hand;
    }
  }
};

Hand.pickWinners = function(hands) {
  var arrayOfRanks = hands.map(function(hand) {
        return hand.rank;
      }).sort(),
      highestRank = arrayOfRanks[arrayOfRanks.length-1],
      highestHands = hands.filter(function(hand) {
        return hand.rank === highestRank;
      });

  var winners = highestHands.filter(function(currHand) {
    for (var i = 0, len=highestHands.length; i<len; i++) {
      if (currHand.losesTo(highestHands[i])) {
        var currCardLoses = true; //if the current hand being looped over by the filter method loses to any other hand of the same rank, it does not get included in the winners array
        break;
      }
      return !currCardLoses;
    }
  });

  return winners;
};

/**
 * StraightFlush constructor
 * @constructor
 * */

function StraightFlush(cards) {
  Hand.call(this, cards);
  this.isPossible();
}

extend(Hand, StraightFlush);

StraightFlush.prototype.name = 'Straight Flush';

StraightFlush.prototype.rank = 8;

StraightFlush.prototype.isPossible = function() {
  if (this._isPossible) { return true; }

  var flush,
      straightFlushPossible,
      straight = new Straight(this.allCards);

  if (straight.isPossible()) {
    flush = new Flush(straight.bestHand);
    if (flush.isPossible()) {
      this.bestHand = flush.bestHand;
      this.bestHand.reverse();
      straightFlushPossible = true;
      this._isPossible = true;
    }
  }
  return straightFlushPossible || false;
};

/**
 * FourOfAKind constructor
 * @constructor
 * */

function FourOfAKind(cards) {
  Hand.call(this, cards);
  this.isPossible();
}

extend(Hand, FourOfAKind);

FourOfAKind.prototype.name = 'Four of a Kind';

FourOfAKind.prototype.rank = 7;

FourOfAKind.prototype.isPossible = function() {
  if (this._isPossible) { return true; }

  var fourOfAKindPossible,
      definedValues = this.values.filter(function(value) {
        if (value) {
          return value;
        }
      });

  for (var i=0; i<this.values.length; i++) {
    if (this.values[i] && this.values[i].length === 4) {
      fourOfAKindPossible = true;
      this._isPossible = true;
      this.bestHand = this.values[i];
      this.bestHand.push(definedValues[definedValues.length-1][0]);
      break;
    }
  }
  return fourOfAKindPossible || false;
};


/**
 * FullHouse constructor
 * @constructor
 * */

function FullHouse(cards) {
  Hand.call(this, cards);
  this.isPossible();
}

extend(Hand, FullHouse);

FullHouse.prototype.name = 'Full House';

FullHouse.prototype.rank = 6;

FullHouse.prototype.isPossible = function() {
  if (this._isPossible) { return true; }

  var fullHousePossible,
      threeOfAKinds = filterByNumberOfCards(3, this),
      onePairs = filterByNumberOfCards(2, this);

  if (!_.isEmpty(threeOfAKinds) && !_.isEmpty(onePairs)) {
    fullHousePossible = true;
    this._isPossible = true;

    this.bestHand = threeOfAKinds[threeOfAKinds.length-1];
    onePairs[onePairs.length - 1].forEach((function(cardInPair) {
      this.bestHand.push(cardInPair);
    }).bind(this));
  }

  return fullHousePossible || false;
};

/**
 * Flush constructor
 * @constructor
 * */

function Flush(cards) {
  Hand.call(this, cards);
  this.isPossible();
}

extend(Hand, Flush);

Flush.prototype.name = 'Flush';

Flush.prototype.rank = 5;

Flush.prototype.isPossible = function() {
  if (this._isPossible) { return true; }

  var possibleFlush;
  for (var suit in this.suits) {
    if (this.suits[suit].length >= 5) {
      possibleFlush = true;
      this._isPossible = true;

      switch(this.suits[suit].length) {
        case 6:
          this.bestHand = this.suits[suit].slice(1);
          break;
        case 7:
          this.bestHand = this.suits[suit].slice(2);
          break;
        default:
          this.bestHand = this.suits[suit];
          break;
      }
      break;
    }
  }
  return possibleFlush || false;
};


/**
 * Straight constructor
 * @constructor
 * */

function Straight(cards) {
  Hand.call(this, cards);
  this.isPossible();
}

extend(Hand, Straight);

Straight.prototype.name = 'Straight';

Straight.prototype.rank = 4;

Straight.prototype.isPossible = function() {
  if (this._isPossible) { return true; }

  var possibleStraight, rankDiff, aceIndex;

  aceIndex = _.findIndex(this.allCards, function(card) {
    return card.value === 'A';
  });

  if (aceIndex >= 0) {
    this.allCards.unshift(new Card('1', this.allCards[aceIndex].suit));
  }

  for (var i = this.allCards.length - 1; i > -1; i--) {
    var previousCard = this.bestHand[this.bestHand.length - 1],
        currentCard = this.allCards[i];

    if (previousCard) {
      rankDiff = previousCard.rank - currentCard.rank;
    }

    if (rankDiff === 1) {
      this.bestHand.push(currentCard);
    } else if (rankDiff > 1) {
      this.bestHand = [];
      this.bestHand.push(currentCard);
    } else if (typeof rankDiff === 'undefined') {
      this.bestHand.push(currentCard);
    }

    if (this.bestHand.length === 5) {
      possibleStraight = true;
      this._isPossible = true;
      this.bestHand.reverse();
      break;
    }
  }

  return possibleStraight || false;
};

/**
 * ThreeOfAKind constructor
 * @constructor
 * */

function ThreeOfAKind(cards) {
  Hand.call(this, cards);
  this.isPossible();
}

extend(Hand, ThreeOfAKind);

ThreeOfAKind.prototype.name = 'Three Of A Kind';

ThreeOfAKind.prototype.rank = 3;

ThreeOfAKind.prototype.isPossible = function() {
  if (this._isPossible) { return true; }
  var possibleThreeOfAKind, topKicker, secondKicker,
      singles = filterByNumberOfCards(1, this),
      threeOfAKinds = filterByNumberOfCards(3, this);

  if (!_.isEmpty(threeOfAKinds)) {
    possibleThreeOfAKind = true;
    this._isPossible = true;
    topKicker = singles[singles.length-1];
    secondKicker = singles[singles.length-2];
    this.bestHand = secondKicker.concat(topKicker).concat(threeOfAKinds[threeOfAKinds.length-1]);
  }

  return possibleThreeOfAKind || false;
};

/**
 * TwoPair constructor
 * @constructor
 * */

function TwoPair(cards) {
  Hand.call(this, cards);
  this.isPossible();
}

extend(Hand, TwoPair);

TwoPair.prototype.name = 'Two Pair';

TwoPair.prototype.rank = 2;

TwoPair.prototype.isPossible = function() {
  if (this._isPossible) { return true; }

  var possibleStraight, topPair, secondPair, kicker,
      singles = filterByNumberOfCards(1, this),
      onePairs = filterByNumberOfCards(2, this);

  if (onePairs.length >= 2) {
    topPair = onePairs[onePairs.length-1];
    secondPair = onePairs[onePairs.length -2];
    kicker = singles[singles.length -1];
    this.bestHand = kicker.concat(secondPair).concat(topPair);
    this._isPossible = true;
    possibleStraight = true;
  }

  return possibleStraight || false;
};


/**
 * OnePair constructor
 * @constructor
 * */

function OnePair(cards) {
  Hand.call(this, cards);
  this.isPossible();
}

extend(Hand, OnePair);

OnePair.prototype.name = 'One Pair';

OnePair.prototype.rank = 1;

OnePair.prototype.isPossible = function() {
  if (this._isPossible) { return true; }

  var possibleOnePair, topThreeSingles,
      singles = filterByNumberOfCards(1, this),
      onePairs = filterByNumberOfCards(2, this);

  if (!_.isEmpty(onePairs)) {
    possibleOnePair = true;
    this._isPossible = true;

    topThreeSingles = singles[singles.length-3].concat(singles[singles.length-2]).concat(singles[singles.length-1]);

    this.bestHand = topThreeSingles.concat(onePairs[onePairs.length - 1]);
  }

  return possibleOnePair || false;
};

/**
 * HighCard constructor
 * @constructor
 * */

function HighCard(cards) {
  Hand.call(this, cards);
  this.isPossible();
}

extend(Hand, HighCard);

HighCard.prototype.name = 'High Card';

HighCard.prototype.rank = 0;

HighCard.prototype.isPossible = function() {
  if (this._isPossible) { return true; }

  this._isPossible = true;

  var i = 5,
      definedValues = this.values.filter(function(value) {
        return typeof value !== 'undefined';
      });

  definedValues = _.flatten(definedValues);
  while(i--) {
    this.bestHand.unshift(definedValues.pop());
  }

  return true;
};

module.exports = {
  'Hand' : Hand,
  'StraightFlush' : StraightFlush,
  'FourOfAKind' : FourOfAKind,
  'FullHouse': FullHouse,
  'Flush': Flush,
  'Straight': Straight,
  'ThreeOfAKind': ThreeOfAKind,
  'TwoPair': TwoPair,
  'OnePair': OnePair,
  'HighCard': HighCard
};

/**
 * Private Helper Functions (Not exported)
 */

function filterByNumberOfCards(numberToFilter, hand) {
  return hand.values.filter(function(value) {
    if (value) {
      return value.length === numberToFilter;
    }
  });
}

//method used to create prototypical inheritance between a parent and child class
function extend(parent, child) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}

//function that runs everytime a hand is created to populate the 'allCards' array
function generateCardsInHand(hand, cards) {
  hand.allCards = cards.map(function(card) {
    if (typeof card === 'string') {
      //calls the 'Card' constructor to create new cards if necessary
      return new Card(card.substring(0,1), card.substring(1));
    } else {
      return card;
    }
  });
}

//sorts the 'allCards' array so the order is lowest cards first, highest cards last
function sortCardsInHand(hand) {
  hand.allCards.sort(function(a,b) {
    if (a.rank > b.rank) {
      return 1;
    } else if (a.rank < b.rank) {
      return -1;
    } else {
      return 0;
    }
  });
}

//plucks each value and adds to the 'suits' key value store on each hand object
function populateValuesSuits(hand) {
  hand.allCards.forEach((function(card) {
    if (!this.suits.hasOwnProperty(card.suit)) {
      this.suits[card.suit] = [];
    }

    if (!this.values.hasOwnProperty(card.rank)) {
      this.values[card.rank] = [];
    }

    this.suits[card.suit].push(card);
    this.values[card.rank].push(card);
  }).bind(hand));
}
