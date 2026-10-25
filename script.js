// ---- menu mobile ----
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

burger.addEventListener("click", () => {
  menu.classList.toggle("open");
  burger.classList.toggle("open");
  burger.setAttribute("aria-expanded", menu.classList.contains("open"));
});

// on referme le menu quand on clique sur un lien
menu.querySelectorAll("a").forEach((lien) => {
  lien.addEventListener("click", () => {
    menu.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  });
});


// ---- lien actif dans la nav selon la section visible ----
// (le hero a aussi un id : quand on remonte tout en haut, plus aucun lien n'est actif)
const sections = document.querySelectorAll("main section[id]");
const liensNav = menu.querySelectorAll("a");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    liensNav.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
    });
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach((s) => observer.observe(s));


// ---- copier l'email ----
const btnCopy = document.getElementById("copy");

btnCopy.addEventListener("click", () => {
  const email = document.getElementById("email").textContent;

  navigator.clipboard.writeText(email)
    .then(() => {
      btnCopy.textContent = "Copié !";
      setTimeout(() => (btnCopy.textContent = "Copier"), 1500);
    })
    .catch(() => {
      // si le presse-papier est bloqué, on sélectionne juste le texte
      const range = document.createRange();
      range.selectNodeContents(document.getElementById("email"));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    });
});


// ---- année dans le footer ----
document.getElementById("year").textContent = new Date().getFullYear();


// ---- le terminal du hero ----
// chaque ligne : [type, texte]. "cmd" = ce que je tape, "out" = la réponse
const lignes = [
  ["cmd", "whoami"],
  ["out", "ibra - futur admin sys & réseaux"],
  ["cmd", "cat stages.txt"],
  ["out", "HSP   -> Zabbix + GLPI sur 2 sites"],
  ["out", "SUEZ  -> support N1/N2, Intune, Autopilot"],
  ["cmd", "ping alternance.fr"],
  ["ok", "64 bytes from alternance.fr: dispo dès nov. 2026"],
];

const term = document.getElementById("term");
const pasAnim = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ajouterLigne(type, texte) {
  const span = document.createElement("span");
  if (type === "cmd") {
    span.innerHTML = '<span class="prompt">$</span> ' + texte + "\n";
  } else if (type === "ok") {
    span.className = "ok";
    span.textContent = texte + "\n";
  } else {
    span.textContent = texte + "\n";
  }
  term.appendChild(span);
}

// version sans animation : on affiche tout direct
if (pasAnim) {
  lignes.forEach(([type, texte]) => ajouterLigne(type, texte));
} else {
  let i = 0;
  const curseur = document.createElement("span");
  curseur.className = "cursor";
  curseur.innerHTML = "&nbsp;";

  function suivante() {
    if (i >= lignes.length) {
      term.appendChild(curseur);
      return;
    }

    const [type, texte] = lignes[i];
    i++;

    // les sorties s'affichent d'un coup
    if (type !== "cmd") {
      ajouterLigne(type, texte);
      setTimeout(suivante, 250);
      return;
    }

    // les commandes sont tapées lettre par lettre
    const ligne = document.createElement("span");
    ligne.innerHTML = '<span class="prompt">$</span> ';
    term.appendChild(ligne);
    ligne.appendChild(curseur);

    let c = 0;
    const frappe = setInterval(() => {
      curseur.before(texte[c]);
      c++;
      if (c === texte.length) {
        clearInterval(frappe);
        curseur.remove();
        ligne.append("\n");
        setTimeout(suivante, 400);
      }
    }, 60);
  }

  setTimeout(suivante, 600);
}
