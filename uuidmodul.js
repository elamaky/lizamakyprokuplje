const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Definisanje modela za goste
const guestSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true },
    timeIn: { type: Date, default: Date.now },
    timeOut: { type: Date, default: null }
});

const Guest = mongoose.model('Guest', guestSchema);

// POST ruta za čuvanje podataka gostiju
router.post('/', async (req, res) => {
    // Dobijanje IP adrese
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress;

  try {
        // Proveri da li postoji gost sa istom IP adresom
        const existingGuest = await Guest.findOne({ ipAddress });

        if (existingGuest) {
            // Ako postoji, ažuriraj podatke
            existingGuest.timeIn = Date.now(); // Ažuriraj vreme kada je gost ponovo pristupio

            await existingGuest.save();
            console.log('Podaci uspešno ažurirani u MongoDB:', `IP: ${ipAddress}`);
            return res.status(200).send('Podaci ažurirani');
        }

        // Ako ne postoji, sačuvaj novog gosta
        const guest = new Guest({ 
            ipAddress 
        });

        await guest.save();

        console.log('Podaci uspešno sačuvani u MongoDB:', `IP: ${ipAddress}`);

        res.status(200).send('Podaci primljeni i sačuvani');
    } catch (err) {
        console.error('Greška pri čuvanju podataka:', err);
        res.status(500).json({ error: 'Greška pri čuvanju podataka' });
    }
});

// GET ruta za dobijanje podataka po IP adresi
router.get('/:ipAddress', async (req, res) => {
    const { ipAddress } = req.params;

    try {
        // Dohvatanje podataka iz MongoDB
        const guest = await Guest.findOne({ ipAddress });

        if (!guest) {
            return res.status(404).json({ error: 'Podaci za dati IP nisu pronađeni' });
        }

        res.status(200).json(guest);
    } catch (err) {
        console.error('Greška pri dohvatanju podataka:', err);
        res.status(500).json({ error: 'Greška pri dohvatanju podataka' });
    }
});

module.exports = router;
