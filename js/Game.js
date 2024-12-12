import { Player } from './models/Player.js';
import { Monster, monsters } from './models/Monster.js';
import { Weapon, weapons } from './models/Weapon.js';
import { Potion } from './models/Potion.js';
import { GameUI } from './ui/GameUI.js';

export class Game {
  constructor(ui) {
    this.ui = ui;
    this.player = new Player();
    this.currentMonster = null;
    this.locations = {
      town: 'town',
      store: 'store',
      cave: 'cave',
      fight: 'fight'
    };
    this.currentLocation = this.locations.town;

    // Bind methods to preserve context
    this.goToCave = this.goToCave.bind(this);
    this.goToStore = this.goToStore.bind(this);
    this.goToTown = this.goToTown.bind(this);
    this.showHowToPlay = this.showHowToPlay.bind(this);
    this.usePotion = this.usePotion.bind(this);
    this.buyPotion = this.buyPotion.bind(this);
    this.attack = this.attack.bind(this);
    this.run = this.run.bind(this);
    this.fightMonster = this.fightMonster.bind(this);
  }

  initialize() {
    console.log('Initializing game...');
    this.currentLocation = this.locations.town;
    console.log('Current location:', this.currentLocation);
    this.updateUI();
    console.log('UI updated');
  }

  updateUI() {
    this.ui.updatePlayerStats(this.player);
    this.ui.updateMonsterStats(this.currentMonster);
    
    switch (this.currentLocation) {
      case this.locations.town:
        this.showTown();
        break;
      case this.locations.store:
        this.showStore();
        break;
      case this.locations.cave:
        this.showCave();
        break;
      case this.locations.fight:
        this.showFight();
        break;
    }
  }

  showTown() {
    console.log('Showing town interface...');
    this.currentMonster = null;
    this.ui.setText("You are in the town square. Where would you like to go?");
    
    console.log('Creating town buttons...');
    const buttons = [
      { text: "Hunt Monsters", handler: this.goToCave },
      { text: "Visit Shop", handler: this.goToStore },
      { text: "How to Play", handler: this.showHowToPlay }
    ];
    console.log('Basic buttons created:', buttons);

    // Add potion buttons if player has any
    const { potions } = this.player.inventory;
    console.log('Player potions:', potions);
    
    if (potions.large > 0) {
      buttons.push({ 
        text: "Use Large Potion", 
        handler: () => this.usePotion('large'),
        disabled: this.player.health >= this.player.maxHealth
      });
    }
    if (potions.medium > 0) {
      buttons.push({ 
        text: "Use Medium Potion", 
        handler: () => this.usePotion('medium'),
        disabled: this.player.health >= this.player.maxHealth
      });
    }
    if (potions.small > 0) {
      buttons.push({ 
        text: "Use Small Potion", 
        handler: () => this.usePotion('small'),
        disabled: this.player.health >= this.player.maxHealth
      });
    }

    console.log('Setting buttons in UI...');
    this.ui.setButtons(buttons);
    console.log('Town interface setup complete');
  }

  showStore() {
    this.ui.setText("Welcome to the shop! What would you like to buy?");
    
    const buttons = [
      { 
        text: "Buy Small Potion (10 gold)", 
        handler: () => this.buyPotion('small'),
        disabled: this.player.gold < 10
      },
      { 
        text: "Buy Medium Potion (30 gold)", 
        handler: () => this.buyPotion('medium'),
        disabled: this.player.gold < 30
      },
      { 
        text: "Buy Large Potion (100 gold)", 
        handler: () => this.buyPotion('large'),
        disabled: this.player.gold < 100
      },
      { text: "Return to Town", handler: this.goToTown }
    ];
    
    // Add weapon buying options if better weapons are available
    const nextWeapon = weapons.find(w => 
      w.price > 0 && // Not the starting weapon
      w.price <= this.player.gold && // Can afford it
      w.power > this.player.currentWeapon.power // Better than current weapon
    );
    
    if (nextWeapon) {
      buttons.unshift({
        text: `Buy ${nextWeapon.name} (${nextWeapon.price} gold)`,
        handler: () => this.buyWeapon(nextWeapon)
      });
    }
    
    this.ui.setButtons(buttons);
  }

  showCave() {
    this.currentLocation = this.locations.cave;
    this.ui.setText("You enter the dark cave. What awaits you?");
    
    const buttons = [
      { text: "Fight Monster", handler: this.fightMonster },
      { text: "Return to Town", handler: this.goToTown }
    ];
    
    this.ui.setButtons(buttons);
  }

  showFight() {
    const monsterName = this.currentMonster.name;
    const monsterLevel = this.currentMonster.level;
    this.ui.setText(`A ${monsterName} (Level ${monsterLevel}) approaches! What will you do?`);
    
    const buttons = [
      { text: "Attack", handler: this.attack },
      { text: "Run", handler: this.run }
    ];

    // Add potion buttons if player has any
    const { potions } = this.player.inventory;
    if (potions.large > 0) {
      buttons.push({ 
        text: "Use Large Potion", 
        handler: () => this.usePotion('large'),
        disabled: this.player.health >= this.player.maxHealth
      });
    }
    if (potions.medium > 0) {
      buttons.push({ 
        text: "Use Medium Potion", 
        handler: () => this.usePotion('medium'),
        disabled: this.player.health >= this.player.maxHealth
      });
    }
    if (potions.small > 0) {
      buttons.push({ 
        text: "Use Small Potion", 
        handler: () => this.usePotion('small'),
        disabled: this.player.health >= this.player.maxHealth
      });
    }
    
    this.ui.setButtons(buttons);
  }

  goToTown() {
    this.currentLocation = this.locations.town;
    this.updateUI();
  }

  goToStore() {
    this.currentLocation = this.locations.store;
    this.updateUI();
  }

  goToCave() {
    this.currentLocation = this.locations.cave;
    this.updateUI();
  }

  fightMonster() {
    // Get a random monster from the list
    const playerLevel = this.player.level;
    
    // Filter monsters within 2 levels of player
    const availableMonsters = monsters.filter(m => 
      Math.abs(m.level - playerLevel) <= 2
    );
    
    // If no monsters in range, use the lowest level monster
    const monster = availableMonsters.length > 0 
      ? availableMonsters[Math.floor(Math.random() * availableMonsters.length)]
      : monsters[0];
      
    this.currentMonster = monster.clone();
    this.currentLocation = this.locations.fight;
    this.updateUI();
  }

  attack() {
    console.log('Attack started');
    console.log('Current monster health:', this.currentMonster.currentHealth);
    
    const playerDamage = this.player.getCurrentWeaponPower();
    this.currentMonster.takeDamage(playerDamage);
    
    console.log('After damage - Monster health:', this.currentMonster.currentHealth);
    
    // Check if monster is dead
    if (this.currentMonster.currentHealth <= 0) {
      // Calculate rewards
      const xpGained = this.currentMonster.xpGet;
      const goldGained = Math.floor(this.currentMonster.xpGet * 0.8); // 80% of XP as gold
      
      console.log('Monster defeated! Rewards:', { xp: xpGained, gold: goldGained });
      
      // Give rewards
      this.player.gainXP(xpGained);
      this.player.gainGold(goldGained);
      
      // Add monster drop
      const dropChance = Math.random();
      if (dropChance > 0.5) {
        const drop = this.currentMonster.drop;
        this.player.inventory.potions[drop]++;
        this.ui.setText(`You defeated the ${this.currentMonster.name}! You gained ${xpGained} XP, found ${goldGained} gold, and got a ${drop} potion!`);
      } else {
        this.ui.setText(`You defeated the ${this.currentMonster.name}! You gained ${xpGained} XP and found ${goldGained} gold!`);
      }
      
      // Return to town
      this.currentLocation = this.locations.town;
      this.currentMonster = null;
      this.updateUI();
      return;
    }
    
    // Monster's turn
    const monsterDamage = Math.max(1, Math.floor(this.currentMonster.baseAttack * (1 + this.currentMonster.level * 0.1)));
    this.player.takeDamage(monsterDamage);
    
    this.ui.setText(
      `You hit the ${this.currentMonster.name} for ${playerDamage} damage. ` +
      `The ${this.currentMonster.name} hits you for ${monsterDamage} damage!`
    );
    
    // Check if player died
    if (this.player.health <= 0) {
      this.ui.setText('You have been defeated! Game Over!');
      this.currentLocation = this.locations.town;
      this.currentMonster = null;
      this.player.reset();
      this.updateUI();
      return;
    }
    
    this.updateUI();
  }

  run() {
    const escapeChance = Math.random();
    if (escapeChance > 0.5) {
      this.ui.setText("You managed to escape!");
      this.currentMonster = null;
      this.currentLocation = this.locations.town;
    } else {
      const damage = this.currentMonster.getDamage();
      this.player.takeDamage(damage);
      this.ui.setText(
        `You failed to escape! The ${this.currentMonster.name} dealt ${damage} damage.`
      );
      
      if (this.player.health <= 0) {
        this.ui.setText("You have been defeated!");
        this.player.reset();
        this.currentLocation = this.locations.town;
      }
    }
    
    this.updateUI();
  }

  buyPotion(size) {
    const price = Potion.getPrice(size);
    if (this.player.gold >= price) {
      this.player.gold -= price;
      this.player.inventory.potions[size]++;
      this.ui.setText(`You bought a ${size} potion for ${price} gold.`);
    } else {
      this.ui.setText(`You don't have enough gold to buy a ${size} potion.`);
    }
    this.updateUI();
  }

  buyWeapon(weapon) {
    if (this.player.gold >= weapon.price) {
      this.player.gold -= weapon.price;
      this.player.currentWeapon = weapon;
      this.ui.setText(`You bought a ${weapon.name}!`);
    } else {
      this.ui.setText("You don't have enough gold!");
    }
    this.updateUI();
  }

  usePotion(size) {
    console.log('Using potion:', size, 'Current potions:', this.player.inventory.potions);
    if (this.player.inventory.potions[size] > 0 && this.player.health < this.player.maxHealth) {
      const healAmount = Potion.getHealAmount(size);
      const oldHealth = this.player.health;
      this.player.heal(healAmount);
      const actualHeal = this.player.health - oldHealth;
      
      this.player.inventory.potions[size]--;
      
      this.ui.setText(`You used a ${size} potion and recovered ${actualHeal} health.`);
      console.log('Healed for:', actualHeal, 'New health:', this.player.health);
    } else if (this.player.health >= this.player.maxHealth) {
      this.ui.setText("You are already at full health!");
    } else {
      this.ui.setText(`You don't have any ${size} potions!`);
    }
    this.updateUI();
  }

  showHowToPlay() {
    const modal = document.getElementById("howToPlayModal");
    const closeBtn = document.querySelector(".close");
    
    // Show the modal
    modal.style.display = "block";

    // Close when clicking X
    const closeModal = () => {
      modal.style.display = "none";
    };

    // Close when clicking outside
    const windowClick = (event) => {
      if (event.target === modal) {
        closeModal();
      }
    };

    // Add event listeners
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', windowClick);

    // Remove event listeners when modal is closed
    const cleanup = () => {
      closeBtn.removeEventListener('click', closeModal);
      window.removeEventListener('click', windowClick);
      modal.removeEventListener('close', cleanup);
    };

    modal.addEventListener('close', cleanup);
  }
}
