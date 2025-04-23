import { useUserData } from '@/store/hooks';
import { RoutesConfig } from '@/types/pagesConfig';
import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { MenuIcon, X } from 'lucide-react';
import { Fragment, useState } from 'react';
import { SidebarItem } from '../shared/sidebar/sidebar-item';
import { Button } from './Button';

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUserData();

    const openSidebar = () => setIsOpen(true);
    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            <div className="relative z-20">
                <MenuIcon
                    onClick={openSidebar}
                    size={32}
                    className="text-casino-gold hover:text-casino-gold-light cursor-pointer transition-colors"
                />

                <Transition show={isOpen} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 z-50" onClose={closeSidebar}>
                        <div className="fixed inset-0 bg-black/50" />

                        <Transition.Child
                            as={Fragment}
                            enter="transform transition-transform duration-300"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition-transform duration-300"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <DialogPanel className="fixed inset-y-0 left-0 flex w-full flex-col bg-casino-primary border-r border-casino-border-20 sm:max-w-sm">

                                <button
                                    onClick={closeSidebar}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-casino-gold-light transition-colors"
                                >
                                    <X size={24} />
                                </button>

                                {/* Основной контент со скроллом */}
                                <div className="h-full overflow-y-auto">
                                    <div className="min-h-full flex flex-col">
                                        {/* Профиль */}
                                        <div className="p-4 border-b border-casino-border-20">
                                            <div className="flex items-center gap-3 mb-4">
                                                <img
                                                    src={user?.photoUrl || 'default-avatar.png'}
                                                    alt="Avatar"
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div>
                                                    <div className="text-white font-medium">{user?.username || 'Гость'}</div>
                                                    <div className="text-sm text-gray-400">ID: {user?.id || '0000000000'}</div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="text-gray-400">На счете</div>
                                                <div className="text-casino-gold-light text-xl font-medium">{user?.balance || '0.00'} ₽</div>
                                                <Button
                                                    onClick={closeSidebar}
                                                    text="Пополнить счет"
                                                    variant="success"
                                                    fullWidth
                                                    routeKey="CASE"
                                                    subRouteKey="DEPOSIT"
                                                />
                                            </div>
                                        </div>

                                        {/* Навигация */}
                                        <div className="p-4 flex-1">
                                            <div className="flex flex-col gap-1">
                                                {Object.entries(RoutesConfig).map(([routeKey, route]) => (
                                                    <SidebarItem
                                                        key={routeKey}
                                                        icon={route.icon}
                                                        routeKey={routeKey as any}
                                                        closeSidebar={closeSidebar}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Футер с контактами */}
                                        <div className="p-4 border-t border-casino-border-20 mt-auto">
                                            <div className="text-sm text-gray-400 mb-2">Телефон:</div>
                                            <a href="tel:+37067720819" className="text-white hover:text-casino-gold-light transition-colors">
                                                +37067720819
                                            </a>
                                            <div className="text-sm text-gray-400 mt-4 mb-2">Email поддержки:</div>
                                            <a href="mailto:info@lexcasino.com" className="text-white hover:text-casino-gold-light transition-colors">
                                                info@lexcasino.com
                                            </a>
                                            <Button
                                                text="ОНЛАЙН ПОМОЩЬ"
                                                variant="primary"
                                                fullWidth
                                                className="mt-4"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </Transition.Child>
                    </Dialog>
                </Transition>
            </div>
        </>
    );
};


