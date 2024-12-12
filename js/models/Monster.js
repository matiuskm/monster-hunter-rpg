export class Monster {
  constructor(name, level, health, xpGet, baseAttack) {
    this.name = name;
    this.level = level;
    this.maxHealth = health;
    this.currentHealth = health;
    this.xpGet = xpGet;
    this.baseAttack = baseAttack;
    
    // Determine potion drop type based on level
    if (level >= 50) {
      this.drop = 'large';
    } else if (level >= 20) {
      this.drop = 'medium';
    } else {
      this.drop = 'small';
    }
  }

  takeDamage(amount) {
    console.log(`Monster ${this.name} taking ${amount} damage. Current health: ${this.currentHealth}`);
    this.currentHealth = Math.max(0, this.currentHealth - amount);
    console.log(`After damage: ${this.currentHealth}`);
  }

  reset() {
    this.currentHealth = this.maxHealth;
  }

  clone() {
    return new Monster(
      this.name,
      this.level,
      this.maxHealth,
      this.xpGet,
      this.baseAttack
    );
  }

  // Get bonus gold based on level
  getBonusGold() {
    const baseBonus = Math.floor(Math.random() * (this.level * 5));
    const rareDrop = Math.random() < 0.1; // 10% chance for rare gold drop
    return rareDrop ? baseBonus * 2 : baseBonus;
  }
}

export const monsters = [
  new Monster("Slime", 1, 50, 50, 10),
  new Monster("Goblin", 2, 60, 60, 15),
  new Monster("Skeleton Warrior", 3, 70, 70, 20),
  new Monster("Zombie", 4, 80, 80, 25),
  new Monster("Orc Grunt", 5, 90, 90, 30),
  new Monster("Fire Imp", 6, 100, 100, 35),
  new Monster("Cave Troll", 7, 120, 120, 40),
  new Monster("Shadow Wraith", 8, 140, 140, 45),
  new Monster("Venom Spider", 9, 160, 160, 50),
  new Monster("Ice Golem", 10, 200, 200, 55),
  new Monster("Dark Sorcerer", 20, 250, 250, 60),
  new Monster("Wyvern", 30, 300, 300, 65),
  new Monster("Forest Guardian", 40, 350, 350, 70),
  new Monster("Hellhound", 50, 400, 400, 75),
  new Monster("Vampire Lord", 60, 450, 450, 80),
  new Monster("Rock Titan", 70, 500, 500, 85),
  new Monster("Demonic Overlord", 80, 550, 550, 90),
  new Monster("Sea Serpent", 90, 600, 600, 95),
  new Monster("Ancient Dragon", 100, 700, 700, 100),
  // Generated list of monsters
  ...Array.from({ length: 180 }, (_, index) => {
    const level = Math.floor(Math.random() * 999) + 1;
    const health = level * 50;
    const xpGet = level * 40;
    const baseAttack = level * 5;

    const names = [
      "Abyss Crawler", "Bone Collector", "Crystal Warden", "Dune Reaper", "Ember Stalker", 
      "Frost Bringer", "Grave Keeper", "Hollow Stalker", "Infernal Beast", "Jungle Predator",
      "Knightmare", "Lava Golem", "Moonshade Stalker", "Nether Phantom", "Obsidian Guardian",
      "Phantom Warlord", "Quake Shaker", "Ravenous Fiend", "Shadow Reaver", "Toxic Brood",
      "Undying Horror", "Void Strider", "Warped Specter", "Xenolith Titan", "Yewbane", "Zephyr Drake"
    ];

    const randomName = names[Math.floor(Math.random() * names.length)];
    return new Monster(randomName, level, health, xpGet, baseAttack);
  })
];