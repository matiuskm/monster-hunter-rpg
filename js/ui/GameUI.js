import { weapons } from '../models/Weapon.js';

export class GameUI {
  constructor() {
    console.log('Initializing GameUI...');
    
    // Get UI elements with error checking
    this.text = document.querySelector("#text");
    if (!this.text) {
      console.error('Could not find #text element');
      throw new Error('Required element #text not found');
    }
    
    this.monsterStats = document.querySelector("#monsterStats");
    if (!this.monsterStats) {
      console.error('Could not find #monsterStats element');
      throw new Error('Required element #monsterStats not found');
    }
    
    this.monsterName = document.querySelector("#monsterName");
    if (!this.monsterName) {
      console.error('Could not find #monsterName element');
      throw new Error('Required element #monsterName not found');
    }
    
    this.monsterHealth = document.querySelector("#monsterHealth");
    if (!this.monsterHealth) {
      console.error('Could not find #monsterHealth element');
      throw new Error('Required element #monsterHealth not found');
    }
    
    this.controls = document.querySelector("#controls");
    if (!this.controls) {
      console.error('Could not find #controls element');
      throw new Error('Required element #controls not found');
    }

    console.log('All UI elements found successfully');

    // Hide monster stats by default
    this.updateMonsterStats(null);
    
    console.log('GameUI initialization complete');
  }

  setText(text) {
    this.text.innerHTML = text;
  }

  setButtons(buttons) {
    console.log('Setting buttons:', buttons);
    // Clear existing buttons
    this.controls.innerHTML = "";
    
    // Create new buttons
    buttons.forEach(button => {
      console.log('Creating button:', button.text);
      const btn = document.createElement("button");
      btn.innerText = button.text;
      
      // Add click handler
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof button.handler === 'function') {
          button.handler();
        }
      });
      
      if (button.disabled) {
        btn.disabled = true;
      }
      
      // Add button to controls
      this.controls.appendChild(btn);
    });
    
    console.log('Buttons added. Controls content:', this.controls.innerHTML);
  }

  updatePlayerStats(player) {
    document.querySelector("#xpText").innerText = player.xp;
    document.querySelector("#healthText").innerText = player.health;
    document.querySelector("#maxHealthText").innerText = player.maxHealth;
    document.querySelector("#goldText").innerText = player.gold;
    document.querySelector("#levelText").innerText = player.level;
    document.querySelector("#weaponText").innerText = player.currentWeapon.name;
    document.querySelector("#powerText").innerText = player.getCurrentWeaponPower();
    
    // Update potion counts with better formatting
    const potionText = [];
    if (player.inventory.potions.large > 0) {
      potionText.push(`L:${player.inventory.potions.large}`);
    }
    if (player.inventory.potions.medium > 0) {
      potionText.push(`M:${player.inventory.potions.medium}`);
    }
    if (player.inventory.potions.small > 0) {
      potionText.push(`S:${player.inventory.potions.small}`);
    }
    document.querySelector("#potionsText").innerText = potionText.length > 0 ? potionText.join(" ") : "0";
  }

  updateMonsterStats(monster) {
    console.log('Updating monster stats:', monster);
    if (!monster) {
      this.monsterStats.style.display = "none";
      this.monsterName.innerText = "";
      this.monsterHealth.innerText = "";
      return;
    }

    this.monsterStats.style.display = "block";
    this.monsterName.innerText = `${monster.name} (Lvl ${monster.level})`;
    this.monsterHealth.innerText = `${monster.currentHealth}/${monster.maxHealth}`;
    console.log('Monster stats updated:', this.monsterHealth.innerText);
  }
}
