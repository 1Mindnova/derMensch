window.addEventListener('DOMContentLoaded', () => {
  fetch('verses.json')
    .then(res => res.json())
    .then(verses => {
      const audio = document.getElementById('audio');
      const display = document.getElementById('verseDisplay');
      const playBtn = document.getElementById('playBtn');
      let currentIndex = -1;
      let isDisplayed = false;
      let lastSwitch = 0;
      const MIN_SWITCH_INTERVAL = 300; // ms, prevent rapid flicker

      // Start playback
      playBtn.addEventListener('click', () => {
        playBtn.style.display = 'none';
        audio.volume = 1.0;
        audio.play().catch(e => {
          console.error('Audio play failed:', e);
        });
      });

      function showVerse(text) {
        // Smoothly hide before showing new text
        display.classList.remove('show');
        display.classList.add('hide');
        // Short delay so fadeOut can apply before changing text
        setTimeout(() => {
          display.textContent = text;
          display.classList.remove('hide');
          display.classList.add('show');
          isDisplayed = true;
        }, 90);
      }

      function hideVerse() {
        display.classList.remove('show');
        display.classList.add('hide');
        isDisplayed = false;
      }

      audio.addEventListener('timeupdate', () => {
        const time = audio.currentTime;
        const now = performance.now();
        let verse = verses.find(v => time >= v.start && time < v.end);

        if (verse) {
          const idx = verses.indexOf(verse);
          if (idx !== currentIndex && (now - lastSwitch) > MIN_SWITCH_INTERVAL) {
            currentIndex = idx;
            lastSwitch = now;
            showVerse(verse.text);
          }
        } else if (!verse && isDisplayed && (now - lastSwitch) > MIN_SWITCH_INTERVAL) {
          hideVerse();
          currentIndex = -1;
          lastSwitch = now;
        }
      });
    })
    .catch(err => {
      console.error('Fehler beim Laden der Vers-Daten:', err);
      document.getElementById('verseDisplay').textContent = 'Fehler beim Laden der Inhalte.';
    });
});
