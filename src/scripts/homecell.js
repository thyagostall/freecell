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
	if (origin.cards.length === 0) {
		return 0;
	}
	
	var currentOrigin = origin.cards.length - 1;
	var candidate = origin.cards[currentOrigin];
	var current = undefined;
	if (this.cards.length > 0) {
		var length = this.cards.length;
		current = this.cards[length - 1];
	}

	if (candidate.rank === 'A' || isNextSameSuit(current, candidate)) {
		return 1;
	} else {
		return 0;
	}
};