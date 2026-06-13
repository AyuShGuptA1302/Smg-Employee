# SMG Docker Watchdog - Keeps Docker Desktop + Containers always alive
# Run this in a PowerShell window and keep it open!

$projectDir = "C:\Users\ayush\OneDrive\Desktop\SMG-JUNE-2026-main\SMG-JUNE-2026-main"
$dockerExe  = "C:\Program Files\Docker\Docker\Docker Desktop.exe"

function Start-DockerDesktop {
    Write-Host "[$(Get-Date -f 'HH:mm:ss')] Starting Docker Desktop..." -ForegroundColor Yellow
    Get-Process | Where-Object { $_.Name -like "*docker*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Start-Process $dockerExe
    
    $waited = 0
    while ($waited -lt 90) {
        Start-Sleep -Seconds 3; $waited += 3
        if (Test-Path "\\.\pipe\dockerDesktopLinuxEngine") {
            Write-Host "[$(Get-Date -f 'HH:mm:ss')] Docker pipe ready. Waiting 20s to stabilize..." -ForegroundColor Cyan
            Start-Sleep -Seconds 20
            return $true
        }
    }
    Write-Host "[$(Get-Date -f 'HH:mm:ss')] Docker failed to start!" -ForegroundColor Red
    return $false
}

function Start-Containers {
    Write-Host "[$(Get-Date -f 'HH:mm:ss')] Starting containers..." -ForegroundColor Yellow
    docker context use desktop-linux 2>&1 | Out-Null
    docker compose up -d 2>&1 | Out-Null
    Start-Sleep -Seconds 5
    
    $url = docker logs smg-cloudflared 2>&1 | Select-String "trycloudflare.com" | Select-Object -Last 1
    if ($url) {
        Write-Host "[$(Get-Date -f 'HH:mm:ss')] PUBLIC URL: $url" -ForegroundColor Green
    }
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   SMG Docker Watchdog - Keep this open!   " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Initial start
$dockerUp = Start-DockerDesktop
if ($dockerUp) { Start-Containers }

# Watchdog loop
while ($true) {
    Start-Sleep -Seconds 20
    
    $pipeExists = Test-Path "\\.\pipe\dockerDesktopLinuxEngine"
    
    if (-not $pipeExists) {
        Write-Host "[$(Get-Date -f 'HH:mm:ss')] Docker crashed! Restarting..." -ForegroundColor Red
        $dockerUp = Start-DockerDesktop
        if ($dockerUp) { Start-Containers }
        continue
    }
    
    # Check if containers are running
    $containers = docker ps --format "{{.Names}}" 2>&1
    if ($containers -notlike "*smg-frontend*") {
        Write-Host "[$(Get-Date -f 'HH:mm:ss')] Containers down! Restarting..." -ForegroundColor Yellow
        Start-Containers
    } else {
        $count = ($containers | Measure-Object -Line).Lines
        Write-Host "[$(Get-Date -f 'HH:mm:ss')] OK - $count containers running" -ForegroundColor Green
        
        # Print URL every 5 minutes reminder
        $url = docker logs smg-cloudflared 2>&1 | Select-String "trycloudflare.com" | Select-Object -Last 1
        if ($url) {
            Write-Host "[$(Get-Date -f 'HH:mm:ss')] LIVE URL: $url" -ForegroundColor Magenta
        }
    }
}
