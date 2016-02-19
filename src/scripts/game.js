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
	var _running = false;

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
			if (!_running) {
				console.log('not running');
				return;
			}

			if (!_areThereAvailableMoves()) {
				_running = false;
				_events.doGameOver();
				return;
			}

			var x = e.offsetX;
			var y = e.offsetY;

			_this.makeMove(x, y);
			_this.draw();

			var state = gameToState(_componentDict, _this.gameNumber);
			if (state !== _previousGameState) {
				_events.doStateChange(state);
				_previousGameState = state;
			}
		};
	}

	this.newGame = function(gameNumber) {
		this.gameNumber = gameNumber;
		this.setGameState(createGame(gameNumber));
		this.draw();

		_running = true;
	}

	this.newRandomGame = function() {
		var gameNumber = Math.floor(Math.random() * 1000000 + 1);
		this.newGame(gameNumber);
	}

	this.restartGame = function() {
		this.newGame(this.gameNumber);
	}

	this.selectGame = function() {
		_events.doBeforeSelectGame();
	}

	this.init = function() {
		_events.setGame(_this);

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

	this.finishMovement = function(acceptableStreak, destination) {
		if (acceptableStreak > 0) {
			this.move(destination, acceptableStreak);
			if (destination instanceof HomeCell) {
				_setCardsInGame(this.getCardsInGame() - acceptableStreak);
			}
		} else if (acceptableStreak !== -1 && destination !== this.origin) {
			_events.doMovementNotAllowed();
		}

		this.origin = null;
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
				_events.doAskCardQuantityToMove(acceptableStreak, destination);
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

	this.setGameHash = function(hash) {
		this.setGameState(stateToGame(hash));
		this.draw();
	}

	this.setGameState = function(game) {
		var i, j;
		var cardsInserted = 0;

		this.gameNumber = game.n;
		_events.doNumberChange(this.gameNumber);		
		
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
			cardsInserted++;
		}

		for (i = 0; i < game.s.length; i++) {
			_stacks[i].cards = [];			
			
			for (j = 0; j < game.s[i].length; j++) {
				var card = new Card(this.assets, _context, game.s[i][j]);
				_stacks[i].cards.push(card);
				cardsInserted++;
			}
		}

		_setCardsInGame(cardsInserted);
		var state = gameToState(_componentDict, this.gameNumber);
		if (state !== _previousGameState) {
			_events.doStateChange(state);
			_previousGameState = state;
		}
	}

	var _areThereAvailableMoves = function() {
		for (var i = 0; i < _componentDict.length; i++) {
			for (var j = 0; j < _componentDict.length; j++) {
				if (_componentDict[j] instanceof HomeCell || _componentDict[i] instanceof HomeCell || _componentDict[i] === _componentDict[j]) {
					continue;
				}

				if (_componentDict[i].howManyAcceptables(_componentDict[j], 1) > 0) {
					return true;
				}
			}
		}

		return false;
	}

	var _setCardsInGame = function(cardsInGame) {
		_cardsInGame = cardsInGame;
		_events.doCardQuantityChange(cardsInGame);
	}

	this.getCardsInGame = function() {
		return _cardsInGame;
	}
}

var memento = new Memento();

var gameEvents = new GameEvents();
var game = new Game('#cardgame', gameEvents);
game.init();