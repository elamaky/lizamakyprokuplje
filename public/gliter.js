let currentGlitter = null;
const glitterBtn = document.getElementById('glit');
let glitterTable = null;
const glitterImages = [
    'g1.gif', 'g2.gif', 'g3.gif', 'g4.gif', 'g5.gif',
    'g6.gif', 'g7.gif', 'g8.gif', 'g9.gif', 'g10.gif',
    'g11.gif', 'g12.gif'
];


// Kreiraj tablu za glitter
function createGlitterTable() {
    glitterTable = document.createElement('div');
    glitterTable.id = 'glitterTable';
    glitterTable.style.position = 'absolute';
    glitterTable.style.background = '#222';
    glitterTable.style.padding = '10px';
    glitterTable.style.display = 'none';
    glitterTable.style.border = '1px solid #444';
    glitterTable.style.borderRadius = '8px';
    glitterTable.style.zIndex = '1000';

    glitterImages.forEach(img => {
        const glitterImg = document.createElement('img');
        glitterImg.src = `/glit/${img}`;
        glitterImg.style.width = '50px';
        glitterImg.style.height = '50px';
        glitterImg.style.margin = '5px';
        glitterImg.style.cursor = 'pointer';

       glitterImg.addEventListener('click', () => {
    applyGlitter(myNickname, img);

    currentGradient = null;
    currentColor = '';
    currentGlitter = img;   // VAŽNO ZA INPUT
    updateInputStyle();     // AŽURIRAJ INPUT

    socket.emit('glitterChange', { nickname: myNickname, glitter: img });
    glitterTable.style.display = 'none';
});


        glitterTable.appendChild(glitterImg);
    });

    document.body.appendChild(glitterTable);
}

// Primeni glitter na tekst korisnika
function applyGlitter(nickname, glitterImg) {
    const guestDiv = document.getElementById(`guest-${nickname}`);
    if (!guestDiv) return;

    guestDiv.style.color = '';
    guestDiv.style.background = `url('/glit/${glitterImg}')`;
    guestDiv.style.backgroundSize = 'cover';
    guestDiv.style.filter = 'brightness(1.5) contrast(1.5)';
    guestDiv.style.backgroundClip = 'text';
    guestDiv.style.webkitBackgroundClip = 'text';
    guestDiv.style.webkitTextFillColor = 'transparent';

    currentGlitter = glitterImg;
    guestDiv.dataset.userGlitter = glitterImg;
}

// Otvori/zatvori tablu
glitterBtn.addEventListener('click', () => {
    if (!glitterTable) createGlitterTable();

    glitterTable.style.left = '0px';
    glitterTable.style.top = '0px';
    glitterTable.style.display = glitterTable.style.display === 'none' ? 'block' : 'none';
});


socket.on('allGlitters', (glitters) => {
    savedGlitters = glitters;
    for (const nickname in glitters) {
        applyGlitter(nickname, glitters[nickname]);
    }
});

socket.on('glitterChange', (data) => {
    applyGlitter(data.nickname, data.glitter);
});