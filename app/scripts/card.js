"use strict";

function Card(assets, ctx, code) {
    this.number = code.charAt(0);
    this.suit = code.charAt(1);

    this.image = assets.images["cards"];
    this.image_selected = assets.images["selected_cards"];

    this.selected = false;
    this.context = ctx;
}

Card.prototype._getHorizontalPositionGrid = function(number) {
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

Card.prototype._getVerticalPositionGrid = function(suit) {
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

Card.prototype.select = function() {
    selected = true;
}

Card.prototype.deselect = function() {
    selected = false;
}

Card.prototype.isSelected = function() {
    return selected;
}

Card.prototype.draw = function(x, y) {
    var spriteX = getHorizontalPositionGrid(this.number);
    var spriteY = getVerticalPositionGrid(this.suit);

    spriteX = spriteX * CARD_WIDTH;
    spriteY = spriteY * CARD_HEIGHT;

    if (selected) {
        context.drawImage(image_selected, spriteX, spriteY, CARD_WIDTH, CARD_HEIGHT, x, y, CARD_WIDTH - 1, CARD_HEIGHT - 1);
    } else {
        context.drawImage(image, spriteX, spriteY, CARD_WIDTH, CARD_HEIGHT, x, y, CARD_WIDTH - 1, CARD_HEIGHT - 1);
    }
}
