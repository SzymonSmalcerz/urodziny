(function () {
  const STORAGE_KEY = 'alfa_solved';
  const form = document.getElementById('alfaForm');
  const input = document.getElementById('alfaInput');
  const feedback = document.getElementById('alfaFeedback');
  const reveal = document.getElementById('alfaReveal');

  if (localStorage.getItem(STORAGE_KEY) === '1') {
    form.classList.add('hidden');
    reveal.classList.add('active');
  }

  function shake(el) {
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
  }

  input.addEventListener('input', () => {
    if (input.value.length > 4) {
      input.value = input.value.slice(0, 4);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = input.value.trim();
    const val = parseInt(raw, 10);
    if (!raw || Number.isNaN(val)) {
      feedback.textContent = 'Wpiszcie liczbę.';
      shake(input);
      return;
    }
    if (val >= 205 && val <= 225) {
      localStorage.setItem(STORAGE_KEY, '1');
      form.classList.add('hidden');
      reveal.classList.add('active');
    } else {
      feedback.textContent = 'Zła waga, spróbujcie ponownie.';
      shake(input);
      setTimeout(() => { input.value = ''; input.focus(); }, 600);
    }
  });
})();
