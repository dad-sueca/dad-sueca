"use strict";
var cardValue;
(function (cardValue) {
    cardValue[cardValue["ACE"] = 0] = "ACE";
    cardValue[cardValue["TWO"] = 1] = "TWO";
    cardValue[cardValue["THREE"] = 2] = "THREE";
    cardValue[cardValue["FOUR"] = 3] = "FOUR";
    cardValue[cardValue["FIVE"] = 4] = "FIVE";
    cardValue[cardValue["SIX"] = 5] = "SIX";
    cardValue[cardValue["SEVEN"] = 6] = "SEVEN";
    cardValue[cardValue["JACK"] = 7] = "JACK";
    cardValue[cardValue["QUEEN"] = 8] = "QUEEN";
    cardValue[cardValue["KING"] = 9] = "KING";
})(cardValue = exports.cardValue || (exports.cardValue = {}));
