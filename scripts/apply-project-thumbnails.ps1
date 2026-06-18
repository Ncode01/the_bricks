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

function Update-ThumbnailsInFile([string]$filePath) {
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

    $pattern = "(?s)(<a[^>]*data-id=`"$slug`"[^>]*>.*?<div class=`"project-item-main`">\s*)<div class=`"project-item-image`"></div>"
    if ($html -notmatch $pattern) {
      continue
    }
    $html = [regex]::Replace($html, $pattern, "`${1}$imageHtml", 1)
  }
  Set-Content -Path $filePath -Value $html -Encoding UTF8 -NoNewline
  Write-Host "Updated thumbnails in: $filePath"
}

$responsiveLink = '    <link rel="stylesheet" href="/_astro/bricks-responsive-fixes.css?v=20260618fix1" />'

foreach ($rel in @("index.html", "projects\index.html", "about\index.html")) {
  $path = Join-Path $webRoot $rel
  if ($rel -eq "index.html" -or $rel -eq "projects\index.html") {
    Update-ThumbnailsInFile $path
  }

  $html = Get-Content $path -Raw
  if ($html -notlike "*bricks-responsive-fixes.css*") {
    $html = $html -replace '(<link rel="stylesheet" href="/_astro/the-bricks-theme\.css[^"]*" />)', "`$1`n$responsiveLink"
    Set-Content -Path $path -Value $html -Encoding UTF8 -NoNewline
    Write-Host "Added responsive CSS link to: $rel"
  }
}

Write-Host "Thumbnails and CSS links applied."
