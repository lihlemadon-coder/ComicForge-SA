/* ComicForge SA — Anime Adapter */

const AnimeAdapter = {
  generateShots(comic, targetSeconds) {
    const panels = (comic.pages || []).flatMap(page => (page.panels || []).map(panel => ({ page, panel })));
    if (!panels.length || !Number.isFinite(targetSeconds) || targetSeconds < 1) return [];
    // Keep individual shots readable (15–30 seconds) and distribute the exact target.
    const count = Math.max(Math.min(panels.length, targetSeconds), Math.ceil(targetSeconds / 60));
    const base = Math.floor(targetSeconds / count);
    const remainder = targetSeconds % count;
    return Array.from({ length: count }, (_, index) => {
      const { page, panel } = panels[index % panels.length];
      const duration = base + (index < remainder ? 1 : 0);
      return {
        id: `shot_${Date.now()}_${index}`,
        pageId: page.id,
        panelId: panel.id,
        pageNumber: page.number,
        panelNumber: panel.number,
        shotType: 'medium',
        cameraAngle: 'eye_level',
        movement: index % 3 === 0 ? 'slow_zoom' : index % 3 === 1 ? 'pan_left' : 'hold',
        voiceLine: panel.dialogue || panel.narration || '[Visual only]',
        soundCue: panel.sfx || 'Ambient',
        durationSeconds: duration,
        animateOrPan: 'pan_zoom'
      };
    });
  },

  generateAnimeScript(durationSeconds, lang, comic) {
    const shots = this.generateShots(comic, durationSeconds);
    let shotsHtml = '';
    let totalSeconds = 0;
    for (const s of shots) {
      totalSeconds += s.durationSeconds;
      shotsHtml += `<tr>
        <td>${s.pageNumber}</td>
        <td>${s.panelNumber}</td>
        <td>medium</td>
        <td>eye_level</td>
        <td>slow_zoom</td>
        <td>${s.voiceLine}</td>
        <td>${s.soundCue}</td>
        <td>${s.durationSeconds}s</td>
      </tr>`;
    }
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Anime Blueprint</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; background: #0a0a0a; color: #f5f5f5; }
    table { width: 100%; border-collapse: collapse; background: #0d1b0d; }
    th, td { border: 1px solid var(--sa-green, #007a4d); padding: 0.5rem; text-align: left; }
    th { background: #007a4d; color: #ffb612; }
    h1 { color: #ce1126; }
  </style>
</head>
<body>
  <h1>Anime Blueprint — Motion Comic Script</h1>
  <p><strong>Target Duration:</strong> ${durationSeconds} seconds</p>
  <p><strong>Language:</strong> ${lang}</p>
  <table>
    <tr>
      <th>Page</th><th>Panel</th><th>Shot Type</th><th>Camera</th><th>Movement</th>
      <th>Voice Line</th><th>Sound Cue</th><th>Duration</th>
    </tr>${shotsHtml}
  </table>
  <p><strong>Total:</strong> ${totalSeconds} seconds</p>
</body>
</html>`;
  }
};
