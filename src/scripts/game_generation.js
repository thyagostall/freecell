'use strict';

function range(start, end) {
	var result = [];
	for (var i = start; i <= end; i++) {
		result.push(i);
	}
	return result;	
}

function createGame(seed) {
	var num_cols = 8;
	var number = seed;

	var getNextValue = function() {
		seed = ((seed * 214013 + 2531011) & 0x7fffffff);
		return ((seed >> 16) & 0x7fff);
	};

	var shuffle = function(deck) {
		var temp, j;
		var last = deck.length - 1;
		
		for (var i = last; i >= 0; i--) {
			j = getNextValue() % (i + 1);
			temp = deck[i];
			deck[i] = deck[j];
			deck[j] = temp;
		}
		return deck;
	};

	var columns = [[], [], [], [], [], [], [], []];
	var deck = range(0, 51);

	shuffle(deck);
	deck = deck.reverse();

	var gameState = {
		'n': number,
		'h': [[], [], [], []],
		'f': [[], [], [], []],
		's': [[], [], [], [], [], [], [], []]
	};	

	for (var i = 0; i < 52; i++) {
		gameState.s[i % num_cols].push(deck[i]);
	}

	return gameState;
}
