'use strict';

var Card = require('./card'),
    _ = require('lodash');

/**
 * Hand constructor
 * @constructor
 * @param {Array} cards - Array of 7 cards in object form or represented as a string (e.g. "7h")
 * */

var Hand = function(cards) {
  this.cardsInHand = [];
  this.suits = {};
  this.values = {};

  generateCardsInHand(this, cards);
  sortCardsInHand(this);
  populateValuesSuits(this);
};


/**
 * StraightFlush constructor
 * @constructor
 * */

var StraightFlush = function(cards) {
  Hand.call(this, cards);
};

extend(Hand, StraightFlush);

StraightFlush.prototype.name = "Straight Flush";

StraightFlush.prototype.make = function() {
  _.find(this.suits, function())
};

module.exports = {
  Hand : Hand,
  StraightFlush : StraightFlush
};


/**
 * Private Helper Functions (Not exported)
 */

function extend(parent, child) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}

function generateCardsInHand(hand, cards) {
  hand.cardsInHand = cards.map(function(card) {
    if (typeof card === 'string') {
      return new Card(card.substring(0,1), card.substring(1));
    } else {
      return card;
    }
  });
}

function sortCardsInHand(hand) {
  hand.cardsInHand.sort(function(a,b) {
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
  hand.cardsInHand.forEach((function(card) {
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