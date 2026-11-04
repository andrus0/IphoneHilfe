(function () {
  'use strict';
  var IH = window.IH = window.IH || {};
  var h = IH.h;
  var KEY = 'ih_setup';
  var MAX_KONTAKTE = 6;

  // ---------- Speicher (nur localStorage auf diesem Gerät) ----------
  IH.Setup = {
    max: MAX_KONTAKTE,
    laden: function () {
      var s = IH.store.get(KEY);
      if (!s || typeof s !== 'object') { s = {}; }
      return {
        notruf: s.notruf && s.notruf.nummer ? { name: String(s.notruf.name || ''), nummer: String(s.notruf.nummer) } : null,
        kontakte: Array.isArray(s.kontakte) ? s.kontakte.slice(0, MAX_KONTAKTE) : [],
        fertig: s.fertig === true,
        uebersprungen: s.uebersprungen === true
      };
    },
    speichern: function (s) { return IH.store.set(KEY, s); },
    zuruecksetzen: function () { IH.store.del(KEY); },
    telHref: function (nummer) { return 'tel:' + String(nummer).replace(/[^\d+]/g, ''); }
  };

  function nummerOk(n) { return String(n).replace(/\D/g, '').length >= 3; }

  // Foto auf 256 x 256 (Mitte, quadratisch) verkleinern -> JPEG-DataURL
  function fotoVerkleinern(file, ok, fehler) {
    var fr = new FileReader();
    fr.onerror = fehler;
    fr.onload = function () {
      var img = new Image();
      img.onerror = fehler;
      img.onload = function () {
        try {
          var s = Math.min(img.width, img.height);
          var c = document.createElement('canvas');
          c.width = 256; c.height = 256;
          c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 256, 256);
          ok(c.toDataURL('image/jpeg', 0.8));
        } catch (e) { fehler(e); }
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  }

  // ---------- Assistent ----------
  // root: Container, fertigCb: wird nach „Fertig“ oder „Später“ gerufen
  IH.Einrichtung = {
    render: function (root, fertigCb) {
      var daten = IH.Setup.laden();
      var schritt = 0;      // 0 Intro, 1 Notruf, 2 Kontakte, 3 Fertig
      var bearbeiten = null; // null | -1 (neu) | Index
      var neuesFoto = null;  // undefined = unverändert
      var fehlerText = '';

      function sichern() { IH.Setup.speichern(daten); }

      function fehlerBox() {
        return h('p', { class: 'fehler', role: 'alert', text: fehlerText, hidden: !fehlerText });
      }

      function feld(id, label, typ, wert, extra) {
        var attrs = { id: id, type: typ, value: wert || '', class: 'eingabe', autocomplete: 'off', autocapitalize: 'words' };
        Object.keys(extra || {}).forEach(function (k) { attrs[k] = extra[k]; });
        return h('div', { class: 'feld' }, h('label', { for: id, text: label }), h('input', attrs));
      }

      function draw() {
        IH.leeren(root);
        if (schritt === 0) { drawIntro(); }
        else if (schritt === 1) { drawNotruf(); }
        else if (schritt === 2) { if (bearbeiten === null) { drawListe(); } else { drawForm(); } }
        else { drawEnde(); }
        window.scrollTo(0, 0);
      }

      function drawIntro() {
        root.appendChild(h('section', { class: 'seite' },
          h('h1', { text: '🛠 Einrichtung' }),
          h('p', { class: 'hinweis-box', text: 'Dieser Teil ist für Angehörige. Du legst einen Notruf-Kontakt und bis zu 6 wichtige Kontakte an.' }),
          h('p', { text: 'Alles bleibt nur auf diesem iPhone. Nichts wird ins Internet gesendet.' }),
          h('button', { type: 'button', class: 'btn btn-gross', text: 'Los geht’s', on: { click: function () { schritt = 1; draw(); } } }),
          h('button', { type: 'button', class: 'btn btn-leise', text: 'Später', on: { click: function () {
            daten.uebersprungen = true; sichern(); fertigCb();
          } } })
        ));
      }

      function drawNotruf() {
        var n = daten.notruf || { name: '', nummer: '' };
        var fehler = fehlerBox();
        root.appendChild(h('section', { class: 'seite' },
          h('h1', { text: '🆘 Notruf-Kontakt' }),
          h('p', { text: 'Wer soll im Notfall angerufen werden? Der Knopf steht oben auf jeder Seite.' }),
          feld('nrName', 'Name (so steht er auf dem Knopf)', 'text', n.name, { maxlength: '30' }),
          feld('nrNummer', 'Telefonnummer', 'tel', n.nummer, { inputmode: 'tel', autocapitalize: 'off' }),
          fehler,
          h('button', { type: 'button', class: 'btn btn-gross', text: 'Weiter', on: { click: function () {
            var name = document.getElementById('nrName').value.trim();
            var nr = document.getElementById('nrNummer').value.trim();
            if (!name || !nummerOk(nr)) {
              fehlerText = 'Bitte Name und Telefonnummer eintragen.';
              fehler.textContent = fehlerText; fehler.hidden = false; return;
            }
            fehlerText = '';
            daten.notruf = { name: name, nummer: nr }; sichern(); schritt = 2; draw();
          } } }),
          h('button', { type: 'button', class: 'btn btn-leise', text: 'Ohne Notruf-Kontakt weiter', on: { click: function () {
            daten.notruf = null; sichern(); schritt = 2; draw();
          } } })
        ));
      }

      function drawListe() {
        var liste = h('ul', { class: 'kontaktliste' });
        daten.kontakte.forEach(function (k, i) {
          liste.appendChild(h('li', { class: 'kontaktzeile' },
            kontaktBild(k, 'klein'),
            h('span', { class: 'kontaktname', text: k.name }),
            h('button', { type: 'button', class: 'btn btn-klein', text: '✏️ Ändern', 'aria-label': k.name + ' ändern', on: { click: function () {
              bearbeiten = i; neuesFoto = undefined; fehlerText = ''; draw();
            } } }),
            h('button', { type: 'button', class: 'btn btn-klein', text: '🗑 Löschen', 'aria-label': k.name + ' löschen', on: { click: function () {
              daten.kontakte.splice(i, 1); sichern(); draw();
            } } })
          ));
        });
        var voll = daten.kontakte.length >= MAX_KONTAKTE;
        root.appendChild(h('section', { class: 'seite' },
          h('h1', { text: '👥 Wichtige Kontakte' }),
          h('p', { text: 'Bis zu ' + MAX_KONTAKTE + ' Personen. Sie erscheinen mit Foto auf der Startseite. (' + daten.kontakte.length + ' von ' + MAX_KONTAKTE + ')' }),
          daten.kontakte.length ? liste : h('p', { class: 'leise', text: 'Noch kein Kontakt.' }),
          h('button', { type: 'button', class: 'btn btn-gross', text: '➕ Kontakt hinzufügen', disabled: voll, on: { click: function () {
            bearbeiten = -1; neuesFoto = undefined; fehlerText = ''; draw();
          } } }),
          h('button', { type: 'button', class: 'btn btn-gross btn-ok', text: 'Fertig', on: { click: function () { schritt = 3; draw(); } } }),
          h('button', { type: 'button', class: 'btn btn-leise', text: 'Zurück zum Notruf-Kontakt', on: { click: function () { schritt = 1; draw(); } } })
        ));
      }

      function kontaktBild(k, groesse) {
        if (k && k.foto) { return h('img', { class: 'avatar ' + groesse, src: k.foto, alt: '' }); }
        return h('span', { class: 'avatar ' + groesse + ' platz', 'aria-hidden': 'true', text: '👤' });
      }

      function drawForm() {
        var neu = bearbeiten === -1;
        var k = neu ? { name: '', nummer: '', foto: '' } : daten.kontakte[bearbeiten];
        var fehler = fehlerBox();
        var vorschau = h('div', { class: 'foto-vorschau' });
        function vorschauZeichnen() {
          IH.leeren(vorschau);
          var f = neuesFoto === undefined ? k.foto : neuesFoto;
          vorschau.appendChild(kontaktBild({ foto: f }, 'gross'));
        }
        vorschauZeichnen();

        var datei = h('input', { type: 'file', accept: 'image/*', id: 'kFoto', class: 'nur-lesegeraet', on: { change: function () {
          var f = datei.files && datei.files[0];
          if (!f) { return; }
          fotoVerkleinern(f, function (url) { neuesFoto = url; fehler.hidden = true; vorschauZeichnen(); }, function () {
            fehler.textContent = 'Das Foto ging nicht. Nimm ein anderes.'; fehler.hidden = false;
          });
        } } });

        root.appendChild(h('section', { class: 'seite' },
          h('h1', { text: neu ? '➕ Neuer Kontakt' : '✏️ Kontakt ändern' }),
          feld('kName', 'Name', 'text', k.name, { maxlength: '30' }),
          feld('kNummer', 'Telefonnummer', 'tel', k.nummer, { inputmode: 'tel', autocapitalize: 'off' }),
          vorschau,
          h('label', { class: 'btn btn-gross foto-knopf', for: 'kFoto' }, '📷 Foto auswählen'),
          datei,
          fehler,
          h('button', { type: 'button', class: 'btn btn-gross btn-ok', text: '💾 Speichern', on: { click: function () {
            var name = document.getElementById('kName').value.trim();
            var nr = document.getElementById('kNummer').value.trim();
            if (!name || !nummerOk(nr)) {
              fehler.textContent = 'Bitte Name und Telefonnummer eintragen.'; fehler.hidden = false; return;
            }
            var eintrag = { name: name, nummer: nr, foto: neuesFoto === undefined ? (k.foto || '') : neuesFoto };
            if (neu) { daten.kontakte.push(eintrag); } else { daten.kontakte[bearbeiten] = eintrag; }
            sichern(); bearbeiten = null; draw();
          } } }),
          h('button', { type: 'button', class: 'btn btn-leise', text: 'Abbrechen', on: { click: function () { bearbeiten = null; draw(); } } })
        ));
      }

      function drawEnde() {
        daten.fertig = true; daten.uebersprungen = false; sichern();
        root.appendChild(h('section', { class: 'seite' },
          h('h1', { text: '✅ Alles bereit' }),
          h('p', { text: 'Die Einrichtung ist fertig. Du kannst sie jederzeit ändern: Halte unten das ⚙ zwei Sekunden gedrückt.' }),
          h('button', { type: 'button', class: 'btn btn-gross', text: '🏠 Zur Startseite', on: { click: function () { fertigCb(); } } })
        ));
      }

      draw();
    }
  };
})();
