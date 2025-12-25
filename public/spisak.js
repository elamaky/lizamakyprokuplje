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
        border-image: linear-gradient(to right, #ffffff, #ffff66, #66ccff) 1;
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
            border-image: linear-gradient(to right, #ffffff, #ffff66, #66ccff) 1;
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
            background-image: linear-gradient(to right, #ffffff, #ffff66, #66ccff);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            border: none;
            outline: none;
        `;

        red.appendChild(input);
        tabela.appendChild(red);
    }

 function setupStream(buttonId, streamUrl, displayText, originalText) {
    const btn = document.getElementById(buttonId);
    const player = new Audio();
    let isPlaying = false;

    function playStream() {
        player.src = streamUrl;
        player.load();
        player.play().then(() => {
            btn.textContent = displayText;
            isPlaying = true;
        }).catch(err => console.error("Greška pri puštanju:", err));
    }

    btn.addEventListener("click", () => {
        btn.blur();
        if (isPlaying) {
            player.pause();
            btn.textContent = originalText;
            isPlaying = false;
        } else {
            playStream();
        }
    });

    // automatski retry ako pukne stream
    player.addEventListener("error", () => {
        if (isPlaying) {
            setTimeout(playStream, 3000);
        }
    });
}

setupStream("mia", "https://stm1.srvif.com:7258/stream", "Stop", "R-Mia");
setupStream("pink", "https://edge9.pink.rs/pinkstream", "Stop", "Pinkradio");
setupStream("rs", "https://stream.radios.rs:9016/;*.mp3", "Stop", "RadioSr");
setupStream("bg", "https://radio.dukahosting.com/8118/stream", "Stop", "RomaBg");
setupStream("at", "https://ip232.radyotelekom.com.tr:8318/;stream.mp3", "Stop", "H&A");


};
// KODOVI GALAKSIJE 
const kodovi = {
  ':)': '😊', ':(': '☹️', ':D': '😃', 'xD': '😆', ':))': '😁', ':O': '😮',
  ';)': '😉', ':P': '😛', ':/': '😕', ':\'(': '😢', '>:(': '😠', ':|': '😐',
  ':-)': '🙂', ':-(': '🙁', ':-D': '😄', ':x': '😎',
  
  // Poruke i citati
  '#0': 'Sto vise upoznajem ljude sve vise volim zivotinje',
  '#1': 'Dragi gosti, vaše primedbe možete prijaviti upravi Galaksije na broj +511 545 856 957 565 956 354 785 968 652 624',
  '#2': '❤🧡💛💚💙💜🤎🖤💖💗💓🤍',
  '#3': '💋💋💋💋💋💋💋',
  '#4': '#n jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  '#5': 'opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa #n',
  '#6': 'ajmo romalen te kela em te gilava',
  '#7': 'hey sefe koj ti je vrag??????????',
  '#8': 'svega ovoga ne bi bilo da je Pera otišao pravo u policiju',
  '#9': 'Musketari Galaksije - svi za jednog, jedan za sve',

  // Mudre misli
  'a1': 'Prevari me jednom – sram te bilo, prevari me dva puta – sram mene bilo.',
  'a2': 'Biti potpuno iskren prema sebi je dobra vežba.',
  'a3': 'Ne trčite za ženama da se ne sudarite sa onima koji od njih beže.',
  'a4': 'Prodavačica je bila toliko lepa da je bilo smešno njeno pitanje: "Šta želite?"',
  'a5': 'Toliko sam pametan da ni sam ne razumem sta govorim',
  'a6': 'Dan bez smeha je izgubljen dan',
  'a7': 'Ponekad razgovaram sam sa sobom jer mi je potrebno misljenje strucnjaka',
  'a8': 'Ko je vas poznavao, ni pakao mu neće teško pasti',
  'a9': 'Sto jedan lud zamrsi 100 mudrih nemogu odmrsiti',

  // Citati sa potpisom
  'b1': 'Versija svakome , Cast nikome - By Arlija',
  'b2': 'Ko se s nama druzi zivot mu je duzi -By Nezna',
  'b3': 'U Galaksiji i Vranje nema laganje 100kg svinja 200kg mast -By X',
  'b4': 'Budala pise Pametan pamti - BY Arlija',
  'b5': '3 puta secem jednom merim - tako to radi Tresnja -By Tresnja',
  'b6': 'Budi mudar kao zmija a bezazlen kao golub - By Dia',
  'b7': 'nekad mi se cini da se moje zelje ostvaruju drugima, neka , steta bi bilo da propadnu ipak su to lepe zelje - By Dia',
  'b8': 'Celavi bez ruku za kosu se vuku da suvu krpu sa dna mora izvuku  -By X',
  'b9': 'Bez starca nema udarca - By Dia',

  // Zabavne
  'c1': 'Kad na vrbi rodi Bostan -By X', 
  'c2': 'Ahaaa u tom zecu lezi grm  -By X',
  'c3': 'Devojka se razbolela od NeuroSexivitisa, smrt je kucala na vrata i onda se pojavio cudotvorni mladic koji joj predlozio terapiju Primacel i danas ima 69 godina -By X',
  'c4': 'Zivot je skup vise neostvarenih i manje ostvarenih zelja  -By X',
  'c5': 'Sta ispadne kad ukrstis Sarplaninca i civavu ?  Ispadnu civavi oci  -By X',
  'c6': 'Naleti slon na golog coveka i sav zbunjen upita - kako ti covece mozes da dises na tu malu SURLU ????---------By X',
  'c7': 'Bio na sastanku sa devojkom i morao ici u WC, rekoh sacekaj me tu idem da  se rukujem sa gospodinom kojeg ces kasnije upoznati -By X',
  'c8': 'Naucni institut Galaksije je utvrdio da zene zive duze od muskaraca jer nemaju ZENE -By X',
  'c9': 'Klincu 13-ti rodjendan i kaze mu otac , epa sine sad si odraso doslo je vreme da razgovaramo o sexu.  Klinac -  Dobro tata sta hoces da znas ???? -By X',

  // Ostalo
  '#iva': '🎶🎶🎶🎶🎵🎶🎶🎵',
  '#dia': '💎💎💎💎💎💎💎💎💎💎💎💎💎💎',
  '#x': 'Pesma za sve goste u Galaksiji od cika X-a ',
  '#g': () => new Date().toLocaleTimeString(),
  '#u': () => `Online: ${document.getElementById('current-users')?.textContent.replace(/\D/g,'') || 0}, Ukupno: ${document.getElementById('total-users')?.textContent.replace(/\D/g,'') || 0}`,
  '#dg': '#n Dobro Dosli, Sa Vama Je Dj Dia ',
  '#ha': 'Hulija❤️Ates',
  
  // Rotirajući Dia
  'dia': () => '+ SLIKA'
};

// REAKCIJE KONOBARICE
const konobaricaReactions = {
  'pauza': 'Arlijo nesrećo moja, ovo maltretiranje trpim samo zbog tebe jer te volim. Ja se ubih od posla, a gosti ne daju bakšiš nikako. Hoću povišicu od 500%',
  'umorna': 'Da, bas sam mnogo umorna, sve me boli , X tako bi mi prijale tvoje zlatne ruke sada da mi masiraju noge',
  'red bul': 'Evo stiže odmah + SLIKA',
  'viski': 'Evo stiže odmah viski za Lepu i ostale goste + SLIKA',
  'vodka': 'Dok vi pijete vodku djavo sedi u cose i smeje se + SLIKA',
  'pivo': 'Naravno, Pivo samo za vas + SLIKA',
  'caj': 'Caj za Dj Sandru + SLIKA',
  'kisela': 'Mj kisela je dobra za tebe , stabilizovace ti se pritisak  + SLIKA',
  'jede': 'Gladni i siti slobodno se posluzite , na racun galaksije  + SLIKA',
  'pije': 'Nemojte se stideti samo se posluzite  + SLIKA',
  'kokta': 'Ima kokte dovoljno za sve  + SLIKA'
};

let tabla;

document.addEventListener('DOMContentLoaded', () => {
  const dugme = document.getElementById('kodgosti');
  if (!dugme) return;

  dugme.addEventListener('click', () => {
    if (!tabla) {
      tabla = document.createElement('div');
      tabla.style.position = 'fixed';
      tabla.style.top = '100px';
      tabla.style.left = '100px';
      tabla.style.width = '500px';
      tabla.style.height = '800px';
      tabla.style.backgroundColor = '#000';
      tabla.style.color = '#fff';
      tabla.style.fontSize = '18px';
      tabla.style.fontWeight = 'bold';
      tabla.style.fontStyle = 'italic';
      tabla.style.border = '2px solid #0ff';
      tabla.style.padding = '10px';
      tabla.style.boxSizing = 'border-box';
      tabla.style.overflow = 'auto';
      tabla.style.zIndex = '9999';
      tabla.style.cursor = 'move';

      let content = `<h2>Galaksija Kodovi</h2>`;
      content += Object.entries(kodovi).map(([k,v]) => `<p>${k}: ${typeof v === 'function' ? v() : v}</p>`).join('');
      content += `<h3>Konobarica - Reakcije</h3>`;
      content += Object.entries(konobaricaReactions).map(([k,v]) => `<p>${k}: ${v}</p>`).join('');

      tabla.innerHTML = content;
      document.body.appendChild(tabla);

      // Drag funkcionalnost
      let offsetX, offsetY, isDown = false;
      tabla.addEventListener('mousedown', e => {
        isDown = true;
        offsetX = e.clientX - tabla.offsetLeft;
        offsetY = e.clientY - tabla.offsetTop;
      });
      document.addEventListener('mouseup', () => isDown = false);
      document.addEventListener('mousemove', e => {
        if (!isDown) return;
        tabla.style.left = (e.clientX - offsetX) + 'px';
        tabla.style.top = (e.clientY - offsetY) + 'px';
      });
    } else {
      tabla.remove();
      tabla = null;
    }
  });
});

