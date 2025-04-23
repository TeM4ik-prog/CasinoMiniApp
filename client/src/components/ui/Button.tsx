import { cn } from "@/lib/utils";
import { RoutesConfig } from "@/types/pagesConfig";
import { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    icon?: ReactNode;
    href?: string;
    routeKey?: string;
    subRouteKey?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'success';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    openNewPage?: boolean;
}

export const Button = ({
    text,
    icon,
    href,
    routeKey,
    subRouteKey,
    variant = 'primary',
    size = 'md',
    fullWidth,
    openNewPage,
    className,
    onClick,
    ...props
}: Props) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-bold rounded-md transition-all duration-200 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] hover:translate-y-[-1px] border border-transparent";

    const variants = {
        primary: "bg-gradient-to-r from-casino-gold to-casino-gold-light text-black shadow-lg shadow-casino-gold/20 hover:shadow-casino-gold/30 hover:from-casino-gold-light hover:to-casino-gold after:absolute after:inset-0 after:bg-white/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity border-casino-gold/30 hover:border-casino-gold/50",
        secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm shadow-lg shadow-black/5 hover:shadow-black/10 after:absolute after:inset-0 after:bg-white/5 after:opacity-0 hover:after:opacity-100 after:transition-opacity border-white/10 hover:border-white/20",
        outline: "border-2 border-casino-gold text-casino-gold hover:border-casino-gold-light hover:text-casino-gold-light shadow-lg shadow-casino-gold/10 hover:shadow-casino-gold/20 after:absolute after:inset-0 after:bg-casino-gold/5 after:opacity-0 hover:after:opacity-100 after:transition-opacity",
        success: "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-600/20 hover:shadow-green-600/30 hover:from-green-500 hover:to-emerald-400 after:absolute after:inset-0 after:bg-white/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity border-green-500/30 hover:border-green-400/50",
    };

    const sizes = {
        sm: "text-sm px-4 py-1.5 min-h-[32px]",
        md: "px-5 py-2 min-h-[40px] text-[15px]",
        lg: "text-lg px-6 py-3 min-h-[48px]",
    };

    const classes = cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
    );

    let path = href;
    
    if (routeKey) {
        const mainRoute = RoutesConfig[routeKey];
        if (mainRoute) {
            if (subRouteKey && mainRoute.subRoutes?.[subRouteKey]) {
                path = mainRoute.subRoutes[subRouteKey].path;
            } else {
                path = mainRoute.path;
            }
        }
    }

    const handleClick = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        if (onClick) {
            onClick(e as MouseEvent<HTMLButtonElement>);
        }
    };

    if (path) {
        return (
            <Link
                to={path}
                target={openNewPage ? '_blank' : undefined}
                className={classes}
                onClick={handleClick}
            >
                {icon}
                {text}
            </Link>
        );
    }

    return (
        <button className={classes} onClick={handleClick} {...props}>
            {icon}
            {text}
        </button>
    );
};