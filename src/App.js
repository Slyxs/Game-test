import React, { useState, useEffect, useRef } from 'react';
import kaplay from 'kaplay';

function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const gameContainerRef = useRef(null);
    const kaplayInstanceRef = useRef(null);

    useEffect(() => {
        if (gameStarted && gameContainerRef.current && !kaplayInstanceRef.current) {
            // Initialize Kaplay
            const k = kaplay({
                root: gameContainerRef.current, // Mount Kaplay canvas in this div
                width: 640,
                height: 480,
                // Kaplay will create and append its own canvas to the root
                // To use a specific canvas:
                // canvas: myCanvasElement
            });

            kaplayInstanceRef.current = k;

            // --- Kaplay game code starts here ---
            k.scene("main", () => {
                // Add a text label
                k.add([
                    k.text("Kaplay Game!"),
                    k.pos(k.width() / 2, 40),
                    k.anchor("center"),
                ]);

                // Add a player character (a simple rectangle)
                const player = k.add([
                    k.rect(40, 40),
                    k.pos(100, k.height() - 100),
                    k.color(0, 0, 255), // Blue color
                    k.anchor("botleft"),
                    k.body(), // Makes it a physical body (for gravity, etc.)
                    k.area(), // Gives it a collider
                    "player", // Tag for easy access
                ]);

                // Add a ground
                k.add([
                    k.rect(k.width(), 20),
                    k.pos(0, k.height() - 20),
                    k.color(0, 255, 0), // Green color
                    k.anchor("botleft"),
                    k.area(), // Required for collisions
                    k.body({ isStatic: true }), // Makes it a static body
                ]);

                // Player movement parameters
                const JUMP_FORCE = 720;
                const SPEED = 320;

                // Handle player input
                k.onKeyDown("left", () => {
                    player.move(-SPEED, 0);
                });

                k.onKeyDown("right", () => {
                    player.move(SPEED, 0);
                });

                k.onKeyPress("space", () => {
                    if (player.isGrounded()) {
                        player.jump(JUMP_FORCE);
                    }
                });

                // Display controls help text
                k.add([
                    k.text("Controls: Left/Right Arrows, Space to Jump", { size: 18 }),
                    k.pos(10, k.height() - 10),
                    k.anchor("botleft"),
                ]);
            });

            // Start the "main" scene
            k.go("main");
            // --- Kaplay game code ends here ---
        }

        // Cleanup function: This runs when gameStarted changes or component unmounts
        return () => {
            if (kaplayInstanceRef.current) {
                if (typeof kaplayInstanceRef.current.quit === 'function') {
                    kaplayInstanceRef.current.quit();
                }
                kaplayInstanceRef.current = null;
            }
            // Ensure the container is empty after Kaplay quits
            if (gameContainerRef.current) {
                gameContainerRef.current.innerHTML = '';
            }
        };
    }, [gameStarted]); // Re-run effect if gameStarted changes

    const handleToggleGame = () => {
        setGameStarted(prevGameStarted => !prevGameStarted);
    };

    return (
        <div>
            <button onClick={handleToggleGame} className="menu_button">
                {gameStarted ? 'Stop Kaplay Game' : 'Start Kaplay Game'}
            </button>
            {/* The div for Kaplay game. Its display is controlled by CSS. */}
            <div
                ref={gameContainerRef}
                id="kaplay-game-container"
                style={{
                    display: gameStarted ? 'block' : 'none', // Show/hide the container
                    width: '640px',
                    height: '480px',
                    border: gameStarted ? '1px solid black' : 'none', // Optional: border only when active
                    marginTop: '10px',
                    backgroundColor: gameStarted ? '#f0f0f0' : 'transparent', // Optional: background
                }}
            >
                {/* Kaplay will attach its canvas here when gameStarted is true and useEffect runs */}
            </div>
        </div>
    );
}

export default App;
