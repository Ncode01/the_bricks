$ErrorActionPreference = "Stop"

$repo = Resolve-Path "."
$zip = Join-Path $repo "the-bricks-cpanel-upload.zip"
$tmp = Join-Path $repo "dist-cpanel-verify"

Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $tmp | Out-Null

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($zip, $tmp)

$rootItems = Get-ChildItem $tmp | Select-Object -ExpandProperty Name | Sort-Object
$projectsChildren = Get-ChildItem (Join-Path $tmp "projects") -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
$aboutHtml = Get-Content (Join-Path $tmp "about\index.html") -Raw
$projectsHtml = Get-Content (Join-Path $tmp "projects\index.html") -Raw
$origCount = (Get-ChildItem $tmp -Recurse -Filter "*.orig" -ErrorAction SilentlyContinue | Measure-Object).Count

$checks = [ordered]@{
  indexAtRoot            = Test-Path (Join-Path $tmp "index.html")
  htaccessAtRoot         = Test-Path (Join-Path $tmp ".htaccess")
  astroAtRoot            = Test-Path (Join-Path $tmp "_astro")
  assetsAtRoot           = Test-Path (Join-Path $tmp "assets")
  aboutIndex             = Test-Path (Join-Path $tmp "about\index.html")
  projectsIndex          = Test-Path (Join-Path $tmp "projects\index.html")
  noProjectSubfolders    = ((Get-ChildItem (Join-Path $tmp "projects") -Directory -ErrorAction SilentlyContinue | Measure-Object).Count -eq 0)
  sixteenProjects        = (([regex]::Matches($projectsHtml, 'class="project-item project-type-website"')).Count -eq 16)
  teamEshan              = $aboutHtml -match "Eshan Manusanka"
  teamJanith             = $aboutHtml -match "Janith"
  teamSasindu            = $aboutHtml -match "Sasindu"
  noOrig                 = ($origCount -eq 0)
  noFirebaseJson         = -not (Test-Path (Join-Path $tmp "firebase.json"))
  noFirebaserc           = -not (Test-Path (Join-Path $tmp ".firebaserc"))
  noGit                  = -not (Test-Path (Join-Path $tmp ".git"))
  noPlaceholderFolders   = -not (Test-Path (Join-Path $tmp "projects\brand_anthem_film"))
  noDistCpanelWrapper    = -not (Test-Path (Join-Path $tmp "dist-cpanel"))
  noLusionWrapper         = -not (Test-Path (Join-Path $tmp "lusion.co"))
}

$allPassed = -not @($checks.Values | Where-Object { $_ -eq $false }).Count

Write-Host "ZIP: $zip"
Write-Host "Size MB: $([math]::Round((Get-Item $zip).Length / 1MB, 2))"
Write-Host "Root items: $($rootItems -join ', ')"
Write-Host "projects/ contains: $($projectsChildren -join ', ')"
Write-Host ""
Write-Host "Checks:"
$checks.GetEnumerator() | ForEach-Object { Write-Host ("  {0}: {1}" -f $_.Key, $_.Value) }
Write-Host ""
Write-Host "ALL PASSED: $allPassed"

if (-not $allPassed) { exit 1 }
