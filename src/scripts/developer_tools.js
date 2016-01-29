function cardsToNumbers(cards) {
	var result = [];

	for (var i in cards) {
		result.push(cards[i].getCode());
	}

	return result;
}

function numbersToCards(assets, context, numbers) {

}

function getGameState(components) {
	var gameState = {
		'h': [],
		'f': [],
		's': []
	};
	for (var i = 0; i < components.length; i++) {
		var key;
		if (components[i] instanceof FreeCell) {
			key = 'f';
		} else if (components[i] instanceof HomeCell) {
			key = 'h';
		} else {
			key = 's';
		}

		gameState[key].push(cardsToNumbers(components[i].cards));
	}
	console.log(JSON.stringify(gameState));
	return JSON.stringify(gameState);
}

function setGameState(components, game) {
	console.log(JSON.parse(game));
}