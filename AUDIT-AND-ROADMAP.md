# ComicForge SA: code review and completion plan

## Feature branch progress

Implemented in `feature/complete-creation-workflows`: editable story template, character add/edit/delete, scene add/edit/delete with cast continuity warnings, comic page and panel workflows, URL artwork, page navigation, HTML comic export, editable anime shots with duration balancing/export, safer project import, bundled South African background prompts, local series memory, and responsive navigation. All JavaScript files pass `node --check`; remaining work includes richer character presets/relationships, image file storage, scene reorder and language/subtitles, custom background management, complete camera/music/voice tooling, and broader automated/browser coverage.

## Fixed in this pass

- Removed the duplicate Characters page ID and gave the comic mark a comic-page and action-burst design.
- Fixed the story view so it uses the existing UI renderer, and connected premise expansion to the Story Engine instead of placeholder text.
- Added per-series memory fields for canon, continuity notes, and creator notes. These are stored in the existing browser storage and travel with project JSON exports. The Settings page now provides a notes editor.
- Fixed project-index recovery when the index is missing and excluded the index record from the project list.
- Corrected dark theme contrast so cards and text are readable together.
- Corrected the malformed story button markup and restored the missing method separator in the UI object.

## Findings that still need implementation

1. **The feature views are mostly project lists.** Character, Scene, Comic, Read Mode, and Anime views need selected-project editors and end-to-end create, edit, delete, save, and preview flows. The underlying model helpers exist, but most are not connected to controls.
2. **Scene continuity is not implemented.** Add scene CRUD, character selection, status checks, and warnings for deceased characters or unsupported changes to established canon. Record accepted changes in series memory.
3. **Comic building needs a real page workflow.** Connect `ComicBuilder` to page and panel controls, persist fields, support panel images or user uploads, add reader navigation, and make export include actual comic content.
4. **Anime generation needs truthful timing and editable shots.** The current adapter produces generic fixed camera values, can add a single oversized remainder shot, and receives no connection to story beats. Add editable shot controls, duration validation, voice script export, and an explicit 300–420 second target.
5. **Background presets are not applied.** The current selection only displays a prompt in an alert. Build a searchable library with location, time, weather, mood, and visual detail fields; insert chosen prompts into panels/scenes and allow user-created presets.
6. **Character presets are awkwardly wired.** The UI encodes preset JSON into inline handlers while the app opens a separate prompt. Use data-backed buttons and a proper character editor; escape user content before rendering it into HTML.
7. **Memory needs visible controls and safeguards.** Current browser storage is local to one browser profile and can be cleared. Add export/import backup reminders, memory search, editable canon items, and a continuity summary. Consider IndexedDB for image-heavy projects.
8. **The app calls itself AI-powered but has no AI connection.** The current Story Engine is a local template generator. Keep it offline and describe it as such, or add an optional provider adapter with user-managed credentials and clear privacy controls.
9. **Project reliability needs polishing.** Add empty-state navigation, autosave on every editor change, storage quota feedback, safe import validation, escaping/sanitization of user text, unique IDs, and recovery after malformed stored data.
10. **The cultural writing system needs better controls.** Add optional setting/cultural context, language tags and subtitle fields, pronunciation/translation notes, and a creator-owned cultural accuracy checklist. Avoid assigning personality or power traits solely from ethnic identity; treat the current story bible's clan-element mappings as fictional worldbuilding rather than factual claims.
11. **Visual and accessibility work remains.** Add coherent mobile navigation (currently the sidebar disappears), keyboard focus states, semantic buttons, readable form labels, and an illustrated South African landscape treatment that stays behind content with sufficient contrast.

## Suggested completion order

1. Finish story, memory, character, and scene editing with persistent autosave.
2. Connect page/panel creation, image handling, read mode, and comic export.
3. Connect editable anime shots and validate duration math.
4. Apply background and character libraries through safe controls.
5. Add import/export resilience, mobile/accessibility polish, and cultural review affordances.

The current app is offline-first and has localStorage persistence, but it is not yet a complete comic production tool. A static app can reliably provide templates and continuity tools; generative image or language output requires either authored templates or an optional external AI service.
