$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path "."
$webRoot = Join-Path $repoRoot "lusion.co\lusion.co"
$splitAssets = Join-Path $repoRoot "lusion.co\lusion.dev\assets"
$dist = Join-Path $repoRoot "dist-cpanel"
$zip = Join-Path $repoRoot "the-bricks-cpanel-upload.zip"

if (!(Test-Path $webRoot)) {
  throw "Web root not found: $webRoot"
}

Write-Host "Cleaning old package..."
Remove-Item $dist -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $zip -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $dist | Out-Null

Write-Host "Copying webroot..."
robocopy $webRoot $dist /E /XD ".git" ".firebase" ".vscode" /XF "*.orig" | Out-Null
if ($LASTEXITCODE -gt 7) {
  throw "robocopy failed while copying webroot. Exit code: $LASTEXITCODE"
}

Write-Host "Copying split assets as real folders..."
if (Test-Path $splitAssets) {
  $assetFolders = @("audios", "models", "projects", "team", "textures")
  foreach ($folder in $assetFolders) {
    $from = Join-Path $splitAssets $folder
    $to = Join-Path $dist "assets\$folder"
    if (Test-Path $from) {
      New-Item -ItemType Directory -Path (Split-Path $to) -Force | Out-Null
      robocopy $from $to /E | Out-Null
      if ($LASTEXITCODE -gt 7) {
        throw "robocopy failed while copying split asset folder: $folder. Exit code: $LASTEXITCODE"
      }
    }
  }
}

Write-Host "Removing old physical project detail folders from cPanel package..."
$projectsDir = Join-Path $dist "projects"
if (Test-Path $projectsDir) {
  Get-ChildItem $projectsDir -Directory | Remove-Item -Recurse -Force
}

Write-Host "Writing .htaccess..."
$htaccess = @'
Options -MultiViews
DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Clean URL support for About
  RewriteRule ^about/?$ /about/index.html [L]

  # Clean URL support for Projects
  RewriteRule ^projects/?$ /projects/index.html [L]

  # Match Firebase behaviour: all /projects/... routes go to projects index
  RewriteRule ^projects/.+/?$ /projects/index.html [L]
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\.(html)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
  </FilesMatch>
  <FilesMatch "\.(js|css)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
'@
Set-Content -Path (Join-Path $dist ".htaccess") -Value $htaccess -Encoding UTF8

Write-Host "Removing .orig files from package..."
Get-ChildItem $dist -Recurse -Filter "*.orig" -File -ErrorAction SilentlyContinue | Remove-Item -Force

Write-Host "Verifying required files..."
$required = @(
  "index.html",
  "about\index.html",
  "projects\index.html",
  "_astro",
  "assets",
  ".htaccess"
)
foreach ($item in $required) {
  $path = Join-Path $dist $item
  if (!(Test-Path $path)) {
    throw "Missing required package item: $item"
  }
}

Write-Host "Checking old project folders were removed..."
$remainingProjectFolders = @()
if (Test-Path $projectsDir) {
  $remainingProjectFolders = Get-ChildItem $projectsDir -Directory
}
if ($remainingProjectFolders.Count -gt 0) {
  $names = ($remainingProjectFolders | Select-Object -ExpandProperty Name) -join ", "
  throw "Project detail folders still exist in package. Remove them first: $names"
}

Write-Host "Creating ZIP..."
Remove-Item $zip -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory(
  $dist,
  $zip,
  [System.IO.Compression.CompressionLevel]::Optimal,
  $false
)

Write-Host ""
Write-Host "DONE."
Write-Host "Created: $zip"
Write-Host ""
Write-Host "Upload this ZIP to cPanel public_html and extract it there."
Write-Host "After extraction, public_html must directly contain index.html, .htaccess, _astro, assets, about, and projects."
