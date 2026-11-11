/* ComicForge SA — App Controller (Day 1 MVP) */
const app = {
  currentProjectId: null,
  currentView: 'dashboard',

  init() {
    this._bindUI();
    this.renderDashboard();
    this._startAutosaveHeartbeat();
  },

  _bindUI() {
    document.getElementById('btn-new-project').addEventListener('click', () => this.newProject());
    document.getElementById('btn-export').addEventListener('click', () => storage.exportAll());
    document.getElementById('input-import').addEventListener('change', (e) => {
      if (e.target.files[0]) {
        storage.importFromFile(e.target.files[0], (err, count) => {
          if (err) alert('Import failed: ' + err.message);
          else {
            alert(`Imported ${count} project(s).`);
            e.target.value = '';
            this.renderDashboard();
          }
        });
      }
    });
  },

  showView(viewName, projectId = null) {
    this.currentView = viewName;
    if (projectId) this.currentProjectId = projectId;
    document.querySelectorAll('[data-view]').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById('view-' + viewName);
    if (target) target.classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const nav = document.getElementById('nav-' + viewName);
    if (nav) nav.classList.add('active');
    switch (viewName) {
      case 'dashboard': this.renderDashboard(); break;
      case 'story': this.renderStory(); break;
      case 'character': this.renderCharacters(); break;
      case 'scenes': this.renderScenes(); break;
      case 'comic': this.renderComic(); break;
      case 'readmode': this.renderReadMode(); break;
      case 'anime': this.renderAnime(); break;
      default: this._renderComingSoon(viewName);
    }
  },

  _renderComingSoon(viewName) {
    const container = document.getElementById('view-' + viewName).querySelector('.view-content');
    container.innerHTML = `
      <div class="empty-state">
        <h2>${viewName.charAt(0).toUpperCase() + viewName.slice(1)}</h2>
        <p>Coming in v2. Build your story first!</p>
      </div>
    `;
  },

  newProject() {
    const name = prompt('Enter series name:');
    if (!name) return;
    const id = 'proj_' + Date.now();
    const project = {
      name,
      status: 'idea',
      language: 'zul',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      story: null,
      characters: [],
      episodes: [],
      comics: [],
      animeBlueprint: null
    };
    storage.saveProject(id, project);
    this.currentProjectId = id;
    this.showView('story', id);
  },

  loadProject(id) {
    const project = storage.loadProject(id);
    if (!project) return;
    this.currentProjectId = id;
    this.showView('story', id);
  },

  deleteProject(id) {
    if (!confirm('Delete this series? This cannot be undone.')) return;
    storage.deleteProject(id);
    this.renderDashboard();
  },

  renderDashboard() {
    const container = document.getElementById('view-dashboard').querySelector('.view-content');
    const index = storage.getProjectIndex();
    const ids = Object.keys(index);
    let html = `
      <div class="card" style="margin-bottom:1rem;">
        <h3>Create New Series</h3>
        <p>Start your South African historic-fantasy comic and anime journey.</p>
        <button class="btn btn-primary" id="btn-create">Create New Project</button>
      </div>
      <div class="card">
        <h3>My Series</h3>
    `;
    if (ids.length === 0) {
      html += `<div class="empty-state" style="height:auto;"><p>No projects yet. Create your first series to begin.</p></div>`;
    } else {
      html += `<div style="display:flex; flex-direction:column; gap:0.5rem;">`;
      for (const id of ids) {
        const p = index[id];
        html += `
          <div class="list-item" onclick="app.loadProject('${id}')">
            <h4>${p.name}</h4>
            <p>Status: <span class="badge">${p.status}</span> &bull; Last updated: ${new Date(p.updatedAt).toLocaleDateString()}</p>
            <div style="margin-top:0.5rem; display:flex; gap:0.5rem;">
              <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); app.loadProject('${id}')">Open</button>
              <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); app.deleteProject('${id}')">Delete</button>
            </div>
          </div>
        `;
      }
      html += `</div>`;
    }
    html += `</div>`;
    container.innerHTML = html;
    document.getElementById('btn-create').addEventListener('click', () => this.newProject());
  },
  renderStory() {
    const project = storage.loadProject(this.currentProjectId);
    if (!project) return;
    const container = document.getElementById('view-story').querySelector('.view-content');
    const story = project.story || {};
    const hasStory = !!story.title;
    container.innerHTML = `
      <div class="card" style="margin-bottom:1rem;">
        <h3>Story Engine</h3>
        <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
          <button class="btn ${!hasStory || true ? 'btn-primary' : 'btn-ghost'}" id="btn-mode-scratch">Start From Scratch</button>
          <button class="btn ${hasStory ? 'btn-primary' : 'btn-ghost'}" id="btn-mode-continue">Continue Storyline</button>
        </div>
        <div id="story-mode-scratch" style="display:block;">
          <div class="card">
            <h4>Story From Scratch</h4>
            <div class="input-group"><label>One-line idea</label><textarea id="story-one-line" rows="3" placeholder="e.g. A boy in rural KZN herding cows finds a red gem after surviving a lion attack...">${story.oneLineIdea || ''}</textarea></div>
            <button class="btn btn-primary btn-sm" id="btn-expand-story">Expand Story</button>
          </div>
          <div id="story-result" class="card" style="${hasStory ? '' : 'display:none;'}">
            <h3>Expanded Story</h3>
            <div class="grid-2"><div class="input-group"><label>Title</label><input id="story-title" value="${story.title || ''}"></div><div class="input-group"><label>Genre</label><input id="story-genre" value="${story.genre || 'Historic Fantasy'}"></div></div>
            <div class="input-group"><label>Logline</label><textarea id="story-logline" rows="2">${story.logline || ''}</textarea></div>
            <div class="input-group"><label>Theme</label><input id="story-theme" value="${story.theme || ''}"></div>
            <div class="input-group"><label>3-Act Structure</label><textarea id="story-three-act" rows="4">${story.threeActStructure || ''}</textarea></div>
            <div class="input-group"><label>Cold Open (0–1 min)</label><textarea id="story-cold-open" rows="2">${story.coldOpen || ''}</textarea></div>
            <div class="input-group"><label>Cliffhanger</label><input id="story-cliffhanger" value="${story.cliffhanger || ''}"></div>
          </div>
        </div>
        <div id="story-mode-continue" style="display:${hasStory ? 'block' : 'none'};"></div>
      </div>
    `;
    document.getElementById('btn-mode-scratch').addEventListener('click', () => {
      document.getElementById('story-mode-scratch').style.display = 'block';
      document.getElementById('story-mode-continue').style.display = 'none';
      document.getElementById('btn-mode-scratch').className = 'btn btn-primary';
      document.getElementById('btn-mode-continue').className = 'btn btn-ghost';
    });
    document.getElementById('btn-mode-continue').addEventListener('click', () => {
      document.getElementById('story-mode-scratch').style.display = 'none';
      document.getElementById('story-mode-continue').style.display = 'block';
      document.getElementById('btn-mode-continue').className = 'btn btn-primary';
      document.getElementById('btn-mode-scratch').className = 'btn btn-ghost';
      this.renderContinueStoryline();
    });
    document.getElementById('btn-expand-story').addEventListener('click', () => {
      const oneLine = document.getElementById('story-one-line').value.trim();
      if (!oneLine) { alert('Please enter a one-line idea first.'); return; }
      const expanded = this._expandStory(oneLine);
      document.getElementById('story-title').value = expanded.title;
      document.getElementById('story-genre').value = expanded.genre;
      document.getElementById('story-logline').value = expanded.logline;
      document.getElementById('story-theme').value = expanded.theme;
      document.getElementById('story-three-act').value = expanded.threeActStructure;
      document.getElementById('story-cold-open').value = expanded.coldOpen;
      document.getElementById('story-cliffhanger').value = expanded.cliffhanger;
      project.story = { oneLineIdea: oneLine, title: expanded.title, genre: expanded.genre, logline: expanded.logline, theme: expanded.theme, threeActStructure: expanded.threeActStructure, coldOpen: expanded.coldOpen, cliffhanger: expanded.cliffhanger, language: project.language || 'zul' };
      storage.saveProject(this.currentProjectId, project);
      document.getElementById('story-result').style.display = 'block';
      this._showAutosave();
    });
    if (hasStory) {
      document.getElementById('story-one-line').value = story.oneLineIdea || '';
      document.getElementById('story-title').value = story.title;
      document.getElementById('story-genre').value = story.genre;
      document.getElementById('story-logline').value = story.logline;
      document.getElementById('story-theme').value = story.theme;
      document.getElementById('story-three-act').value = story.threeActStructure;
      document.getElementById('story-cold-open').value = story.coldOpen;
      document.getElementById('story-cliffhanger').value = story.cliffhanger;
      document.getElementById('story-result').style.display = 'block';
    }
  },
  _expandStory(oneLine) {
    const lower = oneLine.toLowerCase();
    let title = 'The Red Gem of ';
    if (lower.includes('kzn') || lower.includes('zulu') || lower.includes('kwazulu')) title += 'KwaZulu-Natal';
    else if (lower.includes('mabopane')) title += 'Mabopane';
    else if (lower.includes('soweto')) title += 'Soweto';
    else if (lower.includes('johannesburg')) title += 'Johannesburg';
    else title += 'the Valley';
    let logline = `A teenage cowherd survives a lion attack and discovers a red gem that unlocks ancestral visions of Mkhululi, awakening Zulu fire-powers that threaten the dark magic users crossing the sea.`;
    if (lower.includes('lion')) logline = `After surviving a lion attack while herding cows, a teenage boy finds a red gem that floods his mind with visions of the past—and awakens powers long forgotten by his clan.`;
    let genre = 'Historic Fantasy / Zulu';
    let theme = 'Ancestral memory and the cost of power';
    let threeActStructure = `Act 1 (Setup): The boy herds cows in rural KZN with his three dogs—a black Rottweiler, a golden retriever with white socks, and an energetic mixed-breed pup. A lion attacks; the dogs save him. He finds a red gem near the kill site.
Act 2 (Confrontation): Touching the gem, visions of Mkhululi flood in. The boy discovers he can spark fire. An isangoma warns him. Tikoloshe sightings increase. A ship appears on the horizon.
Act 3 (Resolution): The boy must master his fire before the dark magic users from across the sea claim the gem and sever the ancestors from the living.`;
    let coldOpen = 'Dawn at the cattle post. The boy counts his herd. A lion roars from the valley. The dogs stand between the boy and the beast.';
    let cliffhanger = 'The gem glows red, and a voice that is not his own whispers: "Mkhululi remembers."';
    return { title, logline, genre, theme, threeActStructure, coldOpen, cliffhanger };
  },

  _showAutosave() {
    const indicator = document.getElementById('autosave-indicator');
    if (indicator) indicator.style.opacity = '1';
    setTimeout(() => { if (indicator) indicator.style.opacity = '0.6'; }, 1500);
  },

  _startAutosaveHeartbeat() {
    setInterval(() => {
      if (this.currentProjectId) {
        const indicator = document.getElementById('autosave-indicator');
        if (indicator) indicator.style.opacity = '1';
        setTimeout(() => { if (indicator) indicator.style.opacity = '0.6'; }, 800);
      }
    }, 5000);
  },

  renderContinueStoryline() {
    const project = storage.loadProject(this.currentProjectId);
    if (!project) return;
    const container = document.getElementById('view-story').querySelector('.view-content');
    const story = project.story || {};
    let html = `
      <div class="card">
        <h3>Continue Storyline</h3>
        <p>Pick up where you left off. Your Story Bible and character states are loaded below.</p>
        <div class="input-group"><label>Last Episode Summary</label><textarea id="continue-last-episode" rows="3">${story.lastEpisodeSummary || ''}</textarea></div>
        <div class="input-group"><label>Next Episode Goal</label><input id="continue-next-goal" value="${story.nextEpisodeGoal || ''}"></div>
        <h4 style="margin-top:1rem; color:var(--accent-secondary);">Character States (from Character Bible)</h4>
        <div id="continue-character-list" style="margin-bottom:1rem;"></div>
        <div class="grid-2"><div class="input-group"><label>Cold Open</label><input id="continue-cold-open" value="${story.coldOpen || ''}"></div><div class="input-group"><label>Cliffhanger</label><input id="continue-cliffhanger" value="${story.cliffhanger || ''}"></div></div>
        <button class="btn btn-primary btn-sm" id="btn-save-continue">Save Episode Progress</button>
      </div>
    `;
    container.innerHTML = html;
    const charList = document.getElementById('continue-character-list');
    const chars = project.characters || [];
    if (chars.length > 0) {
      let charHtml = '<div style="display:flex; flex-direction:column; gap:0.5rem;">';
      for (const c of chars) {
        charHtml += `<div class="list-item"><h4>${c.name}</h4><p>Status: ${c.alive !== false ? 'Alive' : 'Deceased'} &bull; Last seen: ${c.lastSeen || 'Not yet'}</p><p>Goal: ${c.goal || '—'}</p><p>Secret: ${c.secret || '—'}</p><label style="display:flex; align-items:center; gap:0.5rem; margin-top:0.5rem;"><input type="checkbox" id="char-alive-${c.id}" ${c.alive !== false ? 'checked' : ''}> Alive</label></div>`;
      }
      charHtml += '</div>';
      charList.innerHTML = charHtml;
      for (const c of chars) {
        const cb = document.getElementById(`char-alive-${c.id}`);
        if (cb) cb.addEventListener('change', (e) => { c.alive = e.target.checked; storage.saveProject(this.currentProjectId, project); this._showAutosave(); });
      }
    } else {
      charList.innerHTML = '<p style="color:var(--text-muted);">No characters yet. Add some in the Characters section.</p>';
    }
    document.getElementById('btn-save-continue').addEventListener('click', () => {
      story.lastEpisodeSummary = document.getElementById('continue-last-episode').value.trim();
      story.nextEpisodeGoal = document.getElementById('continue-next-goal').value.trim();
      story.coldOpen = document.getElementById('continue-cold-open').value.trim();
      story.cliffhanger = document.getElementById('continue-cliffhanger').value.trim();
      project.story = story;
      storage.saveProject(this.currentProjectId, project);
      this._showAutosave();
      alert('Episode progress saved.');
    });
  },
  _editingCharacterId: null,

  renderCharacters() {
    const project = storage.loadProject(this.currentProjectId);
    if (!project) return;
    const container = document.getElementById('view-character').querySelector('.view-content');
    const chars = project.characters || [];
    let html = `
      <div class="card" style="margin-bottom:1rem;">
        <h3>Character Creator</h3>
        <div class="grid-2"><div class="input-group"><label>Name</label><input id="char-name"></div><div class="input-group"><label>Age</label><input id="char-age" type="number"></div></div>
        <div class="grid-2"><div class="input-group"><label>SA Background</label><input id="char-background" placeholder="e.g. rural KZN, Mabopane"></div><div class="input-group"><label>Languages</label><input id="char-languages" placeholder="e.g. isiZulu, English"></div></div>
        <div class="input-group"><label>Personality (3 traits)</label><input id="char-personality" placeholder="e.g. brave, curious, loyal"></div>
        <div class="grid-2"><div class="input-group"><label>Powers / Abilities</label><input id="char-powers" placeholder="e.g. fire, lightning"></div><div class="input-group"><label>Weakness</label><input id="char-weakness"></div></div>
        <div class="input-group"><label>Goal</label><input id="char-goal"></div>
        <div class="input-group"><label>Secret</label><input id="char-secret"></div>
        <div class="input-group"><label>Arc (how they change)</label><input id="char-arc"></div>
        <div class="grid-2"><div class="input-group"><label>Dog Bond</label><select id="char-dog-bond"><option value="">None</option><option value="rottweiler">Black Rottweiler (Bhekumuzi)</option><option value="golden">Golden Retriever (Thandi)</option><option value="pup">Mixed-breed Pup (Vuka)</option></select></div><div class="input-group"><label>Status</label><select id="char-status"><option value="alive">Alive</option><option value="deceased">Deceased</option></select></div></div>
        <button class="btn btn-primary btn-sm" id="btn-save-character">Save Character</button>
        <button class="btn btn-ghost btn-sm" id="btn-clear-character">Clear</button>
      </div>
      <div class="card"><h3>Character Bible (${chars.length})</h3><div id="character-list" style="display:flex; flex-direction:column; gap:0.5rem;"></div></div>
    `;
    container.innerHTML = html;
    document.getElementById('btn-save-character').addEventListener('click', () => {
      const name = document.getElementById('char-name').value.trim();
      if (!name) { alert('Please enter a name.'); return; }
      const character = { id: this._editingCharacterId || 'char_' + Date.now(), name, age: parseInt(document.getElementById('char-age').value) || 0, background: document.getElementById('char-background').value.trim(), languages: document.getElementById('char-languages').value.trim().split(',').map(s=>s.trim()).filter(Boolean), personality: document.getElementById('char-personality').value.trim().split(',').map(s=>s.trim()).filter(Boolean), powers: document.getElementById('char-powers').value.trim().split(',').map(s=>s.trim()).filter(Boolean), weakness: document.getElementById('char-weakness').value.trim(), goal: document.getElementById('char-goal').value.trim(), secret: document.getElementById('char-secret').value.trim(), arc: document.getElementById('char-arc').value.trim(), dogBond: document.getElementById('char-dog-bond').value || null, alive: document.getElementById('char-status').value === 'alive', lastSeen: '', updatedAt: new Date().toISOString() };
      if (this._editingCharacterId) { const idx = chars.findIndex(c=>c.id===this._editingCharacterId); if (idx>=0) chars[idx]=character; } else { chars.push(character); }
      project.characters = chars;
      storage.saveProject(this.currentProjectId, project);
      this._showAutosave();
      this._editingCharacterId = null;
      document.getElementById('btn-save-character').textContent = 'Save Character';
      this.renderCharacters();
    });
    document.getElementById('btn-clear-character').addEventListener('click', () => {
      this._editingCharacterId = null;
      ['char-name','char-age','char-background','char-languages','char-personality','char-powers','char-weakness','char-goal','char-secret','char-arc'].forEach(id=>document.getElementById(id).value='');
      document.getElementById('char-dog-bond').value='';
      document.getElementById('char-status').value='alive';
      document.getElementById('btn-save-character').textContent='Save Character';
    });
    const listContainer = document.getElementById('character-list');
    if (chars.length === 0) { listContainer.innerHTML = '<p style="color:var(--text-muted);">No characters yet. Create your first character above.</p>'; }
    else {
      let listHtml='';
      for (const c of chars) {
        listHtml += `<div class="list-item"><div style="display:flex; justify-content:space-between; align-items:flex-start;"><div><h4>${c.name}</h4><p>Age: ${c.age} &bull; Background: ${c.background||'—'}</p><p>Languages: ${c.languages?.join(', ')||'—'}</p><p>Personality: ${c.personality?.join(', ')||'—'}</p><p>Powers: ${c.powers?.join(', ')||'—'}</p><p>Weakness: ${c.weakness||'—'}</p><p>Goal: ${c.goal||'—'}</p><p>Secret: ${c.secret||'—'}</p><p>Arc: ${c.arc||'—'}</p><p>Dog Bond: ${c.dogBond||'None'} &bull; Status: ${c.alive?'Alive':'Deceased'}</p></div><div style="display:flex; gap:0.25rem; flex-direction:column;"><button class="btn btn-sm btn-ghost" onclick="app.editCharacter('${c.id}')">Edit</button><button class="btn btn-sm btn-ghost" onclick="app.linkCharacter('${c.id}')">Link to Story</button><button class="btn btn-sm btn-ghost" onclick="app.deleteCharacter('${c.id}')">Delete</button></div></div></div>`;
      }
      listContainer.innerHTML = listHtml;
    }
  },
  editCharacter(id) {
    const project = storage.loadProject(this.currentProjectId);
    if (!project) return;
    const c = project.characters?.find(x=>x.id===id);
    if (!c) return;
    document.getElementById('char-name').value = c.name||'';
    document.getElementById('char-age').value = c.age||'';
    document.getElementById('char-background').value = c.background||'';
    document.getElementById('char-languages').value = c.languages?.join(', ')||'';
    document.getElementById('char-personality').value = c.personality?.join(', ')||'';
    document.getElementById('char-powers').value = c.powers?.join(', ')||'';
    document.getElementById('char-weakness').value = c.weakness||'';
    document.getElementById('char-goal').value = c.goal||'';
    document.getElementById('char-secret').value = c.secret||'';
    document.getElementById('char-arc').value = c.arc||'';
    document.getElementById('char-dog-bond').value = c.dogBond||'';
    document.getElementById('char-status').value = c.alive?'alive':'deceased';
    this._editingCharacterId = id;
    document.getElementById('btn-save-character').textContent = 'Update Character';
    document.getElementById('char-name').scrollIntoView({behavior:'smooth',block:'center'});
  },

  deleteCharacter(id) {
    if (!confirm('Delete this character?')) return;
    const project = storage.loadProject(this.currentProjectId);
    if (!project) return;
    project.characters = (project.characters||[]).filter(c=>c.id!==id);
    if (project.story && project.story.characterIds) project.story.characterIds = project.story.characterIds.filter(cid=>cid!==id);
    storage.saveProject(this.currentProjectId, project);
    this._showAutosave();
    this.renderCharacters();
  },

  linkCharacter(id) {
    const project = storage.loadProject(this.currentProjectId);
    if (!project) return;
    if (!project.story) project.story = {};
    if (!project.story.characterIds) project.story.characterIds = [];
    if (!project.story.characterIds.includes(id)) project.story.characterIds.push(id);
    storage.saveProject(this.currentProjectId, project);
    this._showAutosave();
    alert('Character linked to story.');
  },

  /* ===== Day 4: Scene Breaker + Continuity ===== */
  renderScenes() {
    const project = storage.loadProject(this.currentProjectId);
    if (!project) return;
    const container = document.getElementById('view-scenes').querySelector('.view-content');
    const story = project.story || {};
    const chars = project.characters || [];
    const scenes = story.scenes || [];

    const segmentLabels = { cold_open:'Cold Open (0–1 min)', act1:'Act 1', act2:'Act 2', climax:'Climax', ending:'Ending', cliffhanger:'Cliffhanger' };
    let html = `<div class="card" style="margin-bottom:1rem;"><h3>Scene Breaker</h3><p>Break your episode into scenes. Track continuity so characters don't change powers or come back from the dead.</p><div class="grid-2"><div class="input-group"><label>Segment</label><select id="scene-segment">`;
    for (const [k,v] of Object.entries(segmentLabels)) html += `<option value="${k}">${v}</option>`;
    html += `</select></div><div class="input-group"><label>Location</label><input id="scene-location" placeholder="e.g. cattle post, river, homestead"></div></div><div class="grid-2"><div class="input-group"><label>Goal</label><input id="scene-goal" placeholder="What the protagonist wants"></div><div class="input-group"><label>Conflict</label><input id="scene-conflict" placeholder="What stands in the way"></div></div><div class="input-group"><label>Dialogue Beats</label><textarea id="scene-dialogue" rows="2" placeholder="Key lines of dialogue"></textarea></div><div class="input-group"><label>Visual Description</label><textarea id="scene-visual" rows="2" placeholder="What the camera sees"></textarea></div><div class="input-group"><label>Characters Present</label><div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.25rem;" id="scene-char-tags"></div></div><button class="btn btn-primary btn-sm" id="btn-add-scene">Add Scene</button></div><div class="card"><h3>Scenes (${scenes.length})</h3><div id="scene-list" style="display:flex;flex-direction:column;gap:0.5rem;"></div></div>`;
    container.innerHTML = html;
    const tagContainer = document.getElementById('scene-char-tags');
    const selectedChars = new Set();
    if (chars.length > 0) {
      for (const c of chars) {
        const btn = document.createElement('button');
        btn.type='button'; btn.className='btn btn-sm btn-ghost'; btn.textContent=c.name;
        btn.addEventListener('click',()=>{ if(selectedChars.has(c.id)){selectedChars.delete(c.id); btn.className='btn btn-sm btn-ghost';} else {selectedChars.add(c.id); btn.className='btn btn-sm btn-primary';} });
        tagContainer.appendChild(btn);
      }
    } else { tagContainer.innerHTML='<span style="color:var(--text-muted);font-size:0.85rem;">No characters yet. Add some in Characters.</span>'; }
    document.getElementById('btn-add-scene').addEventListener('click',()=>{
      const segment=document.getElementById('scene-segment').value; const location=document.getElementById('scene-location').value.trim(); const goal=document.getElementById('scene-goal').value.trim(); const conflict=document.getElementById('scene-conflict').value.trim(); const dialogue=document.getElementById('scene-dialogue').value.trim(); const visual=document.getElementById('scene-visual').value.trim();
      if(!location||!goal){ alert('Please fill in Location and Goal.'); return; }
      const warnings=[]; for(const id of selectedChars){ const c=chars.find(x=>x.id===id); if(c&&c.alive===false) warnings.push(`${c.name} is marked deceased.`); }
      if(warnings.length>0){ if(!confirm('Continuity warnings:\\n'+warnings.join('\\n')+'\\n\\nAdd scene anyway?')) return; }
      const scene={ id:'scene_'+Date.now(), segment, location, goal, conflict, dialogue, visual, characters:Array.from(selectedChars), updatedAt:new Date().toISOString() };
      if(!story.scenes) story.scenes=[]; story.scenes.push(scene); project.story=story;
      storage.saveProject(this.currentProjectId, project); this._showAutosave(); this.renderScenes();
    });
    const listContainer=document.getElementById('scene-list');
    if(scenes.length===0){ listContainer.innerHTML='<p style="color:var(--text-muted);">No scenes yet. Add your first scene above.</p>'; }
    else {
      let listHtml='';
      for(const s of scenes){ const charNames=s.characters?.map(id=>{ const c=chars.find(x=>x.id===id); return c?c.name:'Unknown'; }).join(', ')||'None'; listHtml+=`<div class="list-item"><div style="display:flex;justify-content:space-between;align-items:flex-start;"><div><h4>${segmentLabels[s.segment]||s.segment}</h4><p>Location: ${s.location}</p><p>Goal: ${s.goal}</p><p>Conflict: ${s.conflict||'—'}</p><p>Dialogue: ${s.dialogue||'—'}</p><p>Visual: ${s.visual||'—'}</p><p>Characters: ${charNames}</p></div><button class="btn btn-sm btn-ghost" onclick="app.deleteScene('${s.id}')">Delete</button></div></div>`; }
      listContainer.innerHTML=listHtml;
    }
  },
  deleteScene(id){
    if(!confirm('Delete this scene?')) return;
    const project=storage.loadProject(this.currentProjectId);
    if(!project||!project.story) return;
    project.story.scenes=(project.story.scenes||[]).filter(s=>s.id!==id);
    storage.saveProject(this.currentProjectId, project); this._showAutosave(); this.renderScenes();
  },

  /* ===== Day 5: Comic Builder ===== */
  renderComic() {
    const project = storage.loadProject(this.currentProjectId);
    if (!project) return;
    const container = document.getElementById('view-comic').querySelector('.view-content');
    const comic = project.comic || { pages: [] };
    let html = `<div class="card" style="margin-bottom:1rem;"><h3>Comic Builder</h3><p>Turn your story into pages and panels.</p><div class="input-group"><label>Comic Title</label><input id="comic-title" value="${comic.title||''}"></div><button class="btn btn-primary btn-sm" id="btn-add-page">Add Page</button></div><div id="comic-pages"></div>`;
    container.innerHTML = html;
    const pagesContainer = document.getElementById('comic-pages');
    const renderPages = () => {
      const c2 = storage.loadProject(this.currentProjectId).comic || { pages: [] };
      let h='';
      for(const page of c2.pages){
        h+=`<div class="card" style="border:2px solid var(--border-color);"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;"><strong>Page ${page.number}</strong><div style="display:flex;gap:0.25rem;"><button class="btn btn-sm btn-ghost" onclick="app.addPanel('${page.id}')">+ Panel</button><button class="btn btn-sm btn-ghost" onclick="app.deletePage('${page.id}')">Delete Page</button></div></div><div id="page-${page.id}-panels">${page.panels?.map(p=>this._panelHTML(p,page.id)).join('')||'<span style="color:var(--text-muted);">No panels yet.</span>'}</div></div>`;
      }
      pagesContainer.innerHTML=h;
      for(const page of c2.pages){ for(const p of page.panels||[]){ const b=document.getElementById('del-panel-'+p.id); if(b) b.addEventListener('click',()=>app.deletePanel(page.id,p.id)); const sb=document.getElementById('save-panel-'+p.id); if(sb) sb.addEventListener('click',()=>app.savePanel(page.id,p.id)); } }
    };
    document.getElementById('btn-add-page').addEventListener('click',()=>{
      const c2=storage.loadProject(this.currentProjectId).comic||{pages:[]}; if(!c2.pages)c2.pages=[];
      const page={id:'page_'+Date.now(),number:(c2.pages.length+1),panels:[]}; c2.pages.push(page);
      const proj=storage.loadProject(this.currentProjectId); proj.comic=c2; storage.saveProject(this.currentProjectId,proj); this._showAutosave(); renderPages();
    });
    renderPages();
  },
  _panelHTML(p,pageId){
    return `<div class="list-item" style="border:1px solid var(--accent-secondary);"><div style="display:flex;gap:0.5rem;align-items:flex-start;"><div style="width:80px;height:100px;background:var(--bg-app);border:1px dashed var(--border-color);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:var(--text-muted);flex-shrink:0;">Panel ${p.number}</div><div style="flex:1;"><div class="input-group" style="margin-bottom:0.25rem;"><label>Visual Prompt</label><input id="panel-visual-${p.id}" value="${p.visualPrompt||''}"></div><div class="input-group" style="margin-bottom:0.25rem;"><label>Dialogue</label><textarea id="panel-dialogue-${p.id}" rows="1">${p.dialogue||''}</textarea></div><div class="input-group" style="margin-bottom:0.25rem;"><label>Narration</label><input id="panel-narration-${p.id}" value="${p.narration||''}"></div><div class="input-group" style="margin-bottom:0.25rem;"><label>SFX</label><input id="panel-sfx-${p.id}" value="${p.sfx||''}"></div><button class="btn btn-sm btn-ghost" id="save-panel-${p.id}">Save Panel</button><button class="btn btn-sm btn-ghost" id="del-panel-${p.id}">Delete</button></div></div></div>`;
  },
  addPanel(pageId){
    const proj=storage.loadProject(this.currentProjectId); if(!proj||!proj.comic) return;
    const page=proj.comic.pages.find(p=>p.id===pageId); if(!page) return; if(!page.panels)page.panels=[];
    const panel={id:'panel_'+Date.now(),number:(page.panels.length+1),visualPrompt:'',dialogue:'',narration:'',sfx:''}; page.panels.push(panel);
    storage.saveProject(this.currentProjectId,proj); this._showAutosave(); this.renderComic();
  },
  deletePage(pageId){
    if(!confirm('Delete this page and all its panels?')) return;
    const proj=storage.loadProject(this.currentProjectId); if(!proj||!proj.comic) return;
    proj.comic.pages=proj.comic.pages.filter(p=>p.id!==pageId); proj.comic.pages.forEach((p,i)=>p.number=i+1);
    storage.saveProject(this.currentProjectId,proj); this._showAutosave(); this.renderComic();
  },
  deletePanel(pageId,panelId){
    const proj=storage.loadProject(this.currentProjectId); if(!proj||!proj.comic) return;
    const page=proj.comic.pages.find(p=>p.id===pageId); if(!page) return;
    page.panels=page.panels.filter(p=>p.id!==panelId); page.panels.forEach((p,i)=>p.number=i+1);
    storage.saveProject(this.currentProjectId,proj); this._showAutosave(); this.renderComic();
  },
  savePanel(pageId,panelId){
    const proj=storage.loadProject(this.currentProjectId); if(!proj||!proj.comic) return;
    const page=proj.comic.pages.find(p=>p.id===pageId); if(!page) return;
    const panel=page.panels.find(p=>p.id===panelId); if(!panel) return;
    panel.visualPrompt=document.getElementById('panel-visual-'+panelId).value.trim(); panel.dialogue=document.getElementById('panel-dialogue-'+panelId).value.trim(); panel.narration=document.getElementById('panel-narration-'+panelId).value.trim(); panel.sfx=document.getElementById('panel-sfx-'+panelId).value.trim();
    storage.saveProject(this.currentProjectId,proj); this._showAutosave();
  },

  /* ===== Day 6: Read Mode + Export ===== */
  renderReadMode() {
    const project = storage.loadProject(this.currentProjectId);
    if (!project) return;
    const container = document.getElementById('view-readmode').querySelector('.view-content');
    const comic = project.comic || { pages: [] };
    if (comic.pages.length === 0) { container.innerHTML = `<div class="empty-state"><h2>No Comic Yet</h2><p>Build your comic first in the Comic Builder.</p></div>`; return; }
    let html = `<div class="card" style="margin-bottom:1rem;"><h3>Read Mode</h3><p>Flip through your comic pages like an eBook.</p><div style="display:flex;gap:0.5rem;margin-bottom:1rem;"><button class="btn btn-ghost btn-sm" id="btn-prev-page">&lt; Prev</button><span id="page-counter" style="font-family:monospace;">1 / ${comic.pages.length}</span><button class="btn btn-ghost btn-sm" id="btn-next-page">Next &gt;</button></div><div class="input-group"><label>Export Title (for cover)</label><input id="read-export-title" value="${comic.title||project.name||'Untitled'}"></div><button class="btn btn-primary btn-sm" id="btn-export-comic">Export Comic (HTML)</button></div><div id="comic-reader" style="display:flex;flex-direction:column;align-items:center;gap:1rem;min-height:60vh;"></div>`;
    container.innerHTML = html;
    let currentPage = 0;
    const renderPage = () => {
      const page = comic.pages[currentPage]; const reader = document.getElementById('comic-reader'); document.getElementById('page-counter').textContent = `${currentPage+1} / ${comic.pages.length}`;
      let panelsHtml='';
      for(const p of page.panels||[]){ panelsHtml+=`<div class="list-item" style="border:2px solid var(--accent-secondary);padding:1rem;"><div style="width:100%;height:200px;background:var(--bg-app);border:1px dashed var(--border-color);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;margin-bottom:0.5rem;font-size:0.75rem;color:var(--text-muted);">Panel ${p.number}</div>${p.visualPrompt?`<p><strong>Visual:</strong> ${p.visualPrompt}</p>`:''}${p.dialogue?`<p><strong>Dialogue:</strong> "${p.dialogue}"</p>`:''}${p.narration?`<p><strong>Narration:</strong> ${p.narration}</p>`:''}${p.sfx?`<p><strong>SFX:</strong> ${p.sfx}</p>`:''}</div>`; }
      reader.innerHTML = panelsHtml || '<p style="color:var(--text-muted);">No panels on this page.</p>';
    };
    renderPage();
    document.getElementById('btn-prev-page').addEventListener('click',()=>{ if(currentPage>0){ currentPage--; renderPage(); } });
    document.getElementById('btn-next-page').addEventListener('click',()=>{ if(currentPage<comic.pages.length-1){ currentPage++; renderPage(); } });
    document.getElementById('btn-export-comic').addEventListener('click',()=>{
      const title=document.getElementById('read-export-title').value.trim()||'Untitled'; const c2=storage.loadProject(this.currentProjectId).comic||{pages:[]}; const htmlContent=this._generateComicHTML(title,c2);
      const blob=new Blob([htmlContent],{type:'text/html'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`comic_${title.replace(/\s+/g,'_').toLowerCase()}.html`; a.click(); URL.revokeObjectURL(url); this._showAutosave();
    });
  },
  _generateComicHTML(title,comic){
    let pagesHtml='';
    for(const page of comic.pages){ let panelsHtml=''; for(const p of page.panels||[]){ panelsHtml+=`<div class="panel"><div class="panel-frame"></div>${p.visualPrompt?`<div class="visual-prompt">${p.visualPrompt}</div>`:''}${p.dialogue?`<div class="speech-bubble">${p.dialogue}</div>`:''}${p.narration?`<div class="narration-box">${p.narration}</div>`:''}${p.sfx?`<div class="sfx">${p.sfx}</div>`:''}</div>`; } pagesHtml+=`<div class="comic-page"><h2>Page ${page.number}</h2>${panelsHtml}</div>`; }
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title><style>body{font-family:sans-serif;background:#0f172a;color:#f1f5f9;padding:2rem;}h1{color:#f59e0b;text-align:center;}.comic-page{margin:2rem 0;border:2px solid #475569;padding:1rem;border-radius:10px;background:#1e293b;}.panel{margin:1rem 0;padding:1rem;border:1px dashed #475569;border-radius:8px;background:#0f172a;}.panel-frame{width:100%;height:200px;background:#334155;border:1px solid #475569;margin-bottom:0.5rem;}.visual-prompt{font-style:italic;color:#94a3b8;margin-bottom:0.5rem;}.speech-bubble{background:#ef4444;color:#fff;padding:0.75rem;border-radius:1rem 1rem 1rem 0.25rem;display:inline-block;max-width:80%;}.narration-box{background:#f59e0b;color:#000;padding:0.5rem;border-radius:4px;display:inline-block;}.sfx{color:#22c55e;font-weight:bold;font-size:1.2rem;letter-spacing:2px;}</style></head><body><h1>${title}</h1>${pagesHtml}</body></html>`;
  },

  /* ===== Day 7: Anime Blueprint ===== */
  renderAnime() {
    const project = storage.loadProject(this.currentProjectId);
    if (!project) return;
    const container = document.getElementById('view-anime').querySelector('.view-content');
    const comic = project.comic || { pages: [] };
    if (comic.pages.length === 0) { container.innerHTML = `<div class="empty-state"><h2>No Comic Yet</h2><p>Build your comic first. Anime adapts from comic pages.</p></div>`; return; }
    let html = `<div class="card" style="margin-bottom:1rem;"><h3>Anime Blueprint (Motion Comic)</h3><p>Convert comic pages into 5–7 minute motion-comic shots. Target: 300–420 seconds.</p><div class="grid-2"><div class="input-group"><label>Target Duration (seconds)</label><input id="anime-duration" type="number" value="360"></div><div class="input-group"><label>Language</label><select id="anime-lang"><option value="zul">isiZulu</option><option value="eng">English</option><option value="both">isiZulu + English Subtitles</option></select></div></div><button class="btn btn-primary btn-sm" id="btn-generate-shots">Generate Shot List</button></div><div id="anime-shots" style="display:flex;flex-direction:column;gap:0.5rem;"></div><div class="card" style="margin-top:1rem;"><h3>Export</h3><button class="btn btn-primary btn-sm" id="btn-export-anime">Export Script + Shot List + Voice Script</button></div>`;
    container.innerHTML = html;
    document.getElementById('btn-generate-shots').addEventListener('click',()=>{
      const targetSeconds=parseInt(document.getElementById('anime-duration').value)||360; const pages=comic.pages; const shots=[]; let secondsUsed=0;
      for(const page of pages){ for(const p of page.panels||[]){ if(secondsUsed>=targetSeconds) break; const duration=Math.min(15,targetSeconds-secondsUsed); secondsUsed+=duration; shots.push({id:'shot_'+Date.now()+Math.random(),pageId:page.id,panelId:p.id,pageNumber:page.number,panelNumber:p.number,shotType:'medium',cameraAngle:'eye_level',movement:'slow_zoom',voiceLine:p.dialogue||'[Visual only]',soundCue:p.sfx||'Ambient',durationSeconds:duration,animateOrPan:duration>8?'animate':'pan_zoom'}); } if(secondsUsed>=targetSeconds) break; }
      if(secondsUsed<targetSeconds){ shots.push({id:'shot_cliffhanger',pageId:null,panelId:null,pageNumber:comic.pages.length,panelNumber:0,shotType:'close_up',cameraAngle:'low_angle',movement:'slow_zoom_in',voiceLine:'Cliffhanger voice line here.',soundCue:'Dramatic sting',durationSeconds:targetSeconds-secondsUsed,animateOrPan:'animate'}); }
      let shotsHtml='';
      for(const s of shots){ shotsHtml+=`<div class="list-item"><div style="display:flex;justify-content:space-between;align-items:flex-start;"><div><h4>Shot ${s.pageNumber}.${s.panelNumber}</h4><p>Type: ${s.shotType} &bull; Camera: ${s.cameraAngle} &bull; Movement: ${s.movement}</p><p>Voice: "${s.voiceLine}"</p><p>Sound: ${s.soundCue}</p><p>Duration: ${s.durationSeconds}s &bull; ${s.animateOrPan}</p></div></div></div>`; }
      document.getElementById('anime-shots').innerHTML=shotsHtml; this._showAutosave();
    });
    document.getElementById('btn-export-anime').addEventListener('click',()=>{
      const targetSeconds=parseInt(document.getElementById('anime-duration').value)||360; const lang=document.getElementById('anime-lang').value; const content=this._generateAnimeScript(targetSeconds,lang,comic);
      const blob=new Blob([content],{type:'text/html'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`anime_blueprint_${project.name||'series'}.html`; a.click(); URL.revokeObjectURL(url); this._showAutosave();
    });
  },
  _generateAnimeScript(durationSeconds,lang,comic){
    let shotsHtml=''; let totalSeconds=0;
    for(const page of comic.pages){ for(const p of page.panels||[]){ if(totalSeconds>=durationSeconds) break; const dur=Math.min(15,durationSeconds-totalSeconds); totalSeconds+=dur; shotsHtml+=`<tr><td>${page.number}</td><td>${p.number}</td><td>medium</td><td>eye_level</td><td>slow_zoom</td><td>${p.dialogue||'[Visual]'}</td><td>${p.sfx||'Ambient'}</td><td>${dur}s</td></tr>`; } }
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Anime Blueprint</title><style>body{font-family:sans-serif;padding:2rem;background:#0f172a;color:#f1f5f9;}table{width:100%;border-collapse:collapse;background:#1e293b;}th,td{border:1px solid #475569;padding:0.5rem;text-align:left;}th{background:#334155;color:#f59e0b;}h1{color:#ef4444;}</style></head><body><h1>Anime Blueprint — Motion Comic Script</h1><p><strong>Target Duration:</strong> ${durationSeconds} seconds</p><p><strong>Language:</strong> ${lang}</p><table><tr><th>Page</th><th>Panel</th><th>Shot Type</th><th>Camera</th><th>Movement</th><th>Voice Line</th><th>Sound Cue</th><th>Duration</th></tr>${shotsHtml}</table><p><strong>Total:</strong> ${totalSeconds} seconds</p></body></html>`;
  }
};
document.addEventListener('DOMContentLoaded', () => app.init());