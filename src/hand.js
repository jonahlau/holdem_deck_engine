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
  this.values = {};

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

StraightFlush.prototype.make = function() {
  var possibleStraight

  _.find(this.suits, function() {})
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

FourOfAKind.prototype.make = function() {
  var possibleStraight

};


/**
 * FullHouse constructor
 * @constructor
 * */

function FullHouse(cards) {
  Hand.call(this, cards);
}

extend(Hand, FullHouse);

FourOfAKind.prototype.name = 'Full House';

FourOfAKind.prototype.rank = 6;

FourOfAKind.prototype.make = function() {
  var possibleStraight

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

Flush.prototype.make = function() {
  var possibleFlush = false;
  for (var suit in this.suits) {
    if (this.suits[suit].length >= 5) {
      possibleFlush = true;
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

Straight.prototype.make = function() {
  var possibleStraight;

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

ThreeOfAKind.prototype.make = function() {
  var possibleStraight;

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

TwoPair.prototype.make = function() {
  var possibleStraight;

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

OnePair.prototype.make = function() {
  var possibleStraight;

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

HighCard.prototype.make = function() {
  var possibleStraight;

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
