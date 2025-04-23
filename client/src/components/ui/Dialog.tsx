import { cn } from '@/lib/utils';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { Fragment, ReactNode } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    className?: string;
}

export const Dialog = ({ isOpen, onClose, title, children, className }: Props) => {
    return (
        <Transition show={isOpen} as={Fragment}>
            <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-50"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-50"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black" />
                </Transition.Child>

                {/* Dialog */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <HeadlessDialog.Panel
                                className={cn(
                                    "relative w-full max-w-md transform overflow-hidden rounded-lg bg-casino-primary p-6 shadow-xl transition-all",
                                    "border-2 border-casino-border-20",
                                    className
                                )}
                            >
                                {/* Close button */}
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-4 text-gray-400 hover:text-casino-gold-light transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                {/* Title */}
                                {title && (
                                    <HeadlessDialog.Title className="text-lg font-medium text-white mb-4">
                                        {title}
                                    </HeadlessDialog.Title>
                                )}

                                {/* Content */}
                                <div className="mt-2">{children}</div>
                            </HeadlessDialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </HeadlessDialog>
        </Transition>
    );
};
