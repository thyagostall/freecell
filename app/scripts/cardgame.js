"use strict";

function createCardPlace(context, x, y) {
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + 70, y);
  context.moveTo(x, y);
  context.lineTo(x, y + 95);
  context.lineWidth = 1;
  context.strokeStyle = '#000000';
  context.stroke();

  context.beginPath();
  context.moveTo(x + 70, y);
  context.lineTo(x + 70, y + 95);
  context.moveTo(x + 70, y + 95);
  context.lineTo(x, y + 95);
  context.lineWidth = 1;
  context.strokeStyle = '#00F000';
  context.stroke();
}

function createKingIcon(context, x, y) {
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
  image.onload = function() {
    context.drawImage(image, 0, 0, 32, 32, x + 3, y + 3, 32, 32);
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
      console.log(x + " : " + y);
    }
  }

  return context;
}

var context = init("#cardgame", 640, 480);
createCardPlace(context, 0, 0);
createCardPlace(context, 71, 0);
createCardPlace(context, 142, 0);
createCardPlace(context, 213, 0);

createCardPlace(context, 339, 0);
createCardPlace(context, 410, 0);
createCardPlace(context, 481, 0);
createCardPlace(context, 552, 0);

createKingIcon(context, 292, 20);

console.log("Finished code execution");
