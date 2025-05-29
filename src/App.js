import { useState, useEffect, useRef } from 'react';
// Removed: import ReactDOM from 'react-dom'; 
import kaplay from 'kaplay';

function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const gameContainerRef = useRef(null); // This ref will point to the div created in chat
    const kaplayInstanceRef = useRef(null);

    // Effect for Kaplay initialization and cleanup
    useEffect(() => {
        if (gameStarted) {
            const chatElement = document.getElementById('chat'); // Standard SillyTavern chat container ID
            if (!chatElement) {
                console.error("Kaplay Game Extension: Chat element '#chat' not found. Cannot start game in chat.");
                setGameStarted(false); // Revert state if chat not found
                return;
            }

            // Create a container for the game within the chat
            const gameDiv = document.createElement('div');
            gameDiv.id = 'kaplay-game-in-chat-container';
            // Style the game container
            gameDiv.style.width = '640px'; // Adjust as needed
            gameDiv.style.height = '480px'; // Adjust as needed
            gameDiv.style.border = '1px solid #ccc';
            gameDiv.style.marginBottom = '10px';
            gameDiv.style.backgroundColor = '#f0f0f0'; // So game is visible against chat background

            chatElement.appendChild(gameDiv);
            gameContainerRef.current = gameDiv;
            
            console.log("Kaplay Game Extension: Game container appended to #chat.");

            const k = kaplay({
                root: gameContainerRef.current, // Use the new div in chat
                width: 640,
                height: 480,
                // background: [0, 0, 0], // Optional: canvas background
            });

            kaplayInstanceRef.current = k;

            k.scene("main", () => {
                k.add([
                    k.text("Kaplay Game! (In Chat)"), // Updated text
                    k.pos(k.width() / 2, 40),
                    k.anchor("center"),
                ]);

                const player = k.add([
                    k.rect(40, 40),
                    k.pos(100, k.height() - 100),
                    k.color(0, 0, 255),
                    k.anchor("botleft"),
                    k.body(),
                    k.area(),
                    "player",
                ]);

                k.add([
                    k.rect(k.width(), 20),
                    k.pos(0, k.height() - 20),
                    k.color(0, 255, 0), // Green platform
                    k.anchor("botleft"),
                    k.area(),
                    k.body({ isStatic: true }),
                ]);

                const JUMP_FORCE = 720;
                const SPEED = 320;

                k.onKeyDown("left", () => player.move(-SPEED, 0));
                k.onKeyDown("right", () => player.move(SPEED, 0));
                k.onKeyPress("space", () => {
                    if (player.isGrounded()) {
                        player.jump(JUMP_FORCE);
                    }
                });

                k.add([
                    k.text("Controls: Left/Right Arrows, Space. Button to close.", { size: 14 }), // Updated text
                    k.pos(10, k.height() - 10), // Adjusted position if needed
                    k.anchor("botleft"),
                ]);
            });

            k.go("main");
            console.log("Kaplay Game Extension: Kaplay instance started in chat container.");
        }

        return () => {
            // Cleanup function: runs when gameStarted changes to false or component unmounts
            if (kaplayInstanceRef.current) {
                if (typeof kaplayInstanceRef.current.quit === 'function') {
                    console.log("Kaplay Game Extension: Quitting Kaplay instance.");
                    kaplayInstanceRef.current.quit();
                }
                kaplayInstanceRef.current = null;
            }
            if (gameContainerRef.current) {
                console.log("Kaplay Game Extension: Removing game container from DOM.");
                gameContainerRef.current.remove(); // Remove the div from chat
                gameContainerRef.current = null;
            }
        };
    }, [gameStarted]); // Re-run effect if gameStarted changes

    const handleToggleGame = () => {
        setGameStarted(prevGameStarted => !prevGameStarted);
    };

    // The game UI is no longer rendered via portal here.
    // It's created and destroyed in the useEffect hook.

    return (
        <>
            {/* Changed from <button> to <div> to match reference */}
            <div onClick={handleToggleGame} className="menu_button" style={{ cursor: 'pointer' }}>
                {gameStarted ? 'Stop Kaplay Game' : 'Start Kaplay Game'}
            </div>
            {/* Game UI is now managed by useEffect and appended to chat */}
        </>
    );
}

export default App;
