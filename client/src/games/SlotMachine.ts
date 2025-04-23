import { findWinningSymbol } from '@/utils/slotUtils';
import Phaser from 'phaser';

// Изменяем импорт фона

interface SymbolConfig {
    emoji: string;
    rarity: number; // 5 - самый редкий, 1 - самый частый
    payouts: number[]; // выплаты за 3, 4, 5 символов
}

export class SlotMachine extends Phaser.Scene {
    private reels: Phaser.GameObjects.Text[][] = [];
    private spinButton!: Phaser.GameObjects.Text;
    private symbols: SymbolConfig[] = [
        { emoji: '💰', rarity: 5, payouts: [200, 1000, 5000] }, // Деньги - самый редкий
        { emoji: '💎', rarity: 4, payouts: [100, 500, 2000] },  // Алмаз
        { emoji: '🍒', rarity: 3, payouts: [100, 300, 800] },    // Вишня
        { emoji: '🍊', rarity: 3, payouts: [100, 150, 300] },    // Апельсин
        { emoji: '🍋', rarity: 2, payouts: [60, 130, 200] },     // Лимон
        { emoji: '🍇', rarity: 1, payouts: [30, 120, 300] },     // Виноград
        { emoji: '🍉', rarity: 1, payouts: [30, 120, 500] },    // Арбуз
        { emoji: '🍓', rarity: 1, payouts: [30, 100, 400] }     // Клубника
    ];
    private isSpinning: boolean = false;
    private winText!: Phaser.GameObjects.Text;
    private scoreText!: Phaser.GameObjects.Text;
    private spinningSymbols: Phaser.GameObjects.Text[][] = [];
    private reelMasks: Phaser.GameObjects.Graphics[] = [];
    private finalSymbols: string[] = [];
    private reelFrames: Phaser.GameObjects.Graphics[] = [];
    private symbolPool: Phaser.GameObjects.Text[] = [];
    private activeSymbols: Set<Phaser.GameObjects.Text> = new Set();
    private startX: number = 0;
    private balance: number = 1000; // Начальный баланс в рублях
    private readonly SPIN_COST: number = 50; // Стоимость прокрутки в рублях

    private margin: number = 48;
    private readonly REEL_COUNT = 5;
    private readonly SYMBOL_COUNT = 30;
    private readonly ANIMATION_DURATION = 700;

    private readonly DELAY = 300;
    private readonly REEL_WIDTH = 100;
    private readonly REEL_SPACING = 20;
    private middleArrows: Phaser.GameObjects.Graphics[] = [];

    constructor() {
        super({ key: 'SlotMachine' });
    }

    preload() {
        // Загрузка фона
        this.load.image('slotBackground', 'assets/slot-background.png');
    }

    create() {
        // Создание фона
        const bg = this.add.image(400, 300, 'slotBackground').setOrigin(0.5, 0.5);
        bg.setDisplaySize(800, 600);

        // // Добавляем эффект свечения для фона
        // const glow = this.add.graphics();
        // glow.fillStyle(0x000000, 0.3);
        // glow.fillRect(0, 0, 800, 600);

        const totalWidth = (this.REEL_COUNT * this.REEL_WIDTH) + ((this.REEL_COUNT - 1) * this.REEL_SPACING);
        this.startX = (800 - totalWidth) / 2 + this.REEL_WIDTH / 2;

        // Создание рамок для барабанов с эффектом свечения
        for (let i = 0; i < this.REEL_COUNT; i++) {
            const x = this.startX + i * (this.REEL_WIDTH + this.REEL_SPACING);
            
            // Свечение рамки
            const glow = this.add.graphics();
            glow.lineStyle(8, 0xffffff, 0.3);
            glow.strokeRect(x - this.REEL_WIDTH / 2 + 5, 145 + 5, this.REEL_WIDTH - 10, 310 - 10);
            this.reelFrames.push(glow);

            // Основная рамка
            const frame = this.add.graphics();
            frame.lineStyle(4, 0xffffff);
            frame.strokeRect(x - this.REEL_WIDTH / 2 + 10, 150 + 10, this.REEL_WIDTH - 20, 300 - 20);
            this.reelFrames.push(frame);

            // Создаем стрелки для средних элементов
            const arrow = this.add.graphics();
            arrow.lineStyle(3, 0xffff00);
            arrow.beginPath();
            arrow.moveTo(x - this.REEL_WIDTH / 2 - 20, 300);
            arrow.lineTo(x - this.REEL_WIDTH / 2 - 10, 290);
            arrow.lineTo(x - this.REEL_WIDTH / 2 - 10, 310);
            arrow.closePath();
            arrow.fillStyle(0xffff00);
            arrow.fill();
            this.middleArrows.push(arrow);

            const arrow2 = this.add.graphics();
            arrow2.lineStyle(3, 0xffff00);
            arrow2.beginPath();
            arrow2.moveTo(x + this.REEL_WIDTH / 2 + 20, 300);
            arrow2.lineTo(x + this.REEL_WIDTH / 2 + 10, 290);
            arrow2.lineTo(x + this.REEL_WIDTH / 2 + 10, 310);
            arrow2.closePath();
            arrow2.fillStyle(0xffff00);
            arrow2.fill();
            this.middleArrows.push(arrow2);
        }

        // Создание масок для барабанов
        for (let i = 0; i < this.REEL_COUNT; i++) {
            const x = this.startX + i * (this.REEL_WIDTH + this.REEL_SPACING);
            const mask = this.add.graphics();
            mask.fillStyle(0x000000, 0.7);
            mask.fillRect(x - this.REEL_WIDTH / 2 + 10, 150 + 10, this.REEL_WIDTH - 20, 300 - 20);
            this.reelMasks.push(mask);
        }

        // Предварительное создание пула символов
        this.createSymbolPool();

        // Создание барабанов
        for (let i = 0; i < this.REEL_COUNT; i++) {
            const x = this.startX + i * (this.REEL_WIDTH + this.REEL_SPACING);
            const reelSymbols: Phaser.GameObjects.Text[] = [];
            const symbol = this.getSymbolFromPool(
                x,
                300,
                this.symbols[Math.floor(Math.random() * this.symbols.length)].emoji
            );
            reelSymbols.push(symbol);
            this.reels.push(reelSymbols);
        }

        // Создание кнопки спина с анимацией
        this.spinButton = this.add.text(400, 550, 'SPIN', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#ff0000',
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5);

        // Делаем кнопку интерактивной
        this.spinButton.setInteractive();
        this.spinButton.on('pointerdown', () => this.spin());

        // Добавляем эффект пульсации для кнопки
        this.tweens.add({
            targets: this.spinButton,
            scale: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Создание текста выигрыша
        this.winText = this.add.text(400, 100, '', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5).setVisible(false);

        // Создание текста баланса с эффектом
        this.scoreText = this.add.text(400, 50, `Баланс: ${this.balance} ₽`, {
            fontSize: '32px',
            color: '#ffffff',
            padding: { x: 20, y: 10 },
            backgroundColor: '#000000'
        }).setOrigin(0.5);

        // Добавляем эффект свечения для текста баланса
        this.tweens.add({
            targets: this.scoreText,
            alpha: 0.8,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Создание текста стоимости прокрутки
        const costText = this.add.text(400, 500, `Стоимость прокрутки: ${this.SPIN_COST} ₽`, {
            fontSize: '24px',
            color: '#ffffff',
            padding: { x: 15, y: 8 },
            backgroundColor: '#000000'
        }).setOrigin(0.5);

        // Добавляем эффект мерцания для стрелок
        this.middleArrows.forEach(arrow => {
            this.tweens.add({
                targets: arrow,
                alpha: 0.5,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        });
    }

    private createSymbolPool() {
        for (let i = 0; i < this.REEL_COUNT * this.SYMBOL_COUNT; i++) {
            const symbol = this.add.text(0, 0, '', {
                fontSize: '64px',
                color: '#ffffff'
            }).setOrigin(0.5);
            symbol.setVisible(false);
            this.symbolPool.push(symbol);
        }
    }

    private getSymbolFromPool(x: number, y: number, text: string): Phaser.GameObjects.Text {
        const symbol = this.symbolPool.find(s => !s.visible);
        if (symbol) {
            symbol.setPosition(x, y);
            symbol.setText(text);
            symbol.setVisible(true);
            this.activeSymbols.add(symbol);
            return symbol;
        }
        throw new Error('No available symbols in pool');
    }

    private returnSymbolToPool(symbol: Phaser.GameObjects.Text) {
        symbol.setVisible(false);
        this.activeSymbols.delete(symbol);
    }

    private getRandomSymbol(): SymbolConfig {
        // Создаем взвешенный массив символов в зависимости от их редкости
        const weightedSymbols: SymbolConfig[] = [];
        this.symbols.forEach(symbol => {
            
            const weight = 7 - symbol.rarity; // rarity от 1 до 5
            for (let i = 0; i < weight; i++) {
                weightedSymbols.push(symbol);
            }
        });

        return weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];
    }

    private spin() {
        if (this.isSpinning) return;
        
        // Проверяем достаточно ли средств для прокрутки
        if (this.balance < this.SPIN_COST) {
            // Анимация при недостатке средств
            this.tweens.add({
                targets: this.winText,
                x: 400,
                y: 100,
                alpha: 1,
                duration: 300,
                onStart: () => {
                    this.winText.setText('Недостаточно средств!');
                    this.winText.setVisible(true);
                },
                onComplete: () => {
                    this.time.delayedCall(1000, () => {
                        this.tweens.add({
                            targets: this.winText,
                            alpha: 0,
                            duration: 300,
                            onComplete: () => {
                                this.winText.setVisible(false);
                            }
                        });
                    });
                }
            });
            return;
        }

        // Анимация нажатия кнопки
        this.tweens.add({
            targets: this.spinButton,
            scale: 0.9,
            duration: 100,
            yoyo: true
        });

        // Списываем стоимость прокрутки
        this.balance -= this.SPIN_COST;
        this.scoreText.setText(`Баланс: ${this.balance} ₽`);

        this.isSpinning = true;
        this.winText.setVisible(false);

        // Возвращаем все активные символы в пул
        this.activeSymbols.forEach(symbol => this.returnSymbolToPool(symbol));
        this.activeSymbols.clear();
        this.spinningSymbols = [];

        // Генерируем финальные символы
        this.finalSymbols = Array.from({ length: this.REEL_COUNT }, () =>
            this.getRandomSymbol().emoji
        );

        // Создаем символы для анимации прокрутки
        for (let i = 0; i < this.REEL_COUNT; i++) {
            const x = this.startX + i * (this.REEL_WIDTH + this.REEL_SPACING);
            const symbols: Phaser.GameObjects.Text[] = [];

            for (let j = -this.SYMBOL_COUNT; j < 0; j++) {
                const isWinSymbol = j === -29;
                const symbolConfig = isWinSymbol ?
                    this.symbols.find(s => s.emoji === this.finalSymbols[i])! :
                    this.getRandomSymbol();

                const symbol = this.getSymbolFromPool(
                    x,
                    150 + j * (50 + this.margin),
                    symbolConfig.emoji
                );
                symbol.setColor(isWinSymbol ? '#ffff00' : '#ffffff');
                symbol.setMask(new Phaser.Display.Masks.GeometryMask(this, this.reelMasks[i]));
                symbols.push(symbol);
            }

            this.spinningSymbols.push(symbols);
        }

        // Оптимизированная анимация прокрутки
        this.spinningSymbols.forEach((symbols, reelIndex) => {
            this.time.delayedCall(reelIndex * this.DELAY, () => {
                this.tweens.add({
                    targets: symbols,
                    y: '+=3000',
                    duration: this.ANIMATION_DURATION,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        if (reelIndex === this.REEL_COUNT - 1) {
                            this.isSpinning = false;
                            this.checkWin();
                        }
                    }
                });
            });
        });
    }

    private checkWin() {
        const winSymbols = this.finalSymbols;
        const winningSymbol = findWinningSymbol(winSymbols);

        if (!winningSymbol) {
            this.winText.setText('Попробуйте еще раз!');
            this.winText.setVisible(true);
            return;
        }

        const symbolData = this.symbols.find(s => s.emoji === winningSymbol.symbol)!;
        const baseWin = symbolData.payouts[winningSymbol.count - 3];
        const rarityMultiplier = 6 - symbolData.rarity;
        const totalWin = baseWin * rarityMultiplier;

        if (totalWin > 0) {
            this.balance += totalWin;
            this.scoreText.setText(`Баланс: ${this.balance} ₽`);
            
            // Улучшенная анимация выигрыша
            this.tweens.add({
                targets: this.winText,
                scale: 1.2,
                duration: 200,
                yoyo: true,
                repeat: 1,
                onStart: () => {
                    this.winText.setText(`Выигрыш: ${totalWin} ₽ 🎉`);
                    this.winText.setVisible(true);
                }
            });

            // Анимация для выигрышных символов
            this.highlightWinningSymbols(winningSymbol);

            // Анимация для текста баланса
            this.tweens.add({
                targets: this.scoreText,
                scale: 1.1,
                duration: 200,
                yoyo: true,
                repeat: 1
            });
        }
    }

    private highlightWinningSymbols(winningSymbol: any) {
        // Сбрасываем цвет всех символов
        this.spinningSymbols.forEach(reel => {
            reel.forEach(symbol => {
                symbol.setColor('#ffffff');
            });
        });

        // Подсвечиваем выигрышные символы
        this.spinningSymbols.forEach((reel, reelIndex) => {
            if (reel[reel.length - 1].text === winningSymbol.symbol) {
                reel[reel.length - 1].setColor('#ffff00');
                this.tweens.add({
                    targets: reel[reel.length - 1],
                    scale: 1.2,
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
            }
        });
    }
} 