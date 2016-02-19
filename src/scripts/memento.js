function Memento() {
	this.states = [];
	this.pointer = -1;
}

Memento.prototype.addState = function(hash) {
	if ($.inArray(hash, this.states) >= 0) {
		return;
	}

	this.states.push(hash);
	this.pointer++;
};

Memento.prototype.clear = function() {
	this.states = [];
	this.pointer = -1;
};

Memento.prototype.next = function() {
	if (this.pointer < this.states.length - 1) {
		this.pointer++;
	}
	return this.pointer;
};

Memento.prototype.previous = function() {
	if (this.pointer > 0) {
		this.pointer--;
	}
	return this.pointer;
}

Memento.prototype.undo = function() {
	if (!this.states.pop()) {
		return;
	}
	
	this.pointer--;
	return this.states[this.pointer];
}