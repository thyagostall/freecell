'use strict';

function Card(assets, context, code) {
	if (typeof code === 'string') {
		this.rank = code.charAt(0);
		this.suit = code.charAt(1);
	} else {
		this.rank = code / 4;
		this.suit = code % 4;

		this.rank = CARD_VALUES.charAt(this.rank);
		this.suit = CARD_VALUES.charAt(this.suit);
	}

	this.image = assets.images['cards'];
	this.image_selected = assets.images['selected_cards'];

	this.selected = false;
	this.context = context;
}

Card.prototype._getHorizontalPositionGrid = function(rank) {
	switch (rank) {
	case 'A':
		return 0;
	case 'T':
		return 9;
	case 'J':
		return 10;
	case 'Q':
		return 11;
	case 'K':
		return 12;
	default:
		return parseInt(rank) - 1;
	}
};

Card.prototype._getVerticalPositionGrid = function(suit) {
	switch (suit) {
	case 'D':
		return 0;
	case 'H':
		return 1;
	case 'S':
		return 2;
	case 'C':
		return 3;
	}
};

Card.prototype.select = function() {
	this.selected = true;
};

Card.prototype.deselect = function() {
	this.selected = false;
};

Card.prototype.isSelected = function() {
	return this._selected;
};

Card.prototype.draw = function(x, y) {
	var spriteX = this._getHorizontalPositionGrid(this.rank);
	var spriteY = this._getVerticalPositionGrid(this.suit);

	spriteX = spriteX * CARD_WIDTH;
	spriteY = spriteY * CARD_HEIGHT;

	if (this.selected) {
		this.context.drawImage(this.image_selected, spriteX, spriteY, CARD_WIDTH, CARD_HEIGHT, x, y, CARD_WIDTH - 1, CARD_HEIGHT - 1);
	} else {
		this.context.drawImage(this.image, spriteX, spriteY, CARD_WIDTH, CARD_HEIGHT, x, y, CARD_WIDTH - 1, CARD_HEIGHT - 1);
	}
};
