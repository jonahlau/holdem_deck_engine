'use strict';

/**
 * @constructor
 * @param {string} value - value of the card (e.g. "K" for "King")
 * @param {string} suit - suit of the card (e.g. "S" for "Spades", "C" for "Clubs", "D" for Diamonds, "H" for Hearts)
 * */

var Card = function(value, suit) {
  this.value = value;
  this.suit = suit;
  this.rank = this._values.indexOf(this.value); // +1 so ranks start at 1 instead of 0
};

/**
* List of all available card values from 2 to Ace
* */

Card.prototype._values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

/**
* List of all available suits
* 'S' - Spades
* 'H' - Hearts
* 'D' - Diamonds
* 'C' - Clubs
* */

Card.prototype._suits = ['s', 'h', 'c', 'd'];

/**
* Replaces toString method on all instances of Card.
* Sample output: "Two of Spades" would output "2S"
* */

Card.prototype.toString = function() {
  return "" + this.value + this.suit;
};

module.exports = Card;