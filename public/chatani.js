(function () {

    /* ================= ELEMENTI ================= */
    const audio = document.getElementById('radioStream');
    const chat = document.getElementById('chatContainer');

    /* ================= USER STATE ================= */
    const AUTO_PLAY_KEY = 'radioPlayed';
    let userWantsPlay = localStorage.getItem(AUTO_PLAY_KEY) === 'true';
      let previousStreamBlocked = false;
   /* ================= ADMIN STATE ================= */
    let adminStreamBlocked = false;

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

    .star {
        position: absolute;
        animation: twinkle 2s infinite alternate;
        font-size: 14px;
    }
    @keyframes twinkle {
        from { opacity: .2; transform: scale(.8); }
        to { opacity: 1; transform: scale(1.3); }
    }

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

    /* ================= USER SAFE PLAY ================= */
    function safePlay(reason) {
        if (adminStreamBlocked) return;
        audio.play().catch(() => {});
    }

    window.addEventListener('load', () => {
        if (userWantsPlay && !adminStreamBlocked) safePlay('autoload');
    });

    /* ================= EFFECT HELPERS ================= */
    function clearEffects() {
        effectLayer.innerHTML = '';
    }
    function spawnStars() {
        clearEffects();
        const colors = ['gold','white','red','green'];
        for(let i=0;i<50;i++){
            const s = document.createElement('div');
            s.className='star';
            s.textContent='★';
            s.style.color=colors[Math.floor(Math.random()*colors.length)];
            s.style.left=Math.random()*100+'%';
            s.style.top=Math.random()*100+'%';
            s.style.animationDuration=(1+Math.random()*2)+'s';
            effectLayer.appendChild(s);
        }
    }
    function spawnHearts() {
        clearEffects();
        for(let i=0;i<30;i++){
            const h=document.createElement('div');
            h.className='heart';
            h.textContent='❤';
            h.style.left=Math.random()*100+'%';
            h.style.animationDuration=(3+Math.random()*4)+'s';
            h.style.fontSize=(16+Math.random()*20)+'px';
            effectLayer.appendChild(h);
        }
    }

    /* ================= ADMIN PANEL ================= */
    const activeKeys = new Set();
    let comboTimer = null;

    const adminPanel = document.createElement('div');
    adminPanel.id = 'ADMINBODYPANEL';
    Object.assign(adminPanel.style,{
        display:'none',
        position:'fixed',
        top:'20px',
        right:'20px',
        zIndex:'9999',
        background:'rgba(0,0,0,0.9)',
        border:'2px solid #fff',
        padding:'15px',
        color:'#fff',
        fontFamily:'monospace'
    });
    adminPanel.innerHTML=`
        <button id="close-admin">✖ CLOSE</button><br><br>
        <button id="toggle-stream">STREAM</button><br><br>
        <button id="toggle-body">BODY LOCK</button><br><br>
        <button id="open-anim">ANIMACIJE</button><br><br>
        <label>BRZINA</label><br>
        <input id="speed-slider" type="range" min="0.5" max="5" step="0.1" value="2"><br><br>
        <input id="global-text-input" placeholder="Global text">
    `;
    document.body.appendChild(adminPanel);

  const animPanel = document.createElement('div');
 Object.assign(animPanel.style,{
    display:'none',
    position:'fixed',
    bottom:'0',
    right:'5px',
    zIndex:'9999',
    background:'rgba(0,0,0,0.9)',
    border:'2px solid #fff',
    padding:'15px',
    color:'#fff',
    width: '250px',
    height: '250px',
    fontFamily:'Arial, sans-serif'  // promenio si font
});

    animPanel.innerHTML=`
        <button data-anim="none">NONE</button>
        <button data-anim="rotate">ROTATE</button>
        <button data-anim="mirror">MIRROR</button>
        <button data-anim="dance">DANCE</button>
        <button data-anim="stars">STARS</button>
        <button data-anim="hearts">HEARTS</button>
    `;
    document.body.appendChild(animPanel);

    /* ================= KEY COMBO 3s HOLD ================= */
document.addEventListener('keydown', (e) => {
    if (!e.key) return;
    activeKeys.add(e.key.toUpperCase());

    // Ako su svi tasteri pritisnuti
    if (activeKeys.has('I') && activeKeys.has('M') && activeKeys.has('2')) {
        if (comboTimer === null) {
            // start timer od 3 sekunde
            comboTimer = setTimeout(() => {
                adminPanel.style.display = 'block';
                comboTimer = null; // resetujemo timer
            }, 3000);
        }
    } else {
        // Ako nije kompletan combo, resetuj timer
        if (comboTimer !== null) {
            clearTimeout(comboTimer);
            comboTimer = null;
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (!e.key) return;
    activeKeys.delete(e.key.toUpperCase());
    // Ako se otpusti bilo koji taster, resetujemo timer
    if (comboTimer !== null) {
        clearTimeout(comboTimer);
        comboTimer = null;
    }
});


    /* ================= BUTTON ACTIONS ================= */
    document.getElementById('close-admin').onclick=()=>{
        adminPanel.style.display='none';
        animPanel.style.display='none';
    };
    document.getElementById('toggle-stream').onclick=()=>{ socket.emit('globalControl',{toggleStream:true}); };
    document.getElementById('toggle-body').onclick=()=>{ 
        socket.emit('globalControl',{bodyBlocked:!document.body.classList.contains('body-locked')}); 
    };
    document.getElementById('open-anim').onclick=()=>{
        animPanel.style.display = animPanel.style.display==='none'?'block':'none';
    };
    document.getElementById('speed-slider').oninput=e=>{
        socket.emit('globalControl',{speed:e.target.value});
    };
    document.getElementById('global-text-input').onchange=e=>{
        socket.emit('globalControl',{text:e.target.value});
    };
    animPanel.querySelectorAll('button').forEach(btn=>{
        btn.onclick=()=>{ socket.emit('globalControl',{animation:btn.dataset.anim}); };
    });

    /* ================= SOCKET APPLY ================= */

let previousStreamBlocked = false;

socket.on('globalState', state => {
    // Pauzira audio samo ako se stvarno promenila vrednost
    if ('streamBlocked' in state && state.streamBlocked !== previousStreamBlocked) {
        if(state.streamBlocked){
            audio.pause();
        } else {
            audio.play().catch(()=>{});
        }
        previousStreamBlocked = state.streamBlocked;
    }

    // Ostali update-i
    if('bodyBlocked' in state) document.body.classList.toggle('body-locked', state.bodyBlocked);
    if('animation' in state){
        chat.className='';
        clearEffects();
        if(['rotate','mirror','dance'].includes(state.animation)) chat.classList.add(state.animation);
        if(state.animation==='stars') spawnStars();
        if(state.animation==='hearts') spawnHearts();
    }
    if('speed' in state) chat.style.setProperty('--speed', state.speed+'s');
    if('text' in state) globalTextOverlay.textContent = state.text || '';
});


/* ================= CUSTOM IMAGE ANIMATION ================= */
function spawnCustomEmoji(count = 10) { // count po slici
    clearEffects(); // briše prethodne efekte

    const imagePaths = [
        'emoji gif/100euro.avif',
        'emoji gif/500euro.avif',
        'emoji gif/1000chfb.avif',
        'emoji gif/1000front.avif'
    ];

    // uzimamo trenutnu brzinu sa slidera
    const speedSlider = document.getElementById('speed-slider');
    const speed = parseFloat(speedSlider?.value) || 2;

    imagePaths.forEach(path => {
        for (let i = 0; i < count; i++) {
            const img = document.createElement('img');
            img.src = path;
            img.style.position = 'absolute';
            img.style.left = Math.random() * 100 + '%';
            img.style.width = (30 + Math.random() * 50) + 'px';
            img.style.height = 'auto';
            img.style.pointerEvents = 'none';

            const rx = Math.random() * 360;
            const ry = Math.random() * 360;
            const rz = Math.random() * 360;

            img.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
            img.style.animation = `fall ${speed}s linear infinite`;

            effectLayer.appendChild(img);
        }
    });
}

// Dugme u animPanel
const emojiBtn = document.createElement('button');
emojiBtn.textContent = 'EURO EMOJI';
emojiBtn.onclick = () => { spawnCustomEmoji(5); }; // 5 slika po putanji
animPanel.appendChild(emojiBtn);

// Novi style tag za keyframes
const customStyle = document.createElement('style');
customStyle.innerHTML = `
@keyframes fall {
    from { transform: translateY(-10vh) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
    to { transform: translateY(110vh) rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
}
`;
document.head.appendChild(customStyle);

})();
