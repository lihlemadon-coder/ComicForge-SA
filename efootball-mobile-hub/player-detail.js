const playerDetailContainer = document.getElementById('playerDetailContainer');

if (playerDetailContainer) {
  const escapeHtml = value => String(value).replace(/[&<>\"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  const showError = message => {
    playerDetailContainer.setAttribute('aria-busy', 'false');
    playerDetailContainer.innerHTML = `<p class="lab-error">${escapeHtml(message)}</p>`;
  };

  const params = new URLSearchParams(window.location.search);
  const playerId = params.get('id');

  if (!playerId) {
    showError('No player ID specified. Return to the player list and select a player.');
    return;
  }

  const styleById = new Map();
  let players = [];

  fetch('players.json')
    .then(response => {
      if (!response.ok) throw new Error(`Player data request failed (${response.status}).`);
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data.players)) {
        throw new Error('Player data has an invalid format.');
      }
      players = data.players;
      return fetch('data.json');
    })
    .then(response => {
      if (!response.ok) throw new Error(`Style data request failed (${response.status}).`);
      return response.json();
    })
    .then(data => {
      if (!Array.isArray(data.playerStyles)) {
        throw new Error('Player style catalog is missing or invalid.');
      }
      data.playerStyles.forEach(style => styleById.set(style.id, style));

      const player = players.find(p => p.id === playerId);
      if (!player) {
        showError(`Player "${escapeHtml(playerId)}" not found.`);
        return;
      }

      const style = styleById.get(player.styleId);
      if (!style) {
        showError(`Player style not found for "${escapeHtml(player.name)}".`);
        return;
      }

      playerDetailContainer.setAttribute('aria-busy', 'false');
      playerDetailContainer.innerHTML = `
        <div class="player-detail-card">
          <div class="player-detail-header">
            <span class="lineup-position">${escapeHtml(player.position)}</span>
            <h2>${escapeHtml(player.name)}</h2>
            <span class="player-style-badge tone-${escapeHtml(style.tone)}">${escapeHtml(style.name)}</span>
          </div>
          <div class="player-detail-info">
            <article class="detail-fact">
              <span>PLAYER STYLE</span>
              <p>${escapeHtml(style.name)}</p>
            </article>
            <article class="detail-fact">
              <span>POSITION</span>
              <p>${escapeHtml(player.position)}</p>
            </article>
            <article class="detail-fact">
              <span>STYLE GROUP</span>
              <p>${escapeHtml(style.group)}</p>
            </article>
            ${style.description ? `<article class="detail-fact"><span>STYLE DESCRIPTION</span><p>${escapeHtml(style.description)}</p></article>` : ''}
            ${style.bestFor ? `<article class="detail-fact"><span>BEST FOR</span><p>${escapeHtml(style.bestFor)}</p></article>` : ''}
            ${style.examples ? `<article class="detail-fact"><span>EXAMPLES</span><p>${escapeHtml(style.examples)}</p></article>` : ''}
          </div>
        </div>
      `;
    })
    .catch(error => {
      console.error('Unable to load player details:', error);
      showError('Player details could not be loaded. Open the site through a local web server and check players.json and data.json.');
    });
}