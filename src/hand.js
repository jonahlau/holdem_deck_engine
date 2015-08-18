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
  var possibleStraight;

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

FourOfAKind.prototype.isPossible = function() {
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

FourOfAKind.prototype.isPossible = function() {
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

Flush.prototype.isPossible = function() {
  var possibleFlush = false;
  for (var suit in this.suits) {
    if (this.suits[suit].length >= 5) {
      possibleFlush = true;

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
  var possibleStraight, continuousCardCount, rankDiff;
  //
  //var aceFound = this.allCards.filter(function(card) {
  //  return
  //})

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

TwoPair.prototype.isPossible = function() {
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

OnePair.prototype.isPossible = function() {
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

HighCard.prototype.isPossible = function() {
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
