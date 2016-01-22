'use strict';

var CARD_WIDTH = 71;
var CARD_HEIGHT = 96;

var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 480;

var CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
var CARD_SUITS = ['D', 'S', 'H', 'C'];
// var CARD_SUITS = ['C', 'D', 'H', 'S'];

var BACKGROUND_COLOR = '#008000';

function getColor(suit) {
	var suitIndex = CARD_SUITS.indexOf(suit);
	if (suitIndex % 2) {
		return 'Black';
	} else {
		return 'Red';
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

	var previousNumber = CARD_VALUES.indexOf(current.number);
	previousNumber--;
	previousNumber = CARD_VALUES[previousNumber];

	var result = previousNumber === candidate.number;
	result &= getColor(current.suit) !== getColor(candidate.suit);
	return result;
}