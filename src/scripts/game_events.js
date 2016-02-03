function GameEvents(gameInstance) {
	this.game = gameInstance;
}

GameEvents.prototype.doCardQuantityChange = function() {
	if (this.onCardQuantityChange !== undefined) {
		this.onCardQuantityChange();
	}
}

GameEvents.prototype.doMovementNotAllowed = function() {
	if (this.onMovementNotAllowed !== undefined) {
		this.onMovementNotAllowed();
	}
}

GameEvents.prototype.onCardQuantityChange = function() {
	console.log('New quantity: ' + this.game.getCardsInGame());
}

GameEvents.prototype.onMovementNotAllowed = function() {
	console.log('Movement not allowed!');
}