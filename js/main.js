import { Game } from './Game.js';
import { GameUI } from './ui/GameUI.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    
    try {
        // Create UI first
        console.log('Creating GameUI...');
        const ui = new GameUI();
        console.log('GameUI created successfully');
        
        // Create game with UI
        console.log('Creating Game instance...');
        const game = new Game(ui);
        console.log('Game instance created successfully');
        
        // Initialize game
        console.log('Starting game initialization...');
        game.initialize();
        console.log('Game initialization complete');
    } catch (error) {
        console.error('Error during game initialization:', error);
    }
});

export { GameUI };
