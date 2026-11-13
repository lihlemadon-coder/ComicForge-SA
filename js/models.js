/* ComicForge SA — Data Models */

// Project: top-level data container
const Project = {
  create(name) {
    return {
      name,
      status: 'idea',
      language: 'zul',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      story: null,
      characters: [],
      episodes: [],
      comic: { pages: [] },
      // Persistent series memory: canon, continuity, and creator notes.
      memory: { canon: [], continuity: [], notes: '' },
      animeBlueprint: null
    };
  }
};

// Story structure
const Story = {
  create() {
    return {
      oneLineIdea: '',
      title: '',
      logline: '',
      genre: 'Historic Fantasy / Zulu',
      theme: '',
      threeActStructure: '',
      coldOpen: '',
      cliffhanger: '',
      language: 'zul'
    };
  }
};

// Character structure
const Character = {
  create(name) {
    return {
      id: 'char_' + Date.now(),
      name: name || '',
      age: 0,
      background: '',
      languages: [],
      personality: [],
      powers: [],
      weakness: '',
      goal: '',
      secret: '',
      arc: '',
      dogBond: null,
      alive: true,
      lastSeen: '',
      status: 'alive'
    };
  }
};

// Scene structure
const Scene = {
  create(segment, location, goal) {
    return {
      id: 'scene_' + Date.now(),
      segment: segment || 'cold_open',
      location: location || '',
      goal: goal || '',
      conflict: '',
      dialogue: '',
      visual: '',
      characters: [],
      updatedAt: new Date().toISOString()
    };
  }
};

// Comic page structure
const ComicPage = {
  create(number) {
    return {
      id: 'page_' + Date.now(),
      number: number || 1,
      panels: []
    };
  }
};

// Panel structure
const Panel = {
  create(number) {
    return {
      id: 'panel_' + Date.now(),
      number: number || 1,
      visualPrompt: '',
      dialogue: '',
      narration: '',
      sfx: '',
      imageUrl: ''
    };
  }
};

// Anime shot structure
const AnimeShot = {
  create(pageNumber, panelNumber, voiceLine) {
    return {
      id: 'shot_' + Date.now(),
      pageId: null,
      panelId: null,
      pageNumber: pageNumber || 0,
      panelNumber: panelNumber || 0,
      shotType: 'medium',
      cameraAngle: 'eye_level',
      movement: 'slow_zoom',
      voiceLine: voiceLine || '[Visual only]',
      soundCue: 'Ambient',
      durationSeconds: 15,
      animateOrPan: 'pan_zoom'
    };
  }
};
