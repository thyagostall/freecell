'use strict';

function Game(canvasId, gameEvents) {
	var _this = this;
	var _canvas;
	var _context;
	var _king;

	var _componentDict = [];
	var _freeCells = [];
	var _homeCells = [];
	var _stacks = [];

	var _previousGameState = '';
	var _cardsInGame;

	var _events = gameEvents;

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

	this._gameLoaded = function() {
		var i, j;

		_king = new KingIcon(_this.assets, _context, 292, 20);
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

			var state = gameToState(_componentDict);
			if (state !== _previousGameState) {
				_events.doStateChange(state);
				_previousGameState = state;
			}
		};
	}

	this.newGame = function(gameNumber) {
		_this.setGameState(createGame(gameNumber));
		_this.draw();
	}

	this.init = function() {
		_canvas = $(canvasId)[0];
 		_canvas.width = CANVAS_WIDTH;
		_canvas.height = CANVAS_HEIGHT;

		_context = _canvas.getContext('2d');
		_context.fillStyle = BACKGROUND_COLOR;
		_context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		_this.assets = new AssetLoader();
		_this.assets.loadAll(_this._gameLoaded);
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

	this.move = function(destination, qty) {
		var len = this.origin.cards.length;
		var cards = this.origin.cards.splice(len - qty);
		destination.cards = destination.cards.concat(cards);
	};

	this.makeMove = function(x, y) {
		_delesectAll();
		var component = _getComponentAt(x, y);
		if (!component) {
			this._selected = null;
			return;
		}

		if (component === this.origin) {
			this.origin = null;			
			this._selected = null;
			return;
		}

		if (this.origin) {
			var destination = component;
			if (destination) {
				var acceptableStreak = destination.howManyAcceptables(this.origin, _countFreeCells() + 1);
				if (acceptableStreak > 0) {
					this.move(destination, acceptableStreak);
					if (destination instanceof HomeCell) {
						_setCardsInGame(this.getCardsInGame() - acceptableStreak);
					}
				} else if (destination !== this.origin) {
					_events.doMovementNotAllowed();
				}

				this.origin = null;
			}
		} else {
			if (!(component instanceof HomeCell)) {
				this.origin = component;
				this.origin.select();
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

	this.setGameState = function(game) {
		var i, j;
		_setCardsInGame(0);
		
		for (i = 0; i < game.h.length; i++) {
			_homeCells[i].cards = [];
			
			for (j = 0; j < game.h[i].length; j++) {
				var card = new Card(this.assets, _context, game.h[i][j]);
				_homeCells[i].cards.push(card);
			}
		}	

		for (i = 0; i < game.f.length; i++) {
			_freeCells[i].cards = [];

			if (!game.f[i].length) {
				continue;
			}

			var card = new Card(this.assets, _context, game.f[i]);
			_freeCells[i].cards.push(card);
			_setCardsInGame(this.getCardsInGame() + 1);
		}

		for (i = 0; i < game.s.length; i++) {
			_stacks[i].cards = [];			
			
			for (j = 0; j < game.s[i].length; j++) {
				var card = new Card(this.assets, _context, game.s[i][j]);
				_stacks[i].cards.push(card);
				_setCardsInGame(this.getCardsInGame() + 1);
			}
		}
	}

	var _setCardsInGame = function(cardsInGame) {
		_cardsInGame = cardsInGame;
		_events.doCardQuantityChange(cardsInGame);
	}

	this.getCardsInGame = function() {
		return _cardsInGame;
	}
}

var gameEvents = new GameEvents();
var game = new Game('#cardgame', gameEvents);
game.init();