import Phaser from 'phaser';
import { useEffect, useRef } from 'react';
import { config } from '../games/config';

export const SlotMachineGame = () => {
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (!gameRef.current) {
            gameRef.current = new Phaser.Game(config);
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div id="game-container" className="w-[800px] h-[600px]" />
        </div>
    );
}; 