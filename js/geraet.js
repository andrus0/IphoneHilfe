(function () {
  'use strict';
  var IH = window.IH = window.IH || {};
  var KEY = 'ih_geraet';

  IH.Geraet = {
    // Läuft die App als Home-Bildschirm-App?
    standalone: function () {
      return window.navigator.standalone === true ||
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
    },

    // { major, minor, sicher } – ab iOS 18 im UserAgent evtl. eingefroren
    iosVersion: function () {
      var m = /OS (\d+)[_.](\d+)/.exec(navigator.userAgent || '');
      if (!m) { return null; }
      var major = parseInt(m[1], 10);
      return { major: major, minor: parseInt(m[2], 10), sicher: major < 18 };
    },

    // Vermutung per Sicherheitsbereich unten: > 0 heißt Face ID (kein Home-Knopf)
    vermutung: function () {
      var probe = document.getElementById('safeProbe');
      var px = probe ? probe.getBoundingClientRect().height : 0;
      if (px > 0) { return 'faceid'; }
      // Zusätzlich Seitenverhältnis: Home-Knopf-iPhones 16:9 (~1,78), Face ID ~2,16
      var s = window.screen || {};
      var lang = Math.max(s.width || 0, s.height || 0), kurz = Math.min(s.width || 0, s.height || 0);
      return kurz && lang / kurz > 2 ? 'faceid' : 'homebutton';
    },

    laden: function () {
      var g = IH.store.get(KEY);
      return g && (g.typ === 'faceid' || g.typ === 'homebutton') ? g : null;
    },

    speichern: function (typ) {
      var v = this.iosVersion();
      IH.store.set(KEY, { typ: typ, ios: v ? v.major : null });
    },

    loeschen: function () { IH.store.del(KEY); },

    typ: function () {
      var g = this.laden();
      return g ? g.typ : null;
    }
  };
})();
