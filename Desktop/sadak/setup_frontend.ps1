# Скрипт настройки Frontend для Windows PowerShell

Write-Host "🚀 Настройка Frontend для проекта Садака-Пасс" -ForegroundColor Green

# Проверка Node.js
Write-Host "`n📋 Проверка Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js найден: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js не найден! Установите Node.js 18+ с https://nodejs.org/" -ForegroundColor Red
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "✓ npm найден: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm не найден!" -ForegroundColor Red
    exit 1
}

# Переход в папку frontend
Set-Location frontend

# Установка зависимостей
Write-Host "`n📥 Установка зависимостей..." -ForegroundColor Yellow
npm install

Write-Host "`n✅ Frontend настроен!" -ForegroundColor Green
Write-Host "`nСледующие шаги:" -ForegroundColor Cyan
Write-Host "1. Убедитесь что backend запущен на http://localhost:8000"
Write-Host "2. Запустите: npm run dev"
Write-Host "`nПодробнее: frontend/SETUP.md" -ForegroundColor Gray

