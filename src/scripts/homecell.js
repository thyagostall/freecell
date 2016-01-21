'use strict';

function HomeCell(context, x, y) {
	this.cards = [];

	this._context = context;
	this._x = x;
	this._y = y;
}

HomeCell.prototype = Object.create(Cell.prototype);
HomeCell.prototype.constructor = HomeCell;


HomeCell.prototype.howManyAcceptables = function(origin) {
	if (origin.cards.length == 0) {
		return 0;
	}
	
	var card = origin.cards[0]
	if (card.number === 'A' || isNextSameSuit(card)) {
		return 1;
	} else {
		return 0;
	}
};