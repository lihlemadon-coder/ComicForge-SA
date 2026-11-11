# ComicForge SA — Product Plan (Historic Fantasy Edition)

## Vision
A 100% free, offline-first, single-page web app that helps a solo creator turn one-line ideas into South African historic-fantasy comics, then adapt those comics into 5–7 minute motion-comic anime episodes. No paid APIs. No backend. No team.

## Core Principle
**Story First → Comic → Anime.** No anime without a comic. Every motion-comic shot traces back to a comic panel, which traces back to a story beat.

## Your Specific Story: "Izulu laseMzansi" (Working Title)
- **Setting:** Rural KwaZulu-Natal, historic fantasy.
- **Protagonist:** Teenage cowherd with 3 dogs (black male Rottweiler; gold-brown Golden Retriever with white spots and white "sock" front paws; energetic mixed-breed male pup).
- **Inciting incident:** Lion attack while herding → finds a red gem → visions of the past and a boy named Mkhululi.
- **Magic:** Clan-based elements (Zulu = Fire/Lightning, SiSwati = Air, plus Water, Earth, Nature). Mixed DNA = hybrid powers.
- **Antagonists:** Dark magic users from across the sea (void/ash/shadow magic, not tied to any known element).
- **Culture:** isiZulu dialogue with English subtitles; rural ancestral traditions (tikoloshe, isangoma, ancestors).
- **Format:** Motion comic (pan/zoom over comic art, lip-sync placeholders), released weekly.

## User Flow (v1)
1. Open app → Dashboard (My Series, My Characters, My Episodes, My Comics)
2. Create New Series → Mode: Start From Scratch OR Continue Storyline
3. Story Engine → expand one-liner into title, logline, genre, theme, 3-act structure
4. Character Engine → build Character Bible + Relationship Map
5. Scene breaker → Cold Open, Act 1, Act 2, Climax, Ending, Cliffhanger
6. Comic Builder → Pages > Panels; visual prompts, dialogue, narration, SFX
7. Read Mode → flip-through comic reader
8. Export comic → images + HTML eBook wrapper + cover + table of contents
9. Anime Adaptation Mode → comic page → motion-comic shot list (camera, movement, voice line, sound cue, duration; 300–420 seconds total)
10. Export anime package → Script PDF + Shot List + Voice Script
11. Auto-save to localStorage; Export/Import project JSON

## Feature Priority

### Must Have for v1 (MVP)
- localStorage auto-save + Export/Import JSON
- Story From Scratch: one-line idea → title, logline, genre, theme, 3-act structure
- Continue Storyline: load last episode + character states + story bible
- Character Creator: name, age, SA background, languages, personality, powers, weakness, goal, secret, arc
- Character Bible auto-update after each chapter
- Scene breaker with continuity tracker (no dead characters appearing, no unexplained power changes)
- Comic Builder: manual page > panel split; panel visual prompt, dialogue, narration, SFX; speech/thought/narration bubble CSS placeholders
- Read Mode (flip-through)
- Export comic as images + HTML eBook wrapper
- Anime Adaptation Mode: comic page → motion-comic shot list with duration math (5–7 min target)
- Progress tracker: Idea → Story → Characters → Comic → Anime Blueprint → Done
- Dashboard: My Series, Characters, Episodes, Comics

### Nice to Have for v2
- IndexedDB for larger storage
- Random SA side-character generator (Zulu names, rural KZN vibes)
- Relationship Map visual
- Auto-split story into panels (template logic)
- PDF export for comic (browser print CSS)
- Basic drawing canvas placeholder inside panels
- isiZulu ↔ English toggle for comic text

### Later (v3+)
- Frame-by-frame animation tools
- Audio recording for voice lines
- Online gallery / weekly episode hosting
- Optional paid AI image integration (user brings own key)

## Constraints
- Zero cost: HTML/CSS/vanilla JS only. No server, no paid AI, no paid domain.
- Works offline after first load.
- Hosts free on GitHub Pages / Netlify.
- Single developer. Data is portable JSON.