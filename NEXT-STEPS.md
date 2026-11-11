# ComicForge SA — Next Steps (First 7 Days)

Goal: Finish the smallest MVP in 7 days. One person.

## Definition of Done (Day 7)
Open the app → type one-line Zulu historic-fantasy idea → get title, logline, 3-act structure → save → reload → still there → export JSON → import JSON → done.

## Day 1 — Scaffold & Storage
- Create folder `ComicForge-SA` on Desktop
- `index.html` with shell: header, sidebar (Dashboard), main content area
- `js/storage.js`: `saveProject`, `loadProject`, `listProjects`, `exportJSON`, `importJSON`
- Wire Save/Load buttons to localStorage
- Deploy to GitHub Pages (prove hosting works)

## Day 2 — Story From Scratch
- Form: one-line idea textarea
- Button "Expand Story" → fills title, logline, genre, theme, 3-act structure (template logic; no AI)
- Display result on screen
- Auto-save to localStorage

## Day 3 — Continue Storyline + Characters
- "Continue Storyline" mode: load saved story, show last episode summary
- Character Creator form (name, age, background, languages, powers, weakness, goal, secret, arc)
- Character list: view/edit/delete
- Link one character to the story

## Day 4 — Scene Breaker + Continuity
- Scene UI: Cold Open, Act 1, Act 2, Climax, Ending, Cliffhanger
- Fields per scene: location, characters, goal, conflict, dialogue beats, visual description
- Continuity check: warn if character is "dead" but added to a scene

## Day 5 — Comic Builder (Basic)
- Create comic linked to story
- Add pages; add panels to a page
- Panel fields: visual prompt, dialogue, narration, SFX
- Simple placeholder image box (colored rectangle with text)

## Day 6 — Read Mode + Export
- Read Mode: flip through comic pages fullscreen
- Export: download comic as HTML eBook + images + cover + table of contents
- Progress tracker: Idea → Story → Characters → Comic → Anime Blueprint → Done

## Day 7 — Anime Blueprint + Polish
- Anime Adaptation: convert comic pages to motion-comic shot list with duration seconds (target 300–420s)
- Export: Script PDF (print CSS) + Shot List + Voice Script
- Final bugfix, mobile check, offline test
- Write README; publish

## After Day 7
- Month 1+: Relationship Map, Random SA character generator, PDF comic export, Animatic Checklist
- Month 2+: Motion-comic storyboard side-by-side, drawing placeholders
- Month 3+: Polish, sample project, final launch