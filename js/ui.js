/* ComicForge SA — UI Controller */

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
      '<h3>Create New Series</h3>' +
      '<p>Start your South African historic-fantasy comic and anime journey.</p>' +
      '<button class="btn btn-primary" id="btn-create">Create New Project</button>' +
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
    container.innerHTML = html;
  },

  renderCharacters(container, storage, app) {
    const index = storage.getProjectIndex();
    const ids = Object.keys(index);
    let html =
      '<div class="card">' +
      '<h3>Character Bible</h3>' +
      '<p>Full CRUD: name, age, SA background, languages, personality, powers, weakness, goal, secret, arc, dog bond, status.</p>';
    if (ids.length > 0) {
      html += '<h4>Characters by Project</h4><div style="display:flex; flex-direction:column; gap:0.5rem;">';
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

  renderScenes(container, storage, app) {
    const index = storage.getProjectIndex();
    const ids = Object.keys(index);
    let html =
      '<div class="card">' +
      '<h3>Scene Breaker</h3>' +
      '<p>Cold Open / Act 1 / Act 2 / Climax / Ending / Cliffhanger with location, goal, conflict, dialogue, visual, characters.</p>';
    if (ids.length > 0) {
      html += '<h4>Scenes by Project</h4><div style="display:flex; flex-direction:column; gap:0.5rem;">';
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
      '<p>Pages > Panels with visual prompts, dialogue, narration, SFX. Create comic pages and panels visually.</p>';
    if (ids.length > 0) {
      html += '<h4>Comic Pages by Project</h4><div style="display:flex; flex-direction:column; gap:0.5rem;">';
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

  renderReadMode(container, storage, app) {
    const index = storage.getProjectIndex();
    const ids = Object.keys(index);
    let html =
      '<div class="card">' +
      '<h3>Read Mode</h3>' +
      '<p>Flip-through comic reader. Read your comic pages in order.</p>';
    if (ids.length > 0) {
      html += '<h4>Available Comics</h4><div style="display:flex; flex-direction:column; gap:0.5rem;">';
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
      '<p>Comic pages → motion-comic shot list (camera, movement, voice line, sound cue, duration). Convert comic to anime script.</p>';
    if (ids.length > 0) {
      html += '<h4>Anime Blueprints</h4><div style="display:flex; flex-direction:column; gap:0.5rem;">';
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

  _showAutosave() {
    const indicator = document.getElementById('autosave-indicator');
    if (indicator) indicator.style.opacity = '1';
    setTimeout(() => { if (indicator) indicator.style.opacity = '0.6'; }, 1500);
  },

  _startAutosaveHeartbeat(app) {
    setInterval(() => {
      if (app.currentProjectId) {
        const indicator = document.getElementById('autosave-indicator');
        if (indicator) indicator.style.opacity = '1';
        setTimeout(() => { if (indicator) indicator.style.opacity = '0.6'; }, 800);
      }
    }, 5000);
  }
};
