(function () {
  const activeKeys = new Set();
  let isPaused = false; // trenutno stanje pauze

  // Kreiranje overlay-a
  const overlay = document.createElement('div');
  overlay.id = 'admin-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'none'; // overlay je skriven na početku
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';

  // Kreiranje panela sa dugmadima
  const panel = document.createElement('div');
  panel.style.border = '2px solid #fff';
  panel.style.padding = '30px 40px';
  panel.style.borderRadius = '10px';
  panel.style.boxShadow = '0 0 15px #fff';
  panel.style.backgroundColor = 'transparent';
  panel.style.color = '#fff';
  panel.style.fontFamily = 'monospace';
  panel.style.textAlign = 'center';

  panel.innerHTML = `
    <p style="font-size: 20px; margin-bottom: 20px; text-shadow: 0 0 10px white;">
      ⚠️ Kontrola Radio Servisa
    </p>
    <button id="confirm-restart" style="margin: 5px;">✅ RESTARTUJ</button>
    <button id="confirm-pause" style="margin: 5px;">⏸ PAUZA</button>
    <button id="cancel-restart" style="margin: 5px;">❌ OTKAZI</button>
  `;

  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  // Stilizacija dugmadi
  overlay.querySelectorAll('button').forEach(btn => {
    btn.style.padding = '10px 20px';
    btn.style.fontSize = '16px';
    btn.style.border = '2px solid #fff';
    btn.style.background = 'transparent';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    btn.style.textShadow = '0 0 10px white';
    btn.style.boxShadow = '0 0 8px #fff';
    btn.style.borderRadius = '5px';
    btn.style.transition = 'box-shadow 0.3s ease';
    btn.addEventListener('mouseenter', () => btn.style.boxShadow = '0 0 15px #fff');
    btn.addEventListener('mouseleave', () => btn.style.boxShadow = '0 0 8px #fff');
  });

  // Overlay se prikazuje samo na kombinaciju R + G + 1
  document.addEventListener('keydown', (e) => {
    if (!e.key) return;
    activeKeys.add(e.key.toUpperCase());
    if (activeKeys.has('R') && activeKeys.has('G') && activeKeys.has('1')) {
      overlay.style.display = 'flex';
    }
  });

  document.addEventListener('keyup', (e) => {
    if (!e.key) return;
    activeKeys.delete(e.key.toUpperCase());
  });

  // Dugme OTKAZI
  document.getElementById('cancel-restart').addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  // Dugme RESTART
  document.getElementById('confirm-restart').addEventListener('click', () => {
    fetch('/restart', { method: 'POST' })
      .catch(() => console.error('Greška pri restartu servera'));
    overlay.style.display = 'none';
  });

  // Dugme PAUZA - toggle funkcija
  const pauseButton = document.getElementById('confirm-pause');
  pauseButton.addEventListener('click', () => {
    isPaused = !isPaused; // menja stanje pauze
    fetch('/pause', { method: 'POST' })
      .catch(() => console.error('Greška pri pauzi servera'));

    // Menja tekst dugmeta u zavisnosti od stanja
    pauseButton.textContent = isPaused ? '▶ NASTAVI' : '⏸ PAUZA';
    overlay.style.display = 'none';
  });
})();
