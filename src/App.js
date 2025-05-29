import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM for createPortal
import kaplay from 'kaplay';

function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const gameContainerRef = useRef(null); // This ref will point to the div inside the portal
    const kaplayInstanceRef = useRef(null);

    // Effect for Kaplay initialization and cleanup
    useEffect(() => {
        if (gameStarted && gameContainerRef.current && !kaplayInstanceRef.current) {
            const k = kaplay({
                root: gameContainerRef.current,
                width: 640,
                height: 480,
                // Optional: background color for the canvas itself
                // background: [0, 0, 0], 
            });

            kaplayInstanceRef.current = k;

            k.scene("main", () => {
                k.add([
                    k.text("Kaplay Game! (Overlay)"),
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
                    k.color(0, 255, 0),
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
                    k.text("Controls: Left/Right Arrows, Space to Jump. Press button to close.", { size: 14 }),
                    k.pos(10, k.height() - 10),
                    k.anchor("botleft"),
                ]);
            });

            k.go("main");
        }

        return () => {
            if (kaplayInstanceRef.current) {
                if (typeof kaplayInstanceRef.current.quit === 'function') {
                    kaplayInstanceRef.current.quit();
                }
                kaplayInstanceRef.current = null;
            }
            // Note: The div gameContainerRef points to is managed by React via the portal.
            // No need to manually clear its innerHTML here as it will be unmounted.
        };
    }, [gameStarted]); // Re-run effect if gameStarted changes

    const handleToggleGame = () => {
        setGameStarted(prevGameStarted => !prevGameStarted);
    };

    const gameUi = gameStarted ? (
        ReactDOM.createPortal(
            <div
                ref={gameContainerRef}
                id="kaplay-game-portal-container"
                style={{
                    position: 'fixed', // Overlay styling
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '640px', // Adjust as needed
                    height: '480px', // Adjust as needed
                    backgroundColor: '#282c34', // A distinct background for the container
                    border: '2px solid #61dafb',
                    zIndex: 10000, // Ensure it's on top of other UI elements
                    boxShadow: '0 0 15px rgba(0,0,0,0.5)',
                }}
            >
                {/* Kaplay will attach its canvas here */}
            </div>,
            document.body // Render into the body, outside the normal React component tree
        )
    ) : null;

    return (
        <>
            <button onClick={handleToggleGame} className="menu_button">
                {gameStarted ? 'Stop Kaplay Game' : 'Start Kaplay Game'}
            </button>
            {gameUi}
        </>
    );
}

export default App;
