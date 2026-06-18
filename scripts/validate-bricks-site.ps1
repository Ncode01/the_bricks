$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$root = Join-Path $repoRoot "lusion.co\lusion.co"
$projectsDir = Join-Path $root "projects"

$requiredFiles = @(
  "index.html",
  "about\index.html",
  "projects\index.html",
  "_astro\the-bricks-theme.css",
  "_astro\bricks-responsive-fixes.css",
  "_astro\hoisted.CJiXW_YI.js"
)

foreach ($file in $requiredFiles) {
  $path = Join-Path $root $file
  if (!(Test-Path $path)) {
    throw "Missing required file: $file"
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
  if (Test-Path (Join-Path $projectsDir $folder)) {
    throw "Old placeholder project folder still exists: $folder"
  }
}

foreach ($folder in $newProjectFolders) {
  $file = Join-Path $projectsDir "$folder\index.html"
  if (!(Test-Path $file)) {
    throw "Missing project detail page: $folder"
  }
  $html = Get-Content $file -Raw
  foreach ($needle in @('id="ui"', 'id="header"', 'id="page-container"', 'id="project-details"', 'hoisted.CJiXW_YI.js', 'bricks-responsive-fixes.css')) {
    if ($html -notlike "*$needle*") {
      throw "$folder detail page is missing: $needle"
    }
  }
}

$eraffine = Get-Content (Join-Path $projectsDir "eraffine_satin_effect\index.html") -Raw
if ($eraffine -like "*Watch video*") {
  throw "e Raffiné must not show Watch video because it has no URL."
}

$hameedia = Get-Content (Join-Path $projectsDir "hameedia_husn_eid_campaign\index.html") -Raw
if ($hameedia -notlike "*H7zazQLgESQ*") {
  throw "Hameedia detail page does not include YouTube thumbnail/video ID."
}

$about = Get-Content (Join-Path $root "about\index.html") -Raw
foreach ($name in @("Eshan Manusanka", "Janith Imaduwage", "Sasindu Randi")) {
  if ($about -notlike "*$name*") {
    throw "About page missing team member: $name"
  }
}
if ($about -like '*id="about-team-roster" hidden*') {
  throw "about-team-roster still has hidden attribute."
}

$projects = Get-Content (Join-Path $root "projects\index.html") -Raw
$count = ([regex]::Matches($projects, 'class="project-item project-type-website"')).Count
if ($count -ne 16) {
  throw "Expected 16 project items, found $count"
}

Write-Host "Validation passed."
