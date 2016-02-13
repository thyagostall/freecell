function cardsToNumbers(cards) {
	var result = [];

	for (var i in cards) {
		result.push(cards[i].getCode());
	}

	return result;
}

function gameToState(components, gameNumber) {
	var gameState = {
		'n': gameNumber,
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
	return btoa(JSON.stringify(gameState));
}

function stateToGame(game) {
	return JSON.parse(atob(game));
}