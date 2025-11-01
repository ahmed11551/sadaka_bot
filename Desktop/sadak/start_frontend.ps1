# Start Frontend Server
Write-Host "Starting Frontend..." -ForegroundColor Green

cd frontend

if (-not (Test-Path node_modules)) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    "VITE_API_URL=http://localhost:8000/api/v1" | Out-File -FilePath .env -Encoding UTF8
}

Write-Host "Starting Vite dev server..." -ForegroundColor Green
Write-Host "Frontend will be available at http://localhost:3000" -ForegroundColor Cyan
npm run dev

