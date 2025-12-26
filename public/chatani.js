(function () {

    /* ================= ELEMENTI ================= */
    const audio = document.getElementById('radioStream');

    /* ================= ADMIN STATE ================= */
    let adminStreamBlocked = false;
    let previousStreamBlocked = null;

    /* ================= BODY LOCK CSS ================= */
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
    `;
    document.head.appendChild(style);

    /* ================= ADMIN PANEL ================= */
    const activeKeys = new Set();
    let comboTimer = null;

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
        fontFamily: 'Arial, sans-serif'
    });

    adminPanel.innerHTML = `
        <button id="close-admin">✖ CLOSE</button><br><br>
        <button id="toggle-stream">STREAM</button><br><br>
        <button id="toggle-body">BODY LOCK</button>
    `;

    document.body.appendChild(adminPanel);

    /* ================= KEY COMBO (IM2 - 3s HOLD) ================= */
    document.addEventListener('keydown', e => {
        if (!e.key) return;
        activeKeys.add(e.key.toUpperCase());

        if (activeKeys.has('I') && activeKeys.has('M') && activeKeys.has('2')) {
            if (comboTimer === null) {
                comboTimer = setTimeout(() => {
                    adminPanel.style.display = 'block';
                    comboTimer = null;
                }, 3000);
            }
        } else {
            if (comboTimer !== null) {
                clearTimeout(comboTimer);
                comboTimer = null;
            }
        }
    });

    document.addEventListener('keyup', e => {
        if (!e.key) return;
        activeKeys.delete(e.key.toUpperCase());
        if (comboTimer !== null) {
            clearTimeout(comboTimer);
            comboTimer = null;
        }
    });

    /* ================= BUTTON ACTIONS ================= */
    document.getElementById('close-admin').onclick = () => {
        adminPanel.style.display = 'none';
    };

    document.getElementById('toggle-stream').onclick = () => {
        socket.emit('streamControl', { toggleStream: true });
    };

    document.getElementById('toggle-body').onclick = () => {
        socket.emit('streamControl', {
            bodyBlocked: !document.body.classList.contains('body-locked')
        });
    };

    /* ================= SOCKET LISTENER ================= */
    socket.on('streamState', state => {

        // STREAM BLOCK
        if ('streamBlocked' in state && state.streamBlocked !== previousStreamBlocked) {
            adminStreamBlocked = state.streamBlocked;

            if (adminStreamBlocked) {
                audio.pause();
            }

            previousStreamBlocked = state.streamBlocked;
        }

        // BODY LOCK
        if ('bodyBlocked' in state) {
            document.body.classList.toggle('body-locked', state.bodyBlocked);
        }

    });

})();
