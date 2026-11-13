const app = {
  currentProjectId: null,
  currentView: 'dashboard',
  readPageIndex: 0,
  pendingBackground: '',

  init() {
    this._bindUI();
    this.renderDashboard();
    this._startAutosaveHeartbeat();
  },

  _bindUI() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.addEventListener('click', () => {
      const sidebar=document.getElementById('sidebar');const open=sidebar.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));
    });
    document.querySelectorAll('.nav-item').forEach(item=>item.addEventListener('click',()=>{
      const sidebar=document.getElementById('sidebar');if(sidebar.classList.contains('open'))sidebar.classList.remove('open');
      if(menu)menu.setAttribute('aria-expanded','false');
    }));
    document.getElementById('btn-new-project').addEventListener('click', () => this.newProject());
    document.getElementById('btn-export').addEventListener('click', () => storage.exportAll());
    const input = document.getElementById('input-import');
    if (input) {
      input.addEventListener('change', (e) => {
        if (e.target.files[0]) {
          storage.importFromFile(e.target.files[0], (err, count) => {
            if (err) alert('Import failed: ' + err.message);
            else {
              alert('Imported ' + count + ' project(s).');
              e.target.value = '';
              this.renderDashboard();
            }
          });
        }
      });
    }
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
      case 'settings': this.renderSettings(); break;
      default: this._renderComingSoon(viewName);
    }
  },

  _renderComingSoon(viewName) {
    const container = document.getElementById('view-' + viewName).querySelector('.view-content');
    container.innerHTML =
      '<div class="empty-state">' +
      '<h2>' + viewName + '</h2>' +
      '<p>Coming in v2. Build your story first!</p>' +
      '</div>';
  },

  newProject() {
    const name = prompt('Enter series name:');
    if (!name) return;
    const id = 'proj_' + Date.now();
    const project = Project.create(name);
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
    UI.renderDashboard(container, storage);
  },

  renderStory() {
    const container = document.getElementById('view-story').querySelector('.view-content');
    UI.renderStory(container, storage, app);
  },

  renderCharacters() {
    const container = document.getElementById('view-character').querySelector('.view-content');
    UI.renderCharacters(container, storage, app);
  },

  renderScenes() {
    const container = document.getElementById('view-scenes').querySelector('.view-content');
    UI.renderScenes(container, storage, app);
  },

  renderComic() {
    const container = document.getElementById('view-comic').querySelector('.view-content');
    UI.renderComic(container, storage, app);
  },

  renderReadMode() {
    const container = document.getElementById('view-readmode').querySelector('.view-content');
    UI.renderReadMode(container, storage, app);
  },

  renderAnime() {
    const container = document.getElementById('view-anime').querySelector('.view-content');
    UI.renderAnime(container, storage, app);
  },

  renderSettings() {
    const container = document.getElementById('view-settings').querySelector('.view-content');
    UI.renderMemory(container, storage, this);
  },

  saveMemory() {
    const project=storage.loadProject(this.currentProjectId); if(!project)return;
    project.memory=project.memory||{canon:[],continuity:[],notes:''};
    const field=document.getElementById('memory-notes'); if(field)project.memory.notes=field.value;
    this._saveCurrentProject(project);
  },

  saveStoryFromForm(formData) {
    const project=storage.loadProject(this.currentProjectId);if(!project)return;
    project.story=project.story||Story.create();
    for(const [key,value] of formData.entries())project.story[key]=String(value).trim();
    if(this._saveCurrentProject(project))this.renderStory();
  },

  _saveCurrentProject(project) {
    if (!this.currentProjectId || !storage.saveProject(this.currentProjectId, project)) {
      alert('Could not save this series. Export your work and check browser storage space.');
      return false;
    }
    this._showAutosave();
    return true;
  },

  createCharacter(form) {
    const project = storage.loadProject(this.currentProjectId); if (!project) return;
    const data = Object.fromEntries(form.entries());
    const character = this.editCharacterId ? (project.characters||[]).find(item=>item.id===this.editCharacterId) || Character.create(data.name) : Character.create(data.name);
    character.age = Number(data.age) || 0;
    character.background = data.background;
    character.languages = data.languages.split(',').map(x=>x.trim()).filter(Boolean);
    character.personality = data.personality.split(',').map(x=>x.trim()).filter(Boolean);
    character.powers = data.powers.split(',').map(x=>x.trim()).filter(Boolean);
    character.goal = data.goal; character.weakness = data.weakness; character.secret = data.secret; character.arc = data.arc;
    character.status = data.status; character.alive = data.status !== 'deceased';
    const editingId=this.editCharacterId; CharacterEngine.saveCharacter(project, character, editingId);
    this.editCharacterId=null;
    if (this._saveCurrentProject(project)) this.renderCharacters();
  },

  deleteCharacter(id) {
    const project=storage.loadProject(this.currentProjectId); if(!project)return;
    CharacterEngine.deleteCharacter(project,id);
    if(this._saveCurrentProject(project))this.renderCharacters();
  },

  createScene(form) {
    const project=storage.loadProject(this.currentProjectId); if(!project)return;
    project.story=project.story||Story.create(); project.story.scenes=project.story.scenes||[];
    const data=Object.fromEntries(form.entries());
    const names=data.characters.split(',').map(x=>x.trim()).filter(Boolean);
    const characters=project.characters||[];
    const dead=names.filter(name=>characters.some(c=>(c.name||'').toLowerCase()===name.toLowerCase()&&c.status==='deceased'));
    const unknown=names.filter(name=>!characters.some(c=>(c.name||'').toLowerCase()===name.toLowerCase()));
    const warnings=[];if(dead.length)warnings.push(`${dead.join(', ')} ${dead.length===1?'is':'are'} marked deceased`);if(unknown.length)warnings.push(`${unknown.join(', ')} ${unknown.length===1?'is':'are'} not in this series character bible`);
    if(warnings.length&&!confirm(`Continuity warning: ${warnings.join('; ')}. Add scene anyway?`))return;
    const editingId=this.editSceneId;
    const scene=editingId?(project.story.scenes||[]).find(item=>item.id===editingId)||Scene.create(data.segment,data.location,data.goal):Scene.create(data.segment,data.location,data.goal);
    Object.assign(scene,{conflict:data.conflict,dialogue:data.dialogue,visual:data.visual,characters:names});
    if(editingId){const idx=project.story.scenes.findIndex(item=>item.id===editingId);if(idx>=0)project.story.scenes[idx]=scene;this.editSceneId=null;}else project.story.scenes.push(scene);
    project.memory=project.memory||{canon:[],continuity:[],notes:''};
    if(warnings.length)project.memory.continuity.push(`Override accepted: ${warnings.join('; ')} in scene ${scene.location}.`);
    if(this._saveCurrentProject(project))this.renderScenes();
  },

  deleteScene(id) {
    const project=storage.loadProject(this.currentProjectId);if(!project)return;
    project.story.scenes=(project.story?.scenes||[]).filter(s=>s.id!==id);
    if(this._saveCurrentProject(project))this.renderScenes();
  },

  addComicPage() { const p=storage.loadProject(this.currentProjectId);if(!p)return;ComicBuilder.addPage(p);if(this._saveCurrentProject(p))this.renderComic(); },
  deleteComicPage(id) { const p=storage.loadProject(this.currentProjectId);if(!p)return;ComicBuilder.deletePage(p,id);if(this._saveCurrentProject(p))this.renderComic(); },
  addComicPanel(pageId) { const p=storage.loadProject(this.currentProjectId);if(!p)return;const panel=ComicBuilder.addPanel(pageId,p);if(this.pendingBackground&&panel){panel.visualPrompt=this.pendingBackground;this.pendingBackground='';}if(this._saveCurrentProject(p))this.renderComic(); },
  deleteComicPanel(key) { const [pageId,panelId]=key.split('|');const p=storage.loadProject(this.currentProjectId);if(!p)return;ComicBuilder.deletePanel(p,pageId,panelId);if(this._saveCurrentProject(p))this.renderComic(); },
  saveComicPanel(key) {
    const [pageId,panelId]=key.split('|');const p=storage.loadProject(this.currentProjectId);if(!p)return;
    const saveButton=Array.from(document.querySelectorAll('[data-save-panel]')).find(button=>button.dataset.savePanel===key);
    const root=saveButton?.closest('.panel-editor');if(!root)return;
    const data={};root.querySelectorAll('[data-f]').forEach(el=>data[el.dataset.f]=el.value);
    ComicBuilder.savePanel(p,pageId,panelId,data);if(this._saveCurrentProject(p))this.renderComic();
  },
  setPendingBackground(promptText) { this.pendingBackground=promptText; alert(promptText?'Background will be added to the next new panel.':'Choose a background first.'); },
  exportComic() {
    const p=storage.loadProject(this.currentProjectId);if(!p)return;
    const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const pages=(p.comic?.pages||[]).map(pg=>`<section><h2>Page ${pg.number}</h2>${(pg.panels||[]).map(pa=>`<article><h3>Panel ${pa.number}</h3>${pa.imageUrl&&!/^\s*(javascript|data):/i.test(pa.imageUrl)?`<img src="${esc(pa.imageUrl)}" alt="Comic panel ${pa.number}" style="max-width:100%">`:''}<p>${esc(pa.visualPrompt)}</p><blockquote>${esc(pa.dialogue)}</blockquote><p>${esc(pa.narration)}</p><strong>${esc(pa.sfx)}</strong></article>`).join('')}</section>`).join('');
    this._downloadHTML(p.name||'ComicForge comic',pages,'comicforge-comic.html');
  },
  generateAnimeShots(seconds) {
    if(seconds<300||seconds>420)return alert('Choose a target between 300 and 420 seconds.');
    const p=storage.loadProject(this.currentProjectId);if(!p)return;
    const panels=(p.comic?.pages||[]).some(page=>(page.panels||[]).length);
    if(!panels)return alert('Add at least one comic panel before generating anime shots.');
    p.animeDuration=seconds;p.animeBlueprint=AnimeAdapter.generateShots(p.comic,seconds);
    if(this._saveCurrentProject(p))this.renderAnime();
  },
  updateAnimeShot(index,key,value) { const p=storage.loadProject(this.currentProjectId);if(!p?.animeBlueprint?.[index])return;p.animeBlueprint[index][key]=key==='durationSeconds'?Math.max(1,Math.min(60,Number(value)||1)):value;if(this._saveCurrentProject(p))this.renderAnime(); },
  balanceAnimeShots(target) {
    const p=storage.loadProject(this.currentProjectId);if(!p)return;
    if(!p.animeBlueprint?.length)return alert('Generate shots first.');
    if(target<300||target>420)return alert('Choose a target between 300 and 420 seconds.');
    if(p.animeBlueprint.length*60<target)return alert('There are too few shots for that runtime. Regenerate the blueprint to create enough shots.');
    const base=Math.floor(target/p.animeBlueprint.length),remainder=target%p.animeBlueprint.length;
    p.animeBlueprint.forEach((shot,i)=>shot.durationSeconds=base+(i<remainder?1:0));
    p.animeDuration=target;if(this._saveCurrentProject(p))this.renderAnime();
  },
  exportAnimeShots() {
    const p=storage.loadProject(this.currentProjectId);if(!p)return;
    const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const rows=(p.animeBlueprint||[]).map((s,i)=>`<tr><td>${i+1}</td><td>${esc(s.pageNumber)}</td><td>${esc(s.panelNumber)}</td><td>${esc(s.movement)}</td><td>${esc(s.voiceLine)}</td><td>${esc(s.soundCue)}</td><td>${esc(s.durationSeconds)}</td></tr>`).join('');
    this._downloadHTML(`${p.name} anime blueprint`,`<h1>${esc(p.name)} — Motion Comic</h1><table><thead><tr><th>Shot</th><th>Page</th><th>Panel</th><th>Movement</th><th>Voice</th><th>Sound</th><th>Seconds</th></tr></thead><tbody>${rows}</tbody></table>`,'comicforge-anime.html');
  },
  _downloadHTML(title,body,filename) { const safeTitle=String(title).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const doc=`<!doctype html><html><head><meta charset="utf-8"><title>${safeTitle}</title><style>body{font:16px system-ui;max-width:900px;margin:2rem auto;padding:1rem;background:#101612;color:#f4f1e8}section,article{border:1px solid #50705a;border-radius:10px;padding:1rem;margin:1rem 0}table{width:100%;border-collapse:collapse}td,th{border:1px solid #777;padding:.5rem;text-align:left}</style></head><body>${body}</body></html>`;const url=URL.createObjectURL(new Blob([doc],{type:'text/html'}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url); },

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

  startNewStoryFromPrompt() {
    const idea = prompt('Enter a one-line story idea:');
    if (!idea) return;
    const id = 'proj_' + Date.now();
    const project = Project.create(idea);
    storage.saveProject(id, project);
    this.currentProjectId = id;
    this.showView('story', id);
  },

  exportCurrentProject() {
    const project = storage.loadProject(this.currentProjectId);
    if (!project) return alert('No current project to export.');
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name || 'project'}_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  expandStoryFromIdea(projectId, idea) {
    if (!idea) return;
    projectId = projectId || this.currentProjectId;
    const project = storage.loadProject(projectId);
    if (!project) return alert('No project loaded.');
    project.story = { ...StoryEngine.expandStory(idea), oneLineIdea: idea };
    project.memory = project.memory || { canon: [], continuity: [], notes: '' };
    project.memory.canon.push({ type: 'premise', text: idea, createdAt: new Date().toISOString() });
    // Save the project
    storage.saveProject(projectId, project);
    // Show the story view with the expanded story
    this.showView('story', projectId);
  },

  loadPresetCharacter() {
    fetch('presets/characters.json')
      .then(r => r.json())
      .then(data => {
        const names = data.presets.map(p => p.name);
        const choice = prompt('Choose a preset character:\n\n' + names.join('\n'));
        if (!choice) return;
        const preset = data.presets.find(p => p.name === choice);
        if (!preset) return alert('Character not found.');
        const project = storage.loadProject(this.currentProjectId);
        if (!project) return alert('No project loaded.');
        const char = Character.create(preset.name);
        char.background = preset.look;
        char.personality = [preset.personality];
        project.characters = (project.characters || []).concat(char);
        storage.saveProject(this.currentProjectId, project);
        alert('Character ' + choice + ' added to your project!');
        this.renderCharacters();
      })
      .catch(e => console.error('Failed to load character presets:', e));
  },

  loadPresetBackground() {
    fetch('presets/backgrounds.json')
      .then(r => r.json())
      .then(data => {
        const names = data.presets.map(p => p.name);
        const choice = prompt('Choose a preset background:\n\n' + names.join('\n'));
        if (!choice) return;
        const preset = data.presets.find(p => p.name === choice);
        if (!preset) return alert('Background not found.');
        alert('Loaded background: ' + preset.name + '\n\nPrompt: ' + preset.prompt);
      })
      .catch(e => console.error('Failed to load background presets:', e));
  }
};

// Inline HTML event handlers resolve names through the global window object.
window.app = app;
