(function () {
  const PLAY_SVG = '<polygon points="6,4 20,12 6,20"/>';
  const PAUSE_SVG = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></g>';
  const board = document.getElementById('board');
  const reveal = document.getElementById('reveal');
  const playBtn = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  const player = document.getElementById('player');
  const form = document.getElementById('answerForm');
  const input = document.getElementById('answerInput');
  const feedback = document.getElementById('feedback');
  const counterCur = document.getElementById('cur');
  const counterTotal = document.getElementById('total');
  const emptyState = document.getElementById('emptyState');

  let songs = [];
  let currentIndex = 0;

  function normalize(s) {
    return s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  function setPlayIcon(playing) {
    if (playing) {
      playIcon.innerHTML = '<rect x="5" y="4" width="5" height="16"/><rect x="14" y="4" width="5" height="16"/>';
      playBtn.classList.add('playing');
      playBtn.setAttribute('aria-label', 'Pauza');
    } else {
      playIcon.innerHTML = PLAY_SVG;
      playBtn.classList.remove('playing');
      playBtn.setAttribute('aria-label', 'Odtwórz piosenkę');
    }
  }

  function loadCurrentSong() {
    if (currentIndex >= songs.length) return;
    const name = songs[currentIndex];
    player.src = '/audio/' + encodeURIComponent(name) + '.mp3';
    player.load();
    counterCur.textContent = String(currentIndex + 1);
    setPlayIcon(false);
  }

  function showReveal() {
    board.style.display = 'none';
    reveal.classList.add('active');
    fetch('/api/cipher?group=red')
      .then((r) => r.json())
      .then((d) => {
        const el = document.getElementById('redCipher');
        if (el && d && d.digit) el.textContent = d.digit;
      })
      .catch(() => {});
  }

  function showFeedback(text, kind) {
    feedback.textContent = text;
    feedback.classList.remove('error', 'success');
    if (kind) feedback.classList.add(kind);
  }

  function shake(el) {
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
  }

  playBtn.addEventListener('click', () => {
    if (!songs.length) return;
    if (player.paused) {
      player.play().catch(() => {});
      setPlayIcon(true);
    } else {
      player.pause();
      setPlayIcon(false);
    }
  });

  player.addEventListener('ended', () => setPlayIcon(false));
  player.addEventListener('pause', () => setPlayIcon(false));
  player.addEventListener('play', () => setPlayIcon(true));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) {
      showFeedback('Wpiszcie tytuł.', 'error');
      shake(input);
      return;
    }
    if (currentIndex >= songs.length) return;

    const guess = normalize(value);
    const target = normalize(songs[currentIndex]);
    if (guess === target) {
      showFeedback('✓', 'success');
      player.pause();
      setPlayIcon(false);
      input.value = '';
      currentIndex++;
      setTimeout(() => {
        showFeedback('', null);
        if (currentIndex >= songs.length) {
          showReveal();
        } else {
          loadCurrentSong();
          input.focus();
        }
      }, 700);
    } else {
      showFeedback('To nie ta bajka - spróbujcie jeszcze raz.', 'error');
      shake(input);
    }
  });

  window.getCorrect = function () {
    if (!songs.length) {
      console.log('Lista piosenek jeszcze się nie załadowała.');
      return;
    }
    if (currentIndex >= songs.length) {
      console.log('Wszystkie piosenki zgadnięte.');
      return;
    }
    const song = songs[currentIndex];
    return fetch('/api/answer?song=' + encodeURIComponent(song))
      .then((r) => r.json())
      .then((data) => {
        if (data && data.correct) {
          console.log('Poprawna odpowiedź:', data.correct);
        } else {
          console.warn('Backend nie potwierdził odpowiedzi:', data);
        }
        return data;
      })
      .catch((err) => {
        console.error('Błąd zapytania do backendu:', err);
      });
  };

  fetch('/api/songs')
    .then((r) => r.json())
    .then((data) => {
      const fetched = (data && Array.isArray(data.songs)) ? data.songs : [];
      if (!fetched.length) {
        emptyState.classList.add('active');
        playBtn.disabled = true;
        return;
      }

      songs = fetched;
      currentIndex = 0;
      counterTotal.textContent = String(songs.length);
      loadCurrentSong();
    })
    .catch(() => {
      emptyState.textContent = 'Błąd ładowania listy bajek. Odświeżcie stronę.';
      emptyState.classList.add('active');
      playBtn.disabled = true;
    });
})();
