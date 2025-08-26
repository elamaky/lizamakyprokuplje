window.onload = function () {
    const dugme = document.getElementById('spisak');
    const tabela = document.getElementById('tabela');

    dugme.addEventListener('click', () => {
        tabela.style.display = tabela.style.display === 'none' ? 'block' : 'none';
    });

    tabela.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 300px;
        height: 600px;
        background: black;
        border: 2px solid;
        border-image: linear-gradient(to right, green, blue, yellow, red) 1;
        padding: 10px;
        overflow-y: auto;
        display: none;
    `;

    for (let i = 0; i < 10; i++) {
        const red = document.createElement('div');
        red.style.cssText = `
            margin-bottom: 5px;
            padding-bottom: 5px;
            border-bottom: 1px solid;
            border-image: linear-gradient(to right, green, blue, yellow, red) 1;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Upiši tekst ${i + 1}`;
        input.style.cssText = `
            width: 100%;
            background: black;
            color: transparent;
            font-weight: bold;
            font-style: italic;
            background-clip: text;
            -webkit-background-clip: text;
            background-image: linear-gradient(to right, green, blue, yellow, red);
            border: none;
            outline: none;
        `;

        red.appendChild(input);
        tabela.appendChild(red);
    }
}

//    ZA ODRZAVANJE KONEKCIJE KADA KORISNIKU TAB NIJE U FOKUSU
let heartbeatInterval;

function startHeartbeat() {
  if (!heartbeatInterval) {
    heartbeatInterval = setInterval(() => {
      if (window.currentUser?.username) {
        socket.emit('heartbeat', { username: window.currentUser.username });
      }
    }, 5000); // 5 sekundi
  }
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

// Praćenje promene fokusa taba
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    startHeartbeat();  // Tab nije u fokusu → šalji heartbeat
  } else {
    stopHeartbeat();   // Tab je u fokusu → zaustavi heartbeat
  }
});


