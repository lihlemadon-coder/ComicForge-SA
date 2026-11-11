/* ComicForge SA — Anime Adapter */

const AnimeAdapter = {
  generateShots(comic, targetSeconds) {
    const shots = [];
    let secondsUsed = 0;
    for (const page of comic.pages || []) {
      for (const p of page.panels || []) {
        if (secondsUsed >= targetSeconds) break;
        const duration = Math.min(15, targetSeconds - secondsUsed);
        secondsUsed += duration;
        shots.push({
          id: 'shot_' + Date.now() + Math.random(),
          pageId: page.id,
          panelId: p.id,
          pageNumber: page.number,
          panelNumber: p.number,
          shotType: 'medium',
          cameraAngle: 'eye_level',
          movement: 'slow_zoom',
          voiceLine: p.dialogue || '[Visual only]',
          soundCue: p.sfx || 'Ambient',
          durationSeconds: duration,
          animateOrPan: duration > 8 ? 'animate' : 'pan_zoom'
        });
      }
      if (secondsUsed >= targetSeconds) break;
    }
    if (secondsUsed < targetSeconds) {
      shots.push({
        id: 'shot_cliffhanger',
        pageId: null,
        panelId: null,
        pageNumber: comic.pages.length,
        panelNumber: 0,
        shotType: 'close_up',
        cameraAngle: 'low_angle',
        movement: 'slow_zoom_in',
        voiceLine: 'Cliffhanger voice line here.',
        soundCue: 'Dramatic sting',
        durationSeconds: targetSeconds - secondsUsed,
        animateOrPan: 'animate'
      });
    }
    return shots;
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