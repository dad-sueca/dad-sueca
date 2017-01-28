"use strict";
var cardSuit_1 = require("./cardSuit");
var cardValue_1 = require("./cardValue");
var Card = (function () {
    function Card(suite, value) {
        this.suite = suite;
        this.value = value;
    }
    Card.prototype.getSuit = function () {
        return cardSuit_1.cardSuit[this.suite];
    };
    Card.prototype.getValue = function () {
        return cardValue_1.cardValue[this.value];
    };
    Card.prototype.setPoints = function (card) {
        var card_value = card.getValue();
        switch (card_value) {
            case "ACE":
                return 11;
            case "SEVEN":
                return 10;
            case "KING":
                return 4;
            case "JACK":
                return 3;
            case "QUEEN":
                return 2;
            default:
                return 0;
        }
    };
    Card.prototype.getImageName = function () {
        return "../../../assets/img/cards/" + this.getSuit() + "-" + this.getValue() + ".png";
    };
    return Card;
}());
exports.Card = Card;
