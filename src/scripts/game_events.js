function GameEvents() {

}

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

GameEvents.prototype.doGameOver = function() {
	if (this.onGameOver !== undefined) {
		this.onGameOver();
	}
};

// OK
GameEvents.prototype.doStateChange = function(hash) {
	if (this.onStateChange !== undefined) {
		this.onStateChange(hash);
	}
};

GameEvents.prototype.doAskResign = function() {
	if (this.onAskResign !== undefined) {
		this.onAskResign();
	}
};

GameEvents.prototype.doResign = function(result) {
	//Resign the game
};

GameEvents.prototype.doAskSelectGame = function() {
	if (this.onAskSelectGame !== undefined) {
		this.onAskSelectGame();
	}
};

GameEvents.prototype.doSelectGame = function(gameNumber) {
	game.newGame(gameNumber);
};

GameEvents.prototype.doAskHowManyCardsMove = function() {

};

GameEvents.prototype.doCardsMove = function(type) {

};




GameEvents.prototype.onCardQuantityChange = function(quantity) {
	$('#card-quantity').text(quantity);
};

GameEvents.prototype.onMovementNotAllowed = function() {
	console.log('Movement not allowed!');
};

GameEvents.prototype.onGameOver = function() {
	console.log('Game over');
};

GameEvents.prototype.onStateChange = function(hash) {
	$('#game-state').text(hash);
};

GameEvents.prototype.onAskResign = function() {
	this.doResign(true);
};

GameEvents.prototype.onAskHowManyCardsMove = function() {
	this.doCardsMove(1);
};