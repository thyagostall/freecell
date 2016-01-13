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

	if (this.card) {
		this._selected = true;
		this.card.select();
		result = this.card;
	} else {
		this._selected = false;
	}

	return result;
};

FreeCell.prototype.deselect = function() {
	if (this.card) {
		this.card.deselect();
	}
	this._selected = false;
};

FreeCell.prototype.isSelected = function() {
	return this._selected;
};	

FreeCell.prototype.doesAccept = function() {
	return !this.card;
};

FreeCell.prototype.isBusy = function() {
	return this.card;
};