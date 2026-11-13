# ComicForge SA — AI Comic & Short Anime Creator

A free, offline-first, single-page web app that helps solo creators develop stories, characters, scenes, comics, and motion-comic plans grounded in South African settings and voices.

**No APIs or backend are required.** HTML/CSS/vanilla JavaScript only. The story engine uses local writing templates; it does not generate AI text or images. Project data is stored in this browser and can be exported as JSON. Host on GitHub Pages / Netlify or open locally.

---

## 🎯 The Story (v1 Focus)

**"Izulu laseMzansi"** — Historic fantasy set in rural KwaZulu-Natal.

- **Protagonist:** Teenage cowherd with 3 dogs:
  - Black male Rottweiler (loyal, protective)
  - Golden Retriever — gold-brown with white spots, white "sock" front paws
  - Energetic mixed-breed male pup (from the other two)
- **Inciting incident:** Lion attack while herding → finds a red gem → visions of the past and a boy named **Mkhululi**
- **Magic:** Clan-based elements (Zulu = Fire/Lightning, SiSwati = Air, Xhosa = Water, Ndebele = Earth, Sotho/Tswana = Nature). Mixed DNA = hybrid powers.
- **Antagonists:** Dark magic users from across the sea (Void/Shadow/Ash magic — not tied to any known element)
- **Culture:** isiZulu dialogue with English subtitles; rural ancestral traditions (tikoloshe, isangoma, ancestors)
- **Format:** Motion comic (pan/zoom over comic art, lip-sync placeholders), released weekly

---

## 📁 Project Structure
```
ComicForge-SA/
├── index.html              # Single-page app shell
├── README.md               # This file
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
├── css/
│   ├── reset.css           # CSS reset
│   ├── variables.css       # SA-inspired design tokens
│   ├── layout.css          # Grid layout (sidebar + main)
│   └── components.css      # Buttons, cards, inputs, bubbles
├── js/
│   ├── storage.js          # localStorage layer (save/load/export/import)
│   └── app.js              # App controller (all 7 days of MVP features)
└── assets/                 # (placeholders for icons, sample data)
```

---

## 🚀 Features (v1 MVP — Complete)

| Module | Features |
|--------|----------|
| **Storage** | localStorage auto-save, Export/Import project JSON, portable data |
| **Dashboard** | My Series list, create/delete projects, status tracking |
| **Story Engine** | Local template: premise → title, logline, theme, three acts, cold open, cliffhanger; fields remain editable |
| **Series Memory** | Browser-local canon, continuity overrides, and creator notes; included in JSON exports |
| **Character Bible** | Add, edit, and delete characters with setting, languages, personality, abilities, goals, secrets, arcs, and status |
| **Scene Breaker** | Add, edit, and delete beats with location, goal, conflict, dialogue, visual description, and cast; warns about deceased or unknown characters |
| **Background Library** | South African location prompts can be applied to the next comic panel |
| **Comic Builder** | Add/delete pages and panels; edit prompts, dialogue, narration, sound effects, and artwork URL |
| **Read Mode** | Navigate pages and read panel text or artwork URLs |
| **Comic Export** | Download a standalone HTML version of the comic |
| **Anime Blueprint** | Generate editable motion-comic shots from panels, distribute a 300–420 second runtime, and export the shot list |
| **Progress Tracker** | Idea → Story → Characters → Comic → Anime Blueprint → Done |

---

1. **Clone or download** this repository
2. **Open `index.html`** in a modern browser (or serve the folder locally)
3. **Create a project** → enter your series name
4. **Build your story** → enter a premise, then edit the generated template
5. **Create characters** → link them to your story
6. **Break into scenes** → save story beats with continuity warnings
7. **Build comic** → pages > panels > visual prompts + dialogue
8. **Read mode** → flip through your comic
9. **Anime blueprint** → convert comic to motion-comic shot list
10. **Export** → download JSON backup or HTML comic / anime shot list

---

## 📦 Deploy to GitHub Pages (Free)

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch** → `main` (or `master`) → `/ (root)`
4. Click **Save**
5. Your app is live at `https://lihlemadon-coder.github.io/ComicForge-SA/`

Or deploy to **Netlify Drop** — drag and drop the folder.

---

## 💾 Data Model (JSON)

All data is stored in `localStorage` and portable as JSON:

```json
{
  "id": "proj_123",
  "name": "Izulu laseMzansi",
  "status": "idea",
  "language": "zul",
  "story": {
    "oneLineIdea": "...",
    "title": "...",
    "logline": "...",
    "genre": "Historic Fantasy / Zulu",
    "theme": "...",
    "threeActStructure": "...",
    "scenes": [...],
    "characterIds": ["char_1", "char_2"]
  },
  "characters": [
    {
      "id": "char_1",
      "name": "Sizwe",
      "age": 16,
      "background": "rural KZN",
      "languages": ["isiZulu", "English"],
      "personality": ["brave", "curious", "loyal"],
      "powers": ["fire"],
      "weakness": "...",
      "goal": "...",
      "secret": "...",
      "arc": "...",
      "dogBond": "rottweiler",
      "alive": true
    }
  ],
  "comic": {
    "title": "...",
    "pages": [{ "number": 1, "panels": [...] }]
  }
}
```

---

## 🗺️ Roadmap

- **Week 1:** Foundation + Story Engine ✅
- **Week 2:** Character Bible ✅
- **Month 1:** Comic Builder ✅
- **Month 2:** Anime Adaptation (Motion Comic) ✅
- **Month 3:** Polish + Release v1

### v2 (Nice to Have)
- IndexedDB for larger storage
- Random SA side-character generator
- Relationship Map visual
- PDF export for comic
- Drawing canvas inside panels
- isiZulu ↔ English toggle

### v3 (Later)
- Frame-by-frame animation tools
- Audio recording for voice lines
- Online gallery / weekly episode hosting

---

## Current Limits

- Story structures are template-based, not AI generated. There is no AI image generation.
- Project memory is stored only in the current browser profile. Export JSON for backup or transfer.
- Panel artwork is linked by URL or relative path; this version does not upload image files into the project.
- Scene continuity checks catch unknown or deceased character names, but do not understand plot canon automatically.

## 🙏 Cultural Commitment

This project celebrates South African culture — Zulu, SiSwati, Xhosa, Ndebele, Sotho/Tswana traditions — mixed with fantasy. **No stereotypes.** Characters are people first. Magic grows from real belief systems (ancestors, isangoma, tikoloshe). Research deeply before finalizing cultural elements.

---

## 📄 License

MIT License — free for personal and commercial use.

---

## 👤 Author

**lihlemadon-coder** — Solo developer building ComicForge SA in public.

https://github.com/lihlemadon-coder/ComicForge-SA
## 🛠️ How to Run
