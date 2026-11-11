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
            <p>Status: <span class="badge">${p.status}</span> • Last updated: ${new Date(p.updatedAt).toLocaleDateString()}</p>
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
    document.getElementById('btn-create').addEventListener('click', () => app.newProject());
  },

  renderStory(container, storage, app) {
    // Moved to story-engine.js — see story-engine.js for content
  },

  renderCharacters(container, storage, app) {
    // Moved to character-engine.js — see character-engine.js for content
  },

  renderScenes(container, storage, app) {
    // Moved to comic-builder.js — see comic-builder.js for content
  },

  renderComic(container, storage, app) {
    // Moved to comic-builder.js — see comic-builder.js for content
  },

  renderReadMode(container, storage, app) {
    // Moved to comic-builder.js — see comic-builder.js for content
  },

  renderAnime(container, storage, app) {
    // Moved to anime-adapter.js — see anime-adapter.js for content
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