const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const AUDIO_DIR = path.join(__dirname, 'public', 'audio');
const VIEWS_DIR = path.join(__dirname, 'views');

app.use((req, res, next) => {
  if (req.path.startsWith('/audio/')) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

const sendView = (file) => (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, file));
};

app.get('/', sendView('index.html'));
app.get('/green', sendView('green.html'));
app.get('/red', sendView('red.html'));
app.get('/blue', sendView('blue.html'));
app.get('/alfa', sendView('alfa.html'));

app.get('/api/songs', (req, res) => {
  fs.readdir(AUDIO_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'audio_dir_unavailable', songs: [] });
    }
    const songs = files
      .filter((f) => f.toLowerCase().endsWith('.mp3'))
      .map((f) => f.slice(0, -4));
    for (let i = songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    res.json({ songs });
  });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(VIEWS_DIR, '404.html'));
});

app.listen(PORT, () => {
  console.log(`AKTA SPRAWY №30 — serwer detektywistyczny słucha na porcie ${PORT}`);
});
