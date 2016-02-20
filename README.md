# JavaScript version of Old Microsoft FreeCell

[![Build Status](https://travis-ci.org/thyagostall/freecell.svg?branch=master)](https://travis-ci.org/thyagostall/freecell)

# Building

To build the game it is necessary to have `gulp` installed. Also, some plugins are necessary:

    npm install gulp-connect
    npm install gulp-concat
    npm install gulp-html-replace

To build, type the command:

    gulp build

All the content necessary to embed it in your page will be at the `build` directory.

# Embedding and API

First of all, you need to implement all the events for the game. Most os them are required _- and I will mark as -_ for the game's basic functionality. Thus, you will need to instantiate the object with the methods which will be called upon some game actions.

    var gameEvents = new GameEvents();

Second, it is necessary to instantiate the game object.

    var game = new Game('#game-canvas', gameEvents);

## Basic functions

### New game

As the **Windows** game has. This version also has three ways of starting a game:

> Start a random game from the range 1 through 1000000:

    game.newRandomGame()

> Asks the user to enter a valid game also in the range 1 to 1000000 _(This method requires `onSelectGame` to be implemented in `GameEvents`)_:

    game.selectGame()

> Restarts the current game:

    game.restartGame()

### Game Events

    GameEvents.prototype.onCardQuantityChange = function(quantity)

> Called when the card quantity in game has changed. It happens either when the player move a card to a home cell or when a new game is started.

    GameEvents.prototype.onMovementNotAllowed = function();

> Called when the user performs a movement which is not allowed in the game's rules.

    GameEvents.prototype.onNumberChange = function(number);

> Called when the game's number has changed. Always when a new game is started. The `number` parameter is the game's seed number.

    GameEvents.prototype.onBeforeSelectGame = function();

> Called when the user selects a game. This method is where the code which asks the user what game they want to play is placed. At the end of this block of code, the method `this.doSelectGame(gameNumber)` must be called.

    GameEvents.prototype.onGameOver = function(won);

> Whether the user wins or loses, this event is called. Also, the flag `won` indicates if it comes from a loss or not.

    GameEvents.prototype.onAskCardQuantityToMove = function(acceptableStreak, destination);

> This method is crucial for the game's core. It is triggered always when the player move a streak of cards to an empty stack.
> An dialog with three options must be shown. The options are: Move all, move one and cancel.
> At the end of this function, the method `game.finishMovement(acceptableStreak, destination)` must be called. The parameter `acceptableStreak` must be respectively from the options: `acceptableStreak`, `1`, `-1`.