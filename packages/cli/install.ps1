# install.ps1

# Setup
$RepoUser   = "aluissp"
$RepoName   = "deezlp"
$Version    = "cli-v1.0.0"
$BinaryName = "deezlp.exe"
$Url        = "https://github.com/$RepoUser/$RepoName/releases/download/$Version/$BinaryName"

# Paths
$TargetDir  = "$env:LOCALAPPDATA\Programs\deezlp"
$TargetPath = Join-Path $TargetDir $BinaryName

Write-Host "Starting installation of deezlp for Windows..." -ForegroundColor Cyan

# 1. Validate if the target directory exists
if (!(Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

# 2. Download the binary from GitHub
Write-Host "Downloading binary from GitHub..." -ForegroundColor Gray
try {
    # Use TLS 1.2 for secure download
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

    Invoke-WebRequest -Uri $Url -OutFile $TargetPath -ErrorAction Stop
}
catch {
    Write-Host "Could not download the binary from GitHub. Please check your internet connection or the URL." -ForegroundColor Red
    Exit 1
}

# 3. Validate if the downloaded file is not empty or corrupted
if ((Test-Path $TargetPath) -and ((Get-Item $TargetPath).Length -gt 0)) {
    Write-Host "Binary downloaded successfully." -ForegroundColor Green
} else {
    Write-Host "The downloaded file is empty or corrupted." -ForegroundColor Red
    Exit 1
}

# 4. Check if the target directory is already in the user's PATH
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")

if ($UserPath -notlike "*$TargetDir*") {
    Write-Host "The binary directory is not in your PATH." -ForegroundColor Yellow
    Write-Host "Setting it up permanently..." -ForegroundColor Gray

    $NewPath = $UserPath + ";" + $TargetDir
    [Environment]::SetEnvironmentVariable("Path", $NewPath, "User")

    Write-Host "The binary directory has been added to your PATH." -ForegroundColor Green
    Write-Host "NOTE: To start using 'deezlp', you need to close this terminal and open a new one." -ForegroundColor Yellow
}

Write-Host "✨ Installation completed successfully!" -ForegroundColor Green
