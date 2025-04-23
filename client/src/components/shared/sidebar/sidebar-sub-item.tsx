import { NavLink } from "react-router-dom";

interface Props {
    text: string;
    href: string;
    closeSidebar: () => void;
}

export const SidebarSubItem = ({ text, href, closeSidebar }: Props) => {
    return (
        <NavLink
            to={href}
            onClick={closeSidebar}
            className={({ isActive }) =>
                `flex items-center py-2 px-3 text-sm rounded-md transition-colors hover:bg-white/5
                ${isActive ? 'text-casino-gold' : 'text-gray-400 hover:text-casino-gold-light'}`
            }
        >
            {text}
        </NavLink>
    );
};