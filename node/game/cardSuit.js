"use strict";
var cardSuit;
(function (cardSuit) {
    cardSuit[cardSuit["SPADE"] = 0] = "SPADE";
    cardSuit[cardSuit["HEART"] = 1] = "HEART";
    cardSuit[cardSuit["CLUB"] = 2] = "CLUB";
    cardSuit[cardSuit["DIAMOND"] = 3] = "DIAMOND";
})(cardSuit = exports.cardSuit || (exports.cardSuit = {}));
