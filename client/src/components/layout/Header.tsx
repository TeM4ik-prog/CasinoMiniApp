import { useUserData } from "@/store/hooks";
import { Wallet } from "lucide-react";
import { Button } from "../ui/Button";
import { Sidebar } from "../ui/Sidebar";
import { Logo } from "./Logo";

export const Header: React.FC = () => {
    const { user } = useUserData();

    return (
        <header className="flex w-full px-5 pt-2 bg-casino-primary border-b border-casino-border-20 shadow-lg z-40">
            <div className="flex justify-between items-center w-full h-full">
                <div className="flex items-center gap-4">
                    <Sidebar />
                    <Logo className="p-4" />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <div className="text-sm text-gray-400">Ваш счет:</div>
                            <div className="text-casino-gold-light font-medium">
                                {user?.balance || '0.00'} ₽
                            </div>
                        </div>
                        
                        <Button 
                            text="Касса" 
                            icon={<Wallet size={18} />}
                            variant="success"
                            size="sm"
                            routeKey="CASE"
                            subRouteKey="DEPOSIT"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};
