/* ComicForge SA — Storage Layer (localStorage) */

const STORAGE_PREFIX = 'comicforge_';

const storage = {
  /**
   * Save a project object to localStorage
   */
  saveProject(id, data) {
    try {
      const payload = {
        ...data,
        id,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(payload));
      this._updateProjectList(id, payload);
      return true;
    } catch (e) {
      console.error('saveProject error:', e);
      return false;
    }
  },

  /**
   * Load a project by id
   */
  loadProject(id) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + id);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('loadProject error:', e);
      return null;
    }
  },

  /**
   * List all project ids
   */
  listProjects() {
    try {
      const ids = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          ids.push(key.replace(STORAGE_PREFIX, ''));
        }
      }
      return ids.sort();
    } catch (e) {
      console.error('listProjects error:', e);
      return [];
    }
  },

  /**
   * Delete a project
   */
  deleteProject(id) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + id);
      this._removeFromProjectList(id);
      return true;
    } catch (e) {
      console.error('deleteProject error:', e);
      return false;
    }
  },

  /**
   * Export all projects as a single JSON blob
   */
  exportAll() {
    const projects = {};
    const ids = this.listProjects();
    for (const id of ids) {
      const p = this.loadProject(id);
      if (p) projects[id] = p;
    }
    const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comicforge_export_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Import projects from a JSON file input element
   */
  importFromFile(file, onComplete) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        let count = 0;
        for (const [id, project] of Object.entries(data)) {
          this.saveProject(id, project);
          count++;
        }
        onComplete(null, count);
      } catch (err) {
        onComplete(err);
      }
    };
    reader.readAsText(file);
  },

  /* Internal: keep a lightweight project index for fast dashboard listing */
  _updateProjectList(id, payload) {
    try {
      const indexKey = STORAGE_PREFIX + '__index__';
      let index = {};
      const raw = localStorage.getItem(indexKey);
      if (raw) index = JSON.parse(raw);
      index[id] = {
        id,
        name: payload.name || 'Untitled',
        updatedAt: payload.updatedAt,
        status: payload.status || 'idea'
      };
      localStorage.setItem(indexKey, JSON.stringify(index));
    } catch (e) {
      /* ignore index errors; dashboard can fall back to scanning keys */
    }
  },

  _removeFromProjectList(id) {
    try {
      const indexKey = STORAGE_PREFIX + '__index__';
      let index = {};
      const raw = localStorage.getItem(indexKey);
      if (raw) index = JSON.parse(raw);
      delete index[id];
      localStorage.setItem(indexKey, JSON.stringify(index));
    } catch (e) {
      /* ignore */
    }
  },

  getProjectIndex() {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + '__index__');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }
};