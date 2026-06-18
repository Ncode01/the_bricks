$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$webRoot = Join-Path $repoRoot "lusion.co\lusion.co"
$shellPath = Join-Path $webRoot "projects\index.html"
$projectsDir = Join-Path $webRoot "projects"

$youtubeIds = @{
  "hameedia_husn_eid_campaign" = @("H7zazQLgESQ")
  "cfw_day_2_mikail_hameed" = @("awQUQmls_OU")
  "fashion_bug_avurudu_2026" = @("b6eR6b84DNU")
  "cool_planet_modano_denim" = @("b6MflwuK3H4")
  "eraffine_satin_effect" = @()
  "elvoir_valentines_day_campaign" = @("XsGbQTC11zA")
  "jasper_house_surf_lifestyle" = @("RWPxt9Y2Iro", "pcXBA3AUGuE", "Qp7pPmn2br8", "c7LFsjkvfHM")
  "jasper_house_art_of_surfing_thushan" = @("NnfU0GrFu9I")
  "jasper_house_lina_yoga_journey" = @("hTeQGWCi6zA")
  "flying_ravana_world_tourism_day_dilum_dissanayake" = @("YUZx7BlnfNc")
  "acres_98_world_tourism_day_thashinthan_panchanathan" = @("yK2JX_SsF88")
  "hilton_colombo_oktoberfest_2023" = @("rF7WI99w7ao")
  "taj_samudra_golden_dragon" = @("5vtKU94WD9M")
  "dandex_confidence_street_interviews" = @("-1PH3YhHPTM")
  "shandong_crystal_fried_rice" = @("8eXJGz_1tU4")
  "shandong_sweet_sour_chicken" = @("ivE0oA1_Jr8")
}

$urls = @{
  "hameedia_husn_eid_campaign" = @("https://youtube.com/shorts/H7zazQLgESQ")
  "cfw_day_2_mikail_hameed" = @("https://youtube.com/shorts/awQUQmls_OU?feature=share")
  "fashion_bug_avurudu_2026" = @("https://youtu.be/b6eR6b84DNU")
  "cool_planet_modano_denim" = @("https://youtube.com/shorts/b6MflwuK3H4")
  "eraffine_satin_effect" = @()
  "elvoir_valentines_day_campaign" = @("https://youtube.com/shorts/XsGbQTC11zA")
  "jasper_house_surf_lifestyle" = @(
    "https://youtube.com/shorts/RWPxt9Y2Iro?feature=share",
    "https://youtube.com/shorts/pcXBA3AUGuE",
    "https://youtube.com/shorts/Qp7pPmn2br8",
    "https://youtube.com/shorts/c7LFsjkvfHM"
  )
  "jasper_house_art_of_surfing_thushan" = @("https://youtube.com/shorts/NnfU0GrFu9I")
  "jasper_house_lina_yoga_journey" = @("https://youtube.com/shorts/hTeQGWCi6zA")
  "flying_ravana_world_tourism_day_dilum_dissanayake" = @("https://youtu.be/YUZx7BlnfNc")
  "acres_98_world_tourism_day_thashinthan_panchanathan" = @("https://youtu.be/yK2JX_SsF88")
  "hilton_colombo_oktoberfest_2023" = @("https://youtu.be/rF7WI99w7ao")
  "taj_samudra_golden_dragon" = @("https://youtu.be/5vtKU94WD9M")
  "dandex_confidence_street_interviews" = @("https://youtube.com/shorts/-1PH3YhHPTM?feature=share")
  "shandong_crystal_fried_rice" = @("https://youtube.com/shorts/8eXJGz_1tU4")
  "shandong_sweet_sour_chicken" = @("https://youtube.com/shorts/ivE0oA1_Jr8")
}

function Extract-ElementById([string]$html, [string]$id) {
  $pattern = "<div id=`"$id`""
  $start = $html.IndexOf($pattern)
  if ($start -lt 0) { return $null }
  $pos = $start
  $depth = 0
  while ($pos -lt $html.Length) {
    if ($pos + 4 -le $html.Length -and $html.Substring($pos, 4) -eq "<div") { $depth++ }
    elseif ($pos + 6 -le $html.Length -and $html.Substring($pos, 6) -eq "</div>") {
      $depth--
      if ($depth -eq 0) {
        return $html.Substring($start, $pos + 6 - $start)
      }
    }
    $pos++
  }
  return $null
}

function Get-ThumbnailHtml([string]$slug) {
  $filename = "/assets/projects/$slug/home"
  $ids = $youtubeIds[$slug]
  if ($ids -and $ids.Count -gt 0) {
    $vid = $ids[0]
    return @"
<div
  class="project-details-item is-image project-youtube-thumbnail"
  style="background-image:url('https://img.youtube.com/vi/$vid/hqdefault.jpg')"
  data-thumb-id="$vid"
  data-width="1296"
  data-height="1620"
  data-filename="$filename"
  data-type="image"
  data-fullscreen
></div>
"@
  }
  return @"
<div
  class="project-details-item is-image project-youtube-thumbnail project-thumbnail-placeholder"
  data-width="1296"
  data-height="1620"
  data-filename="$filename"
  data-type="image"
  data-fullscreen
></div>
"@
}

function Get-HiddenCtaHtml() {
  return @"
<a id="project-details-launch-cta" class="project-details-btn bricks-cta-hidden" href="/" hidden aria-hidden="true" tabindex="-1" data-link-type="regular">
  <span id="project-details-launch-cta-dot"></span>
  <p id="project-details-launch-cta-text"></p>
  <span id="project-details-launch-cta-arrow">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M9 9h6m0 0v6m0-6-6 6"></path>
    </svg>
  </span>
</a>
"@
}

function Get-HiddenMobileCtaHtml() {
  return @"
<a id="project-details-launch-cta-mobile" class="project-details-btn bricks-cta-hidden" href="/" hidden aria-hidden="true" tabindex="-1" data-link-type="regular">
  <span id="project-details-launch-cta-mobile-dot"></span>
  <p id="project-details-launch-cta-mobile-text"></p>
  <span id="project-details-launch-cta-mobile-arrow">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M9 9h6m0 0v6m0-6-6 6"></path>
    </svg>
  </span>
</a>
"@
}

function Get-LaunchCtaHtml([string]$url) {
  return @"
<a
  id="project-details-launch-cta"
  class="project-details-btn"
  href="$url"
  target="_blank"
  rel="noopener noreferrer"
  data-link-type="regular"
>
  <span id="project-details-launch-cta-dot"></span>
  <p id="project-details-launch-cta-text">Watch video</p>
  <span id="project-details-launch-cta-arrow">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M9 9h6m0 0v6m0-6-6 6"></path>
    </svg>
  </span>
</a>
"@
}

function Get-MobileCtaHtml([string]$url) {
  return @"
<a
  id="project-details-launch-cta-mobile"
  class="project-details-btn"
  href="$url"
  target="_blank"
  rel="noopener noreferrer"
  data-link-type="regular"
>
  <span id="project-details-launch-cta-mobile-dot"></span>
  <p id="project-details-launch-cta-mobile-text">Watch video</p>
  <span id="project-details-launch-cta-mobile-arrow">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M9 9h6m0 0v6m0-6-6 6"></path>
    </svg>
  </span>
</a>
"@
}

function Get-LinksSectionHtml([string]$slug) {
  $projectUrls = $urls[$slug]
  if (-not $projectUrls -or $projectUrls.Count -eq 0) { return "" }
  if ($projectUrls.Count -eq 1) {
    $u = $projectUrls[0]
    return @"
<div id="project-details-side-list-links">
  <h4 class="project-details-side-list-title">Links</h4>
  <a class="project-details-side-list-item" href="$u" target="_blank" rel="noopener noreferrer" data-link-type="regular">Watch video</a>
</div>
"@
  }
  $links = ""
  for ($i = 0; $i -lt $projectUrls.Count; $i++) {
    $label = "Watch video $($i + 1)"
    $links += "  <a class=`"project-details-side-list-item`" href=`"$($projectUrls[$i])`" target=`"_blank`" rel=`"noopener noreferrer`" data-link-type=`"regular`">$label</a>`n"
  }
  return @"
<div id="project-details-side-list-links">
  <h4 class="project-details-side-list-title">Links</h4>
$links</div>
"@
}

function Patch-ProjectDetails([string]$details, [string]$slug) {
  $details = [regex]::Replace(
    $details,
    '(?s)<div\s+class="project-details-item is-image[^"]*"[^>]*>\s*</div>',
    (Get-ThumbnailHtml $slug)
  )

  $projectUrls = $urls[$slug]
  $launchCtaPattern = '(?s)<a id="project-details-launch-cta"[^>]*>.*?</a>'
  $mobileCtaPattern = '(?s)<a id="project-details-launch-cta-mobile"[^>]*>.*?</a>'
  $linksPattern = '(?s)<div id="project-details-side-list-links">.*?</div>'

  if ($projectUrls -and $projectUrls.Count -eq 1) {
    $cta = Get-LaunchCtaHtml $projectUrls[0]
    $mobile = Get-MobileCtaHtml $projectUrls[0]
  }
  else {
    $cta = Get-HiddenCtaHtml
    $mobile = Get-HiddenMobileCtaHtml
  }

  if ($details -match 'id="project-details-launch-cta"') {
    $details = [regex]::Replace($details, $launchCtaPattern, $cta)
  }
  else {
    $details = [regex]::Replace(
      $details,
      '(?s)(<div id="project-details-desc">.*?</div>)',
      "`$1`n                $cta"
    )
  }

  if ($details -match 'id="project-details-launch-cta-mobile"') {
    $details = [regex]::Replace($details, $mobileCtaPattern, $mobile)
  }
  else {
    $details = [regex]::Replace(
      $details,
      '(?s)(<div id="project-details-right">.*?<div id="project-details-side-list">.*?</div>)',
      "`$1`n                $mobile"
    )
  }

  if ($projectUrls -and $projectUrls.Count -gt 0) {
    if ($details -match 'id="project-details-side-list-links"') {
      $details = [regex]::Replace($details, $linksPattern, (Get-LinksSectionHtml $slug))
    }
    else {
      $details = [regex]::Replace(
        $details,
        '(?s)(<div id="project-details-side-list-services">.*?</div>)',
        "`$1`n                  $(Get-LinksSectionHtml $slug)"
      )
    }
  }
  else {
    $details = [regex]::Replace($details, $linksPattern, "")
  }

  $details = [regex]::Replace(
    $details,
    'class="project-details-item is-text is-credits"(?: data-type="text")*',
    'class="project-details-item is-text is-credits" data-type="text"'
  )

  return $details
}

$shell = Get-Content $shellPath -Raw

if ($shell -notmatch '(?s)(.*?<div id="projects" class="page">).*?(<div id="page-extra-sections">.*)$') {
  throw "Could not locate projects section boundaries in shell template."
}
$shellBefore = $Matches[1] -replace '<div id="projects" class="page">$', '<div id="project" class="page">'
$shellAfter = $Matches[2]

$responsiveLink = '    <link rel="stylesheet" href="/_astro/bricks-responsive-fixes.css?v=20260618fix1" />' + "`n"
$navigationFixScript = '    <script src="/_astro/bricks-navigation-fix.js?v=20260618fix1"></script>' + "`n"

if ($shellBefore -notlike "*bricks-responsive-fixes.css*") {
  $shellBefore = $shellBefore -replace '(<link rel="stylesheet" href="/_astro/the-bricks-theme\.css[^"]*" />)', "`$1`n$responsiveLink"
}

if ($shellBefore -notlike "*bricks-navigation-fix.js*") {
  $shellBefore = $shellBefore -replace '(<script type="module" src="/_astro/hoisted\.CJiXW_YI\.js[^"]*"></script>)', "$navigationFixScript    `$1"
}

$shellBefore = $shellBefore -replace '<body>', '<body class="bricks-project-detail-page">'

foreach ($slug in $youtubeIds.Keys) {
  $fragmentPath = Join-Path $projectsDir "$slug\index.html"
  if (!(Test-Path $fragmentPath)) {
    throw "Missing fragment: $fragmentPath"
  }

  $fragment = Get-Content $fragmentPath -Raw
  $details = Extract-ElementById $fragment "project-details"
  if (-not $details) { throw "Could not extract project-details from $slug" }

  $details = Patch-ProjectDetails $details $slug

  $titleMatch = [regex]::Match($fragment, '<title>(.*?)</title>')
  $pageTitle = if ($titleMatch.Success) { $titleMatch.Groups[1].Value } else { "$slug - The Bricks" }

  $page = $shellBefore + "`n          " + $details + "`n        </div>`n        </div>`n        " + $shellAfter
  $page = [regex]::Replace($page, '<title>.*?</title>', "<title>$pageTitle</title>", 1)

  $outPath = Join-Path $projectsDir "$slug\index.html"
  $tmpPath = "$outPath.tmp"
  Set-Content -Path $tmpPath -Value $page -Encoding UTF8 -NoNewline
  Move-Item -Path $tmpPath -Destination $outPath -Force
  Write-Host "Generated: $slug"
}

Write-Host "All project detail pages generated."
