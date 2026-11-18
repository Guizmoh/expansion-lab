// Installation de l'appli (PWA) depuis la page d'accueil / App install (PWA) from the home page
(function () {
  var root = document.documentElement.getAttribute("data-root") || "./";
  var btn = document.getElementById("installBtn"), note = document.getElementById("installNote"), evt = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); evt = e; });
  window.addEventListener("appinstalled", function () { if (note) { note.textContent = note.getAttribute("data-done"); note.classList.add("on"); } });
  if (btn) btn.addEventListener("click", function () {
    if (evt) { evt.prompt(); evt.userChoice.then(function () { evt = null; }); }
    else if (note) note.classList.add("on");
  });
  // Mémorise la langue choisie pour l'appli / Remember chosen language for the app
  document.querySelectorAll("[data-setlang]").forEach(function (a) {
    a.addEventListener("click", function () { try { localStorage.setItem("mkm-lang", a.getAttribute("data-setlang")); } catch (e) {} });
  });
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) navigator.serviceWorker.register(root + "sw.js").catch(function () {});
})();

// Compteur de téléchargements (Release GitHub) / Download counter
(function () {
  var el = document.getElementById("dlCount");
  if (!el || !window.fetch) return;
  fetch("https://api.github.com/repos/Guizmoh/expansion-lab/releases").then(function (r) { return r.json(); }).then(function (rs) {
    var n = 0;
    (rs || []).forEach(function (r) { (r.assets || []).forEach(function (a) { n += a.download_count || 0; }); });
    el.textContent = "⬇ " + n.toLocaleString() + " " + el.getAttribute(n > 1 ? "data-many" : "data-one");
    el.hidden = false;
  }).catch(function () {});
})();
