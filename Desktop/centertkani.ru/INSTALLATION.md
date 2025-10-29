# Инструкция по установке и запуску

## Требования

- Node.js 18+ 
- npm или yarn
- Git

## Установка

### 1. Клонировать репозиторий (если еще не клонирован)
```bash
cd centertkani.ru
```

### 2. Установить зависимости
```bash
npm install
```

### 3. Создать файл конфигурации

Создайте файл `.env.local` в корне проекта:

```env
# API URL для интеграции с бэкендом
NEXT_PUBLIC_API_URL=https://centertkani.ru/api

# Для локальной разработки (если доступен)
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Запустить dev сервер

```bash
npm run dev
```

Сайт будет доступен по адресу: http://localhost:3000

## Структура команд

```bash
# Разработка
npm run dev          # Запустить dev сервер
npm run build        # Production сборка
npm run start        # Запустить production
npm run lint         # Проверить код
npm run type-check   # Проверить типы TypeScript
```

## Структура проекта

```
centertkani.ru/
├── src/
│   ├── app/              # Страницы Next.js
│   ├── components/       # React компоненты
│   ├── store/           # State management (Zustand)
│   └── lib/             # Утилиты и API
├── public/              # Статические файлы
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Первый запуск

После установки вы увидите:

1. **Главную страницу** - с баннерами, новинками, скидками
2. **Каталог** - доступен по `/catalog/odezhda` или `/catalog/dom`
3. **Корзину** - доступна по `/cart`
4. **Оформление заказа** - доступно по `/checkout`

**Примечание:** Сейчас используются моковые данные. Для полной работы нужна интеграция с реальным API бэкенда.

## Следующие шаги

1. Получить доступ к Figma дизайну
2. Получить API документацию от клиента
3. Настроить изображения товаров
4. Подключить реальный API
5. Протестировать все страницы и функции

## Поддержка

При возникновении проблем:
1. Проверьте версию Node.js: `node --version` (нужна 18+)
2. Проверьте установку зависимостей: `npm list`
3. Очистите кэш: `rm -rf .next node_modules && npm install`

## Полезные ссылки

- [Next.js Документация](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

