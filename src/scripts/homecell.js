'use strict';

function HomeCell(context, x, y) {
	this.cards = [];

	this._context = context;
	this._x = x;
	this._y = y;
}

HomeCell.prototype = Object.create(Cell.prototype);
HomeCell.prototype.constructor = HomeCell;

HomeCell.prototype.draw = function() {
	var x = this._x,
	    y = this._y,
	    context = this._context;

	context.fillStyle = BACKGROUND_COLOR;
	context.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);

	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x + CARD_WIDTH - 1, y);
	context.moveTo(x, y);
	context.lineTo(x, y + CARD_HEIGHT - 1);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	context.beginPath();
	context.moveTo(x + CARD_WIDTH - 1, y);
	context.lineTo(x + CARD_WIDTH - 1, y + CARD_HEIGHT - 1);
	context.moveTo(x + CARD_WIDTH - 1, y + CARD_HEIGHT - 1);
	context.lineTo(x, y + CARD_HEIGHT - 1);
	context.lineWidth = 1;
	context.strokeStyle = '#00F000';
	context.stroke();

	if (this.cards.length > 0) {
		this.cards[this.cards.length - 1].draw(x, y);
	}
};

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