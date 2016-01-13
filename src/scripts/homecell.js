'use strict';

function HomeCell(context, x, y) {
	this._context = context;
	this._x = x;
	this._y = y;
}

HomeCell.prototype = new Cell(this._context, this._x, this._y);
HomeCell.prototype.constructor = HomeCell;


HomeCell.prototype.doesAccept = function(card) {
	if (card.number === 'A') {
		return true;
	} else {
		return isNextSameSuit(card);
	}
};