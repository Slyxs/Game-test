import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Choose the root container for the extension's main UI
// Old: const rootContainer = document.getElementById('extensions_settings');
// New: Target the chat area. 'chat_results' is a common ID for SillyTavern's chat.
// You might need to adjust this ID if your SillyTavern version or theme uses a different one.
const rootContainer = document.getElementById('chat_results'); 

// Ensure the rootContainer exists before trying to append to it.
// This is important as 'chat_results' might not be immediately available
// or might be dynamically loaded. A more robust solution might involve
// waiting for the element or using a MutationObserver, but for simplicity,
// we'll assume it's present or handle the error gracefully.
if (rootContainer) {
    const rootElement = document.createElement('div');
    // Style the rootElement to be less intrusive if needed, e.g., for a button
    // rootElement.style.position = 'relative'; // Or other styles as appropriate
    // rootElement.style.zIndex = '1000'; // Ensure it's visible if overlaying
    rootContainer.appendChild(rootElement);

    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("SillyTavern Extension: Target container 'chat_results' not found. Game UI will not be loaded.");
}
