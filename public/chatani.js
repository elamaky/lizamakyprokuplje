(function () {

  /* ================= KEYS ================= */
  const activeKeys = new Set();

  /* ================= ELEMENTI ================= */
  const audio = document.getElementById('radioStream');
  const chat = document.getElementById('chatContainer');
const lastAppliedState = {
  streamBlocked: null,
  bodyBlocked: null,
  animation: null,
  speed: null,
  text: null
};


  /* ================= GLOBAL TEXT ================= */
  const globalTextOverlay = document.createElement('div');
  Object.assign(globalTextOverlay.style, {
    position: 'fixed',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '3em',
    fontWeight: 'bold',
    fontStyle: 'italic',
    pointerEvents: 'none',
    zIndex: '9999'
  });
  document.body.appendChild(globalTextOverlay);

  /* ================= EFFECT CONTAINER ================= */
  const effectLayer = document.createElement('div');
  effectLayer.id = 'GLOBAL_EFFECTS';
  Object.assign(effectLayer.style, {
    position: 'fixed',
    inset: '0',
    pointerEvents: 'none',
    zIndex: '9998',
    overflow: 'hidden'
  });
  document.body.appendChild(effectLayer);

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

    #chatContainer { --speed: 2s; }

    .rotate { animation: rotate var(--speed) linear infinite; }
    .mirror { animation: mirror var(--speed) ease-in-out infinite; }
    .dance  { animation: dance var(--speed) ease-in-out infinite; }

    @keyframes rotate { to { transform: rotate(360deg); } }
    @keyframes mirror {
      0%,100% { transform: scaleX(1); }
      50% { transform: scaleX(-1); }
    }
    @keyframes dance {
      50% { transform: translateY(-20px) rotate(5deg); }
    }

    /* ZVEZDICE */
    .star {
      position: absolute;
      color: gold;
      animation: twinkle 2s infinite alternate;
      font-size: 14px;
    }
    @keyframes twinkle {
      from { opacity: .2; transform: scale(.8); }
      to { opacity: 1; transform: scale(1.3); }
    }

    /* SRCA */
    .heart {
      position: absolute;
      color: red;
      animation: fall linear infinite;
      font-size: 20px;
    }
    @keyframes fall {
      from { transform: translateY(-10vh); opacity: 1; }
      to { transform: translateY(110vh); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  /* ================= ADMIN PANEL ================= */
  const adminPanel = document.createElement('div');
  adminPanel.id = 'ADMINBODYPANEL';
  Object.assign(adminPanel.style, {
    display: 'none',
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '9999',
    background: 'rgba(0,0,0,0.9)',
    border: '2px solid #fff',
    padding: '15px',
    color: '#fff',
    fontFamily: 'monospace'
  });

  adminPanel.innerHTML = `
    <button id="close-admin">✖ CLOSE</button><br><br>
    <button id="toggle-stream">STREAM</button><br><br>
    <button id="toggle-body">BODY LOCK</button><br><br>
    <button id="open-anim">ANIMACIJE</button><br><br>
    <label>BRZINA</label><br>
    <input id="speed-slider" type="range" min="0.5" max="5" step="0.1" value="2"><br><br>
    <input id="global-text-input" placeholder="Global text">
  `;
  document.body.appendChild(adminPanel);

  /* ================= ANIM PANEL ================= */
  const animPanel = document.createElement('div');
  Object.assign(animPanel.style, {
    display: 'none',
    position: 'fixed',
    top: '260px',
    right: '20px',
    zIndex: '9999',
    background: 'rgba(0,0,0,0.9)',
    border: '2px solid #fff',
    padding: '15px',
    color: '#fff',
    fontFamily: 'monospace'
  });

  animPanel.innerHTML = `
    <button data-anim="none">NONE</button>
    <button data-anim="rotate">ROTATE</button>
    <button data-anim="mirror">MIRROR</button>
    <button data-anim="dance">DANCE</button>
    <button data-anim="stars">STARS</button>
    <button data-anim="hearts">HEARTS</button>
  `;
  document.body.appendChild(animPanel);

  /* ================= KEY COMBO ================= */
  document.addEventListener('keydown', e => {
    activeKeys.add(e.key.toUpperCase());
    if (activeKeys.has('I') && activeKeys.has('M') && activeKeys.has('2')) {
      adminPanel.style.display =
        adminPanel.style.display === 'none' ? 'block' : 'none';
    }
  });

  document.addEventListener('keyup', e => {
    activeKeys.delete(e.key.toUpperCase());
  });

  /* ================= BUTTONS ================= */
  document.getElementById('close-admin').onclick = () => {
    adminPanel.style.display = 'none';
    animPanel.style.display = 'none';
  };

  document.getElementById('toggle-stream').onclick = () => {
    socket.emit('globalControl', { streamBlocked: !audio.paused });
  };

  document.getElementById('toggle-body').onclick = () => {
    socket.emit('globalControl', {
      bodyBlocked: !document.body.classList.contains('body-locked')
    });
  };

  document.getElementById('open-anim').onclick = () => {
    animPanel.style.display =
      animPanel.style.display === 'none' ? 'block' : 'none';
  };

  document.getElementById('speed-slider').oninput = e => {
    socket.emit('globalControl', { speed: e.target.value });
  };

  document.getElementById('global-text-input').onchange = e => {
    socket.emit('globalControl', { text: e.target.value });
  };

  animPanel.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      socket.emit('globalControl', { animation: btn.dataset.anim });
    };
  });

  /* ================= EFFECT HELPERS ================= */
  function clearEffects() {
    effectLayer.innerHTML = '';
  }

  function spawnStars() {
    clearEffects();
    for (let i = 0; i < 50; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      s.textContent = '★';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.animationDuration = 1 + Math.random() * 2 + 's';
      effectLayer.appendChild(s);
    }
  }

  function spawnHearts() {
    clearEffects();
    for (let i = 0; i < 30; i++) {
      const h = document.createElement('div');
      h.className = 'heart';
      h.textContent = '❤';
      h.style.left = Math.random() * 100 + '%';
      h.style.animationDuration = 3 + Math.random() * 4 + 's';
      h.style.fontSize = 16 + Math.random() * 20 + 'px';
      effectLayer.appendChild(h);
    }
  }

  /* ================= SOCKET APPLY ================= */
socket.on('globalState', (state) => {

  /* STREAM – SAMO AKO SE PROMENIO */
  if (
    'streamBlocked' in state &&
    state.streamBlocked !== lastAppliedState.streamBlocked
  ) {
    lastAppliedState.streamBlocked = state.streamBlocked;
    state.streamBlocked ? audio.pause() : audio.play();
  }

  /* BODY LOCK */
  if (
    'bodyBlocked' in state &&
    state.bodyBlocked !== lastAppliedState.bodyBlocked
  ) {
    lastAppliedState.bodyBlocked = state.bodyBlocked;
    document.body.classList.toggle('body-locked', state.bodyBlocked);
  }

  /* CHAT ANIMACIJA */
  if (
    'animation' in state &&
    state.animation !== lastAppliedState.animation
  ) {
    lastAppliedState.animation = state.animation;

    chat.className = '';
    effectLayer.innerHTML = '';

    if (['rotate','mirror','dance'].includes(state.animation)) {
      chat.classList.add(state.animation);
    }
    if (state.animation === 'stars') spawnStars();
    if (state.animation === 'hearts') spawnHearts();
  }

  /* BRZINA */
  if (
    'speed' in state &&
    state.speed !== lastAppliedState.speed
  ) {
    lastAppliedState.speed = state.speed;
    chat.style.setProperty('--speed', state.speed + 's');
  }

  /* GLOBAL TEXT */
  if (
    'text' in state &&
    state.text !== lastAppliedState.text
  ) {
    lastAppliedState.text = state.text;
    globalTextOverlay.textContent = state.text || '';
  }
});
})();
