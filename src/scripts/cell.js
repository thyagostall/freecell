'use strict';

function Cell(context, x, y) {
	this.card = null;

	this._context = context;
	this._x = x;
	this._y = y;
}


Cell.prototype.draw = function() {
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

	if (this.card) {
		this.card.draw(x, y);
	}
};

Cell.prototype.push = function(card) {
	this.card = card;
};

Cell.prototype.pop = function() {
	this.card = null;
};

Cell.prototype.isInside = function(x, y) {
	return (
		x >= this._x &&
		x <= this._x + CARD_WIDTH &&
		y >= this._y &&
		y <= this._y + CARD_HEIGHT
	);
};