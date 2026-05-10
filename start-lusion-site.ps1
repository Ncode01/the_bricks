$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$siteRoot = Join-Path $workspaceRoot "lusion.co\lusion.co"
$domainRoot = Join-Path $workspaceRoot "lusion.co"
$siteAssetsRoot = Join-Path $siteRoot "assets"
$sharedAssetsRoot = Join-Path $domainRoot "lusion.dev\assets"
$port = 5500

if (-not (Test-Path $siteRoot)) {
  throw "Site root not found: $siteRoot"
}

if (-not (Test-Path $sharedAssetsRoot)) {
  throw "Shared asset root not found: $sharedAssetsRoot"
}

function Ensure-Junction {
  param(
    [Parameter(Mandatory = $true)][string]$LinkPath,
    [Parameter(Mandatory = $true)][string]$TargetPath
  )

  if (-not (Test-Path $TargetPath)) {
    Write-Host "Skip missing source: $TargetPath"
    return
  }

  if (Test-Path $LinkPath) {
    return
  }

  New-Item -ItemType Junction -Path $LinkPath -Target $TargetPath | Out-Null
  Write-Host "Linked: $LinkPath -> $TargetPath"
}

function Ensure-DarkFavicons {
  param([Parameter(Mandatory = $true)][string]$MetaPath)

  $darkPath = Join-Path $MetaPath "dark"
  if (-not (Test-Path $darkPath)) {
    New-Item -ItemType Directory -Path $darkPath | Out-Null
  }

  $pairs = @(
    @{ Dst = "favicon.ico"; Candidates = @("favicon.ico", "apple-touch-icon.png", "android-chrome-192x192.png") },
    @{ Dst = "favicon-32x32.png"; Candidates = @("favicon-32x32.png", "apple-touch-icon.png", "android-chrome-192x192.png") },
    @{ Dst = "favicon-16x16.png"; Candidates = @("favicon-16x16.png", "apple-touch-icon.png", "android-chrome-192x192.png") }
  )

  foreach ($pair in $pairs) {
    $dst = Join-Path $darkPath $pair.Dst
    if (Test-Path $dst) {
      continue
    }

    foreach ($candidate in $pair.Candidates) {
      $src = Join-Path $MetaPath $candidate
      if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst
        Write-Host "Created fallback dark icon: $dst"
        break
      }
    }
  }
}

function Ensure-ModelFallback {
  param(
    [Parameter(Mandatory = $true)][string]$AssetsPath
  )

  $target = Join-Path $AssetsPath "models\home\cross.buf"
  if (Test-Path $target) {
    return
  }

  $fallbackSources = @(
    (Join-Path $AssetsPath "models\about\terrain.buf"),
    (Join-Path $AssetsPath "models\about\rock_0.buf")
  )

  foreach ($src in $fallbackSources) {
    if (Test-Path $src) {
      New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
      Copy-Item -Path $src -Destination $target -Force
      Write-Host "Created fallback model: $target"
      break
    }
  }
}

function Ensure-FileCopyFallback {
  param(
    [Parameter(Mandatory = $true)][string]$TargetPath,
    [Parameter(Mandatory = $true)][string[]]$CandidateSources
  )

  if (Test-Path $TargetPath) {
    return
  }

  foreach ($src in $CandidateSources) {
    if (Test-Path $src) {
      New-Item -ItemType Directory -Path (Split-Path -Parent $TargetPath) -Force | Out-Null
      Copy-Item -Path $src -Destination $TargetPath -Force
      Write-Host "Created fallback file: $TargetPath"
      return
    }
  }
}

function Ensure-CriticalFallbackAssets {
  param([Parameter(Mandatory = $true)][string]$AssetsPath)

  $audioFallbackCandidates = @(
    (Join-Path $AssetsPath "audios\\generic.ogg"),
    (Join-Path $AssetsPath "audios\\cinematic_0.ogg"),
    (Join-Path $AssetsPath "audios\\generic_end.ogg")
  )

  $uiAudioNames = @("glass_broken")
  $indexedUiPrefixes = @("hover", "click", "focus", "page")
  foreach ($prefix in $indexedUiPrefixes) {
    foreach ($idx in 0..9) {
      $uiAudioNames += ($prefix + "_" + $idx)
    }
  }

  foreach ($name in $uiAudioNames) {
    Ensure-FileCopyFallback `
      -TargetPath (Join-Path $AssetsPath ("audios\\" + $name + ".ogg")) `
      -CandidateSources $audioFallbackCandidates
  }

  $lineFallbackCandidates = @(
    (Join-Path $AssetsPath "models\\lines\\line_capability.buf"),
    (Join-Path $AssetsPath "models\\lines\\line_office.buf"),
    (Join-Path $AssetsPath "models\\home\\cross.buf")
  )

  Ensure-FileCopyFallback `
    -TargetPath (Join-Path $AssetsPath "models\\lines\\line_reel.buf") `
    -CandidateSources $lineFallbackCandidates
  Ensure-FileCopyFallback `
    -TargetPath (Join-Path $AssetsPath "models\\lines\\line_goal.buf") `
    -CandidateSources $lineFallbackCandidates

  $tunnelFallbackCandidates = @(
    (Join-Path $AssetsPath "models\\about\\terrain.buf"),
    (Join-Path $AssetsPath "models\\about\\rock_0.buf"),
    (Join-Path $AssetsPath "models\\home\\cross.buf")
  )

  $tunnelModelNames = @(
    "grid_structure_ld",
    "grid_structure_hd",
    "grid_base_ld",
    "grid_base_hd",
    "astronaut_helmet",
    "astronaut_helmet_glass",
    "astronaut_glove_shoes",
    "astronaut_wearpack",
    "astronaut_card",
    "astronaut_in_animation",
    "astronaut_out_animation",
    "astronaut_animations",
    "tunnel_block_base",
    "tunnel_block_wall",
    "broken_glass",
    "broken_glass_animation",
    "earth_card",
    "diamond"
  )

  foreach ($name in $tunnelModelNames) {
    Ensure-FileCopyFallback `
      -TargetPath (Join-Path $AssetsPath ("models\\tunnels\\" + $name + ".buf")) `
      -CandidateSources $tunnelFallbackCandidates
  }

  Ensure-FileCopyFallback `
    -TargetPath (Join-Path $AssetsPath "textures\\reel\\desktop.mp4") `
    -CandidateSources @((Join-Path $AssetsPath "textures\\reel\\mobile.mp4"))

  $matcapSourceCandidates = @(
    (Join-Path $AssetsPath "textures\\LDR_RGB1_0.png"),
    (Join-Path $AssetsPath "textures\\tunnels\\white_matcap.jpg")
  )

  Ensure-FileCopyFallback `
    -TargetPath (Join-Path $AssetsPath "textures\\home\\matcap.png") `
    -CandidateSources $matcapSourceCandidates
  Ensure-FileCopyFallback `
    -TargetPath (Join-Path $AssetsPath "textures\\home\\matcap_ld.png") `
    -CandidateSources $matcapSourceCandidates
}

function Get-ProjectIdsFromListing {
  param([Parameter(Mandatory = $true)][string]$ProjectsIndexPath)

  if (-not (Test-Path $ProjectsIndexPath)) {
    return @()
  }

  $html = Get-Content -Path $ProjectsIndexPath -Raw
  $matches = [regex]::Matches($html, 'data-id="([a-z0-9_\-]+)"')
  if ($matches.Count -eq 0) {
    return @()
  }

  $ids = New-Object System.Collections.Generic.HashSet[string]
  foreach ($m in $matches) {
    [void]$ids.Add($m.Groups[1].Value)
  }

  return @($ids)
}

function Ensure-ProjectAssetFallbacks {
  param(
    [Parameter(Mandatory = $true)][string]$AssetsPath,
    [Parameter(Mandatory = $true)][string[]]$ProjectIds
  )

  $projectsRoot = Join-Path $AssetsPath "projects"
  if (-not (Test-Path $projectsRoot)) {
    return
  }

  $homeFallbackCandidates = @(
    (Join-Path $projectsRoot "of_the_oak\\home.webp"),
    (Join-Path $projectsRoot "oryzo_ai\\home.webp"),
    (Join-Path $projectsRoot "my_little_story_book\\home.webp")
  )

  $depthFallbackCandidates = @(
    (Join-Path $projectsRoot "of_the_oak\\home_depth.webp"),
    (Join-Path $projectsRoot "oryzo_ai\\home_depth.webp"),
    (Join-Path $projectsRoot "my_little_story_book\\home_depth.webp")
  )

  foreach ($id in $ProjectIds) {
    Ensure-FileCopyFallback `
      -TargetPath (Join-Path $projectsRoot ($id + "\\home.webp")) `
      -CandidateSources $homeFallbackCandidates

    Ensure-FileCopyFallback `
      -TargetPath (Join-Path $projectsRoot ($id + "\\home_depth.webp")) `
      -CandidateSources $depthFallbackCandidates
  }
}

function Ensure-ProjectRouteFallbacks {
  param(
    [Parameter(Mandatory = $true)][string]$SiteRoot,
    [Parameter(Mandatory = $true)][string[]]$ProjectIds
  )

  $projectsRoot = Join-Path $SiteRoot "projects"
  foreach ($id in $ProjectIds) {
    $slugRoot = Join-Path $projectsRoot $id
    $slugIndex = Join-Path $slugRoot "index.html"
    if (Test-Path $slugIndex) {
      continue
    }

    New-Item -ItemType Directory -Path $slugRoot -Force | Out-Null
    @'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Project Redirect</title>
    <meta http-equiv="refresh" content="0; url=/projects/">
    <script>window.location.replace('/projects/');</script>
  </head>
  <body></body>
</html>
'@ | Set-Content -Path $slugIndex -Encoding UTF8

    Write-Host "Created fallback project route: $slugIndex"
  }
}

$assetFolders = @("audios", "models", "projects", "team", "textures")
foreach ($folder in $assetFolders) {
  Ensure-Junction `
    -LinkPath (Join-Path $siteAssetsRoot $folder) `
    -TargetPath (Join-Path $sharedAssetsRoot $folder)
}

Ensure-DarkFavicons -MetaPath (Join-Path $siteAssetsRoot "meta")
Ensure-ModelFallback -AssetsPath $siteAssetsRoot
Ensure-CriticalFallbackAssets -AssetsPath $siteAssetsRoot

$projectsIndexPath = Join-Path $siteRoot "projects\index.html"
$projectIds = Get-ProjectIdsFromListing -ProjectsIndexPath $projectsIndexPath
if ($projectIds.Count -gt 0) {
  Ensure-ProjectAssetFallbacks -AssetsPath $siteAssetsRoot -ProjectIds $projectIds
  Ensure-ProjectRouteFallbacks -SiteRoot $siteRoot -ProjectIds $projectIds
}

Write-Host "Serving site from: $siteRoot"
Write-Host "URL: http://localhost:$port/"

Push-Location $siteRoot
try {
  py -m http.server $port
} finally {
  Pop-Location
}
