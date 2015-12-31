'use strict';

describe('Card ', function () {
    it('should create a valid card', function() {
        var card = new Card(null, null, "AD");

        expect(card.number).to.be('A');
        expect(card.suit).to.be('D');
    });
});
