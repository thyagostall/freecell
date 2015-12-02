"use strict";

var CARD_WIDTH = 71;
var CARD_HEIGHT = 96;

var CANVAS_HEIGHT = 480;
var CANVAS_WIDTH = 640;

var CARD_VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
var CARD_SUITS = ["D", "H", "S", "C"];

var BACKGROUND_COLOR = "#008000";

function drawCardCell(context, x, y) {
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
}

function AssetLoader() {
  var sources = {
    "cards": "./images/freecell_cards.png",
    "selected_cards": "./images/freecell_cards_selected.png",
    "king": "./images/freecell_king.png"
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
  }

  this.loadAll = function(callback) {
    _callback = callback;
    for (var key in sources) {
      var image = new Image();
      image.src = sources[key];
      image.onload = imageLoaded;
      this.images[key] = image;
    }
  }
}

function Stack(x, y) {
  var CARD_OFFSET_Y = 18;
  this.x = x;
  this.y = y;

  this.cards = [];

  this.draw = function(context) {
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(x, y, CARD_WIDTH, CANVAS_HEIGHT);

    for (var i = 0; i < this.cards.length; i++) {
      this.cards[i].draw(context, x, y + i * CARD_OFFSET_Y);
    }
  }

  this.push = function(card) {
    this.cards.push(card);
  }

  this.getSelected = function() {
    var index = this.cards.length - 1;
    this.cards[index].select();
    return this.cards[index];
  }

  this.pop = function() {
    var index = this.cards.length - 1;
    this.cards[index].deselect();
    this.cards.pop();
  }

  this.select = function() {
    var index = this.cards.length - 1;
    if (index >= 0) {
      this.cards[index].select();
    }
  }

  this.deselect = function() {
    var index = this.cards.length - 1;
    if (index >= 0) {
      this.cards[index].deselect();
    }
  }

  this.doesAccept = function(card) {
    return true;
  }

  this.isInside = function(x, y) {
    var height = CARD_OFFSET_X * (this.cards.length - 1) + CARD_HEIGHT;
    return (
      x >= this.x &&
      x <= this.x + CARD_WIDTH &&
      y >= this.y &&
      y <= this.y + height
    );
  }
}

function CellSet(x, y) {
  this.layout = {
    width: CARD_WIDTH * 4,
    height: CARD_HEIGHT,
    x: x,
    y: y
  }

  this.cards = [null, null, null, null];
  var _this = this;
  var getCellIndex = function(x) {
    return Math.floor((x - _this.layout.x) / CARD_WIDTH);
  }

  this.draw = function(context) {
    drawCardCell(context, x, y);
    if (this.cards[0]) {
      this.cards[0].draw(context, x, y);
    }

    drawCardCell(context, x + CARD_WIDTH, y);
    if (this.cards[1]) {
      this.cards[1].draw(context, x + CARD_WIDTH, y);
    }

    drawCardCell(context, x + CARD_WIDTH * 2, y);
    if (this.cards[2]) {
      this.cards[2].draw(context, x + CARD_WIDTH * 2, y);
    }

    drawCardCell(context, x + CARD_WIDTH * 3, y);
    if (this.cards[3]) {
      this.cards[3].draw(context, x + CARD_WIDTH * 3, y);
    }
  }

  this.isInside = function(x, y) {
    return (
      x >= this.layout.x &&
      x <= this.layout.x + this.layout.width &&
      y >= this.layout.y &&
      y <= this.layout.y + this.layout.height
    );
  }

  this.doesAccept = function(card, x, y) {
    return true;
  }

  this.put = function(card, x, y) {
    var i = getCellIndex(x);
    this.cards[i] = card;
  }

  this.remove = function(x, y) {
    var i = getCellIndex(x);
    this.cards[i] = null;
  }
}

function HomeCell(x, y) {
  var homeCell = new CellSet(x, y);

  console.log(homeCell.layout);

  this.layout = homeCell.layout;
  this.cards = homeCell.cards;

  this.draw = homeCell.draw;
  this.isInside = homeCell.isInside;
  this.doesAccept = homeCell.doesAccept;
  this.put = homeCell.put;
}

function FreeCell() {
  var _this = this;
  var freeCell = new CellSet(0, 0);

  this.layout = freeCell.layout;
  this.cards = freeCell.cards;

  this.draw = freeCell.draw;

  this.select = function(x, y) {
    if (x <= CARD_WIDTH * 4) {
      var i = Math.floor(x / CARD_WIDTH);
      if (this.cards[i]) {
        this.cards[i].select();
        return this.cards[i];
      }
    }
  }

  this.doesAccept = freeCell.doesAccept;
  this.put = freeCell.put;
  this.remove = freeCell.remove;

  this.deselect = function() {
    for (var i = 0; i < 4; i++) {
      if (this.cards[i]) {
        this.cards[i].deselect();
      }
    }
  }

  this.isInside = function(x, y) {
    return freeCell.isInside(x, y);
  }
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

  var image = assets.images["king"];

  function updateKingImpl(type) {
    var pos = 0;
    if (type == "left") {
      pos = 32;
    }
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(x + 3, y + 3, 32, 32);
    context.drawImage(image, pos, 0, 32, 32, x + 3, y + 3, 32, 32);
  }

  this.updateLeft = function() {

  }
}

var canvas;

function init(canvasId, width, height) {
  canvas = $(canvasId)[0];
  var context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, width, height);

  return context;
}

function Card(assets, code) {
  var getHorizontalPositionGrid = function(number) {
    switch (number) {
      case "A":
        return 0;
      case "T":
        return 9;
      case "J":
        return 10;
      case "Q":
        return 11;
      case "K":
        return 12;
      default:
        return parseInt(number) - 1;
    }
  }
  var getVerticalPositionGrid = function(suit) {
    switch (suit) {
      case "D":
        return 0;
      case "H":
        return 1;
      case "S":
        return 2;
      case "C":
        return 3;
    }
  }
  var image = assets.images["cards"];
  var image_selected = assets.images["selected_cards"];

  var selected = false;

  this.select = function() {
    selected = true;
  }

  this.deselect = function() {
    selected = false;
  }

  this.isSelected = function() {
    return selected;
  }

  this.draw = function(context, x, y) {
    var number = code.charAt(0);
    var suit = code.charAt(1);
    var spriteX = getHorizontalPositionGrid(number);
    var spriteY = getVerticalPositionGrid(suit);

    spriteX = spriteX * CARD_WIDTH;
    spriteY = spriteY * CARD_HEIGHT;

    if (selected) {
      context.drawImage(image_selected, spriteX, spriteY, CARD_WIDTH, CARD_HEIGHT, x, y, CARD_WIDTH, CARD_HEIGHT);
    } else {
      context.drawImage(image, spriteX, spriteY, CARD_WIDTH, CARD_HEIGHT, x, y, CARD_WIDTH, CARD_HEIGHT);
    }
  }
}

function Game() {
  var context = init("#cardgame", CANVAS_WIDTH, CANVAS_HEIGHT);
  var selected = undefined;

  var drawSelectedCard = function() {
    if (selected) {
      selected.draw(context, CANVAS_WIDTH - CARD_WIDTH - 10, CANVAS_HEIGHT - CARD_HEIGHT - 10);
    } else {
      context.fillRect(CANVAS_WIDTH - CARD_WIDTH - 10, CANVAS_HEIGHT - CARD_HEIGHT - 10, CARD_WIDTH, CARD_HEIGHT);
    }
  }

  this.init = function() {
    this.freeCell = new FreeCell(0, 0);
    this.homeCell = new HomeCell(339, 0);

    this.king = new KingIcon(assets, context, 292, 20);

    this.freeCell.cards[2] = new Card(assets, "KC");
    this.freeCell.cards[3] = new Card(assets, "JD");
    this.freeCell.cards[0] = new Card(assets, "TS");

    this.stack = new Stack(120, 120);
    this.stack.push(new Card(assets, "AD"));
    this.stack.push(new Card(assets, "AH"));
    this.stack.push(new Card(assets, "QC"));

    this.stack2 = new Stack(240, 120);
    this.stack2.push(new Card(assets, "2D"));
    this.stack2.push(new Card(assets, "2H"));
    this.stack2.push(new Card(assets, "KC"));

    this.draw();
    this.king.update("right");
  }

  this.updateKing = function(x, y) {
    if (y <= 95) {
      if (x < 285) {
        this.king.update("left");
      } else if (x > 339) {
        this.king.update("right");
      }
    }
  }

  this.update = function(x, y) {
    if (this.homeCell.isInside(x, y)) {
      console.log("it is inside the homecell");
      if (selected) {
        console.log("Dropping a card here: " + this.selected)
      }
    }

    this.freeCell.deselect();
    if (this.freeCell.isInside(x, y)) {
      console.log("it is inside the freecell " + selected);
      if (selected) {
        console.log("deselecting");
        selected = undefined;
      } else {
        console.log("selecting");
        selected = this.freeCell.select(x, y);
      }
    }

    if (this.stack.isInside(x, y)) {
      console.log("it is inside the stack");
      if (selected) {
        console.log("Dropping a card here: " + selected)
      } else {

      }
    }

    if (this.stack2.isInside(x, y)) {
      console.log("it is inside the stack 2");
      if (selected) {
        console.log("Dropping a card here: " + selected)
      } else {

      }
    }

    this.draw();
  }

  this.draw = function() {
    this.freeCell.draw(context);
    this.homeCell.draw(context);
    this.stack.draw(context);
    this.stack2.draw(context);

    drawSelectedCard();
  }
}

var assets = new AssetLoader();
assets.loadAll(function() {
  var game = new Game();
  game.init();

  canvas.onmousemove = function(e) {
    var x = e.offsetX;
    var y = e.offsetY;

    game.updateKing(x, y);
  }

  canvas.onclick = function(e) {
    var x = e.offsetX;
    var y = e.offsetY;

    game.update(x, y);
  }
});
