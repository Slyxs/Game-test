/* global SillyTavern */
import React, { useState, useEffect, useRef } from 'react';
import kaplay from 'kaplay';

function App() {
    const [showGame, setShowGame] = useState(false);
    const gameContainerRef = useRef(null);
    const kaplayInstanceRef = useRef(null);

    useEffect(() => {
        if (showGame && gameContainerRef.current) {
            // Prevent multiple initializations if effect runs multiple times rapidly
            if (kaplayInstanceRef.current) {
                return;
            }

            const k = kaplay({
                global: false, // Recommended to avoid polluting the global namespace
                root: gameContainerRef.current,
                width: 640,
                height: 480,
                background: [0, 0, 0], // Black background for the game
            });

            kaplayInstanceRef.current = k;

            // Define a simple game scene
            k.scene("main", () => {
                k.add([
                    k.text("Kaplay Game Running!", { size: 24 }),
                    k.pos(k.width() / 2, k.height() / 2),
                    k.anchor("center"),
                    k.color(255, 255, 255), // White text
                ]);

                // Add a simple rectangle
                k.add([
                    k.rect(50, 50),
                    k.pos(50, 50),
                    k.color(255, 0, 0), // Red color
                    k.anchor("center"),
                ]);
            });

            // Start the main scene
            k.go("main");

            // Cleanup function for when the component unmounts or showGame becomes false
            return () => {
                if (kaplayInstanceRef.current) {
                    kaplayInstanceRef.current.destroy();
                    kaplayInstanceRef.current = null;
                }
                // Ensure the container is empty after destroying Kaplay
                if (gameContainerRef.current) {
                    gameContainerRef.current.innerHTML = '';
                }
            };
        } else {
            // This block ensures cleanup if showGame becomes false and effect re-runs
            // The return function from the effect primarily handles this, but this is an extra guard.
            if (kaplayInstanceRef.current) {
                kaplayInstanceRef.current.destroy();
                kaplayInstanceRef.current = null;
                if (gameContainerRef.current) {
                    gameContainerRef.current.innerHTML = '';
                }
            }
        }
    }, [showGame]); // Re-run the effect when showGame changes

    const handlePlayGameClick = () => {
        setShowGame(true);
    };

    const handleStopGameClick = () => {
        setShowGame(false); // This will trigger the cleanup in useEffect
    };

    function handleClick() {
        alert(`Hello, ${SillyTavern.getContext().name1}!`);
    }

    return (
        <div>
            {!showGame ? (
                <button onClick={handlePlayGameClick} className="menu_button">
                    Launch Kaplay Game
                </button>
            ) : (
                <button onClick={handleStopGameClick} className="menu_button">
                    Stop Kaplay Game
                </button>
            )}
            {showGame && (
                <div 
                    ref={gameContainerRef} 
                    id="kaplay-game-container" 
                    style={{ 
                        width: '640px', 
                        height: '480px', 
                        border: '1px solid #ccc', 
                        marginTop: '10px' 
                    }}
                >
                    {/* Kaplay canvas will be injected here */}
                </div>
            )}
        </div>
    );
}

export default App;
