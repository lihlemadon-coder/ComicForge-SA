/* ComicForge SA — Character Engine */

const CharacterEngine = {
  saveCharacter(project, character, editingId = null) {
    const chars = project.characters || [];
    if (editingId) {
      const idx = chars.findIndex(c => c.id === editingId);
      if (idx >= 0) chars[idx] = character;
    } else {
      chars.push(character);
    }
    project.characters = chars;
  },

  deleteCharacter(project, charId) {
    project.characters = (project.characters || []).filter(c => c.id !== charId);
  },

  updateCharacterStatus(project, charId, alive) {
    const c = project.characters.find(x => x.id === charId);
    if (c) {
      c.alive = alive;
      c.status = alive ? 'alive' : 'deceased';
      c.lastSeen = new Date().toISOString();
    }
  }
};