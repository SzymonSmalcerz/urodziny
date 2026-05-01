const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const AUDIO_DIR = path.join(__dirname, 'public', 'audio');
const VIEWS_DIR = path.join(__dirname, 'views');

const SONGS_BY_NFC = new Map();

function refreshSongs() {
  SONGS_BY_NFC.clear();
  let files = [];
  try {
    files = fs.readdirSync(AUDIO_DIR);
  } catch (_) {
    return [];
  }
  const nfcStems = [];
  files
    .filter((f) => f.toLowerCase().endsWith('.mp3'))
    .forEach((actual) => {
      const stem = actual.slice(0, -4);
      const nfc = stem.normalize('NFC');
      SONGS_BY_NFC.set(nfc, actual);
      nfcStems.push(nfc);
    });
  return nfcStems;
}

refreshSongs();

app.get('/audio/:name', (req, res) => {
  const requested = decodeURIComponent(req.params.name);
  if (!requested.toLowerCase().endsWith('.mp3')) {
    return res.status(404).end();
  }
  const stem = requested.slice(0, -4).normalize('NFC');
  const actual = SONGS_BY_NFC.get(stem);
  if (!actual) {
    return res.status(404).end();
  }
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(AUDIO_DIR, actual));
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
app.get('/aW52b2tlTWUoKQ==', (req, res) => res.redirect(302, '/base64'));
app.get('/base64', sendView('cipher.html'));

const CIPHERS = {
  red:   { digit: '0' },
  green: { digit: '9', message: 'cyfra: 9. Zadania: w dwóch sprawach waga jest rozwiązaniem' },
  blue:  { digit: '6' },
  alfa:  { digit: '1' },
};

app.get('/api/cipher', (req, res) => {
  const group = req.query.group;
  if (!group || !CIPHERS[group]) {
    return res.status(400).json({ error: 'unknown_group' });
  }
  res.json(CIPHERS[group]);
});

app.get('/api/answer', (req, res) => {
  const song = req.query.song;
  if (!song || typeof song !== 'string') {
    return res.status(400).json({ error: 'missing_song_param' });
  }
  if (song.includes('/') || song.includes('\\') || song.includes('..')) {
    return res.status(400).json({ error: 'invalid_song_param' });
  }
  const nfc = song.normalize('NFC');
  if (!SONGS_BY_NFC.has(nfc)) {
    return res.status(404).json({ error: 'song_not_found', song });
  }
  res.json({ correct: nfc });
});

app.get('/api/songs', (req, res) => {
  const songs = refreshSongs();
  for (let i = songs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [songs[i], songs[j]] = [songs[j], songs[i]];
  }
  res.json({ songs });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(VIEWS_DIR, '404.html'));
});

app.listen(PORT, () => {
  console.log(`AKTA SPRAWY №30 - serwer detektywistyczny słucha na porcie ${PORT}`);
});
