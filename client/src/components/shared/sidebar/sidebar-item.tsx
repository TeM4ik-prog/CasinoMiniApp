import { RouteKey, RoutesConfig } from "@/types/pagesConfig";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";
import { SidebarSubItem } from "./sidebar-sub-item";

interface Props {
    routeKey: RouteKey;
    icon?: React.ElementType;
    closeSidebar: () => void;
}

export const SidebarItem = ({ routeKey, icon: Icon, closeSidebar }: Props) => {
    const route = RoutesConfig[routeKey];

    if (!route) return null;
    const { path, label, subRoutes } = route;

    return (
        <Disclosure as="div" className="w-full">
            {({ open }) => (
                <>
                    <div className="flex items-center justify-between w-full rounded-md">
                        {subRoutes ? (
                            <DisclosureButton className="flex items-center gap-3 w-full px-3 py-2.5 text-gray-400 hover:text-casino-gold-light transition-colors rounded-md hover:bg-white/5">
                                {Icon && <Icon size={20} />}
                                <span className="text-sm">{label}</span>
                                <motion.div 
                                    animate={{ rotate: open ? 180 : 0 }} 
                                    transition={{ duration: 0.2 }}
                                    className="ml-auto"
                                >
                                    <ChevronDown size={16} />
                                </motion.div>
                            </DisclosureButton>
                        ) : (
                            <NavLink
                                to={path}
                                onClick={closeSidebar}
                                className={({ isActive }) => 
                                    `flex items-center gap-3 w-full px-3 py-2.5 transition-colors rounded-md hover:bg-white/5 
                                    ${isActive ? 'text-casino-gold' : 'text-gray-400 hover:text-casino-gold-light'}`
                                }
                            >
                                {Icon && <Icon size={20} />}
                                <span className="text-sm">{label}</span>
                            </NavLink>
                        )}
                    </div>

                    {subRoutes && (
                        <DisclosurePanel>
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: open ? 1 : 0, y: open ? 0 : -10 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col pl-8 mt-1"
                            >
                                {Object.entries(subRoutes).map(([subKey, subRoute]) => (
                                    <SidebarSubItem 
                                        key={subKey} 
                                        text={subRoute.label} 
                                        href={subRoute.path} 
                                        closeSidebar={closeSidebar} 
                                    />
                                ))}
                            </motion.div>
                        </DisclosurePanel>
                    )}
                </>
            )}
        </Disclosure>
    );
};
