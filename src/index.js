import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Target for the button: 'extensions_buttons_template_zone' is a common area for extension buttons.
// This should place the button in a toolbar or a dedicated extension button area in the main UI.
const rootContainer = document.getElementById('extensions_buttons_template_zone');

if (rootContainer) {
    const rootElement = document.createElement('div');
    // The button itself will be styled by App.js or SillyTavern's CSS for 'menu_button'
    // Add inline style to ensure the div itself doesn't break flex layouts if 'extensions_buttons_template_zone' is a flex container.
    rootElement.style.display = 'inline-block'; // Or 'flex', 'contents' depending on parent styling
    rootContainer.appendChild(rootElement);

    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("SillyTavern Extension: Target container 'extensions_buttons_template_zone' not found. Game button will not be loaded.");
}
