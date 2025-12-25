(function () {

  /* ================= KEYS ================= */
  const activeKeys = new Set();

  /* ================= ELEMENTI IZ HTML ================= */
  const audio = document.getElementById('radioStream');
  const chat = document.getElementById('chatContainer');

  /* ================= GLOBAL TEXT OVERLAY ================= */
  const globalTextOverlay = document.createElement('div');
  globalTextOverlay.style.position = 'fixed';
  globalTextOverlay.style.top = '0';
  globalTextOverlay.style.left = '0';
  globalTextOverlay.style.width = '100vw';
  globalTextOverlay.style.height = '100vh';
  globalTextOverlay.style.display = 'flex';
  globalTextOverlay.style.alignItems = 'center';
  globalTextOverlay.style.justifyContent = 'center';
  globalTextOverlay.style.color = '#fff';
  globalTextOverlay.style.fontSize = '3em';
  globalTextOverlay.style.fontWeight = 'bold';
  globalTextOverlay.style.fontStyle = 'italic';
  globalTextOverlay.style.textAlign = 'center';
  globalTextOverlay.style.pointerEvents = 'none';
  globalTextOverlay.style.zIndex = '9999';
  globalTextOverlay.style.background = 'transparent';
  document.body.appendChild(globalTextOverlay);

  /* ================= CSS ================= */
  const style = document.createElement('style');
  style.innerHTML = `
    body.body-locked * {
      pointer-events: none;
      user-select: none;
    }

    body.body-locked #ADMINBODYPANEL,
    body.body-locked #ADMINBODYPANEL * {
      pointer-events: auto;
    }

    #chatContainer {
      --speed: 2s;
    }

    .rotate { animation: rotate var(--speed) linear infinite; }
    .mirror { animation: mirror var(--speed) ease-in-out infinite; }
    .dance  { animation: dance var(--speed) ease-in-out infinite; }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes mirror {
      0% { transform: scaleX(1); }
      50% { transform: scaleX(-1); }
      100% { transform: scaleX(1); }
    }

    @keyframes dance {
      0% { transform: translateY(0); }
      50% { transform: translateY(-20px) rotate(5deg); }
      100% { transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  /* ================= ADMIN PANEL ================= */
  const adminPanel = document.createElement('div');
  adminPanel.id = 'ADMINBODYPANEL';
  adminPanel.style.display = 'none';
  adminPanel.style.position = 'fixed';
  adminPanel.style.top = '20px';
  adminPanel.style.right = '20px';
  adminPanel.style.zIndex = '9999';
  adminPanel.style.background = 'rgba(0,0,0,0.9)';
  adminPanel.style.border = '2px solid #fff';
  adminPanel.style.padding = '20px';
  adminPanel.style.color = '#fff';
  adminPanel.style.fontFamily = 'monospace';

  adminPanel.innerHTML = `
    <button id="toggle-stream">STREAM</button><br><br>
    <button id="toggle-body">BODY LOCK</button><br><br>
    <button id="open-anim">ANIMACIJE</button><br><br>
    <label>BRZINA</label><br>
    <input id="speed-slider" type="range" min="0.5" max="5" step="0.1" value="2"><br><br>
    <input id="global-text-input" placeholder="Global text">
  `;
  document.body.appendChild(adminPanel);

  /* ================= ANIMATION PANEL ================= */
  const animPanel = document.createElement('div');
  animPanel.style.display = 'none';
  animPanel.style.position = 'fixed';
  animPanel.style.top = '260px';
  animPanel.style.right = '20px';
  animPanel.style.zIndex = '9999';
  animPanel.style.background = 'rgba(0,0,0,0.9)';
  animPanel.style.border = '2px solid #fff';
  animPanel.style.padding = '15px';
  animPanel.style.color = '#fff';
  animPanel.style.fontFamily = 'monospace';

  animPanel.innerHTML = `
    <button data-anim="none">NONE</button>
    <button data-anim="rotate">ROTATE</button>
    <button data-anim="mirror">MIRROR</button>
    <button data-anim="dance">DANCE</button>
  `;
  document.body.appendChild(animPanel);

  /* ================= KEY COMBO IM2 ================= */
  document.addEventListener('keydown', (e) => {
    if (!e.key) return;
    activeKeys.add(e.key.toUpperCase());

    if (
      activeKeys.has('I') &&
      activeKeys.has('M') &&
      activeKeys.has('2')
    ) {
      adminPanel.style.display =
        adminPanel.style.display === 'none' ? 'block' : 'none';
    }
  });

  document.addEventListener('keyup', (e) => {
    if (!e.key) return;
    activeKeys.delete(e.key.toUpperCase());
  });

  /* ================= BUTTON EVENTS ================= */
  document.getElementById('toggle-stream').onclick = () => {
    const blocked = !audio.paused;
    socket.emit('globalControl', { streamBlocked: blocked });
  };

  document.getElementById('toggle-body').onclick = () => {
    const blocked = !document.body.classList.contains('body-locked');
    socket.emit('globalControl', { bodyBlocked: blocked });
  };

  document.getElementById('open-anim').onclick = () => {
    animPanel.style.display =
      animPanel.style.display === 'none' ? 'block' : 'none';
  };

  document.getElementById('speed-slider').oninput = (e) => {
    socket.emit('globalControl', { speed: e.target.value });
  };

  document.getElementById('global-text-input').onchange = (e) => {
    socket.emit('globalControl', { text: e.target.value });
  };

  animPanel.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      socket.emit('globalControl', { animation: btn.dataset.anim });
    };
  });

  /* ================= SOCKET APPLY ================= */
  socket.on('globalState', (state) => {

    /* STREAM BLOKADA ZA SVE */
    if ('streamBlocked' in state) {
      state.streamBlocked ? audio.pause() : audio.play();
    }

    /* BODY LOCK */
    if ('bodyBlocked' in state) {
      document.body.classList.toggle('body-locked', state.bodyBlocked);
    }

    /* ANIMACIJA CHAT CONTAINER */
    if ('animation' in state) {
      chat.className = '';
      if (state.animation !== 'none') {
        chat.classList.add(state.animation);
      }
    }

    /* BRZINA ANIMACIJE */
    if ('speed' in state) {
      chat.style.setProperty('--speed', state.speed + 's');
    }

    /* GLOBAL TEXT OVERLAY */
    if ('text' in state) {
      globalTextOverlay.textContent = state.text || '';
    }
  });

})();
