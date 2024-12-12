export class Weapon {
  constructor(name, power, price) {
    this.name = name;
    this.power = power;
    this.price = price;
  }

  calculateSellPrice() {
    return Math.floor(this.price * (0.4 + Math.random() * 0.4));
  }
}

export const weapons = [
  new Weapon("Stick", 8, 0),           // Starting weapon
  new Weapon("Dagger", 15, 50),        // Basic upgrade
  new Weapon("Short Sword", 25, 150),  // Better weapon
  new Weapon("Long Sword", 40, 300),   // Advanced weapon
  new Weapon("Great Sword", 60, 600),  // Elite weapon
  new Weapon("Dragon Slayer", 100, 1000) // Legendary weapon
];
