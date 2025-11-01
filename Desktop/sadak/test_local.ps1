# Скрипт для локального тестирования проекта

Write-Host "🧪 Тестирование проекта Садака-Пасс локально" -ForegroundColor Green
Write-Host ""

# Проверка Python
Write-Host "1️⃣ Проверка Python..." -ForegroundColor Yellow
try {
    $pythonCmd = "python"
    $pythonVersion = python --version 2>&1
    Write-Host "   ✓ Python: $pythonVersion" -ForegroundColor Green
} catch {
    try {
        $pythonCmd = "py"
        $pythonVersion = py --version 2>&1
        Write-Host "   ✓ Python (через py): $pythonVersion" -ForegroundColor Green
    } catch {
        Write-Host "   ✗ Python не найден!" -ForegroundColor Red
        exit 1
    }
}

# Проверка Node.js
Write-Host "`n2️⃣ Проверка Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js не найден!" -ForegroundColor Red
    exit 1
}

# Настройка Backend
Write-Host "`n3️⃣ Настройка Backend..." -ForegroundColor Yellow
Set-Location backend

if (-not (Test-Path venv)) {
    Write-Host "   Создание виртуального окружения..." -ForegroundColor Cyan
    & $pythonCmd -m venv venv
}

Write-Host "   Активация виртуального окружения..." -ForegroundColor Cyan
& .\venv\Scripts\Activate.ps1

Write-Host "   Установка зависимостей..." -ForegroundColor Cyan
pip install --quiet -r requirements.txt

# Создание .env если нет
if (-not (Test-Path .env)) {
    Write-Host "   Создание .env файла..." -ForegroundColor Cyan
    @"
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sadakadb
TELEGRAM_BOT_TOKEN=
TELEGRAM_SECRET_KEY=
SECRET_KEY=dev-secret-key-$(Get-Random)
"@ | Out-File -FilePath .env -Encoding UTF8
    Write-Host "   ⚠ .env файл создан. Обновите DATABASE_URL при необходимости." -ForegroundColor Yellow
}

# Настройка Frontend
Write-Host "`n4️⃣ Настройка Frontend..." -ForegroundColor Yellow
Set-Location ..\frontend

if (-not (Test-Path node_modules)) {
    Write-Host "   Установка зависимостей..." -ForegroundColor Cyan
    npm install
} else {
    Write-Host "   ✓ Зависимости уже установлены" -ForegroundColor Green
}

# Создание .env если нет
if (-not (Test-Path .env)) {
    Write-Host "   Создание .env файла..." -ForegroundColor Cyan
    "VITE_API_URL=http://localhost:8000/api/v1" | Out-File -FilePath .env -Encoding UTF8
}

Write-Host "`n✅ Настройка завершена!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Следующие шаги:" -ForegroundColor Cyan
Write-Host "   1. Убедитесь что PostgreSQL запущен и создана база данных 'sadakadb'"
Write-Host "   2. В первом терминале запустите backend:"
Write-Host "      cd backend"
Write-Host "      .\venv\Scripts\Activate.ps1"
Write-Host "      uvicorn app.main:app --reload"
Write-Host ""
Write-Host "   3. Во втором терминале запустите frontend:"
Write-Host "      cd frontend"
Write-Host "      npm run dev"
Write-Host ""
Write-Host "   4. Откройте http://localhost:3000 в браузере"
Write-Host ""

Set-Location ..

