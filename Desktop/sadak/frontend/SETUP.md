# Инструкция по настройке Frontend

## Шаг 1: Установка Node.js

Убедитесь, что у вас установлен Node.js 18 или выше.

Скачайте с https://nodejs.org/

Проверка:
```powershell
node --version
npm --version
```

## Шаг 2: Установка зависимостей

```powershell
cd frontend
npm install
```

## Шаг 3: Настройка переменных окружения

Файл `.env` уже создан с базовыми настройками:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

Если ваш backend работает на другом порту, измените URL.

## Шаг 4: Запуск dev-сервера

```powershell
npm run dev
```

Приложение будет доступно на http://localhost:3000

## Шаг 5: Сборка для продакшена

```powershell
npm run build
```

Собранные файлы будут в папке `dist/`

## Устранение проблем

### Ошибки при npm install

Попробуйте:
```powershell
npm cache clean --force
npm install
```

### Проблемы с портами

Если порт 3000 занят, Vite автоматически предложит использовать другой порт.

### Ошибки подключения к API

Проверьте:
- Запущен ли backend сервер
- Правильность VITE_API_URL в .env
- CORS настройки на backend (должны разрешать localhost:3000)

