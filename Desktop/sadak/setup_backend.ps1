# Скрипт настройки Backend для Windows PowerShell

Write-Host "🚀 Настройка Backend для проекта Садака-Пасс" -ForegroundColor Green

# Проверка Python
Write-Host "`n📋 Проверка Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python найден: $pythonVersion" -ForegroundColor Green
} catch {
    try {
        $pythonVersion = py --version 2>&1
        Write-Host "✓ Python найден (через py): $pythonVersion" -ForegroundColor Green
        $pythonCmd = "py"
    } catch {
        Write-Host "✗ Python не найден! Установите Python 3.11+ с https://www.python.org/" -ForegroundColor Red
        exit 1
    }
}

# Переход в папку backend
Set-Location backend

# Создание виртуального окружения
Write-Host "`n📦 Создание виртуального окружения..." -ForegroundColor Yellow
if (Test-Path venv) {
    Write-Host "✓ Виртуальное окружение уже существует" -ForegroundColor Green
} else {
    if ($pythonCmd) {
        & $pythonCmd -m venv venv
    } else {
        python -m venv venv
    }
    Write-Host "✓ Виртуальное окружение создано" -ForegroundColor Green
}

# Активация и установка зависимостей
Write-Host "`n📥 Установка зависимостей..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt

Write-Host "`n✅ Backend настроен!" -ForegroundColor Green
Write-Host "`nСледующие шаги:" -ForegroundColor Cyan
Write-Host "1. Настройте DATABASE_URL в backend/.env"
Write-Host "2. Создайте базу данных PostgreSQL"
Write-Host "3. Запустите: alembic revision --autogenerate -m 'Initial migration'"
Write-Host "4. Затем: alembic upgrade head"
Write-Host "5. Запустите сервер: uvicorn app.main:app --reload"
Write-Host "`nПодробнее: backend/SETUP.md" -ForegroundColor Gray

