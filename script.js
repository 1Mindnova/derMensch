window.addEventListener('DOMContentLoaded', () => {
  fetch('verses.json')
    .then(res => res.json())
    .then(verses => {
      const audio = document.getElementById('audio');
      const display = document.getElementById('verseDisplay');
      const playBtn = document.getElementById('playBtn');
      let currentIndex = -1;
      let isDisplayed = false;

      playBtn.addEventListener('click', () => {
        playBtn.style.display = 'none';
        audio.volume = 1.0;
        audio.play().catch(e => {
          console.error('Audio play failed:', e);
        });
      });

      function showVerse(text) {
        display.textContent = text;
        display.classList.remove('hide');
        display.classList.add('show');
        isDisplayed = true;
      }

      function hideVerse() {
        display.classList.remove('show');
        display.classList.add('hide');
        isDisplayed = false;
      }

      audio.addEventListener('timeupdate', () => {
        const time = audio.currentTime;
        let verse = verses.find(v => time >= v.start && time < v.end);

        if (verse && verses.indexOf(verse) !== currentIndex) {
          currentIndex = verses.indexOf(verse);
          showVerse(verse.text);
        } else if (!verse && isDisplayed) {
          hideVerse();
          currentIndex = -1;
        }
      });
    })
    .catch(err => {
      console.error('Fehler beim Laden der Vers-Daten:', err);
      document.getElementById('verseDisplay').textContent = 'Fehler beim Laden der Inhalte.';
    });
});
