import {Card} from "./card";

export class Deck {

    public cards: Card[] = [];
    public trumpSuit: string = '';

    public cardsPlayer1: Card[] = [];
    public cardsPlayer2: Card[] = [];
    public cardsPlayer3: Card[] = [];
    public cardsPlayer4: Card[] = [];

    public constructor() {
        this.shuffle();
        this.distributionDeck();
        this.setTrumpSuit();
    }

    public shuffle(): void {
        this.cards = [];

        for (let suitIndex = 0; suitIndex < 4; suitIndex++) {
            for (let valueIndex = 0; valueIndex < 10; valueIndex++) {
                this.cards.push(new Card(suitIndex, valueIndex));
            }
        }

        let curr: number = this.cards.length;
        let swap: Card;
        let random: number;

        while (0 !== curr) {
            random = Math.floor(Math.random() * curr);
            curr -= 1;

            swap = this.cards[curr];

            this.cards[curr] = this.cards[random];
            this.cards[random] = swap;
        }
    }

    public distributionDeck(): void {
        let cards_aux: Card[] = this.cards;
        this.cardsPlayer1 = cards_aux.slice(0, 10);
        this.cardsPlayer2 = cards_aux.slice(10, 20);
        this.cardsPlayer3 = cards_aux.slice(20, 30);
        this.cardsPlayer4 = cards_aux.slice(30, 40);
    }

    public setTrumpSuit(): void {
        this.trumpSuit = this.cards[0].getImageName();
    }
}
