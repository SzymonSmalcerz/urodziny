(function () {
  const form = document.getElementById('alfaForm');
  const input = document.getElementById('alfaInput');
  const feedback = document.getElementById('alfaFeedback');
  const reveal = document.getElementById('alfaReveal');

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
      form.classList.add('hidden');
      reveal.classList.add('active');
      fetch('/api/cipher?group=alfa')
        .then((r) => r.json())
        .then((d) => {
          const el = document.getElementById('alfaCipher');
          if (el && d && d.digit) el.textContent = d.digit;
        })
        .catch(() => {});
    } else {
      feedback.textContent = 'Zły kod, spróbujcie ponownie.';
      shake(input);
      setTimeout(() => { input.value = ''; input.focus(); }, 600);
    }
  });
})();
