import { Logo } from "./Logo";

export const Footer: React.FC = () => {
    return (
        <footer className="bg-casino-primary text-white relative overflow-hidden border-t border-casino-border-20">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
            <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="space-y-4">
                        <Logo />
                        <p className="text-gray-400 text-sm">
                            Лучшие игровые автоматы и казино. Мы предлагаем широкий выбор слотов и игр от ведущих производителей.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-casino-gold to-casino-gold-light text-transparent bg-clip-text">
                            Игры
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="hover:text-casino-gold transition-colors">
                                <a href="#popular">Популярные</a>
                            </li>
                            <li className="hover:text-casino-gold transition-colors">
                                <a href="#slots">Слоты</a>
                            </li>
                            <li className="hover:text-casino-gold transition-colors">
                                <a href="#jackpot">Джекпоты</a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-casino-gold to-casino-gold-light text-transparent bg-clip-text">
                            Информация
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="hover:text-casino-gold transition-colors">
                                <a href="/rules">Правила</a>
                            </li>
                            <li className="hover:text-casino-gold transition-colors">
                                <a href="/faq">FAQ</a>
                            </li>
                            <li className="hover:text-casino-gold transition-colors">
                                <a href="/about">О нас</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-casino-border-20 pt-6 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} LEX Casino. Все права защищены.</p>
                        <div className="flex gap-4">
                            <a href="/privacy" className="hover:text-casino-gold transition-colors">Конфиденциальность</a>
                            <a href="/terms" className="hover:text-casino-gold transition-colors">Условия использования</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
