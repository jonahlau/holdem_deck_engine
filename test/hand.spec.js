var should = require('should'),
    Hand = require('../src/hand').Hand,
    StraightFlush = require('../src/hand').StraightFlush,
    FourOfAKind = require('../src/hand').FourOfAKind,
    FullHouse = require('../src/hand').FullHouse,
    Flush = require('../src/hand').Flush,
    Straight = require('../src/hand').Straight,
    ThreeOfAKind = require('../src/hand').ThreeOfAKind,
    TwoPair = require('../src/hand').TwoPair,
    OnePair = require('../src/hand').OnePair,
    HighCard = require('../src/hand').HighCard;

describe('Hand', function () {
    it('should create a hand with given 7 cards', function () {
        var hand = new Hand(['5c', '4c', '2d', '7s', '5s', '5c', '6d']);

        hand.allCards.length.should.equal(7);
        hand.allCards[0].value.should.equal('2');
        hand.allCards[0].suit.should.equal('d');
        hand.allCards[0].rank.should.equal(1);
    });

    it('should sort all cards given', function() {
        var hand = new Hand(['5c', '4c', '2d', '7s', '6s', '8h', '6d']);

        hand.allCards.length.should.equal(7);
        hand.allCards[0].value.should.equal('2');
        hand.allCards[0].suit.should.equal('d');
        hand.allCards[0].rank.should.equal(1);
        hand.allCards[1].value.should.equal('4');
        hand.allCards[1].suit.should.equal('c');
        hand.allCards[1].rank.should.equal(3);
        hand.allCards[2].value.should.equal('5');
        hand.allCards[2].suit.should.equal('c');
        hand.allCards[2].rank.should.equal(4);
        hand.allCards[3].value.should.equal('6');
        hand.allCards[3].suit.should.equal('s');
        hand.allCards[3].rank.should.equal(5);
    });

    it('populates suits and values', function() {
        var hand = new Hand(['5c', '4c', '5d', '5s', '6s', '8h', '6d']);
        hand.suits.should.have.property('d');
        hand.suits['d'].length.should.equal(2);
        hand.suits.should.have.property('c');
        hand.suits['c'].length.should.equal(2);
        hand.suits.should.have.property('s');
        hand.suits['s'].length.should.equal(2);
        hand.suits.should.have.property('h');
        hand.suits['h'].length.should.equal(1);

        hand.values.should.not.have.property(0);
        hand.values.should.not.have.property(1);
        hand.values.should.have.property(2);
        hand.values.should.have.property(3);
        hand.values.should.have.property(4);
        hand.values.should.have.property(6);
        hand.values[2].should.have.length(1);
        hand.values[3].should.have.length(3);
        hand.values[4].should.have.length(2);
        hand.values[6].should.have.length(1);
    });
});

describe('Flush constructor', function() {
  it('detects a flush', function() {
    var flush = new Flush(['3c', '9c', '5c', '6c', '7c', 'Ah', 'As']);
    flush.isPossible().should.equal(true);
    flush.bestHand.length.should.equal(5);

  });

  it('detects a flush and pushes only 5 cards to the bestHand array if there are more than 5 that make the flush', function() {
    var flush = new Flush(['3c', '9c', '5c', '6c', '7c', '8c', '10c']);
    flush.isPossible().should.equal(true);
    flush.bestHand.length.should.equal(5);
  });
});

describe('Straight constructor', function() {
  it('detects a straight', function() {
    var straight = new Straight(['3c', '4d', '5s', '6h', '7s', 'Ac', 'Ad']);
    straight.isPossible().should.equal(true);
  });

  it('returns false if there is no straight', function() {
    var straight = new Straight(['Ac', '4d', '5s', '6h', '7s', 'Ac', 'Ad']);
    straight.isPossible().should.equal(false);
  });
});
