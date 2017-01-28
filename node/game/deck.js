"use strict";
var card_1 = require("./card");
var Deck = (function () {
    function Deck() {
        this.cards = [];
        this.trumpSuit = '';
        this.cardsPlayer1 = [];
        this.cardsPlayer2 = [];
        this.cardsPlayer3 = [];
        this.cardsPlayer4 = [];
        this.shuffle();
        this.distributionDeck();
        this.setTrumpSuit();
    }
    Deck.prototype.shuffle = function () {
        this.cards = [];
        for (var suitIndex = 0; suitIndex < 4; suitIndex++) {
            for (var valueIndex = 0; valueIndex < 10; valueIndex++) {
                this.cards.push(new card_1.Card(suitIndex, valueIndex));
            }
        }
        var curr = this.cards.length;
        var swap;
        var random;
        while (0 !== curr) {
            random = Math.floor(Math.random() * curr);
            curr -= 1;
            swap = this.cards[curr];
            this.cards[curr] = this.cards[random];
            this.cards[random] = swap;
        }
    };
    Deck.prototype.distributionDeck = function () {
        var cards_aux = this.cards;
        this.cardsPlayer1 = cards_aux.slice(0, 10);
        this.cardsPlayer2 = cards_aux.slice(10, 20);
        this.cardsPlayer3 = cards_aux.slice(20, 30);
        this.cardsPlayer4 = cards_aux.slice(30, 40);
    };
    Deck.prototype.setTrumpSuit = function () {
        this.trumpSuit = this.cards[0].getImageName();
    };
    return Deck;
}());
exports.Deck = Deck;
