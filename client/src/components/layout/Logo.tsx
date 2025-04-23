import { RoutesConfig } from "@/types/pagesConfig";
import { Link } from "react-router-dom";

interface Props {
    className?: string;
}

export const Logo: React.FC<Props> = ({ className }) => {
    return (
        <div className={`flex items-center z-10 h-min mr-auto ${className}`}>
            <Link to={RoutesConfig.HOME.path}>
                <span className="font-['Pacifico',cursive] p-2 text-nowrap text-4xl bg-gradient-to-r from-casino-gold via-casino-gold-light to-casino-gold text-transparent bg-clip-text">
                    LEX
                </span>
            </Link>
        </div>
    )
}

