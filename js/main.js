/* ==========================================================================
   AFRICONNECT SUMMIT 2026 — SCRIPT PRINCIPAL (JavaScript vanilla)
   Sommaire :
   1. Thème clair / sombre (localStorage)
   2. Navbar au scroll + menu hamburger
   3. Animations au scroll (IntersectionObserver)
   4. Compte à rebours
   5. Compteurs animés (chiffres clés)
   6. Onglets du programme
   7. Filtrage des intervenants
   8. Validation du formulaire de contact
   9. Bouton retour en haut
   10. Année dynamique du footer
   ========================================================================== */


/* ---------- 1. THÈME CLAIR / SOMBRE ---------- */

// Au chargement, on applique le thème enregistré (ou "light" par défaut)
const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('africonnect-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', function () {
    const themeActuel = document.documentElement.getAttribute('data-theme');
    const nouveauTheme = themeActuel === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', nouveauTheme);
    localStorage.setItem('africonnect-theme', nouveauTheme);
  });
}


/* ---------- 2. NAVBAR AU SCROLL + MENU HAMBURGER ---------- */

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function () {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // On ferme le menu quand on clique sur un lien (utile sur mobile)
  const liens = navLinks.querySelectorAll('a');
  for (let i = 0; i < liens.length; i++) {
    liens[i].addEventListener('click', function () {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  }
}


/* ---------- 3. ANIMATIONS AU SCROLL ---------- */

const elementsAnimes = document.querySelectorAll('.reveal');

const observateur = new IntersectionObserver(function (entrees) {
  entrees.forEach(function (entree) {
    if (entree.isIntersecting) {
      entree.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.15 });

elementsAnimes.forEach(function (element) {
  observateur.observe(element);
});


/* ---------- 4. COMPTE À REBOURS ---------- */

const compteArebours = document.querySelector('[data-countdown]');

if (compteArebours) {
  const dateCible = new Date(compteArebours.dataset.countdown).getTime();

  const elJours = compteArebours.querySelector('[data-cd="days"]');
  const elHeures = compteArebours.querySelector('[data-cd="hours"]');
  const elMinutes = compteArebours.querySelector('[data-cd="minutes"]');
  const elSecondes = compteArebours.querySelector('[data-cd="seconds"]');

  function ajouteZero(nombre) {
    return nombre < 10 ? '0' + nombre : nombre;
  }

  function actualiserCompteARebours() {
    const maintenant = new Date().getTime();
    let difference = dateCible - maintenant;
    if (difference < 0) difference = 0;

    const jours = Math.floor(difference / (1000 * 60 * 60 * 24));
    const heures = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const secondes = Math.floor((difference / 1000) % 60);

    elJours.textContent = ajouteZero(jours);
    elHeures.textContent = ajouteZero(heures);
    elMinutes.textContent = ajouteZero(minutes);
    elSecondes.textContent = ajouteZero(secondes);
  }

  actualiserCompteARebours();
  setInterval(actualiserCompteARebours, 1000);
}


/* ---------- 5. COMPTEURS ANIMÉS ---------- */

const compteurs = document.querySelectorAll('[data-count]');

function lancerCompteur(element) {
  const valeurFinale = parseInt(element.dataset.count);
  const suffixe = element.dataset.suffix || '';
  let valeurActuelle = 0;
  const pas = Math.ceil(valeurFinale / 60); // ~60 étapes pour l'animation

  const intervalle = setInterval(function () {
    valeurActuelle += pas;
    if (valeurActuelle >= valeurFinale) {
      valeurActuelle = valeurFinale;
      clearInterval(intervalle);
    }
    element.textContent = valeurActuelle + suffixe;
  }, 25);
}

const observateurCompteurs = new IntersectionObserver(function (entrees) {
  entrees.forEach(function (entree) {
    if (entree.isIntersecting) {
      lancerCompteur(entree.target);
      observateurCompteurs.unobserve(entree.target);
    }
  });
}, { threshold: 0.5 });

compteurs.forEach(function (compteur) {
  observateurCompteurs.observe(compteur);
});


/* ---------- 6. ONGLETS DU PROGRAMME ---------- */

const ongletsJours = document.querySelectorAll('.day-tab');
const panneauxJours = document.querySelectorAll('.day-panel');

ongletsJours.forEach(function (onglet) {
  onglet.addEventListener('click', function () {
    // On désactive tous les onglets puis on active celui cliqué
    ongletsJours.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
    onglet.setAttribute('aria-selected', 'true');

    const jourChoisi = onglet.dataset.day;

    panneauxJours.forEach(function (panneau) {
      if (panneau.dataset.day === jourChoisi) {
        panneau.classList.add('active');
      } else {
        panneau.classList.remove('active');
      }
    });
  });
});


/* ---------- 7. FILTRAGE DES INTERVENANTS ---------- */

const boutonsFiltre = document.querySelectorAll('.filter-btn');
const cartesIntervenants = document.querySelectorAll('[data-topic]');

boutonsFiltre.forEach(function (bouton) {
  bouton.addEventListener('click', function () {
    boutonsFiltre.forEach(function (b) { b.classList.remove('active'); });
    bouton.classList.add('active');

    const filtreChoisi = bouton.dataset.filter;

    cartesIntervenants.forEach(function (carte) {
      if (filtreChoisi === 'tous' || carte.dataset.topic === filtreChoisi) {
        carte.classList.remove('hidden');
      } else {
        carte.classList.add('hidden');
      }
    });
  });
});


/* ---------- 8. VALIDATION DU FORMULAIRE DE CONTACT ---------- */

const formulaire = document.querySelector('#registration-form');

if (formulaire) {
  const boiteSucces = document.querySelector('.form-success');

  // Vérifie un champ et affiche/masque son message d'erreur.
  // On laisse le navigateur faire le travail de vérification (required,
  // type="email", minlength, pattern...) grâce à checkValidity() :
  // plus besoin d'un if/else différent pour chaque champ.
  function verifierChamp(champ) {
    const zone = champ.closest('.field');
    const messageErreur = zone.querySelector('.field-error');
    const estValide = champ.checkValidity();

    zone.classList.toggle('valid', estValide);
    zone.classList.toggle('invalid', !estValide);
    // Le message d'erreur vient de l'attribut title="" posé sur le champ dans le HTML
    messageErreur.textContent = estValide ? '' : champ.title;

    return estValide;
  }

  // Validation en direct pendant la saisie
  const champs = formulaire.querySelectorAll('input, select, textarea');
  champs.forEach(function (champ) {
    champ.addEventListener('blur', function () { verifierChamp(champ); });
    champ.addEventListener('input', function () {
      if (champ.closest('.field').classList.contains('invalid')) {
        verifierChamp(champ);
      }
    });
  });

  // Validation complète à l'envoi du formulaire
  formulaire.addEventListener('submit', function (evenement) {
    evenement.preventDefault();

    let formulaireValide = true;
    champs.forEach(function (champ) {
      const champOk = verifierChamp(champ);
      if (!champOk) formulaireValide = false;
    });

    if (formulaireValide) {
      boiteSucces.classList.add('show');
      formulaire.reset();

      // On retire les classes valid/invalid après la réinitialisation
      formulaire.querySelectorAll('.field').forEach(function (zone) {
        zone.classList.remove('valid', 'invalid');
      });

      setTimeout(function () {
        boiteSucces.classList.remove('show');
      }, 6000);
    }
  });
}


/* ---------- 9. BOUTON RETOUR EN HAUT ---------- */

const boutonRetourHaut = document.querySelector('.back-to-top');

if (boutonRetourHaut) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      boutonRetourHaut.classList.add('show');
    } else {
      boutonRetourHaut.classList.remove('show');
    }
  });

  boutonRetourHaut.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ---------- 10. ANNÉE DYNAMIQUE DU FOOTER ---------- */

const anneeActuelle = new Date().getFullYear();
document.querySelectorAll('[data-year]').forEach(function (element) {
  element.textContent = anneeActuelle;
});
