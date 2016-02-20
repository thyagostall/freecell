'use strict';

function KingIcon(assets, context, x, y) {
	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x + 38, y);
	context.moveTo(x, y);
	context.lineTo(x, y + 38);
	context.lineWidth = 1;
	context.strokeStyle = '#00F000';
	context.stroke();

	context.beginPath();
	context.moveTo(x + 38, y);
	context.lineTo(x + 38, y + 38);
	context.moveTo(x + 38, y + 38);
	context.lineTo(x, y + 38);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();

	this._context = context;
	this._x = x;
	this._y = y;
	this._image = assets.images['king'];
	this._imageWin = assets.images['king_win'];	
}

KingIcon.prototype._updateKingImpl = function(type) {
	var context = this._context,
		x = this._x,
		y = this._y,
		image = this._image,
		pos = 0;
	
	if (type == 'left') {
		pos = 32;
	}
	context.fillStyle = BACKGROUND_COLOR;
	context.fillRect(x + 3, y + 3, 32, 32);
	context.drawImage(image, pos, 0, 32, 32, x + 3, y + 3, 32, 32);
}

KingIcon.prototype.updateLeft = function() {
	this._updateKingImpl('left');
};

KingIcon.prototype.updateRight = function() {
	this._updateKingImpl('right');
};

KingIcon.prototype.win = function() {
	var context = this._context,
		x = this._x,
		y = this._y,
		image = this._imageWin;

	context.fillStyle = BACKGROUND_COLOR;
	context.fillRect(x + 3, y + 3, 32, 32);
	context.drawImage(image, 10, 105);
}