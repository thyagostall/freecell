function GameEvents() {

}

// OK
GameEvents.prototype.setGame = function(game) {
	this.game = game;
};

// OK
GameEvents.prototype.doCardQuantityChange = function(quantity) {
	if (this.onCardQuantityChange !== undefined) {
		this.onCardQuantityChange(quantity);
	}
};

// OK
GameEvents.prototype.doMovementNotAllowed = function() {
	if (this.onMovementNotAllowed !== undefined) {
		this.onMovementNotAllowed();
	}
};

// OK
GameEvents.prototype.doStateChange = function(hash) {
	if (this.onStateChange !== undefined) {
		this.onStateChange(hash);
	}
};

// OK
GameEvents.prototype.doNumberChange = function(number) {
	if (this.onNumberChange !== undefined) {
		this.onNumberChange(number);
	}
};

// OK
GameEvents.prototype.doBeforeSelectGame = function() {
	if (this.onBeforeSelectGame !== undefined) {
		this.onBeforeSelectGame();
	}
};

// OK
GameEvents.prototype.doSelectGame = function(number) {
	game.newGame(number);
};

// OK
GameEvents.prototype.doGameOver = function() {
	if (this.onGameOver !== undefined) {
		this.onGameOver();
	}	
};

// OK
GameEvents.prototype.doAskCardQuantityToMove = function(acceptableStreak, destination) {
	if (this.onAskCardQuantityToMove !== undefined) {
		this.onAskCardQuantityToMove(acceptableStreak, destination);
	} else {
		this.game.finishMovement(acceptableStreak, destination);
	}
};


// OK
GameEvents.prototype.onCardQuantityChange = function(quantity) {
	$('#card-quantity').text(quantity);
};

// OK
GameEvents.prototype.onMovementNotAllowed = function() {
	window.alert('Movement not allowed!');
};

// OK
GameEvents.prototype.onStateChange = function(hash) {
	memento.addState(hash);
};

// OK
GameEvents.prototype.onNumberChange = function(number) {
	$('#game-number').text('#' + number);
};

// OK
GameEvents.prototype.onBeforeSelectGame = function() {
	var gameNumber = window.prompt("Type the game number:");
	this.doSelectGame(new Number(gameNumber));
};

// OK
GameEvents.prototype.onGameOver = function() {
	console.log('Game fuckin\' over');
};

// OK
GameEvents.prototype.doAskCardQuantityToMove = function(acceptableStreak, destination) {
	if (destination instanceof Stack && destination.cards.length === 0) {
		if (window.confirm('Do you want to move all the cards?')) {
			game.finishMovement(acceptableStreak, destination);
		} else {
			game.finishMovement(-1, destination);
		}
	} else {
		game.finishMovement(acceptableStreak, destination);
	}
}