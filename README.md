# ComicForge SA — AI Comic & Short Anime Creator

A 100% free, offline-first, single-page web app that helps solo creators turn one-line ideas into South African historic-fantasy comics, then adapt those comics into 5–7 minute motion-comic anime episodes.

**No paid APIs. No backend. No database server. No team.** HTML/CSS/vanilla JavaScript only. Works offline. Host free on GitHub Pages / Netlify.

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
| **Story Engine** | Start From Scratch (one-line → title, logline, genre, theme, 3-act structure, cold open, cliffhanger) |
| **Continue Storyline** | Load last episode summary, character states, next episode goal |
| **Character Bible** | Full CRUD: name, age, SA background, languages, personality, powers, weakness, goal, secret, arc, dog bond, status |
| **Scene Breaker** | Cold Open / Act 1 / Act 2 / Climax / Ending / Cliffhanger with location, goal, conflict, dialogue, visual, characters |
| **Continuity Tracker** | Warns if a deceased character is added to a scene |
| **Comic Builder** | Pages > Panels with visual prompt, dialogue, narration, SFX |
| **Read Mode** | Flip-through comic reader |
| **Comic Export** | Download as standalone HTML eBook |
| **Anime Blueprint** | Comic pages → motion-comic shot list (camera, movement, voice line, sound cue, duration) |
| **Anime Export** | Shot list + voice script as HTML |
| **Progress Tracker** | Idea → Story → Characters → Comic → Anime Blueprint → Done |

---

1. **Clone or download** this repository
2. **Open `index.html`** in any modern browser — works offline immediately
3. **Create a project** → enter your series name
4. **Build your story** → one-line idea → expanded story
5. **Create characters** → link them to your story
6. **Break into scenes** → continuity-checked scene builder
7. **Build comic** → pages > panels > visual prompts + dialogue
8. **Read mode** → flip through your comic
9. **Anime blueprint** → convert comic to motion-comic shot list
10. **Export** → download JSON backup or HTML eBook / anime script

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