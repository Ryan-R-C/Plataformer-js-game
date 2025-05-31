import { GameApplication } from './GameApplication.js';

// ==================== INITIALIZATION ====================
// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new GameApplication();
    app.initialize();
});

// Fallback initialization for immediate execution
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new GameApplication();
        app.initialize();
    });
} else {
    const app = new GameApplication();
    app.initialize();
}