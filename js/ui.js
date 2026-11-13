const UI = {
  showView(viewName, projectId = null) {
    this.currentView = viewName;
    if (projectId) this.currentProjectId = projectId;
    document.querySelectorAll('[data-view]').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById('view-' + viewName);
    if (target) target.classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const nav = document.getElementById('nav-' + viewName);
    if (nav) nav.classList.add('active');
  },
renderDashboard(container, storage) {
    const index = storage.getProjectIndex();
    const ids = Object.keys(index);
    let html =
      '<div class="card" style="margin-bottom:1rem;">' +
      '<h3>Start Your SA Story</h3>' +
      '<p>Start your South African historic-fantasy comic and anime journey.</p>' +
      '<button class="btn btn-primary" id="btn-create">Create New Project</button>' +
      '<button class="btn btn-ghost btn-sm" id="btn-start-story" style="margin-left:0.5rem;">Start New Story</button>' +
      '<button class="btn btn-ghost btn-sm" id="btn-export-project" style="margin-left:0.5rem;">Export Project</button>' +
      '</div>' +
      '<div class="card">' +
      '<h3>My Series</h3>';
    if (ids.length === 0) {
      html += '<div class="empty-state" style="height:auto;"><p>No projects yet. Create your first series to begin.</p></div>';
    } else {
      html += '<div style="display:flex; flex-direction:column; gap:0.5rem;">';
      for (const id of ids) {
        const p = index[id];
        html +=
          '<div class="list-item" onclick="app.loadProject(\'' + id + '\')">' +
          '<h4>' + escapeHTML(p.name) + '</h4>' +
          '<p>Status: <span class="badge">' + escapeHTML(p.status) + '</span> • Last updated: ' + new Date(p.updatedAt).toLocaleDateString() + '</p>' +
          '<div style="margin-top:0.5rem; display:flex; gap:0.5rem;">' +
          '<button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); app.loadProject(\'' + id + '\')">Open</button>' +
          '<button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); app.deleteProject(\'' + id + '\')">Delete</button>' +
          '</div>' +
          '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
    const btnCreate = document.getElementById('btn-create');
    if (btnCreate) btnCreate.addEventListener('click', () => app.newProject());
    const btnStartStory = document.getElementById('btn-start-story');
    if (btnStartStory) btnStartStory.addEventListener('click', () => app.startNewStoryFromPrompt());
    const btnExportProject = document.getElementById('btn-export-project');
    if (btnExportProject) btnExportProject.addEventListener('click', () => app.exportCurrentProject());
  },
renderStory(container, storage, app) {
    const index = storage.getProjectIndex();
    const ids = Object.keys(index);
    const project = app.currentProjectId ? storage.loadProject(app.currentProjectId) : null;
    let html = '<div class="card">' +
      '<h3>Story Engine</h3>' +
      '<p>Expand a one-line idea into a full story structure with 3-act structure, cold open, and cliffhanger.</p>';

    // If we have a project with story data, show it
    if (project && project.story) {
      const s=project.story;
      html += `<h4>Your Story</h4><form id="story-edit-form" class="editor-grid"><label>Working title<input name="title" value="${escapeHTML(s.title)}"></label><label>Logline<textarea name="logline">${escapeHTML(s.logline)}</textarea></label><label>Genre<input name="genre" value="${escapeHTML(s.genre)}"></label><label>Theme<input name="theme" value="${escapeHTML(s.theme)}"></label><label>Three act structure<textarea name="threeActStructure" rows="8">${escapeHTML(s.threeActStructure)}</textarea></label><label>Cold open<textarea name="coldOpen">${escapeHTML(s.coldOpen)}</textarea></label><label>Cliffhanger<textarea name="cliffhanger">${escapeHTML(s.cliffhanger)}</textarea></label><button class="btn btn-primary">Save story</button></form><button class="btn btn-ghost" id="export-story">Export project</button>`;
    }
    // If we have a project but no story yet, show entry form
    else if (project && !project.story) {
      html += '<div style="margin-top:1rem;">';
      html += '<h4>Enter Your One-Line Story Idea</h4>';
      html += '<p>Describe your story in one sentence. It will be expanded into a full 3-act structure.</p>';
      html += '<input type="text" id="story-idea-input" style="width:100%;padding:0.5rem;margin:0.5rem 0;font-size:1rem;border:1px solid var(--border-color);border-radius:var(--radius-sm);" placeholder="e.g. A teenage cowherd finds a red gem that gives him visions of ancestral fire-powers...">';
      html += '<button class="btn btn-primary" id="btn-expand-story">Expand Story</button>';
      html += '</div>';
    }
    // No project loaded - show intro
    else {
      html += '<div style="margin-top:1rem;">';
      html += '<h4>Create a Project First</h4>';
      html += '<p>Click "Create New Project" to start your SA historic-fantasy comic and anime journey.</p>';
      html += '<button class="btn btn-primary" onclick="app.newProject();">Create New Project</button>';
      html += '</div>';
    }

    html += '</div>';

    container.innerHTML = html;
    const expandButton = document.getElementById('btn-expand-story');
    if (expandButton) expandButton.addEventListener('click', () => {
      app.expandStoryFromIdea(app.currentProjectId, document.getElementById('story-idea-input').value);
    });
    const storyForm=document.getElementById('story-edit-form');
    if(storyForm)storyForm.addEventListener('submit',e=>{e.preventDefault();app.saveStoryFromForm(new FormData(storyForm));});
    document.getElementById('export-story')?.addEventListener('click',()=>app.exportCurrentProject());
  },
  renderCharacters(container, storage, app) {
    const project = app.currentProjectId && storage.loadProject(app.currentProjectId);
    if (!project) { container.innerHTML = '<div class="card"><h3>Character Bible</h3><p>Open or create a series before adding characters.</p></div>'; return; }
    const chars = project.characters || [];
    container.innerHTML = `<div class="card"><h3>Character Bible · ${escapeHTML(project.name)}</h3><p>Keep each character’s motives, language, relationships, and status consistent across the series.</p><form id="character-form" class="editor-grid"><label>Name<input name="name" required></label><label>Age<input name="age" type="number" min="0"></label><label>South African setting / background<input name="background"></label><label>Languages<input name="languages" placeholder="isiZulu, English"></label><label>Personality traits<input name="personality" placeholder="curious, patient"></label><label>Abilities<input name="powers"></label><label>Goal<input name="goal"></label><label>Weakness or limitation<input name="weakness"></label><label>Secret<input name="secret"></label><label>Character arc<input name="arc"></label><label>Status<select name="status"><option>alive</option><option>injured</option><option>missing</option><option>deceased</option></select></label><button class="btn btn-primary" type="submit">Add character</button></form><h4>Series characters (${chars.length})</h4><div class="editor-list">${chars.map(ch => `<article class="list-item"><strong>${escapeHTML(ch.name)}</strong> · ${escapeHTML(ch.status || 'alive')} · age ${escapeHTML(ch.age || 'unspecified')}<p>${escapeHTML(ch.background)}</p><p>Languages: ${escapeHTML((ch.languages || []).join(', '))}</p><button type="button" class="btn btn-sm btn-ghost" data-delete-character="${escapeHTML(ch.id)}">Delete</button></article>`).join('') || '<p>No characters yet.</p>'}</div></div>`;
    const characterForm=document.getElementById('character-form');
    const presetTools=document.createElement('div');presetTools.className='preset-tools';presetTools.innerHTML=`<label>Start from a character template<select id="character-preset"><option value="">Choose a template</option>${(window.CHARACTER_PRESETS||[]).map((item,index)=>`<option value="${index}">${escapeHTML(item.name)} · ${escapeHTML(item.saCulture)}</option>`).join('')}</select></label><button type="button" id="apply-character-preset" class="btn btn-sm btn-ghost">Apply to form</button>`;
    characterForm.insertBefore(presetTools,characterForm.firstChild);
    const relationshipLabel=document.createElement('label');relationshipLabel.innerHTML='Relationships <textarea name="relationships" placeholder="Name: relationship and a short note"></textarea>';
    characterForm.insertBefore(relationshipLabel,characterForm.querySelector('[type="submit"]'));
    container.querySelectorAll('.editor-list .list-item').forEach((article,index)=>{const relationships=chars[index]?.relationships||[];if(relationships.length){const detail=document.createElement('p');detail.textContent=`Relationships: ${relationships.map(item=>`${item.name} (${item.note||item.type||'connected'})`).join('; ')}`;article.append(detail);}});
    document.getElementById('apply-character-preset').addEventListener('click',()=>{
      const preset=(window.CHARACTER_PRESETS||[])[Number(document.getElementById('character-preset').value)];if(!preset)return;
      for(const key of ['name','age','background','goal'])characterForm.elements[key].value=preset[key]||'';
      for(const key of ['languages','personality','powers'])characterForm.elements[key].value=(preset[key]||[]).join(', ');
    });
    container.querySelectorAll('.editor-list .list-item').forEach((article,index) => {
      const character=chars[index]; if(!character)return;
      const button=document.createElement('button'); button.type='button'; button.className='btn btn-sm btn-ghost'; button.textContent='Edit'; button.dataset.editCharacter=character.id; article.insertBefore(button,article.firstChild);
    });
    document.getElementById('character-form').addEventListener('submit', e => { e.preventDefault(); app.createCharacter(new FormData(e.currentTarget)); });
    container.querySelectorAll('[data-edit-character]').forEach(b => b.addEventListener('click', () => {
      const character = chars.find(item => item.id === b.dataset.editCharacter); if (!character) return;
      const form = document.getElementById('character-form');
      for (const key of ['name','age','background','goal','weakness','secret','arc','status']) if (form.elements[key]) form.elements[key].value = character[key] ?? '';
      for (const key of ['languages','personality','powers']) if (form.elements[key]) form.elements[key].value = (character[key] || []).join(', ');
      form.elements.relationships.value=(character.relationships||[]).map(item=>`${item.name}: ${item.note||item.type||''}`).join('\n');
      app.editCharacterId = character.id;
      form.querySelector('[type="submit"]').textContent = 'Save character';
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    container.querySelectorAll('[data-delete-character]').forEach(b => b.addEventListener('click', () => app.deleteCharacter(b.dataset.deleteCharacter)));
  },
  renderScenes(container, storage, app) {
    const index = storage.getProjectIndex();
    const ids = Object.keys(index);
    let html =
      '<div class="card">' +
      '<h3>Scene Breaker</h3>' +
      '<p>Cold Open / Act 1 / Act 2 / Climax / Ending / Cliffhanger with location, goal, conflict, dialogue, visual, characters.</p>';
    if (ids.length > 0) {
      html += '<h4>Scenes by Project</h4><div style="display:flex;flex-direction:column;gap:0.5rem;">';
      for (const id of ids) {
        const p = index[id];
        html +=
          '<div class="list-item" onclick="app.loadProject(\'' + id + '\')">' +
          '<h4>' + p.name + '</h4>' +
          '<p>' + p.status + '</p>' +
          '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
  },
  renderComic(container, storage, app) {
    const index = storage.getProjectIndex();
    const ids = Object.keys(index);
    let html =
      '<div class="card">' +
      '<h3>Comic Builder</h3>' +
      '<p>Pages > Panels with visual prompts, dialogue, narration, SFX. Create comic pages and panels visually.</p>' +
      '<button class="btn btn-primary" id="btn-preset-bg" style="margin-top:0.75rem;">Load Preset Background</button>' +
      '<div id="preset-bg-list" style="margin-top:0.75rem;"></div>';
    if (ids.length > 0) {
      html += '<h4>Comic Pages by Project</h4><div style="display:flex;flex-direction:column;gap:0.5rem;">';
      for (const id of ids) {
        const p = index[id];
        html +=
          '<div class="list-item" onclick="app.loadProject(\'' + id + '\')">' +
          '<h4>' + p.name + '</h4>' +
          '<p>' + p.status + '</p>' +
          '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
    const presetBgContainer = document.getElementById('preset-bg-list');
    if (presetBgContainer) {
      fetch('presets/backgrounds.json').then(r => r.json()).then(data => {
        let btnHtml = '<h4>Choose a SA Background</h4><div style="display:flex;flex-direction:column;gap:0.5rem;">';
        data.presets.forEach(p => {
          btnHtml += '<button class="btn btn-sm btn-ghost" onclick="app.loadPresetBackground(\'' + p.name + '\', \'' + p.prompt.replace(/'/g, "\\'") + '\')">' + p.name + '</button>';
        });
        btnHtml += '</div>';
        presetBgContainer.innerHTML = btnHtml;
      }).catch(e => console.error('Failed to load background presets:', e));
    }
  },
  renderReadMode(container, storage, app) {
    const index = storage.getProjectIndex();
    const ids = Object.keys(index);
    let html =
      '<div class="card">' +
      '<h3>Read Mode</h3>' +
      '<p>Flip-through comic reader. Read your comic pages in order.</p>';
    if (ids.length > 0) {
      html += '<h4>Available Comics</h4><div style="display:flex;flex-direction:column;gap:0.5rem;">';
      for (const id of ids) {
        const p = index[id];
        html +=
          '<div class="list-item" onclick="app.loadProject(\'' + id + '\')">' +
          '<h4>' + p.name + '</h4>' +
          '<p>' + p.status + '</p>' +
          '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
  },
  renderAnime(container, storage, app) {
    const index = storage.getProjectIndex();
    const ids = Object.keys(index);
    let html =
      '<div class="card">' +
      '<h3>Anime Blueprint</h3>' +
      '<p>Generate anime script from comic pages.</p>';
    if (ids.length > 0) {
      html += '<h4>Projects</h4><div style="display:flex;flex-direction:column;gap:0.5rem;">';
      for (const id of ids) {
        const p = index[id];
        html +=
          '<div class="list-item" onclick="app.loadProject(\'' + id + '\')">' +
          '<h4>' + p.name + '</h4>' +
          '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
  }
};

function escapeHTML(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }
function safeImageUrl(value) { try { const parsed=new URL(value,document.baseURI); return ['http:','https:','file:'].includes(parsed.protocol)?value:''; } catch { return ''; } }

UI.renderScenes = function(container, storage, app) {
  const project = app.currentProjectId && storage.loadProject(app.currentProjectId);
  if (!project) { container.innerHTML = '<div class="card"><h3>Scene Breaker</h3><p>Open a series before creating scenes.</p></div>'; return; }
  const scenes = (project.story && project.story.scenes) || [];
  container.innerHTML = `<div class="card"><h3>Scene Breaker · ${escapeHTML(project.name)}</h3><form id="scene-form" class="editor-grid"><label>Beat<select name="segment"><option>Cold Open</option><option>Act 1</option><option>Act 2</option><option>Climax</option><option>Ending</option><option>Cliffhanger</option></select></label><label>Location<input name="location" required></label><label>Goal<input name="goal"></label><label>Conflict<input name="conflict"></label><label>Characters<input name="characters" placeholder="Names separated by commas"></label><label>Dialogue<textarea name="dialogue"></textarea></label><label>Visual description<textarea name="visual"></textarea></label><button class="btn btn-primary">Add scene</button></form><h4>Scenes (${scenes.length})</h4>${scenes.map((s,i)=>`<article class="list-item"><strong>${i+1}. ${escapeHTML(s.segment)} · ${escapeHTML(s.location)}</strong><p>${escapeHTML(s.goal)} · ${escapeHTML(s.conflict)}</p><p>Language: ${escapeHTML(s.language||'en')} · ${escapeHTML(s.dialogue)}</p>${s.subtitles?`<p>Subtitle: ${escapeHTML(s.subtitles)}</p>`:''}<p>${escapeHTML(s.visual)}</p><button data-delete-scene="${escapeHTML(s.id)}" class="btn btn-sm btn-ghost">Delete</button></article>`).join('') || '<p>No scenes yet.</p>'}</div>`;
  const sceneForm=document.getElementById('scene-form');
  const languageLabel=document.createElement('label');languageLabel.textContent='Dialogue language';
  const language=document.createElement('select');language.name='language';[['en','English'],['zu','isiZulu'],['xh','isiXhosa'],['af','Afrikaans'],['st','Sesotho'],['tn','Setswana'],['nso','Sepedi'],['ss','siSwati'],['ve','Tshivenda'],['ts','itsonga'],['nr','isiNdebele']].forEach(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;language.append(option);});languageLabel.append(language);
  const subtitleLabel=document.createElement('label');subtitleLabel.innerHTML='Subtitle / translation<textarea name="subtitles" placeholder="Optional translation or subtitle text"></textarea>';
  const submit=sceneForm.querySelector('[type="submit"],button:not([type])');sceneForm.insertBefore(languageLabel,submit);sceneForm.insertBefore(subtitleLabel,submit);
  container.querySelectorAll('[data-delete-scene]').forEach(button=>{
    const scene=scenes.find(item=>item.id===button.dataset.deleteScene); if(!scene)return;
    const edit=document.createElement('button');edit.type='button';edit.className='btn btn-sm btn-ghost';edit.textContent='Edit';
      edit.onclick=()=>{const form=document.getElementById('scene-form');for(const key of ['segment','location','goal','conflict','dialogue','visual','language','subtitles'])form.elements[key].value=scene[key]||'';form.elements.characters.value=(scene.characters||[]).join(', ');app.editSceneId=scene.id;form.querySelector('button').textContent='Save scene';form.scrollIntoView({behavior:'smooth'});};
    button.parentElement.insertBefore(edit,button);
  });
  document.getElementById('scene-form').addEventListener('submit',e=>{e.preventDefault();app.createScene(new FormData(e.currentTarget));});
  container.querySelectorAll('[data-delete-scene]').forEach(b=>b.addEventListener('click',()=>app.deleteScene(b.dataset.deleteScene)));
};

UI.renderComic = function(container, storage, app) {
  const project = app.currentProjectId && storage.loadProject(app.currentProjectId);
  if (!project) { container.innerHTML = '<div class="card"><h3>Comic Builder</h3><p>Open a series before creating comic pages.</p></div>'; return; }
  const pages = project.comic?.pages || [];
  container.innerHTML = `<div class="card"><h3>Comic Builder · ${escapeHTML(project.name)}</h3><button id="add-page" class="btn btn-primary">Add page</button> <button id="export-comic" class="btn btn-ghost">Export comic HTML</button><div id="bg-options"></div>${pages.map(page=>`<section class="comic-page"><h4>Page ${page.number}</h4><button data-add-panel="${escapeHTML(page.id)}" class="btn btn-sm btn-ghost">Add panel</button> <button data-delete-page="${escapeHTML(page.id)}" class="btn btn-sm btn-ghost">Delete page</button>${(page.panels||[]).map(p=>`<article class="panel-editor"><h5>Panel ${p.number}</h5><label>Visual prompt<textarea data-f="visualPrompt" data-p="${escapeHTML(page.id)}" data-i="${escapeHTML(p.id)}">${escapeHTML(p.visualPrompt)}</textarea></label><label>Dialogue<textarea data-f="dialogue" data-p="${escapeHTML(page.id)}" data-i="${escapeHTML(p.id)}">${escapeHTML(p.dialogue)}</textarea></label><label>Narration<input data-f="narration" data-p="${escapeHTML(page.id)}" data-i="${escapeHTML(p.id)}" value="${escapeHTML(p.narration)}"></label><label>Sound effect<input data-f="sfx" data-p="${escapeHTML(page.id)}" data-i="${escapeHTML(p.id)}" value="${escapeHTML(p.sfx)}"></label><button data-save-panel="${escapeHTML(page.id)}|${escapeHTML(p.id)}" class="btn btn-sm btn-ghost">Save panel</button> <button data-delete-panel="${escapeHTML(page.id)}|${escapeHTML(p.id)}" class="btn btn-sm btn-ghost">Delete panel</button></article>`).join('')}</section>`).join('') || '<p>No pages yet.</p>'}</div>`;
  container.querySelectorAll('.panel-editor').forEach(root=>{
    const promptField=root.querySelector('[data-f="visualPrompt"]'); const panel=(project.comic.pages.find(page=>page.id===promptField.dataset.p)?.panels||[]).find(item=>item.id===promptField.dataset.i);
    const label=document.createElement('label');label.textContent='Artwork image URL (optional)';
    const input=document.createElement('input');input.type='url';input.placeholder='https://… or a relative image path';input.value=panel?.imageUrl||'';input.dataset.f='imageUrl';input.dataset.p=promptField.dataset.p;input.dataset.i=promptField.dataset.i;label.appendChild(input);root.insertBefore(label,root.querySelector('[data-f="dialogue"]'));
    const uploadLabel=document.createElement('label');uploadLabel.textContent='Upload artwork (15 MB max)';const upload=document.createElement('input');upload.type='file';upload.accept='image/*';upload.dataset.uploadImage=`${promptField.dataset.p}|${promptField.dataset.i}`;uploadLabel.append(upload);root.insertBefore(uploadLabel,root.querySelector('[data-f="dialogue"]'));
    const languageLabel=document.createElement('label');languageLabel.textContent='Dialogue language';const language=document.createElement('select');language.dataset.f='dialogueLanguage';language.dataset.p=promptField.dataset.p;language.dataset.i=promptField.dataset.i;
    [['en','English'],['zu','isiZulu'],['xh','isiXhosa'],['af','Afrikaans'],['st','Sesotho'],['tn','Setswana'],['nso','Sepedi'],['ss','siSwati'],['ve','Tshivenda'],['ts','itsonga'],['nr','isiNdebele']].forEach(([value,text])=>{const option=document.createElement('option');option.value=value;option.textContent=text;language.append(option);});language.value=panel?.dialogueLanguage||'en';languageLabel.append(language);root.insertBefore(languageLabel,root.querySelector('[data-f="dialogue"]'));
    const subtitleLabel=document.createElement('label');subtitleLabel.textContent='Subtitle / translation';const subtitle=document.createElement('textarea');subtitle.dataset.f='subtitles';subtitle.dataset.p=promptField.dataset.p;subtitle.dataset.i=promptField.dataset.i;subtitle.value=panel?.subtitles||'';subtitleLabel.append(subtitle);root.insertBefore(subtitleLabel,root.querySelector('[data-f="narration"]'));
  });
  document.getElementById('add-page').onclick=()=>app.addComicPage(); document.getElementById('export-comic').onclick=()=>app.exportComic();
  container.querySelectorAll('[data-add-panel]').forEach(b=>b.onclick=()=>app.addComicPanel(b.dataset.addPanel));
  container.querySelectorAll('[data-delete-page]').forEach(b=>b.onclick=()=>app.deleteComicPage(b.dataset.deletePage));
  container.querySelectorAll('[data-save-panel]').forEach(b=>b.onclick=()=>app.saveComicPanel(b.dataset.savePanel));
  container.querySelectorAll('[data-f]').forEach(field=>field.addEventListener('change',()=>app.saveComicPanel(`${field.dataset.p}|${field.dataset.i}`)));
  container.querySelectorAll('[data-upload-image]').forEach(input=>input.addEventListener('change',()=>{if(input.files[0])app.uploadPanelImage(input.dataset.uploadImage,input.files[0]);}));
  container.querySelectorAll('[data-delete-panel]').forEach(b=>b.onclick=()=>app.deleteComicPanel(b.dataset.deletePanel));
  const presets=[...(window.BACKGROUND_PRESETS||[]),...((project.memory&&project.memory.backgrounds)||[])];const target=document.getElementById('bg-options');
  if(target){target.innerHTML=`<label>South African setting<select id="bg-select"><option value="">Choose setting</option>${presets.map((p,i)=>`<option value="${i}">${escapeHTML(p.name)} · ${escapeHTML(p.saCulture)}</option>`).join('')}</select></label><button id="apply-bg" type="button" class="btn btn-sm btn-ghost">Use background in next panel</button><p id="bg-prompt"></p>`;document.getElementById('bg-select').onchange=e=>{const p=presets[e.target.value];target.dataset.prompt=p?p.prompt:'';document.getElementById('bg-prompt').textContent=p?p.prompt:'';};document.getElementById('apply-bg').onclick=()=>app.setPendingBackground(target.dataset.prompt||'');}
};

UI.renderReadMode = function(container, storage, app) {
  const project = app.currentProjectId && storage.loadProject(app.currentProjectId);
  if (!project) { container.innerHTML='<div class="card"><h3>Read Mode</h3><p>Open a series to read its comic.</p></div>'; return; }
  const pages=project.comic?.pages||[]; const index=Math.max(0,Math.min(app.readPageIndex||0,pages.length-1)); const page=pages[index];
  container.innerHTML=`<div class="card read-mode"><h3>${escapeHTML(project.name)} · Read Mode</h3>${page?`<h4>Page ${page.number} / ${pages.length}</h4><div class="reader-panels">${(page.panels||[]).map(p=>`<article class="reader-panel">${p.imageAssetId?`<div class="art-placeholder" data-asset-image="${escapeHTML(p.imageAssetId)}">Loading artwork…</div>`:safeImageUrl(p.imageUrl)?`<img class="panel-art" src="${escapeHTML(safeImageUrl(p.imageUrl))}" alt="Comic panel ${p.number}">`:`<div class="art-placeholder">${escapeHTML(p.visualPrompt||'Artwork not added yet')}</div>`}${p.narration?`<p>${escapeHTML(p.narration)}</p>`:''}${p.dialogue?`<blockquote lang="${escapeHTML(p.dialogueLanguage||'en')}">${escapeHTML(p.dialogue)}</blockquote>`:''}${p.subtitles?`<p class="subtitle">${escapeHTML(p.subtitles)}</p>`:''}${p.sfx?`<strong>${escapeHTML(p.sfx)}</strong>`:''}</article>`).join('')}</div><button id="reader-prev" class="btn btn-ghost" ${index===0?'disabled':''}>Previous</button> <button id="reader-next" class="btn btn-primary" ${index>=pages.length-1?'disabled':''}>Next</button>`:'<p>No comic pages yet. Add pages in Comic Builder.</p>'}</div>`;
  app.releaseAssetUrls();
  container.querySelectorAll('[data-asset-image]').forEach(async placeholder=>{try{const asset=await AssetStore.get(placeholder.dataset.assetImage);if(!asset||!placeholder.isConnected)return;const url=URL.createObjectURL(asset.blob);app.assetUrls.push(url);const image=document.createElement('img');image.src=url;image.alt='Uploaded comic panel artwork';image.className='panel-art';placeholder.replaceWith(image);}catch(error){placeholder.textContent='Artwork is unavailable on this device.';}});
  document.getElementById('reader-prev')?.addEventListener('click',()=>{app.readPageIndex--;app.renderReadMode();}); document.getElementById('reader-next')?.addEventListener('click',()=>{app.readPageIndex++;app.renderReadMode();});
};

UI.renderAnime = function(container, storage, app) {
  const project=app.currentProjectId&&storage.loadProject(app.currentProjectId); if(!project){container.innerHTML='<div class="card"><h3>Anime Blueprint</h3><p>Open a series first.</p></div>';return;}
  const shots=project.animeBlueprint||[]; const total=shots.reduce((sum,s)=>sum+Number(s.durationSeconds||0),0);
  container.innerHTML=`<div class="card"><h3>Anime Blueprint · ${escapeHTML(project.name)}</h3><p>Generate editable shots from comic panels. Target runtime: 300–420 seconds.</p><label>Target duration in seconds<input id="anime-duration" type="number" min="300" max="420" step="15" value="${project.animeDuration||360}"></label><button id="generate-shots" class="btn btn-primary">Generate shots</button> <button id="balance-shots" class="btn btn-ghost">Distribute target across shots</button> <button id="export-anime" class="btn btn-ghost">Export shot list</button><p>Current runtime: ${total}s${shots.length&&(total<300||total>420)?' — outside target':''}</p>${shots.map((s,i)=>`<article class="list-item"><h4>Shot ${i+1} · page ${s.pageNumber}, panel ${s.panelNumber}</h4><label>Movement<input data-shot="${i}" data-key="movement" value="${escapeHTML(s.movement)}"></label><label>Voice line<textarea data-shot="${i}" data-key="voiceLine">${escapeHTML(s.voiceLine)}</textarea></label><label>Sound cue<input data-shot="${i}" data-key="soundCue" value="${escapeHTML(s.soundCue)}"></label><label>Duration<input type="number" min="1" max="60" data-shot="${i}" data-key="durationSeconds" value="${s.durationSeconds}"></label></article>`).join('')}</div>`;
  container.querySelectorAll('.card > .list-item').forEach((article,index)=>{
    const shot=shots[index];if(!shot)return;
    const addControl=(labelText,key,options)=>{const label=document.createElement('label');label.textContent=labelText;let control;if(options){control=document.createElement('select');options.forEach(([value,text])=>{const option=document.createElement('option');option.value=value;option.textContent=text;control.append(option);});control.value=shot[key]||options[0][0];}else{control=document.createElement('input');control.value=shot[key]||'';}control.dataset.shot=String(index);control.dataset.key=key;label.append(control);article.append(label);};
    addControl('Shot size','shotType',[['establishing','Establishing'],['wide','Wide'],['medium','Medium'],['close_up','Close up'],['insert','Insert']]);
    addControl('Camera angle','cameraAngle',[['eye_level','Eye level'],['high_angle','High angle'],['low_angle','Low angle'],['over_shoulder','Over the shoulder'],['bird_eye','Bird’s eye']]);
    addControl('Voice character','voiceCharacter');addControl('Dialogue language','language',[['en','English'],['zu','isiZulu'],['xh','isiXhosa'],['af','Afrikaans'],['st','Sesotho'],['tn','Setswana'],['nso','Sepedi'],['ss','siSwati'],['ve','Tshivenda'],['ts','itsonga'],['nr','isiNdebele']]);
    const label=document.createElement('label');label.textContent='Subtitle / translation';const field=document.createElement('textarea');field.value=shot.subtitles||'';field.dataset.shot=String(index);field.dataset.key='subtitles';label.append(field);article.append(label);addControl('Music cue','musicCue');
  });
  document.getElementById('generate-shots').onclick=()=>app.generateAnimeShots(Number(document.getElementById('anime-duration').value));document.getElementById('balance-shots').onclick=()=>app.balanceAnimeShots(Number(document.getElementById('anime-duration').value));document.getElementById('export-anime').onclick=()=>app.exportAnimeShots();
  container.querySelectorAll('[data-shot]').forEach(el=>el.addEventListener('change',()=>app.updateAnimeShot(Number(el.dataset.shot),el.dataset.key,el.value)));
};

UI.renderMemory = function(container, storage, app) {
  const project = app.currentProjectId ? storage.loadProject(app.currentProjectId) : null;
  if (!project) {
    container.innerHTML = '<div class="card"><h3>Series Memory</h3><p>Open a series first. Its canon, continuity notes, and creator notes will be saved in this browser with the project.</p></div>';
    return;
  }
  const memory = project.memory || { canon: [], continuity: [], notes: '' };
  const canonItems = (memory.canon || []).map(item => `<li>${escapeHTML(item.text)}</li>`).join('');
  const continuityItems = (memory.continuity || []).map(item => `<li>${escapeHTML(item)}</li>`).join('');
  container.innerHTML = `<div class="card"><h3>Series Memory</h3><p>Saved with <strong>${escapeHTML(project.name)}</strong> in this browser. Export the project JSON for backup or transfer.</p><h4>Canon</h4><ul>${canonItems || '<li>Your premise and fixed facts appear here.</li>'}</ul><h4>Continuity notes</h4><ul>${continuityItems || '<li>Accepted continuity overrides are recorded here.</li>'}</ul><label for="memory-notes">Creator notes</label><textarea id="memory-notes" rows="8" style="width:100%;margin:.5rem 0;">${escapeHTML(memory.notes)}</textarea><button class="btn btn-primary" id="save-memory">Save Memory</button></div>`;
  document.getElementById('memory-notes').addEventListener('input', () => app.saveMemory());
  const backgrounds=memory.backgrounds||[];const bgManager=document.createElement('section');bgManager.innerHTML=`<h4>My background prompts</h4><form id="background-form" class="editor-grid"><label>Name<input name="name" required></label><label>Region or culture<input name="saCulture"></label><label>Visual prompt<textarea name="prompt" required></textarea></label><button class="btn btn-ghost">Add background</button></form><div class="editor-list">${backgrounds.map((item,index)=>`<article class="list-item"><strong>${escapeHTML(item.name)}</strong> · ${escapeHTML(item.saCulture)}<p>${escapeHTML(item.prompt)}</p><button data-delete-background="${index}" type="button" class="btn btn-sm btn-ghost">Delete</button></article>`).join('')||'<p>No custom backgrounds yet.</p>'}</div>`;
  const saveButton=document.getElementById('save-memory');saveButton.parentElement.insertBefore(bgManager,saveButton);
  document.getElementById('background-form').addEventListener('submit',event=>{event.preventDefault();app.addBackground(new FormData(event.currentTarget));});
  bgManager.querySelectorAll('[data-delete-background]').forEach(button=>button.addEventListener('click',()=>app.deleteBackground(Number(button.dataset.deleteBackground))));
  document.getElementById('save-memory').addEventListener('click', () => {
    app.saveMemory();
  });
};

// Expose the UI API across classic script files.
window.UI = UI;
