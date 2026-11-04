(function () {
  'use strict';
  var IH = window.IH = window.IH || {};

  // Element bauen: h('div', {class:'x', text:'..', on:{click:fn}}, kinder...)
  IH.h = function (tag, props) {
    var el = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (v === null || v === undefined || v === false || k === 'style') { return; }
      if (k === 'class') { el.className = v; }
      else if (k === 'text') { el.textContent = v; }
      else if (k === 'on') {
        Object.keys(v).forEach(function (ev) { el.addEventListener(ev, v[ev]); });
      }
      else if (k === 'hidden' || k === 'disabled' || k === 'value' || k === 'checked' || k === 'src') { el[k] = v; }
      else { el.setAttribute(k, v === true ? '' : v); }
    });
    for (var i = 2; i < arguments.length; i++) { anhaengen(el, arguments[i]); }
    return el;
  };

  function anhaengen(el, kind) {
    if (kind === null || kind === undefined || kind === false) { return; }
    if (Array.isArray(kind)) { kind.forEach(function (k) { anhaengen(el, k); }); }
    else if (kind.nodeType) { el.appendChild(kind); }
    else { el.appendChild(document.createTextNode(String(kind))); }
  }

  IH.leeren = function (el) { while (el.firstChild) { el.removeChild(el.firstChild); } };

  // localStorage sicher (Privatmodus etc.)
  IH.store = {
    get: function (key) {
      try { var v = window.localStorage.getItem(key); return v === null ? null : JSON.parse(v); }
      catch (e) { return null; }
    },
    set: function (key, val) {
      try { window.localStorage.setItem(key, JSON.stringify(val)); return true; }
      catch (e) { return false; }
    },
    del: function (key) {
      try { window.localStorage.removeItem(key); } catch (e) { /* egal */ }
    }
  };
})();
