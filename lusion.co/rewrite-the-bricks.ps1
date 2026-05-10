$ErrorActionPreference = 'Stop'

$root = 'C:\Users\child\Documents\New folder (4)\lusion.co\lusion.co'

function Update-File {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][scriptblock]$Transform
  )

  $original = Get-Content -Raw -LiteralPath $Path
  $updated = & $Transform $original
  if ($updated -ne $original) {
    Set-Content -LiteralPath $Path -Value $updated -NoNewline
  }
}

$oldSlugs = @(
  'oryzo_ai',
  'of_the_oak',
  'devin_ai',
  'porsche_dream_machine',
  'synthetic_human',
  'ddd_2024',
  'spaace',
  'choo_choo_world',
  'zero_tech',
  'spatial_fusion',
  'worldcoin',
  'lusion_labs',
  'my_little_story_book',
  'soda_experience',
  'infinite_passerella',
  'the_turn_of_the_screw',
  'maxmara_bearings_gifts'
)

$newSlugs = @(
  'brand_anthem_film',
  'product_launch_campaign',
  'social_content_series',
  'documentary_short',
  'event_recap_film',
  'founder_story',
  'commercial_spot',
  'recruitment_campaign',
  'testimonial_series',
  'product_demo_film',
  'behind_the_scenes_content',
  'case_study_film',
  'launch_teaser',
  'culture_campaign',
  'explainer_film',
  'campaign_toolkit',
  'brand_story_series'
)

$newTitles = @(
  'Brand Anthem Film',
  'Product Launch Campaign',
  'Social Content Series',
  'Documentary Short',
  'Event Recap Film',
  'Founder Story',
  'Commercial Spot',
  'Recruitment Campaign',
  'Testimonial Series',
  'Product Demo Film',
  'Behind the Scenes Content',
  'Case Study Film',
  'Launch Teaser',
  'Culture Campaign',
  'Explainer Film',
  'Campaign Toolkit',
  'Brand Story Series'
)

$newTags = @(
  'concept • production • post',
  'strategy • production • delivery',
  'creative • production • cutdowns',
  'research • direction • edit',
  'capture • edit • motion graphics',
  'interviews • narrative • post',
  'treatment • production • finishing',
  'strategy • production • edit',
  'interviews • production • delivery',
  'scripting • studio shoot • post',
  'capture • edit • social assets',
  'interviews • edit • sound',
  'concept • motion • finishing',
  'creative • production • cutdowns',
  'scripting • motion • voiceover',
  'film • edits • platform versions',
  'concept • production • delivery'
)

$oldTags = @(
  'concept • web • design • development • 3d • animation',
  'web • design • development • 3d • animation',
  'web • design • development • 3d',
  'concept • 3D illustration • mograph • video',
  'web • design • development • 3d • web3',
  'concept • web • game design • 3d',
  'api design • webgl • 3d',
  'web • design • development • 3d',
  'web • design • development • 3d',
  'web • design • development • 3d',
  'api design • webgl • 3d',
  'web • design • development • 3d',
  'concept • design • development • 3d',
  'AR • development • 3d',
  'concept • design • development • 3d',
  'design • development • 3d',
  'development • 3D'
)

# Home page
Update-File "$root\index.html" {
  param($text)
  $text = $text.Replace('A selection of immersive digital experiences created for', 'A selection of story-led productions built around')
  $text = $text.Replace('Where Creative Ideas Become Immersive Experiences', 'Where strong stories become effective productions.')
  $text = $text.Replace('Our process blends creative direction, 3D craft, and', 'We build productions with a clear role to play,')
  $text = $text.Replace('interactive development to build tailored digital journeys', 'supporting campaigns and helping audiences remember what matters')
  $text = $text.Replace('Need a production partner from first idea to final delivery?', 'Need a production partner from first idea to final delivery?')
  $text = $text.Replace('Discuss a Project', 'Discuss a Project')
  for ($i = 0; $i -lt $oldSlugs.Count; $i++) {
    $text = $text.Replace($oldSlugs[$i], $newSlugs[$i])
    $text = $text.Replace($oldTags[$i], $newTags[$i])
    $text = $text.Replace($newTitles[$i], $newTitles[$i])
  }
  $text = $text.Replace('mailto:hello@lusion.co', 'mailto:hello@thebricks.com')
  $text = $text.Replace('mailto:business@lusion.co', 'mailto:business@thebricks.com')
  $text = $text.Replace('https://twitter.com/lusionltd/', '#')
  $text = $text.Replace('https://www.instagram.com/lusionltd/', '#')
  $text = $text.Replace('https://www.linkedin.com/company/lusionltd/', '#')
  $text = $text.Replace('https://labs.lusion.co/', '#')
  $text = $text.Replace('https://labs.lusion.co', '#')
  $text = $text.Replace('R&D: labs.lusion.co', 'Production / The Bricks')
  $text = $text.Replace('Built by Lusion with ❤️', 'Built by The Bricks with craft')
  $text = $text.Replace('©2026 THE BRICKS Creative Studio', '©2026 THE BRICKS Creative Production House')
  $text = $text.Replace('https://lusion.co/assets/meta/social_sharing.jpg', '/assets/meta/social_sharing.jpg')
  $text
}

# About page
Update-File "$root\about\index.html" {
  param($text)
  $replacements = @{
    'Edan Kwan' = 'The Bricks Team'
    'Cofounder & <br /> Creative Director' = 'Creative Production House'
    'A worldwide team' = 'A focused team'
    'specialists in design,' = 'specialists in strategy,'
    'motion, 3D, and technology' = 'creative development, production, and post-production'
    'immersive digital' = 'story-led'
    'experiences.' = 'productions.'
    'BRANDS WE WORK WITH' = 'WHO WE WORK WITH'
    'Trusted by global brands, cultural institutions, and forward thinking teams.' = 'We partner with brands, agencies, and organizations looking for thoughtful, story-led production support from concept through delivery.'
    'Awards' = 'How We Work'
    'Articles' = 'Process'
    'Talks' = 'Capabilities'
    'Awwwards' = '01 — Discover'
    'FWA' = '02 — Develop'
    'CSSDA' = '03 — Produce'
    'Webby Awards' = '04 — Deliver'
    'Lovie Awards' = 'Discover'
    'Drum Awards' = 'Develop'
    'CommArts' = 'Produce'
    'Site of the Year' = 'We define the brief, audience, objectives, and creative opportunity.'
    'Developer Site of the Year' = 'We shape the idea through concepting, scripting, treatments, and planning.'
    'Site of the Month' = 'We manage production with a focus on clarity, craft, and execution.'
    'Site of the Day' = 'We finish, refine, and deliver assets ready for launch across the right channels.'
    'Honorable Mention' = 'Deliver'
    'Webby Winner' = 'Strategy'
    'Webby Nominee' = 'Creative'
    'Lovie Winner' = 'Production'
    'The Drum Awards for Design' = 'Post-Production'
    'Best-in-show Interactive' = 'Editing, motion graphics, colour, sound, and final delivery assets.'
    'Digital Design Days' = 'Discover'
    'Awwwards Conf' = 'Develop'
    'KIKK Festival' = 'Produce'
    'Grow Paris' = 'Deliver'
    'Oct 2024 Milan' = ''
    'Oct 2023 Amsterdam' = ''
    'Oct 2023 Namur' = ''
    'Oct 2022 Amsterdam' = ''
    'Nov 2018 Paris' = ''
    'Digital Experience Strategy' = 'Brief Development'
    'Technology Strategy' = 'Audience Understanding'
    'Creative Direction' = 'Messaging Alignment'
    'WebGL Development' = 'Concept Development'
    'Front End Development' = 'Scriptwriting'
    'Unity/Unreal' = 'Storyboarding'
    'Interactive Installations' = 'Art Direction'
    'AR and VR Experiences' = 'Treatment Creation'
    'Procedural Modeling' = 'Direction'
    '3D Asset Creation' = 'Live-Action Production'
    '3D Optimization' = 'Crew Coordination'
    'Animation' = 'Production Management'
    '3D Pipeline Development' = 'On-Set Execution'
    'Is Your Big Idea Ready to Go Wild?' = 'Need a production partner from first idea to final delivery?'
  }
  foreach ($key in $replacements.Keys) { $text = $text.Replace($key, $replacements[$key]) }
  $text = $text.Replace('The Bricks is a creative production house that believes in creating impactful, story-driven productions and supports clients at every stage from concept to delivery.', 'The Bricks is a creative production house that believes in creating impactful, story-driven productions that achieve clients’ objectives. We support clients at every stage from concept to final delivery.')
  $text = $text.Replace('The Bricks is a creative production house that believes in creating impactful, story-driven productions that achieve clients’ objectives. We handle the entire creative process in-house from concept to final delivery.', 'The Bricks is a creative production house that believes in creating impactful, story-driven productions that achieve clients’ objectives. We handle the entire creative process in-house from concept to final delivery.')
  $text = $text.Replace('mailto:hello@lusion.co', 'mailto:hello@thebricks.com')
  $text = $text.Replace('mailto:business@lusion.co', 'mailto:business@thebricks.com')
  $text = $text.Replace('https://twitter.com/lusionltd/', '#')
  $text = $text.Replace('https://www.instagram.com/lusionltd/', '#')
  $text = $text.Replace('https://www.linkedin.com/company/lusionltd/', '#')
  $text = $text.Replace('https://labs.lusion.co/', '#')
  $text = $text.Replace('https://labs.lusion.co', '#')
  $text = $text.Replace('R&D: labs.lusion.co', 'Production / The Bricks')
  $text = $text.Replace('Built by Lusion with ❤️', 'Built by The Bricks with craft')
  $text = $text.Replace('©2026 LUSION Creative Studio', '©2026 THE BRICKS Creative Production House')
  $text = $text.Replace('https://lusion.co/assets/meta/social_sharing.jpg', '/assets/meta/social_sharing.jpg')
  $text
}

# Projects page
Update-File "$root\projects\index.html" {
  param($text)
  $text = $text.Replace('Lusion - Our Projects', 'The Bricks - Projects')
  $text = $text.Replace('Lusion works with a wide range of clients including global brands, startups and agencies.', 'The Bricks creates story-driven productions and supports clients at every stage from concept to delivery.')
  $text = $text.Replace('Projects', 'Projects')
  for ($i = 0; $i -lt $oldSlugs.Count; $i++) {
    $text = $text.Replace('href="/projects/' + $oldSlugs[$i] + '"', 'href="/projects/' + $newSlugs[$i] + '"')
    $text = $text.Replace('data-id="' + $oldSlugs[$i] + '"', 'data-id="' + $newSlugs[$i] + '"')
    $text = $text.Replace($oldSlugs[$i].Replace('_', ' '), $newTitles[$i])
    $text = $text.Replace($newTitles[$i], $newTitles[$i])
    $text = $text.Replace($oldTags[$i], $newTags[$i])
  }
  $text = $text.Replace('Oryzo AI', 'Brand Anthem Film')
  $text = $text.Replace('Of The Oak', 'Product Launch Campaign')
  $text = $text.Replace('Devin AI', 'Social Content Series')
  $text = $text.Replace('Porsche: Dream Machine', 'Documentary Short')
  $text = $text.Replace('Synthetic Human', 'Event Recap Film')
  $text = $text.Replace('DDD 2024', 'Founder Story')
  $text = $text.Replace('Spaace - NFT Marketplace', 'Commercial Spot')
  $text = $text.Replace('Choo Choo World', 'Recruitment Campaign')
  $text = $text.Replace('Zero Tech', 'Testimonial Series')
  $text = $text.Replace('Meta: Spatial Fusion', 'Product Demo Film')
  $text = $text.Replace('Worldcoin Globe', 'Behind the Scenes Content')
  $text = $text.Replace('Lusion Labs', 'Case Study Film')
  $text = $text.Replace('My Little Storybook', 'Launch Teaser')
  $text = $text.Replace('Soda Experience', 'Culture Campaign')
  $text = $text.Replace('Infinite Passerella', 'Explainer Film')
  $text = $text.Replace('The Turn Of The Screw', 'Campaign Toolkit')
  $text = $text.Replace('Max Mara: Bearing Gifts', 'Brand Story Series')
  $text = $text.Replace('concept • web • design • development • 3d • animation', 'concept • production • post')
  $text = $text.Replace('web • design • development • 3d • animation', 'strategy • production • delivery')
  $text = $text.Replace('web • design • development • 3d', 'creative • production • cutdowns')
  $text = $text.Replace('concept • 3D illustration • mograph • video', 'research • direction • edit')
  $text = $text.Replace('web • design • development • 3d • web3', 'capture • edit • motion graphics')
  $text = $text.Replace('concept • web • game design • 3d', 'interviews • narrative • post')
  $text = $text.Replace('api design • webgl • 3d', 'treatment • production • finishing')
  $text = $text.Replace('AR • development • 3d', 'strategy • production • edit')
  $text = $text.Replace('development • 3D', 'concept • production • delivery')
  $text = $text.Replace('concept • design • development • 3d', 'scripting • studio shoot • post')
  $text = $text.Replace('design • development • 3d', 'capture • edit • social assets')
  $text = $text.Replace('development • 3d', 'interviews • edit • sound')
  $text = $text.Replace('web • design • development • 3d', 'concept • motion • finishing')
  $text = $text.Replace('web • design • development • 3d • web3', 'creative • production • cutdowns')
  $text = $text.Replace('web • design • development • 3d • animation', 'scripting • motion • voiceover')
  $text = $text.Replace('concept • web • design • development • 3d • animation', 'film • edits • platform versions')
  $text = $text.Replace('Where Your Big Idea Ready to Go Wild?', 'Ready to create something with purpose?')
  $text = $text.Replace('Is Your Big Idea Ready to Go Wild?', 'Ready to create something with purpose?')
  $text = $text.Replace('mailto:hello@lusion.co', 'mailto:hello@thebricks.com')
  $text = $text.Replace('mailto:business@lusion.co', 'mailto:business@thebricks.com')
  $text = $text.Replace('https://twitter.com/lusionltd/', '#')
  $text = $text.Replace('https://www.instagram.com/lusionltd/', '#')
  $text = $text.Replace('https://www.linkedin.com/company/lusionltd/', '#')
  $text = $text.Replace('https://labs.lusion.co/', '#')
  $text = $text.Replace('https://labs.lusion.co', '#')
  $text = $text.Replace('R&D: labs.lusion.co', 'Production / The Bricks')
  $text = $text.Replace('Built by Lusion with ❤️', 'Built by The Bricks with craft')
  $text = $text.Replace('©2026 LUSION Creative Studio', '©2026 THE BRICKS Creative Production House')
  $text = $text.Replace('https://lusion.co/assets/meta/social_sharing.jpg', '/assets/meta/social_sharing.jpg')
  $text = $text.Replace('Lusion - Our Projects', 'The Bricks - Projects')
  $text
}

# Duplicate root pages -> redirect stubs
Set-Content -LiteralPath "$root\about.html" -Value '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/about/"><title>The Bricks - About Us</title></head><body><p>Redirecting to <a href="/about/">The Bricks About page</a>.</p></body></html>' -NoNewline
Set-Content -LiteralPath "$root\projects.html" -Value '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/projects/"><title>The Bricks - Projects</title></head><body><p>Redirecting to <a href="/projects/">The Bricks Projects page</a>.</p></body></html>' -NoNewline

# Placeholder team data
Set-Content -LiteralPath "$root\assets\team\team.json" -Value @'
[
  {"id":"member-01","name":"The Bricks Team","role":"Creative Production House"},
  {"id":"member-02","name":"Placeholder Team Member","role":"Strategy"},
  {"id":"member-03","name":"Placeholder Team Member","role":"Creative"},
  {"id":"member-04","name":"Placeholder Team Member","role":"Production"},
  {"id":"member-05","name":"Placeholder Team Member","role":"Post-Production"},
  {"id":"member-06","name":"Placeholder Team Member","role":"Project Management"},
  {"id":"member-07","name":"Placeholder Team Member","role":"Operations"}
]
'@ -NoNewline

'REWRITE_DONE'
