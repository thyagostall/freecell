'use strict';

function HomeCell(context, x, y) {
	this._context = context;
	this._x = x;
	this._y = y;
}

HomeCell.prototype = new Cell(this._context, this._x, this._y);
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