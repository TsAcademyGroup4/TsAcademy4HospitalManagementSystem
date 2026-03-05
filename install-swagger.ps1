# Install Swagger documentation packages
Write-Host "Installing Swagger documentation packages for Hospital Management System..." -ForegroundColor Cyan
Write-Host ""

# Run npm install
npm install swagger-ui-express swagger-jsdoc

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Packages installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Start the server: npm run dev"
    Write-Host "2. Open your browser: http://localhost:5050/api-docs"
    Write-Host ""
    Write-Host "The Swagger UI will show all API endpoints with:" -ForegroundColor Cyan
    Write-Host "   - Request/Response schemas"
    Write-Host "   - Authentication details"
    Write-Host "   - Try-it-out testing functionality"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Installation failed. Please ensure npm is installed and try again." -ForegroundColor Red
    Write-Host ""
}
