import { weapons } from './Weapon.js';
import { Potion } from './Potion.js';

export class Player {
  constructor() {
    this.level = 1;
    this.xp = 0;
    this.health = 100;
    this.maxHealth = 100;
    this.gold = 50;
    this.currentWeapon = weapons[0]; // Start with Stick
    this.inventory = {
      potions: {
        small: 2,
        medium: 0,
        large: 0
      }
    };
  }

  reset() {
    this.level = 1;
    this.xp = 0;
    this.health = 100;
    this.maxHealth = 100;
    this.gold = 50;
    this.currentWeapon = weapons[0];
    this.inventory = {
      potions: {
        small: 2,
        medium: 0,
        large: 0
      }
    };
  }

  getDisplayHealth() {
    return Math.max(0, this.health);
  }

  setHealth(value) {
    this.health = Math.min(this.maxHealth, Math.max(0, value));
  }

  takeDamage(damage) {
    this.setHealth(this.health - damage);
  }

  heal(amount) {
    this.setHealth(this.health + amount);
  }

  getCurrentWeaponPower() {
    // Base power is weapon power
    const basePower = this.currentWeapon.power;
    
    // Level bonus is more significant now
    const levelBonus = Math.floor(this.level * 2); // +2 power per level
    
    // Add some randomness to make combat more interesting
    const variability = Math.floor(Math.random() * 3); // 0-2 random bonus
    
    // Calculate total damage
    const totalPower = basePower + levelBonus + variability;
    
    console.log('Damage calculation:', {
      base: basePower,
      levelBonus: levelBonus,
      variability: variability,
      total: totalPower
    });
    
    return totalPower;
  }

  addWeapon(weapon) {
    if (!this.inventory.includes(weapon.name)) {
      this.inventory.push(weapon.name);
      return this.inventory.length - 1;  // Return index of new weapon
    }
    return -1;  // Return -1 if weapon already exists
  }

  equipWeapon(index) {
    if (index >= 0 && index < this.inventory.length) {
      this.currentWeaponIndex = index;
      return true;
    }
    return false;
  }

  gainXP(amount) {
    this.xp += amount;
    // Check for level up
    const nextLevelXP = this.level * 100;
    if (this.xp >= nextLevelXP) {
      this.levelUp();
    }
  }

  gainGold(amount) {
    this.gold += amount;
  }

  levelUp() {
    this.level += 1;
    this.maxHealth = 100 + (this.level - 1) * 20; // +20 HP per level
    this.health = this.maxHealth; // Heal to full on level up
    this.xp = 0; // Reset XP for next level
  }

  getTotalPotions() {
    return this.inventory.potions.small + 
           this.inventory.potions.medium + 
           this.inventory.potions.large;
  }

  addPotion(type) {
    this.inventory.potions[type]++;
  }

  usePotion(type) {
    if (this.inventory.potions[type] > 0) {
      const potion = Potion.TYPES[type.toUpperCase()];
      const healAmount = potion.hpGain + Math.floor(this.level * 1.5);
      this.health = Math.min(this.maxHealth, this.health + healAmount);
      this.inventory.potions[type]--;
      return healAmount;
    }
    return 0;
  }

  canAfford(price) {
    return this.gold >= price;
  }

  spendGold(amount) {
    if (this.canAfford(amount)) {
      this.gold -= amount;
      return true;
    }
    return false;
  }

  getXPRequiredForLevel(level) {
    // Base XP requirement starts at 100 for level 2
    const baseXP = 100;
    
    // Each level requires exponentially more XP
    // Using a quadratic growth formula: baseXP * (level-1)^1.8
    // This makes early levels achievable but gets much harder later
    return Math.floor(baseXP * Math.pow(level - 1, 1.8));
  }

  formatXP(xp) {
    if (xp >= 1000000) {
      return `${(xp / 1000000).toFixed(1)}M`;
    } else if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}K`;
    }
    return xp.toString();
  }
}
