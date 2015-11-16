"use strict";

var CARD_WIDTH = 71;
var CARD_HEIGHT = 96;

var CARD_VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var CARD_SUITS = ["D", "H", "S", "C"];

function drawCardCell(context, x, y) {
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

function FreeCell(x, y) {
  this.layout = {
    width: CARD_WIDTH * 4,
    height: CARD_HEIGHT
  }

  this.cards = [null, null, null, null];

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
    if (this.cards[2] !== null) {
      this.cards[2].draw(context, x + CARD_WIDTH * 2, y);
    }

    drawCardCell(context, x + CARD_WIDTH * 3, y);
    if (this.cards[3]) {
      this.cards[3].draw(context, x + CARD_WIDTH * 3, y);
    }
  }
}

function HomeCell(context, x, y) {

}

function KingIcon(context, x, y) {
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

  var image = new Image();
  image.src = "./images/freecell_king.png";

  this.update = function(type) {
    var pos = 0;
    if (type == "left") {
      pos = 32;
    }
    context.fillStyle = "#008000";
    context.fillRect(x + 3, y + 3, 32, 32);
    context.drawImage(image, pos, 0, 32, 32, x + 3, y + 3, 32, 32);
  }
}

function init(canvasId, width, height) {
  var canvas = $(canvasId)[0];
  var context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  context.fillStyle = "#008000";
  context.fillRect(0, 0, width, height);

  canvas.onmousemove = function(e) {
    var x = e.offsetX;
    var y = e.offsetY;

    if (y <= 95) {
      canvas.style.cursor = 'crosshair';
      if (x < 285) {
        king.update("left");
      } else if (x > 339) {
        king.update("right");
      }
    } else {
      canvas.style.cursor = 'default';
    }
  }

  return context;
}

function Card(number, suit) {
  var getHorizontalPositionGrid = function(number) {
    switch (number) {
      case "A":
        return 0;
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

  this.draw = function(context, x, y) {
    var spriteX = getHorizontalPositionGrid(number);
    var spriteY = getVerticalPositionGrid(suit);

    spriteX = spriteX * CARD_WIDTH;
    spriteY = spriteY * CARD_HEIGHT;

    context.drawImage(image, spriteX, spriteY, 71, 96, x, y, 71, 96);
    console.log(getHorizontalPositionGrid(number) + " " + number);
  }
}

var context = init("#cardgame", 640, 480);
// drawCardCell(context, 0, 0);
// drawCardCell(context, 71, 0);
// drawCardCell(context, 142, 0);
// drawCardCell(context, 213, 0);
var freeCell = new FreeCell(0, 0);
console.log(freeCell.layout.width);
console.log(freeCell.layout.height);

drawCardCell(context, 339, 0);
drawCardCell(context, 410, 0);
drawCardCell(context, 481, 0);
drawCardCell(context, 552, 0);

var king = new KingIcon(context, 292, 20);
var image = new Image();
image.src = "./images/freecell_cards.png";
image.onload = function() {
  // var numbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  // var suits = ["D", "H", "S", "C"];
  //
  // for (var i = 0; i < 14; i++) {
  //   for (var j = 0; j < 4; j++) {
  //     new Card(context, 8 + j * 152, 120 + i * 18, numbers[i], suits[j]);
  //   }
  // }

  freeCell.cards[2] = new Card("A", "C");
  freeCell.cards[1] = new Card("A", "C");
  freeCell.cards[3] = new Card("A", "C");
  freeCell.cards[0] = new Card("A", "C");

  king.update();
  freeCell.draw(context);

  console.log(freeCell.cards);
}

console.log("Finished code execution");
