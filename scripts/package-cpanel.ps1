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

Write-Host "Removing old placeholder project folders from cPanel package..."
$projectsDir = Join-Path $dist "projects"
$oldProjectFolders = @(
  "behind_the_scenes_content",
  "brand_anthem_film",
  "brand_story_series",
  "campaign_toolkit",
  "case_study_film",
  "commercial_spot",
  "culture_campaign",
  "documentary_short",
  "event_recap_film",
  "explainer_film",
  "founder_story",
  "launch_teaser",
  "product_demo_film",
  "product_launch_campaign",
  "recruitment_campaign",
  "social_content_series",
  "testimonial_series"
)
foreach ($folder in $oldProjectFolders) {
  $path = Join-Path $projectsDir $folder
  if (Test-Path $path) {
    Remove-Item $path -Recurse -Force
  }
}

$newProjectFolders = @(
  "hameedia_husn_eid_campaign",
  "cfw_day_2_mikail_hameed",
  "fashion_bug_avurudu_2026",
  "cool_planet_modano_denim",
  "eraffine_satin_effect",
  "elvoir_valentines_day_campaign",
  "jasper_house_surf_lifestyle",
  "jasper_house_art_of_surfing_thushan",
  "jasper_house_lina_yoga_journey",
  "flying_ravana_world_tourism_day_dilum_dissanayake",
  "acres_98_world_tourism_day_thashinthan_panchanathan",
  "hilton_colombo_oktoberfest_2023",
  "taj_samudra_golden_dragon",
  "dandex_confidence_street_interviews",
  "shandong_crystal_fried_rice",
  "shandong_sweet_sour_chicken"
)
foreach ($folder in $newProjectFolders) {
  $path = Join-Path $projectsDir "$folder\index.html"
  if (!(Test-Path $path)) {
    throw "Missing required project detail page in package: $folder/index.html"
  }
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

  # Clean URL support for Projects index
  RewriteRule ^projects/?$ /projects/index.html [L]

  # Fallback only when a physical project detail folder/file does not exist
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^projects/.+/?$ /projects/index.html [L]
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\.(html)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
  </FilesMatch>
  <FilesMatch "\.(js|css)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
  <FilesMatch "\.(jpg|jpeg|png|webp|gif|svg)$">
    Header set Cache-Control "public, max-age=604800"
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
