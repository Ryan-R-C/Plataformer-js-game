import { Game } from './Game.js';

class GameApplication {
    constructor() {
        this.game = null;
        this.canvas = null;
    }

    async initialize() {
        try {
            // Get canvas element
            this.canvas = document.querySelector('canvas');
            if (!this.canvas) {
                throw new Error('Canvas element not found');
            }

            // Create and initialize game
            this.game = new Game(this.canvas);
            await this.game.initialize();
            
            // Start the game
            this.game.start();
            
            console.log('Game application started successfully');
        } catch (error) {
            console.error('Failed to start game application:', error);
            this.showErrorMessage(error.message);
        }
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            z-index: 1000;
        `;
        errorDiv.textContent = `Error: ${message}`;
        document.body.appendChild(errorDiv);
    }
}

export { GameApplication };