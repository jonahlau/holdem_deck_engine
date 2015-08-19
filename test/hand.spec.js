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

        hand.values[3].should.have.length(1);
        hand.values[4].should.have.length(3);
        hand.values[5].should.have.length(2);
        hand.values[7].should.have.length(1);
        should(hand.values[0]).equal(undefined);
        should(hand.values[1]).equal(undefined);
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

  it('detects a wheel', function() {
    var straight = new Straight(['Kc', '2d', '3s', '4h', '5s', 'Ac', '5d']);
    straight.isPossible().should.equal(true);
    straight.bestHand.length.should.equal(5);
    straight.bestHand[4].rank.should.equal(0);
    straight.bestHand[4].value.should.equal('A');
    straight.bestHand[3].value.should.equal('2');
    straight.bestHand[2].value.should.equal('3');
    straight.bestHand[1].value.should.equal('4');
    straight.bestHand[0].value.should.equal('5');
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
    fourOfAKind1.isPossible().should.equal(true);
    fourOfAKind1.bestHand.length.should.equal(5);
    fourOfAKind1.bestHand[0].value.should.equal('3');
    fourOfAKind1.bestHand[1].value.should.equal('3');
    fourOfAKind1.bestHand[2].value.should.equal('3');
    fourOfAKind1.bestHand[3].value.should.equal('3');
    fourOfAKind1.bestHand[fourOfAKind1.bestHand.length-1].value.should.equal('A');

    var fourOfAKind2 = new FourOfAKind(['3c', '3h', '3s', '7c', 'Ks', 'Qd', '3d']);
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
        threeOfAKind.isPossible().should.equal(true);
        threeOfAKind.bestHand[0].value.should.equal('3');
        threeOfAKind.bestHand[1].value.should.equal('3');
        threeOfAKind.bestHand[2].value.should.equal('3');
        threeOfAKind.bestHand[3].value.should.equal('A');
        threeOfAKind.bestHand[threeOfAKind.bestHand.length-1].value.should.equal('K');
    });

    it('returns false for hands that are not three of a kind', function() {
        var threeOfAKind = new ThreeOfAKind(['3c', '3d', '2h', '9s', '4c', '8s', '7d']);
        threeOfAKind.isPossible().should.equal(false);
    });
});

describe('TwoPair constructor', function() {
  it('detects a two pair and chooses the highest kicker', function() {
    var twoPair = new TwoPair(['3c', '3d', '5h', '5s', 'Ac', '9s', 'Kd']);
    twoPair.isPossible().should.equal(true);
    twoPair.bestHand[0].value.should.equal('5');
    twoPair.bestHand[1].value.should.equal('5');
    twoPair.bestHand[2].value.should.equal('3');
    twoPair.bestHand[3].value.should.equal('3');
    twoPair.bestHand[twoPair.bestHand.length-1].value.should.equal('A');
  });

  it('returns false for hands that are not full houses', function() {
    var twoPair = new TwoPair(['3c', '3d', '2h', '3s', '4c', '8s', '7d']);
    twoPair.isPossible().should.equal(false);
  });

  it('return highest two pairs if there are more than two pairs present', function() {
    var twoPair = new TwoPair(['3c', '3d', 'Kh', 'Ks', '4c', '4s', '7d']);
    twoPair.isPossible().should.equal(true);
    twoPair.bestHand[0].value.should.equal('K');
    twoPair.bestHand[1].value.should.equal('K');
    twoPair.bestHand[2].value.should.equal('4');
    twoPair.bestHand[3].value.should.equal('4');
    twoPair.bestHand[4].value.should.equal('7');
  });
});

describe('OnePair constructor', function() {
    it('detects a one pair', function() {
       var onePair = new OnePair(['8c', '6d', 'Kh', 'Ks', '4c', '4s', '7d']);
        onePair.isPossible().should.equal(true);
        console.log(onePair)
    });
});

describe('HighCard constructor', function() {
    it('detects a high card', function() {
        var highCard = new HighCard(['8c', '6d', 'Kh', 'As', '4c', '4s', '7d']);
        highCard.isPossible().should.equal(true);
        console.log(highCard);
    });
});
