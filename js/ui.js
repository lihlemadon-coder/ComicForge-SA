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
          '<h4>' + p.name + '</h4>' +
          '<p>Status: <span class="badge">' + p.status + '</span> • Last updated: ' + new Date(p.updatedAt).toLocaleDateString() + '</p>' +
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
    let html =
      '<div class="card">' +
      '<h3>Story Engine</h3>' +
      '<p>Expand a one-line idea into a full story structure with 3-act structure, cold open, and cliffhanger.</p>';
    if (ids.length > 0) {
      html += '<h4>Projects</h4><div style="display:flex; flex-direction:column; gap:0.5rem;">';
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
    html += '<div class="card" style="margin-top:1rem;"><details style="border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.75rem;"><summary style="cursor:pointer;font-weight:bold;color:var(--accent-primary);">Cultural Notes — isiZulu &amp; South African Traditions</summary><ul style="margin-top:0.5rem;font-size:0.85rem;"><li>isiZulu dialogue paired with English subtitles — ancestors speak in their own tongue.</li><li>Sangoma, tikoloshe, ancestral visions are real cultural beliefs — treat with respect, never as monsters.</li><li>Ubuntu: "I am because we are" — community matters more than individual glory.</li><li>Clan elements: Zulu=Fire/Lightning, SiSwati=Air, Xhosa=Water, Ndebele=Earth, Sotho/Tswana=Nature.</li><li>Mixed DNA characters have hybrid powers — celebrate hybridity, don&#39;t erase it.</li></ul></details></div>';
    container.innerHTML = html;
  },
  renderCharacters(container, storage, app) {
    const index = storage.getProjectIndex();
    const ids = Object.keys(index);
    let html =
      '<div class="card">' +
      '<h3>Character Bible</h3>' +
      '<p>Full CRUD: name, age, SA background, languages, personality, powers, weakness, goal, secret, arc, dog bond, status.</p>' +
      '<button class="btn btn-primary" id="btn-preset-char" style="margin-top:0.75rem;">Load Preset Character</button>' +
      '<div id="preset-char-list" style="margin-top:0.75rem;"></div>';
    if (ids.length > 0) {
      html += '<h4>Characters by Project</h4><div style="display:flex;flex-direction:column;gap:0.5rem;">';
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
    const presetCharContainer = document.getElementById('preset-char-list');
    if (presetCharContainer) {
      fetch('presets/characters.json').then(r => r.json()).then(data => {
        let btnHtml = '<h4>Choose a SA Preset Character</h4><div style="display:flex;flex-direction:column;gap:0.5rem;">';
        data.presets.forEach(p => {
          btnHtml += '<button class="btn btn-sm btn-ghost" onclick="app.loadPresetCharacter(\'' + p.name + '\', \'' + JSON.stringify(p).replace(/'/g, "\\'") + '\')">' + p.name + ' — ' + p.saCulture + '</button>';
        });
        btnHtml += '</div>';
        presetCharContainer.innerHTML = btnHtml;
      }).catch(e => console.error('Failed to load character presets:', e));
    }
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
