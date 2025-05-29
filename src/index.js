import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

function initializeReactApp() {
    // This ID is commonly used in SillyTavern for placing extension buttons
    // in a dedicated bar or dropdown accessible from the main UI.
    const rootContainer = document.getElementById('extensions_buttons_template_zone');

    if (rootContainer) {
        console.log("Kaplay Game Extension: Found 'extensions_buttons_template_zone'. Attempting to render button host."); 
        
        // Use a span as the root for the React app. Spans are inline by default.
        // We'll still style it as inline-block to ensure it behaves correctly in a button bar.
        const rootElement = document.createElement('span');
        rootElement.id = 'kaplay-game-button-host'; // Added ID for easier DOM inspection
        rootElement.style.display = 'inline-block'; // Ensure it takes space in the layout
        rootElement.style.margin = '0'; // Prevent default margins from interfering
        rootElement.style.padding = '0'; // Prevent default paddings from interfering
        
        rootContainer.appendChild(rootElement);
        console.log("Kaplay Game Extension: Host element <span id='kaplay-game-button-host'> appended to 'extensions_buttons_template_zone'.");

        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
        console.log("Kaplay Game Extension: React <App /> component (which includes the button) rendered into host span. Please check browser console and DOM inspector.");
    } else {
        console.error("SillyTavern Extension: Target container 'extensions_buttons_template_zone' not found. Game button will not be loaded. Ensure this element exists in your SillyTavern HTML.");
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
    console.log("Kaplay Game Extension: DOMContentLoaded already fired. Initializing React app immediately."); // Added log for this path
    initializeReactApp();
}
