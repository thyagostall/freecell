'use strict';

function AssetLoader() {
	var _sources = {
		'cards': './images/freecell_cards.png',
		'selected_cards': './images/freecell_cards_selected.png',
		'king': './images/freecell_king.png',
		'king_win': './images/freecell_king_win.png'
	};
	var _sourceCount = Object.keys(_sources).length;
	var _loadedImages = 0;
	var _callback;

	this.images = {};

	function _imageLoaded() {
		_loadedImages++;
		if (_loadedImages === _sourceCount) {
			_callback();
		}
	};

	AssetLoader.prototype.loadAll = function(callback) {
		_callback = callback;
		for (var key in _sources) {
			var image = new Image();
			image.src = _sources[key];
			image.onload = _imageLoaded;
			this.images[key] = image;
		}
	};	
}