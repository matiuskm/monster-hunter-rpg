export class Potion {
    constructor(name, hpGain, price) {
        this.name = name;
        this.hpGain = hpGain;
        this.price = price;
    }

    static getHealAmount(size) {
        switch(size) {
            case 'small': return 50;
            case 'medium': return 150;
            case 'large': return 500;
            default: return 50;
        }
    }

    static getPrice(size) {
        switch(size) {
            case 'small': return 10;
            case 'medium': return 30;
            case 'large': return 100;
            default: return 10;
        }
    }
}
