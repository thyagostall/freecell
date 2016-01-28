'use strict';

var CARD_WIDTH = 71;
var CARD_HEIGHT = 96;

var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 480;

var CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
var CARD_SUITS = ['C', 'D', 'H', 'S'];

var BACKGROUND_COLOR = '#008000';

function getColor(suit) {
	if (suit === 'H' || suit === 'D') {
		return 'Red';
	} else {
		return 'Black';
	}
}

function isNextSameSuit(current, candidate) {
	if (current.number === 'K') {
		return false;
	}

	var nextNumber = CARD_VALUES.indexOf(current.number);
	nextNumber++;
	nextNumber = CARD_VALUES[nextNumber];

	return nextNumber === candidate.number && current.suit === candidate.suit;
}

function isPreviousInvertedSuit(current, candidate) {
	if (current.number === 'A') {
		return false;
	}

	var previousRank = CARD_VALUES.indexOf(current.rank);
	previousRank--;
	previousRank = CARD_VALUES[previousRank];

	var result = previousRank === candidate.rank;
	result &= getColor(current.suit) !== getColor(candidate.suit);
	return result;
}