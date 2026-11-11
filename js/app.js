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
  }
};
