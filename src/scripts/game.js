var CARD_WIDTH = 71;
var CARD_HEIGHT = 96;

var CANVAS_HEIGHT = 480;
var CANVAS_WIDTH = 640;

var CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
var CARD_SUITS = ['D', 'S', 'H', 'C'];

var BACKGROUND_COLOR = '#008000';

function Cell(context, x, y) {
	this.card = null;

	this.x = x;
	this.y = y;

	this.draw = function() {
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

	this.push = function(card) {
		this.card = card;
	};

	this.pop = function() {
		this.card = null;
	};

	this.isInside = function(x, y) {
		return (
			x >= this.x &&
			x <= this.x + CARD_WIDTH &&
			y >= this.y &&
			y <= this.y + CARD_HEIGHT
		);
	};
}

function HomeCell(context, x, y) {
	this.prototype = new Cell(context, x, y);

	this.draw = function() {
		return this.prototype.draw();
	};

	this.push = function(card) {
		return this.prototype.push(card);
	};

	this.pop = function() {
		this.prototype.pop();
	};

	this.isInside = function(x, y) {
		return this.prototype.isInside(x, y);
	};

	this.doesAccept = function(card) {
		if (card.number === 'A') {
			return true;
		} else {
			return isNextSameSuit(card);
		}
	};
}

function FreeCell(context, x, y) {
	var _selected = false;
	this.prototype = new Cell(context, x, y);

	this.select = function() {
		var result;

		if (this.prototype.card) {
			_selected = true;
			this.prototype.card.select();
			result = this.prototype.card;
		} else {
			_selected = false;
		}

		return result;
	};

	this.deselect = function() {
		if (this.prototype.card) {
			this.prototype.card.deselect();
		}
		_selected = false;
	};

	this.isSelected = function() {
		return _selected;
	};

	this.draw = function() {
		return this.prototype.draw();
	};

	this.push = function(card) {
		return this.prototype.push(card);
	};

	this.pop = function() {
		return this.prototype.pop();
	};

	this.isInside = function(x, y) {
		return this.prototype.isInside(x, y);
	};

	this.doesAccept = function() {
		return !this.prototype.card;
	};

	this.isBusy = function() {
		return this.prototype.card;
	};
}

function Stack(context, x, y) {
	var CARD_OFFSET_Y = 18;
	var selected = false;

	this.streakSize = 0;

	this.x = x;
	this.y = y;

	this.cards = [];

	this.draw = function() {
		context.fillStyle = BACKGROUND_COLOR;
		context.fillRect(x, y, CARD_WIDTH, CANVAS_HEIGHT);

		for (var i = 0; i < this.cards.length; i++) {
			this.cards[i].draw(x, y + i * CARD_OFFSET_Y);
		}
	};

	this.push = function(card) {
		this.cards.push(card);
		this.streakSize++;
	};

	this.pop = function() {
		var index = this.cards.length - 1;
		this.cards[index].deselect();
		this.cards.pop();
		this.streakSize--;
	};

	this.select = function() {
		var index = this.cards.length - 1;
		if (index >= 0) {
			this.cards[index].select();
			selected = true;
			return this.cards[index];
		}
	};

	this.deselect = function() {
		var index = this.cards.length - 1;
		if (index >= 0) {
			this.cards[index].deselect();
			selected = false;
		}
	};

	this.isSelected = function() {
		return selected;
	};

	this.doesAccept = function(card) {
		if (this.cards.length === 0) {
			return true;
		}
		var last = this.cards.length - 1;
		return isPreviousInvertedSuit(this.cards[last], card);
	};

	this.isInside = function(x, y) {
		var height = CARD_OFFSET_Y * (this.cards.length - 1) + CARD_HEIGHT;
		return (
			x >= this.x &&
			x <= this.x + CARD_WIDTH &&
			y >= this.y &&
			y <= this.y + height
		);
	};
}

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

	var image = assets.images['king'];

	function updateKingImpl(type) {
		var pos = 0;
		if (type == 'left') {
			pos = 32;
		}
		context.fillStyle = BACKGROUND_COLOR;
		context.fillRect(x + 3, y + 3, 32, 32);
		context.drawImage(image, pos, 0, 32, 32, x + 3, y + 3, 32, 32);
	}

	this.updateLeft = function() {
		updateKingImpl('left');
	};

	this.updateRight = function() {
		updateKingImpl('right');
	};
}

function AssetLoader() {
	var sources = {
		'cards': './images/freecell_cards.png',
		'selected_cards': './images/freecell_cards_selected.png',
		'king': './images/freecell_king.png'
	};
	var sourceCount = Object.keys(sources).length;
	var loadedImages = 0;
	var _callback;

	this.images = {};

	var imageLoaded = function() {
		loadedImages++;
		if (loadedImages == sourceCount) {
			_callback();
		}
	};

	this.loadAll = function(callback) {
		_callback = callback;
		for (var key in sources) {
			var image = new Image();
			image.src = sources[key];
			image.onload = imageLoaded;
			this.images[key] = image;
		}
	};
}

function getColor(suit) {
	var suitIndex = CARD_SUITS.indexOf(suit);
	if (suitIndex % 2) {
		return 'Black';
	} else {
		return 'Red';
	}
}

function isNextSameSuit(current, candidate) {
	if (current.number === 'K') {
		return false;
	}

	var nextNumber = CARD_VALUES.indexOf(current.number);
	nextNumber++;
	nextNumber = CARD_VALUES[nextNumber];

	return nextNumber === candidate.number && current.suit === candidate.suit;
}

function isPreviousInvertedSuit(current, candidate) {
	if (current.number === 'A') {
		return false;
	}

	var previousNumber = CARD_VALUES.indexOf(current.number);
	previousNumber--;
	previousNumber = CARD_VALUES[previousNumber];

	var result = previousNumber === candidate.number;
	result &= getColor(current.suit) !== getColor(candidate.suit);
	return result;
}

function Game(canvasId) {
	var _this = this;
	var _canvas;
	var _context;
	var _king;

	var _componentDict = [];
	var _freeCells = [];
	var _homeCells = [];
	var _stacks = [];

	var _countFreeCells = function() {
		var result = 0;
		for (var i = 0; i < _freeCells.length; i++) {
			if (!_freeCells[i].isBusy()) {
				result++;
			}
		}
		return result;
	};

	var _getComponentAt = function(x, y) {
		for (var i = 0; i < _componentDict.length; i++) {
			if (_componentDict[i].isInside(x, y)) {
				return _componentDict[i];
			}
		}
	};

	var _isSelectable = function(component) {
		return component && component.select;
	};

	var _delesectAll = function() {
		for (var i = 0; i < _componentDict.length; i++) {
			if (_isSelectable(_componentDict[i])) {
				_componentDict[i].deselect();
			}
		}
	};

	var _findFreeCell = function() {
		for (var i = 0; i < _freeCells.length; i++) {
			if (!_freeCells[i].isBusy()) {
				return _freeCells[i];
			}
		}
	};

	this.init = function() {
		var i;

		_canvas = $(canvasId)[0];
		_canvas.width = CANVAS_WIDTH;
		_canvas.height = CANVAS_HEIGHT;

		_context = _canvas.getContext('2d');
		_context.fillStyle = BACKGROUND_COLOR;
		_context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		var assets = new AssetLoader();
		assets.loadAll(function() {
			_king = new KingIcon(assets, _context, 292, 20);
			_king.updateRight();

			_freeCells[0] = new FreeCell(_context, 1, 1);
			_freeCells[1] = new FreeCell(_context, 72, 1);
			_freeCells[2] = new FreeCell(_context, 143, 1);
			_freeCells[3] = new FreeCell(_context, 214, 1);

			_homeCells[0] = new HomeCell(_context, 339, 1);
			_homeCells[1] = new HomeCell(_context, 410, 1);
			_homeCells[2] = new HomeCell(_context, 481, 1);
			_homeCells[3] = new HomeCell(_context, 552, 1);

			_stacks[0] = new Stack(_context, 8, 112);
			_stacks[1] = new Stack(_context, 84, 112);
			_stacks[2] = new Stack(_context, 160, 112);
			_stacks[3] = new Stack(_context, 236, 112);
			_stacks[4] = new Stack(_context, 312, 112);
			_stacks[5] = new Stack(_context, 388, 112);
			_stacks[6] = new Stack(_context, 464, 112);
			_stacks[7] = new Stack(_context, 540, 112);

			for (i = 0; i < _freeCells.length; i++) {
				_componentDict.push(_freeCells[i]);
			}
			for (i = 0; i < _homeCells.length; i++) {
				_componentDict.push(_homeCells[i]);
			}
			for (i = 0; i < _stacks.length; i++) {
				_componentDict.push(_stacks[i]);
			}

			for (i = 0; i < 8; i++) {
				_stacks[i].push(new Card(assets, _context, 'KC'));
			}
			_stacks[0].push(new Card(assets, _context, 'QD'));
			_stacks[0].push(new Card(assets, _context, 'JC'));
			_stacks[0].push(new Card(assets, _context, 'TD'));

			_freeCells[0].push(new Card(assets, _context, 'AD'));
			_this.draw();

			_canvas.onmousemove = function(e) {
				var x = e.offsetX;
				var y = e.offsetY;

				if (y <= 95) {
					if (x < 285) {
						_king.updateLeft();
					} else if (x > 339) {
						_king.updateRight();
					}
				}
			};

			_canvas.onclick = function(e) {
				var x = e.offsetX;
				var y = e.offsetY;

				_this.makeMove(x, y);
				_this.draw();
			};

			_canvas.ondblclick = function(e) {
				var x = e.offsetX;
				var y = e.offsetY;

				_this.moveToFreeCell(x, y);
				_this.draw();
			};
		});
	};

	this.moveToFreeCell = function(x, y) {
		if (this._selected) {
			return;
		}

		var destination = _findFreeCell();
		if (destination) {
			this.origin = _getComponentAt(x, y);
			if (this.origin) {
				this._selected = this.origin.select();
			}
			this.move(destination);
		}
	};

	this.move = function(destination) {
		var i;
		var qty = 1;
		if (this.origin instanceof Stack && destination instanceof Stack) {
			qty = this.origin.streakSize;
		}

		qty = Math.min(qty, _countFreeCells() + 1);
		var temp = [];

		for (i = 0; i < qty; i++) {
			temp.push(this._selected);
			this.origin.pop();
			this._selected.deselect();
			this._selected = this.origin.select();
		}

		for (i = 0; i < qty; i++) {
			destination.push(temp.pop());
		}

		if (this._selected) {
			this._selected.deselect();
			this._selected = null;
		}
	};

	this.makeMove = function(x, y) {
		_delesectAll();
		var component = _getComponentAt(x, y);
		if (!component) {
			this._selected.deselect();
			this._selected = null;
			return;
		}

		if (this._selected) {
			var destination = component;
			if (destination) {
				if (destination.doesAccept(this._selected)) {
					this.move(destination);
				} else {
					if (destination !== this.origin) {
						// console.log('impossible move!!');
					}
				}

				if (this._selected) {
					this._selected.deselect();
					this._selected = null;
				}
			}
		} else {
			this.origin = component;
			if (this.origin) {
				this._selected = this.origin.select();
			}
		}
	};

	this.draw = function() {
		var i;
		for (i = 0; i < _freeCells.length; i++) {
			_freeCells[i].draw();
		}
		for (i = 0; i < _homeCells.length; i++) {
			_homeCells[i].draw();
		}
		for (i = 0; i < _stacks.length; i++) {
			_stacks[i].draw();
		}
	};
}

var game = new Game('#cardgame');
game.init(); 
