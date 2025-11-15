// ======= CSS direktno iz JS =======
const style = document.createElement('style');
style.textContent = `
  #avatar {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 300px;
    height: 500px;
    border: 5px solid;
    border-image: linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff) 1;
    background: black;
    padding: 10px;
    box-sizing: border-box;
    z-index: 999;
    overflow-y: auto;
  }
  #avatar img {
    width: 20px;
    height: 20px;
    margin: 5px;
    cursor: pointer;
  }
  .inline-avatar {
    width: 20px;
    height: 20px;
    margin-left: 5px;
    vertical-align: middle;
  }
  #clear-avatar {
    margin-top: 10px;
    padding: 5px 10px;
    background-color: #f44336;
    color: white;
    border: none;
    cursor: pointer;
  }
`;
document.head.appendChild(style);

// ======= Local Storage za avatare =======
let avatars = JSON.parse(localStorage.getItem('avatars') || '{}');

function saveAvatarsToStorage() {
  localStorage.setItem('avatars', JSON.stringify(avatars));
}

function createAvatarImg(src) {
  const img = document.createElement('img');
  img.src = src;
  img.className = 'inline-avatar';
  return img;
}

// ======= Socket događaji =======

// Ažuriranje liste gostiju
socket.on('updateGuestList', guests => {
  for (const username of guests) {
    const avatar = avatars[username];
    if (avatar) {
      const guestDiv = document.getElementById(`guest-${username}`);
      if (guestDiv) {
        guestDiv.querySelector('.inline-avatar')?.remove();
        guestDiv.appendChild(createAvatarImg(avatar));
      }
    }
  }
});

// Primi sve postojeće avatare kada se korisnici prvi put povežu
socket.on('initialAvatars', avatarsFromServer => {
  avatarsFromServer = avatarsFromServer || {};
  // Spoji sa lokalnim localStorage avatarima
  avatars = { ...avatarsFromServer, ...avatars };
  saveAvatarsToStorage();

  for (const username in avatars) {
    (function tryAppend() {
      const guestDiv = document.getElementById(`guest-${username}`);
      if (guestDiv) {
        guestDiv.querySelector('.inline-avatar')?.remove();
        guestDiv.appendChild(createAvatarImg(avatars[username]));
      } else {
        setTimeout(tryAppend, 100);
      }
    })();
  }
});

// Kada se avatar promeni (event od drugih korisnika)
socket.on('avatarChange', data => {
  if (data.avatar) {
    avatars[data.username] = data.avatar;
  } else {
    delete avatars[data.username];
  }
  saveAvatarsToStorage();

  const guestDiv = document.getElementById(`guest-${data.username}`);
  if (guestDiv) {
    guestDiv.querySelector('.inline-avatar')?.remove();
    if (data.avatar) {
      guestDiv.appendChild(createAvatarImg(data.avatar));
    }
  }
});

// ======= Klik na avatar panel =======
document.getElementById('sl').addEventListener('click', () => {
  const avatarDiv = document.getElementById('avatar');
  if (!avatarDiv) return;

  avatarDiv.style.display = avatarDiv.style.display === 'block' ? 'none' : 'block';
  if (avatarDiv.style.display === 'none' || !window.currentUser?.username) return;

  const username = window.currentUser.username;

  // Očisti stare slike i dugme
  avatarDiv.querySelectorAll('img').forEach(img => img.remove());
  avatarDiv.querySelector('#clear-avatar')?.remove();

  // Dodavanje slika za izbor
  for (let i = 1; i <= 20; i++) {
    const img = document.createElement('img');
    img.src = `nik/sl${i}.webp`;
    img.alt = `Slika ${i}`;

    img.addEventListener('click', () => {
      const guestDiv = document.getElementById(`guest-${username}`);
      if (guestDiv) {
        guestDiv.querySelector('.inline-avatar')?.remove();
        guestDiv.appendChild(createAvatarImg(img.src));
      }
      avatars[username] = img.src;
      saveAvatarsToStorage();
      socket.emit('avatarChange', { username, avatar: img.src });
    });

    avatarDiv.appendChild(img);
  }

  // Dugme za brisanje avatara
  const clearButton = document.createElement('button');
  clearButton.id = 'clear-avatar';
  clearButton.textContent = 'Obriši Avatar';
  clearButton.addEventListener('click', () => {
    const guestDiv = document.getElementById(`guest-${username}`);
    if (guestDiv) {
      guestDiv.querySelector('.inline-avatar')?.remove();
    }
    delete avatars[username];
    saveAvatarsToStorage();
    socket.emit('avatarChange', { username, avatar: '' });
  });

  avatarDiv.appendChild(clearButton);
});

// ======= Registracija korisnika =======
// Ako korisnik već ima avatar u localStorage, pošalji ga serveru
const username = window.currentUser?.username || 'mojUsername';
if (avatars[username]) {
  socket.emit('register', { username, avatar: avatars[username] });
} else {
  socket.emit('register', { username, avatar: '' });
}
