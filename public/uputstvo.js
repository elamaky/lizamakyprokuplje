document.getElementById("up").addEventListener("click", () => {
  let marlboro = document.getElementById("marlboro");
  if (marlboro) {
    marlboro.remove();
    return;
  }

  marlboro = document.createElement("div");
  marlboro.id = "marlboro";
  marlboro.style.position = "fixed";
  marlboro.style.top = "50%";
  marlboro.style.left = "50%";
  marlboro.style.transform = "translate(-50%, -50%)";
  marlboro.style.background = "black";
  marlboro.style.border = "2px solid white";
  marlboro.style.color = "white";
  marlboro.style.fontWeight = "bold";
  marlboro.style.fontStyle = "italic";
  marlboro.style.padding = "20px";
  marlboro.style.zIndex = "9999";
  marlboro.style.maxWidth = "600px";
  marlboro.style.overflowY = "auto";
  marlboro.style.maxHeight = "80%";

  marlboro.innerHTML = `
    <div style="text-align:center; font-size:24px; border-bottom:2px solid white; padding-bottom:10px; margin-bottom:20px;">
      Uputstvo za DJ-e
    </div>

    <div style="font-size:20px; margin-bottom:10px;">Dugme Snimanje</div>
    <ol style="margin-left:20px;">
      <li>Pokreće snimanje (START)</li>
      <li>Stopira snimanje (STOP)</li>
      <li>Preuzima snimak na PC (Sačuvaj)</li>
    </ol>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme Brisanje Chata</div>
    <p style="margin-left:20px;">Brisanje cele istorije poruka klikom na dugme.</p>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme Privat</div>
    <p style="margin-left:20px;">Uključuje/isključuje privat. (NAPOMENA za DJ-e: desni klik na gosta otvara traku obeležavanja kao signal da je privat uključen/isključen.)</p>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme Pozadina</div>
    <p style="margin-left:20px;">Dodaje sliku pozadine na ceo ekran. Klik otvara prompt za unos URL-a slike. Ako je polje prazno, briše trenutnu pozadinu.</p>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme WebSlike</div>
    <p style="margin-left:20px;">Automatsko emitovanje slike svima na chatu u realnom vremenu, sa pozicioniranjem i drag funkcijom po celom ekranu.</p>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme Text</div>
    <p style="margin-left:20px;">Otvara prozor za unos teksta, biranje boje, animacije, fonta i veličine. Klik na Generiši prikazuje tekst na ekranu, koji se može slobodno pomerati prevlačenjem mišem.</p>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme Spisak</div>
    <p style="margin-left:20px;">Služi za unos teksta po potrebi — najčešće za upisivanje muzičkih želja gostiju, da DJ ne pamti sve.</p>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme Chat</div>
    <p style="margin-left:20px;">Povećava ili smanjuje dimenzije chata po želji, uz mogućnost pomeranja chata po ekranu.</p>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme Okvir</div>
    <p style="margin-left:20px;">Biranje boje granica za chat, listu gostiju, polja za unos teksta i dugmiće na ekranu.</p>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme Sirina</div>
    <p style="margin-left:20px;">Omogućava izbor debljine granica za sve vidljive elemente na chatu.</p>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme Mixer</div>
    <p style="margin-left:20px;">Dodavanje i emitovanje pesama.</p>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme Web Maska</div>
    <p style="margin-left:20px;">Čuva unapred sređeni dizajn (slike + tekst + web pozadina) na PC-u. (Napomena: slike dodajete iz dugmeta ChatMaska.)</p>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme *__X__*</div>
    <p style="margin-left:20px; color:red;">NE DIRAJTE — OPASNO PO ŽIVOT! Može pokvariti PC.</p>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme ChatMaska</div>
    <p style="margin-left:20px;">Birate pozadinu chata, menjate dimenzije i pozicije gost liste, dugmića i polja za unos teksta. Čuvate stanje na PC klikom na Save, a na dugme Učitaj — učitavate sačuvanu verziju.</p>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme RAM</div>
    <p style="margin-left:20px;">Info o radio chatu i potrošnji RAM memorije.</p>

    <div style="font-size:20px; margin:20px 0 10px;">Dugme BrisanjeWeba</div>
    <p style="margin-left:20px;">Briše sve elemente učitane iz WebMaske.</p>

    <button id="closeMarlboro" style="margin-top:20px; background:white; color:black; font-weight:bold;">Zatvori</button>
  `;

  document.body.appendChild(marlboro);

  document.getElementById("closeMarlboro").addEventListener("click", () => {
    marlboro.remove();
  });

  interact('#marlboro').draggable({
    listeners: {
      start (event) {
        marlboro.style.transform = 'none';
      },
      move (event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
    }
  });
});
