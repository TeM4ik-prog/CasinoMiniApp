import Phaser from 'phaser';

export class SlotMachine extends Phaser.Scene {
    private reels: Phaser.GameObjects.Text[][] = [];
    private spinButton!: Phaser.GameObjects.Text;
    private symbols: string[] = ['🍒', '🍊', '🍋', '🍇'];
    private isSpinning: boolean = false;
    private winText!: Phaser.GameObjects.Text;
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private currentSymbols: string[] = [];
    private spinningSymbols: Phaser.GameObjects.Text[][] = [];
    private reelMasks: Phaser.GameObjects.Graphics[] = [];
    private finalSymbols: string[] = [];
    private reelFrames: Phaser.GameObjects.Graphics[] = [];
    private winSymbolsText!: Phaser.GameObjects.Text;

    private margin: number = 48;

    constructor() {
        super({ key: 'SlotMachine' });
    }

    create() {
        // Создание фона
        this.add.rectangle(400, 300, 600, 400, 0x000000);

        // Создание рамок для барабанов
        for (let i = 0; i < 3; i++) {
            const frame = this.add.graphics();
            frame.lineStyle(4, 0xffffff);
            frame.strokeRect(140 + i * 200, 150, 120, 300);
            this.reelFrames.push(frame);
        }

        // Создание масок для барабанов
        for (let i = 0; i < 3; i++) {
            const mask = this.add.graphics();
            mask.fillStyle(0x000000);
            mask.fillRect(140 + i * 200, 150, 120, 300);
            this.reelMasks.push(mask);
        }

        // Создание барабанов
        for (let i = 0; i < 3; i++) {
            const reelSymbols: Phaser.GameObjects.Text[] = [];
            const symbol = this.add.text(
                200 + i * 200,
                300,
                this.symbols[Math.floor(Math.random() * this.symbols.length)],
                {
                    fontSize: '64px',
                    color: '#ffffff'
                }
            ).setOrigin(0.5);
            reelSymbols.push(symbol);
            this.reels.push(reelSymbols);
        }

        // Создание кнопки спина
        this.spinButton = this.add.text(400, 550, 'SPIN', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#ff0000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        this.spinButton.setInteractive();
        this.spinButton.on('pointerdown', () => this.spin());

        // Создание текста выигрыша
        this.winText = this.add.text(400, 100, '', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5).setVisible(false);

        // Создание текста счета
        this.scoreText = this.add.text(400, 50, 'Счет: 0', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    private spin() {
        if (this.isSpinning) return;
        this.isSpinning = true;
        this.winText.setVisible(false);

        // Удаляем старые символы
        if (this.spinningSymbols.length > 0) {
            this.spinningSymbols.forEach(symbols => {
                symbols.forEach(symbol => symbol.destroy());
            });
            this.spinningSymbols = [];
        }

        // Удаляем выигрышные символы
        this.finalSymbols = [];

        // Удаляем текст с выигрышными символами
        if (this.winSymbolsText) {
            this.winSymbolsText.destroy();
        }

        // Генерируем финальные символы
        this.finalSymbols = [
            this.symbols[Math.floor(Math.random() * this.symbols.length)],
            this.symbols[Math.floor(Math.random() * this.symbols.length)],
            this.symbols[Math.floor(Math.random() * this.symbols.length)]
        ];

        // Отображаем выигрышные символы внизу экрана
        this.winSymbolsText = this.add.text(400, 500, `Выигрышные символы: ${this.finalSymbols.join(' ')}`, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Скрываем основные символы
        this.reels.forEach(reel => reel[0].setVisible(false));

        // Создаем символы для анимации прокрутки
        this.spinningSymbols = [];
        for (let i = 0; i < 3; i++) {
            const symbols: Phaser.GameObjects.Text[] = [];

            // Создаем случайные символы
            for (let j = -50; j < 0; j++) {
                const randomSymbol = this.add.text(
                    200 + i * 200,
                    150 + j * (50 + this.margin),
                    j === -29 ? this.finalSymbols[i] : this.symbols[Math.floor(Math.random() * this.symbols.length)],
                    {
                        fontSize: '64px',
                        color: j === -29 ? '#ffff00' : '#ffffff'
                    }
                ).setOrigin(0.5);
                randomSymbol.setMask(new Phaser.Display.Masks.GeometryMask(this, this.reelMasks[i]));
                symbols.push(randomSymbol);
            }

            // Добавляем выигрышный символ на 27-ю позицию
            const winSymbol = this.add.text(
                200 + i * 200,
                150 + (-29) * (50 + this.margin),  // Позиция для 29-го элемента
                this.finalSymbols[i],
                {
                    fontSize: '64px',
                    color: '#ffff00'
                }
            ).setOrigin(0.5);
            winSymbol.setMask(new Phaser.Display.Masks.GeometryMask(this, this.reelMasks[i]));
            symbols.push(winSymbol);

            this.spinningSymbols.push(symbols);
        }

        // Анимация прокрутки для каждого барабана
        this.spinningSymbols.forEach((symbols, reelIndex) => {
            // Запускаем анимацию с задержкой для каждого барабана
            this.time.delayedCall(reelIndex * 1000, () => {
                this.tweens.add({
                    targets: symbols,
                    y: '+=3000',
                    duration: 3000,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        if (reelIndex === this.reels.length - 1) {
                            this.isSpinning = false;
                            this.checkWin();
                        }
                    }
                });
            });
        });
    }

    private checkWin() {
        // Получаем символы в центре каждого барабана
        const centerSymbols = this.reels.map(reel => reel[0].text);

        // Проверяем выигрыш
        const firstSymbol = centerSymbols[0];
        const allSame = centerSymbols.every(symbol => symbol === firstSymbol);

        if (allSame) {
            this.score += 100;
            this.scoreText.setText(`Счет: ${this.score}`);
            this.winText.setText('Выигрыш!');
            this.winText.setVisible(true);
        } else {
            this.winText.setText('Попробуйте еще раз!');
            this.winText.setVisible(true);
        }
    }
} 