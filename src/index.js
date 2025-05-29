import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

function initializeReactApp() {
    // This ID is commonly used in SillyTavern for placing extension buttons
    // in a dedicated bar or dropdown accessible from the main UI.
    const rootContainer = document.getElementById('extensions_buttons_template_zone');

    if (rootContainer) {
        console.log("Kaplay Game Extension: Found 'extensions_buttons_template_zone'. Attempting to render button host."); // Added log
        const rootElement = document.createElement('div');
        // Style the container div to be inline so it fits into a button bar.
        // The actual button styling is handled by the 'menu_button' class in App.js.
        rootElement.style.display = 'inline-block'; 
        rootContainer.appendChild(rootElement);

        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
        console.log("Kaplay Game Extension: Button host successfully rendered into 'extensions_buttons_template_zone'. Check if button is visible and correctly styled by 'menu_button' class."); // Enhanced log
    } else {
        console.error("SillyTavern Extension: Target container 'extensions_buttons_template_zone' not found. Game button will not be loaded.");
        // You could add fallback logic here, e.g., trying a different container ID
        // or logging more detailed diagnostics if this critical element is missing.
    }
}

// Ensure the DOM is fully loaded before trying to initialize the React app.
// This helps prevent errors if the script runs before the target DOM elements are ready.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeReactApp);
} else {
    // DOMContentLoaded has already fired
    initializeReactApp();
}
