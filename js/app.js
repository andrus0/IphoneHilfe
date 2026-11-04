(function () {
  'use strict';
  var IH = window.IH;
  var h = IH.h;
  var app = document.getElementById('app');
  var btnZurueck = document.getElementById('btnZurueck');
  var btnStart = document.getElementById('btnStart');
  var kopf = document.getElementById('kopf');
  var toastEl = document.getElementById('toast');
  var BROWSER_KEY = 'ih_browser';

  // ---------- Hilfsfunktionen ----------
  function finde(liste, id) {
    for (var i = 0; i < liste.length; i++) { if (liste[i].id === id) { return liste[i]; } }
    return null;
  }

  var toastTimer = null;
  function toast(text) {
    toastEl.textContent = text;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 4000);
  }

  function gehe(hash) { if (location.hash === hash) { route(); } else { location.hash = hash; } }

  // ---------- Vorlesen ----------
  var lesenBtn = null;
  var lesenToken = 0;
  var hatSprache = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  function lesenZuruecksetzen() {
    if (!lesenBtn) { return; }
    lesenBtn.textContent = '🔊 Vorlesen';
    lesenBtn.setAttribute('aria-label', 'Vorlesen');
    lesenBtn.classList.remove('aktiv');
  }

  function stopLesen() {
    lesenToken++;
    if (hatSprache) { window.speechSynthesis.cancel(); }
    lesenZuruecksetzen();
  }

  function deutscheStimme() {
    var stimmen = window.speechSynthesis.getVoices() || [];
    var treffer = null;
    stimmen.forEach(function (v) {
      if (!treffer && v.lang && v.lang.replace('_', '-') === 'de-DE') { treffer = v; }
    });
    stimmen.forEach(function (v) {
      if (!treffer && v.lang && v.lang.toLowerCase().indexOf('de') === 0) { treffer = v; }
    });
    return treffer;
  }

  function vorlesenKnopf(holeTexte) {
    var btn = h('button', { type: 'button', class: 'btn btn-gross btn-vorlesen', text: '🔊 Vorlesen', 'aria-label': 'Vorlesen' });
    if (!hatSprache) { btn.hidden = true; return btn; }
    btn.addEventListener('click', function () {
      if (btn.classList.contains('aktiv')) { stopLesen(); return; }
      stopLesen();
      lesenBtn = btn;
      var mein = lesenToken;
      var texte = holeTexte();
      var stimme = deutscheStimme();
      btn.textContent = '⏹ Stopp';
      btn.setAttribute('aria-label', 'Vorlesen stoppen');
      btn.classList.add('aktiv');
      texte.forEach(function (t, i) {
        var u = new window.SpeechSynthesisUtterance(t);
        u.lang = 'de-DE';
        u.rate = 0.9;
        if (stimme) { u.voice = stimme; }
        if (i === texte.length - 1) {
          u.onend = function () { if (mein === lesenToken) { lesenZuruecksetzen(); } };
        }
        u.onerror = function () { if (mein === lesenToken) { lesenZuruecksetzen(); } };
        window.speechSynthesis.speak(u);
      });
    });
    return btn;
  }

  // ---------- Bausteine ----------
  function passend(schritt, typ) { return !schritt.nur || schritt.nur === typ; }

  function notrufKnopf(gross) {
    var s = IH.Setup.laden();
    if (!s.notruf) { return null; }
    var name = s.notruf.name || 'Notruf';
    return h('a', {
      class: 'btn btn-notruf' + (gross ? ' btn-riesig' : ''),
      href: IH.Setup.telHref(s.notruf.nummer),
      'aria-label': name + ' anrufen'
    }, '📞 ' + name + ' anrufen');
  }

  function kachel(href, emoji, titel) {
    return h('a', { class: 'kachel', href: href },
      h('span', { class: 'kachel-emoji', 'aria-hidden': 'true', text: emoji }),
      h('span', { class: 'kachel-text', text: titel }));
  }

  function schrittListe(schritte) {
    var typ = IH.Geraet.typ();
    var ol = h('ol', { class: 'schritte' });
    schritte.filter(function (s) { return passend(s, typ); }).forEach(function (s) {
      ol.appendChild(h('li', { class: 'schritt' },
        h('span', { class: 'schritt-bild', 'aria-hidden': 'true', text: s.bild || '' }),
        h('span', { class: 'schritt-text', text: s.text })));
    });
    return ol;
  }

  function schrittTexte(schritte) {
    var typ = IH.Geraet.typ();
    var out = [];
    schritte.filter(function (s) { return passend(s, typ); }).forEach(function (s, i) {
      out.push('Schritt ' + (i + 1) + '. ' + s.text);
    });
    return out;
  }

  function seite(kinder, mitNotruf) {
    var sec = h('section', { class: 'seite' });
    if (mitNotruf) {
      var n = notrufKnopf(false);
      if (n) { sec.appendChild(n); }
    }
    kinder.forEach(function (k) { if (k) { sec.appendChild(k); } });
    return sec;
  }

  function andereLeise(text, href) {
    return h('a', { class: 'btn btn-leise', href: href, text: text });
  }

  // ---------- Ansichten ----------
  function viewStart() {
    var s = IH.Setup.laden();
    var teile = [];
    var n = notrufKnopf(true);
    if (n) { teile.push(n); }
    else {
      teile.push(h('p', { class: 'hinweis-box', text: 'Noch kein Notruf-Kontakt. Angehörige: Halte unten das ⚙ zwei Sekunden gedrückt.' }));
    }
    if (s.kontakte.length) {
      var kg = h('div', { class: 'raster' });
      s.kontakte.forEach(function (k) {
        kg.appendChild(h('a', { class: 'kachel kontakt', href: IH.Setup.telHref(k.nummer), 'aria-label': k.name + ' anrufen' },
          k.foto ? h('img', { class: 'avatar gross', src: k.foto, alt: '' })
                 : h('span', { class: 'kachel-emoji', 'aria-hidden': 'true', text: '👤' }),
          h('span', { class: 'kachel-text', text: k.name })));
      });
      teile.push(h('h2', { text: 'Anrufen' }), kg);
    }
    var bg = h('div', { class: 'raster' });
    IH.BEREICHE.forEach(function (b) { bg.appendChild(kachel('#/bereich/' + b.id, b.emoji, b.titel)); });
    teile.push(h('h2', { text: 'Was möchtest du tun?' }), bg);
    return seite(teile, false);
  }

  function anleitungenDesBereichs(id) {
    return IH.ANLEITUNGEN.filter(function (a) { return a.bereich === id || (a.auch && a.auch.indexOf(id) >= 0); });
  }

  function viewBereich(id) {
    var b = finde(IH.BEREICHE, id);
    if (!b) { return viewStart(); }
    var g = h('div', { class: 'raster' });
    anleitungenDesBereichs(id).forEach(function (a) { g.appendChild(kachel('#/anleitung/' + a.id, a.emoji, a.titel)); });
    var teile = [h('h1', { text: b.emoji + ' ' + b.titel })];
    if (id === 'echt') {
      teile.push(h('p', { class: 'hinweis-box warn', text: 'Im Zweifel: nichts tippen, Kontakt anrufen.' }));
      IH.FALLEN.forEach(function (f) { g.appendChild(kachel('#/falle/' + f.id, f.emoji, f.titel)); });
    }
    teile.push(g);
    return seite(teile, true);
  }

  function viewAnleitung(id) {
    var a = finde(IH.ANLEITUNGEN, id);
    if (!a) { return viewStart(); }
    return seite([
      h('h1', { text: a.emoji + ' ' + a.titel }),
      vorlesenKnopf(function () { return [a.titel].concat(schrittTexte(a.schritte)); }),
      schrittListe(a.schritte)
    ], true);
  }

  function punktListe(punkte, klasse) {
    var ul = h('ul', { class: 'punkte ' + klasse });
    punkte.forEach(function (p) { ul.appendChild(h('li', { text: p })); });
    return ul;
  }

  function viewFalle(id) {
    var f = finde(IH.FALLEN, id);
    if (!f) { return viewStart(); }
    return seite([
      h('h1', { text: f.emoji + ' ' + f.titel }),
      vorlesenKnopf(function () {
        return [f.titel, 'Woran erkennst du das?'].concat(f.erkennen, ['Was tust du?'], f.tun);
      }),
      h('h2', { text: '🔎 Woran erkennst du das?' }),
      punktListe(f.erkennen, 'erkennen'),
      h('h2', { text: '✅ Was tust du?' }),
      punktListe(f.tun, 'tun'),
      h('p', { class: 'hinweis-box warn', text: 'Im Zweifel: nichts tippen, Kontakt anrufen.' })
    ], true);
  }

  function browserWeiter() {
    IH.store.set(BROWSER_KEY, true);
    gehe('#/start');
  }

  function viewHomescreen() {
    var hs = IH.HOMESCREEN;
    return seite([
      h('h1', { text: hs.emoji + ' ' + hs.titel }),
      h('p', { text: 'So ist die App immer schnell da, wie jede andere App.' }),
      vorlesenKnopf(function () { return [hs.titel].concat(schrittTexte(hs.schritte)); }),
      schrittListe(hs.schritte),
      h('button', { type: 'button', class: 'btn btn-leise', text: 'Trotzdem im Browser weiter', on: { click: browserWeiter } })
    ], false);
  }

  function viewGeraet() {
    var vermutet = IH.Geraet.vermutung();
    var v = IH.Geraet.iosVersion();
    function wahl(typ, emoji, text, bildText) {
      return h('button', {
        type: 'button', class: 'btn btn-wahl' + (vermutet === typ ? ' vorschlag' : ''),
        on: { click: function () { IH.Geraet.speichern(typ); gehe('#/start'); } }
      }, h('span', { class: 'wahl-emoji', 'aria-hidden': 'true', text: emoji }), h('span', { text: text }), h('span', { class: 'leise klein', text: bildText }));
    }
    var teile = [
      h('h1', { text: '📱 Dein iPhone' }),
      h('p', { class: 'gross-text', text: 'Schau auf die Vorderseite, ganz unten. Hast du dort einen runden Knopf?' }),
      wahl('homebutton', '🔘', 'Ja, ich habe einen runden Knopf', 'Der Knopf unter dem Bildschirm.'),
      wahl('faceid', '📱', 'Nein, der Bildschirm geht bis ganz unten', 'Kein Knopf unter dem Bildschirm.')
    ];
    if (v) {
      teile.push(h('p', { class: 'leise klein', text: v.sicher ? 'Erkannt: iOS ' + v.major + '.' : 'Deine iOS-Version ist neu (iOS ' + v.major + ' oder höher). Die genaue Nummer kann dieses Gerät nicht sicher anzeigen.' }));
    }
    return seite(teile, false);
  }

  function viewEinrichtung() {
    var box = h('div', { class: 'einrichtung' });
    IH.Einrichtung.render(box, function () { gehe('#/start'); });
    return box;
  }

  function viewEinstellungen() {
    return seite([
      h('h1', { text: '⚙ Für Angehörige' }),
      h('p', { text: 'Hier änderst du die Einrichtung dieses iPhones.' }),
      h('a', { class: 'btn btn-gross', href: '#/einrichtung', text: '👥 Notruf und Kontakte ändern' }),
      h('a', { class: 'btn btn-gross', href: '#/geraet', text: '📱 iPhone-Art neu wählen' }),
      h('button', { type: 'button', class: 'btn btn-gross', text: '🗑 Alles zurücksetzen', on: { click: function () {
        if (window.confirm('Wirklich alles löschen? Notruf, Kontakte und iPhone-Art gehen verloren.')) {
          IH.Setup.zuruecksetzen(); IH.Geraet.loeschen(); IH.store.del(BROWSER_KEY); gehe('#/start');
        }
      } } })
    ], false);
  }

  // ---------- Routing ----------
  var ONBOARDING = { homescreen: 1, geraet: 1, einrichtung: 1, einstellungen: 1 };

  function aktuelleRoute() {
    var teile = (location.hash || '').replace(/^#\/?/, '').split('/');
    return { name: teile[0] || 'start', id: teile[1] || '' };
  }

  function elternHash(r) {
    if (r.name === 'anleitung') {
      var a = finde(IH.ANLEITUNGEN, r.id);
      return a ? '#/bereich/' + a.bereich : '#/start';
    }
    if (r.name === 'falle') { return '#/bereich/echt'; }
    return '#/start';
  }

  function route() {
    stopLesen();
    var r = aktuelleRoute();

    if (!ONBOARDING[r.name]) {
      var s = IH.Setup.laden();
      if (!IH.Geraet.standalone() && !IH.store.get(BROWSER_KEY)) { r = { name: 'homescreen', id: '' }; }
      else if (!IH.Geraet.laden()) { r = { name: 'geraet', id: '' }; }
      else if (!s.fertig && !s.uebersprungen) { r = { name: 'einrichtung', id: '' }; }
    }

    var ansicht;
    switch (r.name) {
      case 'bereich': ansicht = viewBereich(r.id); break;
      case 'anleitung': ansicht = viewAnleitung(r.id); break;
      case 'falle': ansicht = viewFalle(r.id); break;
      case 'homescreen': ansicht = viewHomescreen(); break;
      case 'geraet': ansicht = viewGeraet(); break;
      case 'einrichtung': ansicht = viewEinrichtung(); break;
      case 'einstellungen': ansicht = viewEinstellungen(); break;
      default: r = { name: 'start', id: '' }; ansicht = viewStart();
    }

    IH.leeren(app);
    app.appendChild(ansicht);
    window.scrollTo(0, 0);

    var zurueck = elternHash(r);
    var amStart = r.name === 'start';
    btnZurueck.disabled = amStart;
    btnZurueck.dataset.ziel = zurueck;
    kopf.hidden = r.name === 'homescreen' || r.name === 'geraet';
    document.title = 'iPhone-Hilfe';
  }

  // ---------- Zahnrad: nur 2 Sekunden gedrückt halten ----------
  function zahnradEinrichten() {
    var btn = document.getElementById('btnZahnrad');
    var timer = null;
    function start() {
      stop(true);
      btn.classList.add('haelt');
      timer = setTimeout(function () {
        timer = null;
        btn.classList.remove('haelt');
        gehe('#/einstellungen');
      }, 2000);
    }
    function stop(still) {
      btn.classList.remove('haelt');
      if (timer) {
        clearTimeout(timer); timer = null;
        if (still !== true) { toast('Das ist für Angehörige. Halte das ⚙ zwei Sekunden gedrückt.'); }
      }
    }
    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', function () { stop(); });
    btn.addEventListener('pointercancel', function () { stop(true); });
    btn.addEventListener('pointerleave', function () { stop(true); });
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    btn.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); start(); }
    });
    btn.addEventListener('keyup', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { stop(); }
    });
  }

  // ---------- Start ----------
  btnZurueck.addEventListener('click', function () { gehe(btnZurueck.dataset.ziel || '#/start'); });
  btnStart.addEventListener('click', function () { gehe('#/start'); });
  window.addEventListener('hashchange', route);
  window.addEventListener('pagehide', stopLesen);
  zahnradEinrichten();
  route();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* ohne Offline-Cache weiter */ });
    });
  }
})();
