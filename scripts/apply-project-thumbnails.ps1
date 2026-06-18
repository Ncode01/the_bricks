$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$webRoot = Join-Path $repoRoot "lusion.co\lusion.co"

$thumbMap = @{
  "hameedia_husn_eid_campaign" = "H7zazQLgESQ"
  "cfw_day_2_mikail_hameed" = "awQUQmls_OU"
  "fashion_bug_avurudu_2026" = "b6eR6b84DNU"
  "cool_planet_modano_denim" = "b6MflwuK3H4"
  "eraffine_satin_effect" = $null
  "elvoir_valentines_day_campaign" = "XsGbQTC11zA"
  "jasper_house_surf_lifestyle" = "RWPxt9Y2Iro"
  "jasper_house_art_of_surfing_thushan" = "NnfU0GrFu9I"
  "jasper_house_lina_yoga_journey" = "hTeQGWCi6zA"
  "flying_ravana_world_tourism_day_dilum_dissanayake" = "YUZx7BlnfNc"
  "acres_98_world_tourism_day_thashinthan_panchanathan" = "yK2JX_SsF88"
  "hilton_colombo_oktoberfest_2023" = "rF7WI99w7ao"
  "taj_samudra_golden_dragon" = "5vtKU94WD9M"
  "dandex_confidence_street_interviews" = "-1PH3YhHPTM"
  "shandong_crystal_fried_rice" = "8eXJGz_1tU4"
  "shandong_sweet_sour_chicken" = "ivE0oA1_Jr8"
}

function Write-FileAtomic([string]$path, [string]$content) {
  $tmpPath = "$path.tmp"
  Set-Content -Path $tmpPath -Value $content -Encoding UTF8 -NoNewline
  Move-Item -Path $tmpPath -Destination $path -Force
}

function Update-ProjectCardsInFile([string]$filePath) {
  $html = Get-Content $filePath -Raw

  foreach ($slug in $thumbMap.Keys) {
    $vid = $thumbMap[$slug]
    $imageHtml = if ($vid) {
      @"
<div
                    class="project-item-image project-youtube-thumbnail"
                    style="background-image: url('https://img.youtube.com/vi/$vid/hqdefault.jpg');"
                    data-thumb-id="$vid"
                    aria-hidden="true"
                  ></div>
"@
    } else {
      '                    <div class="project-item-image project-youtube-thumbnail project-thumbnail-placeholder" aria-hidden="true"></div>'
    }

    $blockPattern = "(?s)(<a\s+class=`"project-item project-type-website`"[^>]*data-id=`"$slug`"[^>]*)(>)(.*?)(</a>)"
    $m = [regex]::Match($html, $blockPattern)
    if (-not $m.Success) { continue }

    $open = $m.Groups[1].Value
    $gt = $m.Groups[2].Value
    $inner = $m.Groups[3].Value
    $close = $m.Groups[4].Value

    if ($open -notlike '*data-link-type=*') {
      $open = $open + ' data-link-type="regular"'
    }

    $inner = [regex]::Replace(
      $inner,
      '(?s)<div class="project-item-main">\s*<div class="project-item-image[^"]*"[^>]*>\s*</div>',
      "<div class=`"project-item-main`">`n                  $imageHtml"
    )
    if ($inner -notlike '*project-youtube-thumbnail*') {
      $inner = [regex]::Replace(
        $inner,
        '(?s)<div class="project-item-main">\s*<div class="project-item-image"></div>',
        "<div class=`"project-item-main`">`n                  $imageHtml"
      )
    }

    $replacement = $open + $gt + $inner + $close
    $html = $html.Remove($m.Index, $m.Length).Insert($m.Index, $replacement)
  }

  Write-FileAtomic $filePath $html
  Write-Host "Updated project cards in: $filePath"
}

$responsiveLink = '    <link rel="stylesheet" href="/_astro/bricks-responsive-fixes.css?v=20260618fix2" />'
$navigationFixScript = '    <script src="/_astro/bricks-navigation-fix.js?v=20260618fix1"></script>'

function Add-NavigationFixScript([string]$filePath) {
  $html = Get-Content $filePath -Raw
  if ($html -like '*bricks-navigation-fix.js*') { return }
  if ($html -notmatch '<script type="module" src="/_astro/hoisted\.CJiXW_YI\.js') { return }
  $html = $html -replace '(<script type="module" src="/_astro/hoisted\.CJiXW_YI\.js[^"]*"></script>)', "$navigationFixScript`n    `$1"
  Write-FileAtomic $filePath $html
  Write-Host "Added navigation fix script to: $filePath"
}

foreach ($rel in @("index.html", "projects\index.html", "about\index.html")) {
  $path = Join-Path $webRoot $rel
  if ($rel -eq "index.html" -or $rel -eq "projects\index.html") {
    Update-ProjectCardsInFile $path
  }

  $html = Get-Content $path -Raw
  if ($html -notlike "*bricks-responsive-fixes.css*") {
    $html = $html -replace '(<link rel="stylesheet" href="/_astro/the-bricks-theme\.css[^"]*" />)', "`$1`n$responsiveLink"
    Write-FileAtomic $path $html
    Write-Host "Added responsive CSS link to: $rel"
  }
}

foreach ($rel in @("index.html", "projects\index.html", "about\index.html")) {
  Add-NavigationFixScript (Join-Path $webRoot $rel)
}

Get-ChildItem (Join-Path $webRoot "projects\*\index.html") | ForEach-Object {
  Add-NavigationFixScript $_.FullName
}

Write-Host "Thumbnails, CSS links, and navigation fix applied."
