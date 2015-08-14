'use strict';

var Card = require('./card');

/**
* Deck constructor - generates a deck of 52 cards
* @constructor
* @returns {Object} - To access the cards in the deck, call new Deck().cards
* */

var Deck = function() {
  this.cards = [];

  Card.prototype._values.forEach((function(value) {
    Card.prototype._suits.forEach((function(suit) {
      this.cards.push(new Card(value, suit));
    }).bind(this));
  }).bind(this))
};

/**
* @param {number} n - number of times to shuffle the deck
* @returns {Object} - To access the cards in the deck, call new Deck().cards
* */

Deck.prototype.shuffle = function(n) {
  var i, k, temp;

  for (i=0; i < n; i++) {
    this.cards.forEach((function(currCard, i) {
      k = Math.floor(Math.random() * this.cards.length);
      temp = this.cards[k];
      this.cards[k] = currCard;
      this.cards[i] = temp;
    }).bind(this));
  }

  return this;
};

/**
* Function that deals the top card in the deck
* @returns {Object} - an instance of Card
* */

Deck.prototype.deal = function() {
  return this.cards.shift();
};

console.log(new Deck().shuffle(1));