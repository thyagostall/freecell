'use strict';

function FreeCell(context, x, y) {
	this._selected = false;

	this._context = context;
	this._x = x;
	this._y = y;
}	

FreeCell.prototype = new Cell(this._context, this._x, this._y);
FreeCell.prototype.constructor = FreeCell;

FreeCell.prototype.select = function() {
	var result;

	if (this.cards.length > 0) {
		this._selected = true;
		this.cards[0].select();
		result = this.cards[0];
	} else {
		this._selected = false;
	}

	return result;
};

FreeCell.prototype.deselect = function() {
	if (this.cards.length > 0) {
		this.cards[0].deselect();
	}
	this._selected = false;
};

FreeCell.prototype.isSelected = function() {
	return this._selected;
};	

FreeCell.prototype.howManyAcceptables = function() {
	return 1 - this.cards.length;
};

FreeCell.prototype.isBusy = function() {
	return this.card;
};