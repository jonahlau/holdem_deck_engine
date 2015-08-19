'use strict';

var Card = require('./card'),
    _ = require('lodash');

/**
 * Hand constructor
 * @constructor
 * @param {Array} cards - Array of 7 cards in object form or represented as a string (e.g. '7h')
 * */

function Hand(cards) {
  this.allCards = [];
  this.bestHand = [];
  this.suits = {};
  this.values = [];
  this._isPossible = null;

  generateCardsInHand(this, cards);
  sortCardsInHand(this);
  populateValuesSuits(this);
}

/**
 * StraightFlush constructor
 * @constructor
 * */

function StraightFlush(cards) {
  Hand.call(this, cards);
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
      this.bestHand = this.values[i]
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
}

extend(Hand, Flush);

Flush.prototype.name = 'Flush';

Flush.prototype.rank = 5;

Flush.prototype.isPossible = function() {
  if (this._isPossible) { return true; }

  var possibleFlush = false;
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
  return possibleFlush;
};


/**
 * Straight constructor
 * @constructor
 * */

function Straight(cards) {
  Hand.call(this, cards);
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
    this.bestHand = threeOfAKinds[threeOfAKinds.length-1].concat(topKicker).concat(secondKicker);
  }

  return possibleThreeOfAKind || false;
};

/**
 * TwoPair constructor
 * @constructor
 * */

function TwoPair(cards) {
  Hand.call(this, cards);
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
    this.bestHand = topPair.concat(secondPair).concat(kicker);
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

    topThreeSingles = singles[singles.length-1].concat(singles[singles.length-2]).concat(singles[singles.length-3]);

    this.bestHand = onePairs[onePairs.length - 1].concat(topThreeSingles);
  }

  return possibleOnePair || false;
};

/**
 * HighCard constructor
 * @constructor
 * */

function HighCard(cards) {
  Hand.call(this, cards);
}

extend(Hand, HighCard);

HighCard.prototype.name = 'High Card';

HighCard.prototype.rank = 0;

HighCard.prototype.isPossible = function() {
  var definedValues = this.values.filter(function(value) {
    return typeof value !== 'undefined';
  });

  for (var i = definedValues.length - 1; i > 1; i--) {
    this.bestHand.push(definedValues[i]);
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

function extend(parent, child) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}

function generateCardsInHand(hand, cards) {
  hand.allCards = cards.map(function(card) {
    if (typeof card === 'string') {
      return new Card(card.substring(0,1), card.substring(1));
    } else {
      return card;
    }
  });
}

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
