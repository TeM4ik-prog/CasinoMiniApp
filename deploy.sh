#!/bin/bash

# Остановка предыдущих процессов
pm2 stop all

# Переход в директорию проекта
cd /path/to/your/project

# Обновление кода
git pull

# Установка зависимостей
cd client
npm install
npm run build

cd ../backend
npm install
npm run build

cd ../keystone
npm install
npm run build

# Запуск приложения
cd ../backend
pm2 start dist/main.js --name "casino-app"

# Запуск Keystone
cd ../keystone
pm2 start npm --name "keystone" -- run dev

# Сохранение конфигурации PM2
pm2 save 