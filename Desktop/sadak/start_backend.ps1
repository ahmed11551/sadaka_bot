# Start Backend Server
Write-Host "Starting Backend..." -ForegroundColor Green

cd backend

if (-not (Test-Path venv)) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        py -m venv venv
    }
}

Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -q -r requirements.txt

if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sadakadb`nTELEGRAM_BOT_TOKEN=`nTELEGRAM_SECRET_KEY=`nSECRET_KEY=dev-secret-key" | Out-File -FilePath .env -Encoding UTF8
}

Write-Host "Starting uvicorn server..." -ForegroundColor Green
Write-Host "Backend will be available at http://localhost:8000" -ForegroundColor Cyan
uvicorn app.main:app --reload

