import { Button } from '@/components/ui/Button';
import ContentBlock from '@/components/ui/ContentBlock';
import { Input } from '@/components/ui/Input';
import { Section } from '@/components/ui/Section';
import { useUserData } from '@/store/hooks';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { user } = useUserData();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            // Здесь можно добавить логику обновления данных
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Данные обновлены');
        } catch (err) {
            toast.error('Ошибка при обновлении данных');
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-6"
        >
            <Section>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Профиль пользователя */}
                    <div className="w-full md:w-1/3">
                        <ContentBlock>
                            <div className="p-4">
                                <div className="flex flex-col items-center">
                                    <img
                                        src={user?.photoUrl || '/default-avatar.png'}
                                        alt="Аватар"
                                        className="w-20 h-20 rounded-full mb-3 object-cover"
                                    />
                                    <h2 className="text-xl font-bold text-casino-gold">
                                        {user?.username || 'Пользователь'}
                                    </h2>
                                    <p className="text-sm text-gray-400">ID: {user?.telegramId}</p>
                                </div>
                                <div className="mt-4 p-3 bg-casino-primary-dark rounded">
                                    <p className="text-sm text-gray-400">Баланс</p>
                                    <p className="text-lg font-medium text-casino-gold-light">
                                        {user?.balance?.toLocaleString('ru-RU', {
                                            style: 'currency',
                                            currency: 'RUB'
                                        }) || '0.00 ₽'}
                                    </p>
                                </div>
                            </div>
                        </ContentBlock>
                    </div>

                    {/* Основная информация и действия */}
                    <div className="w-full md:w-2/3">
                        <ContentBlock>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-casino-gold mb-4">
                                    Информация
                                </h3>
                                <div className="space-y-3">
                                    <Input
                                        label="Имя"
                                        value={user?.firstName || ''}
                                        disabled
                                    />
                                    <Input
                                        label="Фамилия"
                                        value={user?.lastName || ''}
                                        disabled
                                    />
                                    <Input
                                        label="Telegram ID"
                                        value={user?.telegramId?.toString() || ''}
                                        disabled
                                    />
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-casino-gold mb-4">
                                        Действия
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Button
                                            text="Пополнить баланс"
                                            variant="success"
                                            fullWidth
                                            routeKey="CASE"
                                            subRouteKey="DEPOSIT"
                                        />
                                        <Button
                                            text="История транзакций"
                                            variant="primary"
                                            fullWidth
                                            routeKey="CASE"
                                            subRouteKey="TRANSACTIONS"
                                        />
                                        <Button
                                            text="Поддержка"
                                            variant="secondary"
                                            fullWidth
                                        />
                                        <Button
                                            text={isRefreshing ? "Обновление..." : "Обновить данные"}
                                            variant="outline"
                                            fullWidth
                                            onClick={handleRefresh}
                                            disabled={isRefreshing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </ContentBlock>
                    </div>
                </div>
            </Section>
        </motion.div>
    );
};

export default ProfilePage; 