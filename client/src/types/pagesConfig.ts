import { createAxiosInstance } from "@/api/axios.api";
import { ArrowDownToLine, CoinsIcon, DollarSignIcon, HelpCircleIcon, History, HomeIcon, InfoIcon, PlusCircle, Ticket, UserCog2Icon, Wallet } from "lucide-react";

export interface Route {
    path: string;
    label: string;
    shortLabel?: string;
    showInHeader?: boolean;
    icon?: React.ElementType;
    subRoutes?: { [key: string]: Route };
}

export interface Routes {
    [key: string]: Route;
}

export let RoutesConfigMain: { [key: string]: Route } = {
    HOME: { 
        path: '/', 
        label: 'Главная страница', 
        showInHeader: false, 
        icon: HomeIcon 
    },
    SLOTS: {
        path: '/slots',
        label: 'Слоты',
        showInHeader: true,
        icon: DollarSignIcon
    },
    // CASINO: {
    //     path: '/casino',
    //     label: 'Игровой Зал',
    //     showInHeader: false,
    //     icon: DollarSignIcon,
    //     subRoutes: {
    //         SLOTS: {
    //             path: '/slots',
    //             label: 'Слоты',
    //         },
    //         LIVE: {
    //             path: '/live',
    //             label: 'Live Казино',
    //         },
    //         TABLE: {
    //             path: '/table',
    //             label: 'Настольные игры',
    //         }
    //     }
    // },

    CASE: {
        path: '/case',
        label: 'Касса',
        icon: Wallet,
        subRoutes: {
            DEPOSIT: {
                path: '/deposit',
                label: 'Пополнить счет',
                icon: PlusCircle
            },
            TRANSACTIONS: {
                path: '/transactions',
                label: 'История транзакций',
                icon: History
            },
            POINTS: {
                path: '/points',
                label: 'Обменять баллы',
                icon: CoinsIcon
            },
            WITHDRAW: {
                path: '/withdraw',
                label: 'Вывести средства',
                icon: ArrowDownToLine
            },
            PROMOCODE: {
                path: '/promocode',
                label: 'Промокод',
                icon: Ticket
            }
        }
    },


    JACKPOT: {
        path: '/jackpot',
        label: 'Джекпот',
        showInHeader: false,
        icon: CoinsIcon,
    },
    RULES: {
        path: '/rules',
        label: 'Правила',
        showInHeader: false,
        icon: HelpCircleIcon,
    },
    FAQ: {
        path: '/faq',
        label: 'FAQ',
        showInHeader: false,
        icon: InfoIcon,
    },
    ABOUT: {
        path: '/about',
        label: 'О нас',
        showInHeader: false,
        icon: InfoIcon,
    },
    PROFILE: { 
        path: '/profile', 
        label: 'Личный кабинет', 
        showInHeader: false, 
        icon: UserCog2Icon
    },
}




function updateRoutesWithParentPath(routes: Record<string, any>, parentPath = '') {
    return Object.entries(routes).reduce((acc, [key, value]) => {
        const newPath = parentPath + value.path;

        acc[key] = { ...value, path: newPath };
        if (value.subRoutes) {
            acc[key].subRoutes = updateRoutesWithParentPath(value.subRoutes, newPath);
        }

        return acc;
    }, {} as Record<string, any>);
}

export const RoutesConfig: { [key: string]: Route } = updateRoutesWithParentPath(RoutesConfigMain);




class ApiConfig {
    auth = {
        baseInstance: createAxiosInstance('auth/'),
        telegramInstance: createAxiosInstance('auth/telegram/'),
        profile: "profile",
        login: "login",
    }

    admin = {
        baseInstance: createAxiosInstance('admin/'),
        users: {
            main: "users",
            ban: "users/ban",
            passwordChange: "password/change",
        }
    }

    users = {
        baseInstance: createAxiosInstance('users/'),
    }

    gifts = {
        baseInstance: createAxiosInstance('gifts/'),
        lastUpdate: "last-update",
        giftModels: 'gift-models',
        applyFilters: 'apply-filters',
        userFilters: "user-filters"
    }
}

export const apiConfig = new ApiConfig()
export type RouteKey = keyof typeof RoutesConfig;

