# Copier en deploy_ftp.ps1 et renseigner vos identifiants FTP (ne pas committer deploy_ftp.ps1)
$ftpHost = "ftp.votre-hebergeur.org"
$user = "VOTRE_USER_FTP"
$pass = "VOTRE_MOT_DE_PASSE"
$cred = "${user}:${pass}"

$siteBase = "ftp://${ftpHost}/public_html/alharamaine.site"
$wwwBase = "ftp://${ftpHost}/www"

function FtpUpload($localFile, $remoteBase, $remotePath) {
    Write-Host "  UP [$remoteBase]: $remotePath" -ForegroundColor Cyan
    curl.exe -s -T $localFile -u $cred "$remoteBase/$remotePath" --ftp-create-dirs
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$distPath = Join-Path $root "frontend-vite\dist"
$backendPath = Join-Path $root "backend"

Write-Host "`n=== DEPLOIEMENT alharamaine.site ===" -ForegroundColor Green

if (-not (Test-Path $distPath)) {
    Write-Host "Build manquant. Lancez: cd frontend-vite; npm run build" -ForegroundColor Red
    exit 1
}

Write-Host "[1/2] Frontend..." -ForegroundColor Yellow
Get-ChildItem -Path $distPath -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($distPath.Length + 1).Replace("\", "/")
    FtpUpload $_.FullName $siteBase $rel
}

Write-Host "`n[2/2] Backend..." -ForegroundColor Yellow
Get-ChildItem -Path $backendPath -Recurse -File | Where-Object { $_.Name -ne "local.php" } | ForEach-Object {
    $rel = "backend/" + $_.FullName.Substring($backendPath.Length + 1).Replace("\", "/")
    FtpUpload $_.FullName $siteBase $rel
}

Write-Host "`n=== TERMINE ===" -ForegroundColor Green
Write-Host "Site: https://alharamaine.site/`n"
