import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { useUserData } from "@/store/hooks";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface GameCardProps {
    title: string;
    image: string;
    onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, image, onClick }) => {
    return (
        <div className="flex flex-col space-y-2">
            <div 
                onClick={onClick}
                className="relative cursor-pointer group overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-300 w-full"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
                <img 
                    src={image} 
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                    }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate px-1">{title}</span>
        </div>
    );
};

const CategoryTitle: React.FC<{ title: string }> = ({ title }) => (
    <div className="w-full border-b border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2">{title}</h2>
    </div>
);

const Navigation: React.FC = () => {
    const categories = [
        { id: 'popular', title: 'Популярные', path: '#popular' },
        { id: 'slots', title: 'Слоты', path: '#slots' },
        { id: 'jackpot', title: 'Джек Пот', path: '#jackpot' }
    ];

    const [activeCategory, setActiveCategory] = useState('popular');
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const sections = categories.map(cat => {
                const element = document.getElementById(cat.id);
                if (!element) return { id: cat.id, offset: 0 };
                return {
                    id: cat.id,
                    offset: Math.abs(element.getBoundingClientRect().top - 64)
                };
            });

            const closest = sections.reduce((prev, curr) => 
                prev.offset < curr.offset ? prev : curr
            );

            setActiveCategory(closest.id);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCategoryClick = (categoryId: string, path: string) => {
        const element = document.getElementById(categoryId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveCategory(categoryId);
        }
    };

    return (
        <div className="fixed p-4 top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg z-50 border-b border-white/10">
            <div className="max-w-[1920px] mx-auto px-4">
                <div className="flex justify-center space-x-4 scrollbar-hide h-10">
                    {categories.map(category => (
                        <Button
                            key={category.id}
                            text={category.title}
                            variant={activeCategory === category.id ? "outline" : "secondary"}
                            size="sm"
                            className="min-w-[100px] h-10"
                            onClick={() => handleCategoryClick(category.id, category.path)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const GameSection: React.FC<{ title: string; games: Array<{ id: number; title: string; image: string }> }> = ({ title, games }) => {
    const handleGameClick = (gameTitle: string) => {
        console.log(`Starting game: ${gameTitle}`);
        // Здесь будет логика запуска игры
    };

    return (
        <div className="w-full mb-8">
            <CategoryTitle title={title} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
                {games.map((game) => (
                    <GameCard
                        key={game.id}
                        title={game.title}
                        image={game.image}
                        onClick={() => handleGameClick(game.title)}
                    />
                ))}
            </div>
        </div>
    );
};

const MainPage: React.FC = () => {
    const { user } = useUserData();

    const popularGames = [
        { id: 1, title: "Classic Roulette", image: "/games/roulette.jpg" },
        { id: 2, title: "Banana Splash", image: "/games/banana-splash.jpg" },
        { id: 3, title: "Age of Gods", image: "/games/age-of-gods.jpg" },
        { id: 4, title: "Hot 7", image: "/games/hot7.jpg" },
        { id: 5, title: "Hot Fruits 100", image: "/games/hot-fruits.jpg" },
        { id: 6, title: "Wild Shark", image: "/games/wild-shark.jpg" },
        { id: 7, title: "Book of Ra", image: "/games/book-of-ra.jpg" },
        { id: 8, title: "Lucky Lady's Charm", image: "/games/lucky-ladys-charm.jpg" },
        { id: 9, title: "Sizzling Hot", image: "/games/sizzling-hot.jpg" },
        { id: 10, title: "Dolphin's Pearl", image: "/games/dolphins-pearl.jpg" },
        { id: 11, title: "Columbus", image: "/games/columbus.jpg" },
        { id: 12, title: "Lord of the Ocean", image: "/games/lord-of-ocean.jpg" }
    ];

    const slots = [
        { id: 1, title: "Bai Shi", image: "/games/bai-shi.jpg" },
        { id: 2, title: "Funky Monkey", image: "/games/funky-monkey.jpg" },
        { id: 3, title: "Attila", image: "/games/attila.jpg" },
        { id: 4, title: "Cherry Love", image: "/games/cherry-love.jpg" },
        { id: 5, title: "Admiral Nelson", image: "/games/admiral-nelson.jpg" },
        { id: 6, title: "Banana Splash", image: "/games/banana-splash.jpg" },
        { id: 7, title: "Golden Sevens", image: "/games/golden-sevens.jpg" },
        { id: 8, title: "Pharaoh's Gold", image: "/games/pharaohs-gold.jpg" },
        { id: 9, title: "Queen of Hearts", image: "/games/queen-of-hearts.jpg" },
        { id: 10, title: "Royal Dynasty", image: "/games/royal-dynasty.jpg" },
        { id: 11, title: "Magic Princess", image: "/games/magic-princess.jpg" },
        { id: 12, title: "Gryphon's Gold", image: "/games/gryphons-gold.jpg" },
        { id: 13, title: "Diamond 7", image: "/games/diamond-7.jpg" },
        { id: 14, title: "Ultra Hot", image: "/games/ultra-hot.jpg" },
        { id: 15, title: "Always Hot", image: "/games/always-hot.jpg" }
    ];

    const jackpotGames = [
        { id: 1, title: "Age of Privateers", image: "/games/age-of-privateers.jpg" },
        { id: 2, title: "Alchemists Secret", image: "/games/alchemists-secret.jpg" },
        { id: 3, title: "Amazing Fruits", image: "/games/amazing-fruits.jpg" },
        { id: 4, title: "Mega Joker", image: "/games/mega-joker.jpg" },
        { id: 5, title: "Super Fortune", image: "/games/super-fortune.jpg" },
        { id: 6, title: "Diamond Strike", image: "/games/diamond-strike.jpg" },
        { id: 7, title: "Golden Sevens Deluxe", image: "/games/golden-sevens-deluxe.jpg" },
        { id: 8, title: "Mega Fortune", image: "/games/mega-fortune.jpg" }
    ];

    return (
        <PageContainer>
            <Navigation />
            <div className="w-full max-w-[1920px] mx-auto px-4 pt-16">
                <div className="grid grid-cols-12 gap-6">
                    {/* Сайдбар */}
                    <div className="hidden lg:block lg:col-span-2">
                        <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Категории</h3>
                            <nav className="space-y-2">
                                <a href="#popular" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Популярные</a>
                                <a href="#slots" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Слоты</a>
                                <a href="#jackpot" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Джек Пот</a>
                            </nav>
                        </div>
                    </div>

                    {/* Основной контент */}
                    <div className="col-span-12 lg:col-span-10">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 space-y-12">
                                <div id="popular" className="scroll-mt-16">
                                    <GameSection title="Популярные" games={popularGames} />
                                </div>
                                <div id="slots" className="scroll-mt-16">
                                    <GameSection title="Слоты" games={slots} />
                                </div>
                                <div id="jackpot" className="scroll-mt-16">
                                    <GameSection title="Джек Пот" games={jackpotGames} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default MainPage;