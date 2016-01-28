'use strict';

function range(start, end) {
	var result = [];
	for (var i = start; i <= end; i++) {
		result.push(i);
	}
	return result;	
}

function generate_game(seed) {
	var num_cols = 8;

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

	for (var i = 0; i < 52; i++) {
		columns[i % num_cols].push(deck[i]);
	}

	return columns;
}

function render_like_oracle(columns) {
	var render_card = function (card) {
		var suit = (card % 4);
		var rank = Math.floor(card / 4);

		return 'A23456789TJQK'.charAt(rank) + 'CDHS'.charAt(suit);
	};

	var render_column = function(col, index) {
		return ': ' + col.map(render_card).join(' ') + '\n';
	};

	return columns.map(render_column).join('');
}
