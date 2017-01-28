import { cardSuit } from "./cardSuit";
import { cardValue } from "./cardValue";

export class Card {

    public constructor(private suite: cardSuit, private value: cardValue) {
    }

    public getSuit(): string {
        return cardSuit[this.suite];
    }

    public getValue(): string {
        return cardValue[this.value];
    }

    public setPoints(card : Card): number {
        let card_value: string = card.getValue();

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
    }

    public getImageName(): string {
        return "../../../assets/img/cards/" + this.getSuit() + "-" + this.getValue() + ".png";
    }
}
