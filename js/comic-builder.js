/* ComicForge SA — Comic Builder */

const ComicBuilder = {
  addPage(project) {
    const comic = project.comic || { pages: [] };
    if (!comic.pages) comic.pages = [];
    const page = {
      id: 'page_' + Date.now(),
      number: comic.pages.length + 1,
      panels: []
    };
    comic.pages.push(page);
    project.comic = comic;
    return page;
  },

  deletePage(project, pageId) {
    const comic = project.comic || { pages: [] };
    comic.pages = comic.pages.filter(p => p.id !== pageId);
    comic.pages.forEach((p, i) => p.number = i + 1);
    project.comic = comic;
  },

  addPanel(pageId, project) {
    const comic = project.comic || { pages: [] };
    const page = comic.pages.find(p => p.id === pageId);
    if (!page) return null;
    if (!page.panels) page.panels = [];
    const panel = {
      id: 'panel_' + Date.now(),
      number: page.panels.length + 1,
      visualPrompt: '',
      dialogue: '',
      narration: '',
      sfx: ''
    };
    page.panels.push(panel);
    project.comic = comic;
    return panel;
  },

  deletePanel(project, pageId, panelId) {
    const comic = project.comic || { pages: [] };
    const page = comic.pages.find(p => p.id === pageId);
    if (!page) return;
    page.panels = page.panels.filter(p => p.id !== panelId);
    page.panels.forEach((p, i) => p.number = i + 1);
    project.comic = comic;
  },

  savePanel(project, pageId, panelId, data) {
    const comic = project.comic || { pages: [] };
    const page = comic.pages.find(p => p.id === pageId);
    if (!page) return;
    const panel = page.panels.find(p => p.id === panelId);
    if (!panel) return;
    if (data.visualPrompt !== undefined) panel.visualPrompt = data.visualPrompt;
    if (data.dialogue !== undefined) panel.dialogue = data.dialogue;
    if (data.narration !== undefined) panel.narration = data.narration;
    if (data.sfx !== undefined) panel.sfx = data.sfx;
    project.comic = comic;
  },

  getPanelHTML(panel, pageId) {
    return `<div class="list-item" style="border:1px solid var(--accent-secondary);">
      <div style="display:flex;gap:0.5rem;align-items:flex-start;">
        <div style="width:80px;height:100px;background:var(--bg-app);border:1px dashed var(--border-color);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:var(--text-muted);flex-shrink:0;">Panel ${panel.number}</div>
        <div style="flex:1;">
          <div class="input-group" style="margin-bottom:0.25rem;">
            <label>Visual Prompt</label>
            <input id="panel-visual-${panel.id}" value="${panel.visualPrompt || ''}">
          </div>
          <div class="input-group" style="margin-bottom:0.25rem;">
            <label>Dialogue</label>
            <textarea id="panel-dialogue-${panel.id}" rows="1">${panel.dialogue || ''}</textarea>
          </div>
          <div class="input-group" style="margin-bottom:0.25rem;">
            <label>Narration</label>
            <input id="panel-narration-${panel.id}" value="${panel.narration || ''}">
          </div>
          <div class="input-group" style="margin-bottom:0.25rem;">
            <label>SFX</label>
            <input id="panel-sfx-${panel.id}" value="${panel.sfx || ''}">
          </div>
          <div style="display:flex;gap:0.25rem;">
            <button class="btn btn-sm btn-ghost" id="save-panel-${panel.id}">Save Panel</button>
            <button class="btn btn-sm btn-ghost" id="del-panel-${panel.id}">Delete</button>
          </div>
        </div>
      </div>
    </div>`;
  }
};