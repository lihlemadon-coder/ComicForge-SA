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
      const project = JSON.parse(raw);
      project.memory = project.memory || { canon: [], continuity: [], notes: '' };
      project.memory.canon = project.memory.canon || [];
      project.memory.continuity = project.memory.continuity || [];
      project.memory.backgrounds = project.memory.backgrounds || [];
      project.memory.notes = project.memory.notes || '';
      return project;
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
        if (key && key.startsWith(STORAGE_PREFIX) && key !== STORAGE_PREFIX + '__index__') {
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
  async deleteProject(id) {
    try {
      const project=this.loadProject(id);
      for(const page of project?.comic?.pages||[])for(const panel of page.panels||[])if(panel.imageAssetId){try{await AssetStore.delete(panel.imageAssetId);}catch(error){console.warn('Could not remove artwork asset:',error);}}
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
  async exportAll() {
    const projects = {};
    const ids = this.listProjects();
    for (const id of ids) {
      const p = this.loadProject(id);
      if (p) projects[id] = await this._embedAssets(p);
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
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const projects = data && data.name && typeof data === 'object' ? { [data.id || `proj_${Date.now()}`]: data } : data;
        if (!projects || typeof projects !== 'object' || Array.isArray(projects)) throw new Error('Expected a project or project bundle.');
        let count = 0;
        for (const [id, project] of Object.entries(projects)) {
          if (!project || typeof project !== 'object' || typeof project.name !== 'string') continue;
          const safeId = String(project.id || id).replace(/[^\w-]/g, '_');
          for (const page of project.comic?.pages || []) for (const panel of page.panels || []) {
            if (panel.imageData) {
              const response = await fetch(panel.imageData);
              const blob = await response.blob();
              panel.imageAssetId = `${safeId}_${panel.id}`;
              await AssetStore.save(panel.imageAssetId, blob);
              delete panel.imageData;
            }
          }
          if (!this.saveProject(safeId, project)) throw new Error(`Could not import ${project.name}.`);
          count++;
        }
        if (!count) throw new Error('No valid projects were found in this file.');
        onComplete(null, count);
      } catch (err) {
        onComplete(err);
      }
    };
    reader.readAsText(file);
  },

  async _embedAssets(project) {
    const copy = JSON.parse(JSON.stringify(project));
    for (const page of copy.comic?.pages || []) for (const panel of page.panels || []) {
      if (!panel.imageAssetId) continue;
      try {
        const asset = await AssetStore.get(panel.imageAssetId);
        if (asset) panel.imageData = await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(asset.blob);});
      } catch (error) { console.warn('Image omitted from JSON backup:', error); }
    }
    return copy;
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
      if (raw) return JSON.parse(raw);
      const index = {};
      for (const id of this.listProjects()) {
        const project = this.loadProject(id);
        if (project) index[id] = { id, name: project.name || 'Untitled', status: project.status || 'idea', updatedAt: project.updatedAt };
      }
      return index;
    } catch (e) {
      return {};
    }
  }
};
