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

describe('Hand constructor', function () {
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

    hand.values[3].should.have.length(1);
    hand.values[4].should.have.length(3);
    hand.values[5].should.have.length(2);
    hand.values[7].should.have.length(1);
    should(hand.values[0]).equal(undefined);
    should(hand.values[1]).equal(undefined);
  });

  it('should find the best hand given 7 cards', function() {
    var hand = Hand.make(['3c', '9c', '5c', '6c', '7c', 'Ah', 'As']);
    var hand2 = Hand.make(['3c', '4d', '5s', '6h', '7s', 'Ac', 'Ad']);

    hand.name.should.equal('Flush');
    hand.toString().should.equal('3c,5c,6c,7c,9c');

    hand2.name.should.equal('Straight');
    hand2.toString().should.equal(('3c,4d,5s,6h,7s'));
  });

  it('compares two hands and chooses the winning hand', function() {
    var lowerStraight = Hand.make(['8c', '7d', '6h', '5s', '4c', 'Ks', 'Kd']),
      higherStraight = Hand.make(['Ac', 'Kd', 'Qh', 'Js', 'Tc', '4s', '4d']),
      fullHouse = Hand.make(['Kc', 'Kd', 'Ks', 'As', 'Ad', '9d', '3c']);

    lowerStraight.compare(higherStraight).should.equal(-1);
    fullHouse.compare(higherStraight).should.equal(1);
  });

  it('compares two hands and accounts for higher kicker', function() {
    var highKicker = Hand.make(['Kc', 'Kd', 'Ah', '5s', '6d', '2s', '7d']),
      lowerKicker = Hand.make(['Kc', 'Kd', 'Qh', '5s', '6d', '2s', '7d']),
      threeOfAKindHi = Hand.make(['Kc', 'Kd', 'Kh', 'Ad', '3c', '2s']),
      threeOfAKindLow = Hand.make(['Kc', 'Kd', 'Kh', 'Qd', '6c', '2s']);

    lowerKicker.compare(highKicker).should.equal(-1);
    threeOfAKindHi.compare(threeOfAKindLow).should.equal(1);
  });

  it('compares two hands and accounts for higher kicker', function() {
    var highKicker = Hand.make(['Kc', 'Kd', 'Ah', '5s', '6d', '2s', '7d']),
      lowerKicker = Hand.make(['Kc', 'Kd', 'Qh', '5s', '6d', '2s', '7d']),
      threeOfAKindHi = Hand.make(['Kc', 'Kd', 'Kh', 'Ad', '3c', '2s']),
      threeOfAKindLow = Hand.make(['Kc', 'Kd', 'Kh', 'Qd', '6c', '2s']);

    lowerKicker.compare(highKicker).should.equal(-1);
    threeOfAKindHi.compare(threeOfAKindLow).should.equal(1);
  });

  it('tells if a hand can beat another hand', function() {
    var highKicker = Hand.make(['Kc', 'Kd', 'Ah', '5s', '6d', '2s', '7d']),
      lowerKicker = Hand.make(['Kc', 'Kd', 'Qh', '5s', '6d', '2s', '7d']),
      threeOfAKindHi = Hand.make(['Kc', 'Kd', 'Kh', 'Ad', '3c', '2s']),
      threeOfAKindLow = Hand.make(['Kc', 'Kd', 'Kh', 'Qd', '6c', '2s']);

    lowerKicker.beats(highKicker).should.equal(false);
    threeOfAKindHi.beats(threeOfAKindLow).should.equal(true);
  });

  it('tells if a hand loses to another hand', function() {
    var highKicker = Hand.make(['Kc', 'Kd', 'Ah', '5s', '6d', '2s', '7d']),
      lowerKicker = Hand.make(['Kc', 'Kd', 'Qh', '5s', '6d', '2s', '7d']),
      threeOfAKindHi = Hand.make(['Kc', 'Kd', 'Kh', 'Ad', '3c', '2s']),
      threeOfAKindLow = Hand.make(['Kc', 'Kd', 'Kh', 'Qd', '6c', '2s']);

    lowerKicker.losesTo(highKicker).should.equal(true);
    threeOfAKindHi.losesTo(threeOfAKindLow).should.equal(false);
  });

  it('tells if a hand ties with another hand', function() {
    var hand1 = Hand.make(['Kc', 'Kd', 'Ah', '5s', '6d', '2s', '7d']),
        hand2 = Hand.make(['Kc', 'Kd', 'Ah', '5s', '6d', '2h', '7c']),
        fullhouse1 = Hand.make(['Kc', 'Kd', 'Kh', 'Ad', 'Ac', '2s']),
        fullhouse2 = Hand.make(['Kc', 'Kd', 'Kh', 'Ad', 'As', '2d']);

    hand1.ties(hand2).should.equal(true);
    fullhouse1.ties(fullhouse2).should.equal(true);
  });

  it('picks winners out of multiple hands', function() {
    var hand1 = Hand.make(['8c', '7d', '6h', '5s', '4c', 'Ks', 'Kd']),
        hand2 = Hand.make(['Kc', 'Kd', 'Ah', '5s', '6d', '2h', '7c']),
        hand3 = Hand.make(['Kc', 'Kd', 'Kh', 'Ad', '3c', '2s', '7c']),
        winners = Hand.pickWinners([hand1,hand2,hand3]);

    winners.length.should.equal(1);
    winners[0].name.should.equal('Straight');

    var highKicker = Hand.make(['Kc', 'Kd', 'Ah', '5s', '6d', '2s', '7d']),
        lowerKicker = Hand.make(['Kc', 'Kd', 'Qh', '5s', '6d', '2s', '7d']);
        winners2 = Hand.pickWinners([highKicker, lowerKicker]);

    winners2.length.should.equal(1);
    winners2[0].bestHand[2].value.should.equal('A');
  });
});

describe('Flush constructor', function() {
  it('detects a flush', function() {
    var flush = new Flush(['3c', '9c', '5c', '6c', '7c', 'Ah', 'As']);
    flush.should.have.property('_isPossible');
    flush['_isPossible'].should.equal(true);
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
    straight.should.have.property('_isPossible');
    straight['_isPossible'].should.equal(true);
    straight.isPossible().should.equal(true);
  });

  it('returns false if there is no straight', function() {
    var straight = new Straight(['Ac', '4d', '5s', '6h', '7s', 'Ac', 'Ad']);
    straight.isPossible().should.equal(false);
  });

  it('detects a wheel', function() {
    var straight = new Straight(['Kc', '2d', '3s', '4h', '5s', 'Ac', '5d']);
    straight.isPossible().should.equal(true);
    straight.bestHand.length.should.equal(5);
    straight.bestHand[0].rank.should.equal(0);
    straight.bestHand[0].value.should.equal('A');
    straight.bestHand[1].value.should.equal('2');
    straight.bestHand[2].value.should.equal('3');
    straight.bestHand[3].value.should.equal('4');
    straight.bestHand[4].value.should.equal('5');
  });

  it('detects the highest possible straight', function() {
    var straight = new Straight(['Kc', 'Ad', 'Qs', 'Th', 'Js', '9c', '8d']);
    straight.isPossible().should.equal(true);
  });

  it('doesn\'t spill over if you have a hand like \'JKQA2\'', function() {
    var straight = new Straight(['8c', '9d', 'Js', 'Kh', 'Qs', 'Ac', '2d']);
    straight.isPossible().should.equal(false);
  })
});

describe('StraighFlush constructor', function() {
  it('detects a straight flush', function() {
    var straightFlush = new StraightFlush(['3c', '4c', '5c', '6c', '7c', 'As', 'Ad']);
    straightFlush.should.have.property('_isPossible');
    straightFlush['_isPossible'].should.equal(true);
    straightFlush.isPossible().should.equal(true);
    straightFlush.bestHand.length.should.equal(5);
  });

  it('returns false if there is no straight flush', function() {
    var straightFlush = new StraightFlush(['3d', '4c', '5c', '6c', '7c', 'Ac', 'Kc']);
    straightFlush.isPossible().should.equal(false);
  });

  it('returns false if there is a flush and a straight but does not qualify as straight flush', function() {
    var straightFlush = new StraightFlush(['3d', '4c', '5c', '6c', '7c', 'Ac', 'Kd']);
    straightFlush.isPossible().should.equal(false);
  });

  it('detects a straight flush when there is a kicker of higher suit', function() {
    var straightFlush = new StraightFlush(['3c', '4c', '5c', '6c', '7c', 'Ac', 'Kc']);
    straightFlush.isPossible().should.equal(true);
    straightFlush.bestHand.length.should.equal(5);
  });
});

describe('FourOfAKind constructor', function() {
  it('detects a four of a kind and chooses the highest kicker', function() {
    var fourOfAKind1 = new FourOfAKind(['3c', '3d', '3h', '3s', '7c', 'As', 'Ad']);
    fourOfAKind1.should.have.property('_isPossible');
    fourOfAKind1['_isPossible'].should.equal(true);
    fourOfAKind1.isPossible().should.equal(true);
    fourOfAKind1.bestHand.length.should.equal(5);
    fourOfAKind1.bestHand[0].value.should.equal('3');
    fourOfAKind1.bestHand[1].value.should.equal('3');
    fourOfAKind1.bestHand[2].value.should.equal('3');
    fourOfAKind1.bestHand[3].value.should.equal('3');
    fourOfAKind1.bestHand[fourOfAKind1.bestHand.length-1].value.should.equal('A');

    var fourOfAKind2 = new FourOfAKind(['3c', '3h', '3s', '7c', 'Ks', 'Qd', '3d']);
    fourOfAKind2.should.have.property('_isPossible');
    fourOfAKind2['_isPossible'].should.equal(true);
    fourOfAKind2.isPossible().should.equal(true);
    fourOfAKind2.bestHand.length.should.equal(5);
    fourOfAKind1.bestHand[0].value.should.equal('3');
    fourOfAKind1.bestHand[1].value.should.equal('3');
    fourOfAKind1.bestHand[2].value.should.equal('3');
    fourOfAKind1.bestHand[3].value.should.equal('3');
    fourOfAKind2.bestHand[fourOfAKind2.bestHand.length-1].value.should.equal('K')
  });

  it('returns false for hands that are not four of a kind', function() {
    var fourOfAKind = new FourOfAKind(['2c', '3d', '3h', '3s', '7c', 'As', 'Ad']);
    fourOfAKind.isPossible().should.equal(false);
  });
});


describe('FullHouse constructor', function() {
  it('detects a full house and chooses the highest pair kicker', function() {
    var fullHouse1 = new FullHouse(['3c', '3d', '3h', '4s', '4c', '7s', '7d']);
    fullHouse1.should.have.property('_isPossible');
    fullHouse1['_isPossible'].should.equal(true);
    fullHouse1.isPossible().should.equal(true);
    fullHouse1.bestHand.length.should.equal(5);
    fullHouse1.bestHand[0].value.should.equal('3');
    fullHouse1.bestHand[1].value.should.equal('3');
    fullHouse1.bestHand[2].value.should.equal('3');
    fullHouse1.bestHand[3].value.should.equal('7');
    fullHouse1.bestHand[4].value.should.equal('7');
  });

  it('returns false for hands that are not full houses', function() {
    var fullHouse1 = new FullHouse(['3c', '3d', '2h', '4s', '4c', '8s', '7d']);
    fullHouse1.isPossible().should.equal(false);
  });
});

describe('ThreeOfAKind constructor', function() {
  it('detects a two pair and chooses two highest kickers', function() {
    var threeOfAKind = new ThreeOfAKind(['3c', '3d', '3h', '5s', 'Ac', '9s', 'Kd']);
    threeOfAKind.should.have.property('_isPossible');
    threeOfAKind['_isPossible'].should.equal(true);
    threeOfAKind.isPossible().should.equal(true);
    threeOfAKind.bestHand[4].value.should.equal('3');
    threeOfAKind.bestHand[3].value.should.equal('3');
    threeOfAKind.bestHand[2].value.should.equal('3');
    threeOfAKind.bestHand[1].value.should.equal('A');
    threeOfAKind.bestHand[0].value.should.equal('K');
  });

  it('returns false for hands that are not three of a kind', function() {
    var threeOfAKind = new ThreeOfAKind(['3c', '3d', '2h', '9s', '4c', '8s', '7d']);
    threeOfAKind.isPossible().should.equal(false);
  });
});

describe('TwoPair constructor', function() {
  it('detects a two pair and chooses the highest kicker', function() {
    var twoPair = new TwoPair(['3c', '3d', '5h', '5s', 'Ac', '9s', 'Kd']);
    twoPair.should.have.property('_isPossible');
    twoPair['_isPossible'].should.equal(true);
    twoPair.isPossible().should.equal(true);
    twoPair.bestHand[4].value.should.equal('5');
    twoPair.bestHand[3].value.should.equal('5');
    twoPair.bestHand[2].value.should.equal('3');
    twoPair.bestHand[1].value.should.equal('3');
    twoPair.bestHand[0].value.should.equal('A');
  });

  it('returns false for hands that are not full houses', function() {
    var twoPair = new TwoPair(['3c', '3d', '2h', '3s', '4c', '8s', '7d']);
    twoPair.isPossible().should.equal(false);
  });

  it('return highest two pairs if there are more than two pairs present', function() {
    var twoPair = new TwoPair(['3c', '3d', 'Kh', 'Ks', '4c', '4s', '7d']);
    twoPair.isPossible().should.equal(true);
    twoPair.bestHand[4].value.should.equal('K');
    twoPair.bestHand[3].value.should.equal('K');
    twoPair.bestHand[2].value.should.equal('4');
    twoPair.bestHand[1].value.should.equal('4');
    twoPair.bestHand[0].value.should.equal('7');
  });
});

describe('OnePair constructor', function() {
  it('detects a one pair', function() {
    var onePair = new OnePair(['8c', '6d', 'Kh', 'Ks', '4c', '4s', '7d']);
    onePair.should.have.property('_isPossible');
    onePair['_isPossible'].should.equal(true);
    onePair.isPossible().should.equal(true);
  });
});

describe('HighCard constructor', function() {
  it('detects a high card', function() {
    var highCard = new HighCard(['8c', '6d', 'Kh', 'As', '4c', '4s', '7d']);
    highCard.should.have.property('_isPossible');
    highCard['_isPossible'].should.equal(true);
    highCard.isPossible().should.equal(true);
    highCard.bestHand[4].value.should.equal('A');
    highCard.bestHand[3].value.should.equal('K');
    highCard.bestHand[2].value.should.equal('8');
    highCard.bestHand[1].value.should.equal('7');
    highCard.bestHand[0].value.should.equal('6');
  });
});
