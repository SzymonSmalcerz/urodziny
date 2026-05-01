window.invokeMe = function () {
  return fetch('/api/cipher?group=green')
    .then((r) => r.json())
    .then((d) => {
      console.log(d.message);
      return d.message;
    })
    .catch((err) => {
      console.error('Brak połączenia z serwerem:', err);
    });
};
