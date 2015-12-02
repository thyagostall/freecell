var CARD_WIDTH = 71;
var CARD_HEIGHT = 96;

var CANVAS_HEIGHT = 480;
var CANVAS_WIDTH = 640;

var CARD_VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
var CARD_SUITS = ["D", "H", "S", "C"];

var BACKGROUND_COLOR = "#008000";

function Cell(context, x, y) {
  var _card = null;

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

    if (_card) {
      _card.draw(x, y);
    }
  }

  this.setCard = function(card) {
    _card = card;
  }

  this.isInside = function(x, y) {
    return (
      x >= this.x &&
      x <= this.x + CARD_WIDTH &&
      y >= this.y &&
      y <= this.y + CARD_HEIGHT
    );
  }
}

function Stack(context, x, y) {
  var CARD_OFFSET_Y = 18;
  this.x = x;
  this.y = y;

  this.cards = [];

  this.draw = function() {
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(x, y, CARD_WIDTH, CANVAS_HEIGHT);

    for (var i = 0; i < this.cards.length; i++) {
      this.cards[i].draw(x, y + i * CARD_OFFSET_Y);
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
    var height = CARD_OFFSET_Y * (this.cards.length - 1) + CARD_HEIGHT;
    return (
      x >= this.x &&
      x <= this.x + CARD_WIDTH &&
      y >= this.y &&
      y <= this.y + height
    );
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
    updateKingImpl("left");
  }

  this.updateRight = function() {
    updateKingImpl("right");
  }
}

function Card(assets, context, code) {
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

  this.draw = function(x, y) {
    var number = code.charAt(0);
    var suit = code.charAt(1);
    var spriteX = getHorizontalPositionGrid(number);
    var spriteY = getVerticalPositionGrid(suit);

    spriteX = spriteX * CARD_WIDTH;
    spriteY = spriteY * CARD_HEIGHT;

    if (selected) {
      context.drawImage(image_selected, spriteX, spriteY, CARD_WIDTH, CARD_HEIGHT, x, y, CARD_WIDTH - 1, CARD_HEIGHT - 1);
    } else {
      context.drawImage(image, spriteX, spriteY, CARD_WIDTH, CARD_HEIGHT, x, y, CARD_WIDTH - 1, CARD_HEIGHT - 1);
    }
  }
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

function Game(canvasId) {
  var _this = this;
  var _canvas;
  var _context;
  var _king;

  var _componentDict = [];
  var _freeCells = [];
  var _homeCells = [];
  var _stacks = [];

  var _getComponentAt = function(x, y) {
    for (var i = 0; i < _componentDict.length; i++) {
      if (_componentDict[i].isInside(x, y)) {
        return _componentDict[i];
      }
    }
  }

  this.init = function() {
    _canvas = $(canvasId)[0];
    _canvas.width = CANVAS_WIDTH;
    _canvas.height = CANVAS_HEIGHT;

    _context = _canvas.getContext("2d");
    _context.fillStyle = BACKGROUND_COLOR;
    _context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    var assets = new AssetLoader();
    assets.loadAll(function() {
      _king = new KingIcon(assets, _context, 292, 20);
      _king.updateRight();

      _freeCells[0] = new Cell(_context, 1, 1);
      _freeCells[1] = new Cell(_context, 72, 1);
      _freeCells[2] = new Cell(_context, 143, 1);
      _freeCells[3] = new Cell(_context, 214, 1);

      _homeCells[0] = new Cell(_context, 339, 1);
      _homeCells[1] = new Cell(_context, 410, 1);
      _homeCells[2] = new Cell(_context, 481, 1);
      _homeCells[3] = new Cell(_context, 552, 1);

      _stacks[0] = new Stack(_context, 8, 112);
      _stacks[1] = new Stack(_context, 84, 112);
      _stacks[2] = new Stack(_context, 160, 112);
      _stacks[3] = new Stack(_context, 245, 112);
      _stacks[4] = new Stack(_context, 324, 112);
      _stacks[5] = new Stack(_context, 403, 112);
      _stacks[6] = new Stack(_context, 482, 112);
      _stacks[7] = new Stack(_context, 561, 112);

      for (var i = 0; i < _freeCells.length; i++) {
        _componentDict.push(_freeCells[i]);
      }
      for (var i = 0; i < _homeCells.length; i++) {
        _componentDict.push(_homeCells[i]);
      }
      for (var i = 0; i < _stacks.length; i++) {
        _componentDict.push(_stacks[i])
      }

      for (var i = 0; i < 8; i++) {
        _stacks[i].push(new Card(assets, _context, "KH"));
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
      }

      _canvas.onclick = function(e) {
        var x = e.offsetX;
        var y = e.offsetY;

        console.log(_getComponentAt(x, y));

        _this.update(x, y);
      }
    });
  }

  this.update = function(x, y) {

  }

  this.draw = function() {
    for (var i = 0; i < _freeCells.length; i++) {
      _freeCells[i].draw();
    }
    for (var i = 0; i < _homeCells.length; i++) {
      _homeCells[i].draw();
    }
    for (var i = 0; i < _stacks.length; i++) {
      _stacks[i].draw();
    }
  }
}

var game = new Game("#cardgame");
game.init();
