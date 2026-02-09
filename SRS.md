# SRS - Software Requirements Specification
## Application Lecture Flash

**Version:** 2.0.0  
**Date:** 09 février 2026  
**Auteur:** Frédéric MISERY (webmaster@micetf.fr)  
**Contexte:** Application éducative pour l'enseignement primaire  
**Organisme:** Éducation Nationale - Circonscription

---

## 1. Introduction

### 1.1 Objectif du Document
Ce document définit les exigences fonctionnelles et techniques de l'application **Lecture Flash**, un outil pédagogique destiné aux enseignants du primaire pour améliorer la fluence de lecture des élèves.

### 1.2 Contexte Pédagogique
L'application s'inspire de la méthode "Fluence : le texte qui s'efface" développée par Julie Meunier (@petitejulie89), adaptée pour une utilisation web interactive.

### 1.3 Public Cible
- **Utilisateurs principaux** : Enseignants du primaire
- **Bénéficiaires** : Élèves du cycle 2 et 3 (CP à CM2)
- **Contexte d'usage** : Salle de classe, TBI/TNI, ordinateurs individuels ou collectifs

### 1.4 Portée
L'application permet l'entraînement à la fluence de lecture par disparition progressive du texte, avec plusieurs vitesses de lecture et deux modes (voix haute/silencieuse).

---

## 2. Description Générale

### 2.1 Fonctionnalités Principales
1. **Saisie de texte** : Importation, saisie manuelle ou chargement depuis cloud
2. **Configuration de lecture** : Choix du type et de la vitesse de lecture
3. **Lecture flash** : Affichage progressif avec disparition mot par mot
4. **Gestion de fichiers** : Import/Export de textes

### 2.2 Avantages Pédagogiques
- Entraînement ciblé de la fluence de lecture
- Adaptation aux besoins individuels (vitesses variables)
- Suivi visuel du rythme de lecture
- Motivation par le défi du "texte qui disparaît"

---

## 3. Exigences Fonctionnelles

### 3.1 Gestion des Modes

#### 3.1.1 Mode SAISIE
**Identifiant** : REQ-FUNC-001  
**Priorité** : Critique  
**Description** : L'utilisateur peut préparer le texte avant la lecture flash.

**Critères d'acceptation** :
- Affichage d'une zone de texte multi-lignes (17 lignes minimum)
- Placeholder "Écrivez ou collez le texte ici."
- Compteur de caractères en temps réel
- Sauvegarde automatique en session

#### 3.1.2 Mode LECTURE
**Identifiant** : REQ-FUNC-002  
**Priorité** : Critique  
**Description** : Le texte s'affiche et disparaît progressivement mot par mot.

**Critères d'acceptation** :
- Animation fluide de disparition (effet masque blanc)
- Respect des espaces entre les mots
- Retour à la ligne automatique dans le cadre
- Gestion des signes de ponctuation (espaces insécables)
- Bouton "Modifier" visible pour revenir en mode SAISIE
- Fin automatique et retour au mode SAISIE

---

### 3.2 Chargement de Texte

#### 3.2.1 Saisie Manuelle
**Identifiant** : REQ-FUNC-003  
**Priorité** : Critique  
**Description** : L'utilisateur peut saisir ou copier-coller du texte directement.

**Critères d'acceptation** :
- Textarea responsive avec bordure bleue
- Support du copier-coller (Ctrl+C / Ctrl+V)
- Pas de limite de caractères
- Nettoyage automatique des espaces multiples

#### 3.2.2 Import Local
**Identifiant** : REQ-FUNC-004  
**Priorité** : Haute  
**Description** : L'utilisateur peut importer un fichier .txt depuis son ordinateur.

**Critères d'acceptation** :
- Bouton "Importer" avec icône upload
- Filtre sur fichiers .txt uniquement
- Chargement du contenu dans la zone de texte
- Message d'erreur si format invalide

#### 3.2.3 Export Local
**Identifiant** : REQ-FUNC-005  
**Priorité** : Haute  
**Description** : L'utilisateur peut sauvegarder le texte en fichier .txt.

**Critères d'acceptation** :
- Bouton "Enregistrer" avec icône download
- Nom de fichier par défaut : "lecture-flash.txt"
- Encodage UTF-8
- Téléchargement automatique

#### 3.2.4 Chargement Cloud
**Identifiant** : REQ-FUNC-006  
**Priorité** : Moyenne  
**Description** : L'utilisateur peut charger un texte depuis une URL cloud.

**Services supportés** :
- Dropbox
- Nextcloud
- Apps.education.fr (Nuage)
- Google Drive

**Critères d'acceptation** :
- Champ URL avec validation
- Bouton "Charger" avec état loading
- Normalisation automatique des URLs (dl=1, /download, etc.)
- Gestion des erreurs (404, CORS, timeout)
- Affichage d'un badge "☁️ Texte chargé depuis le cloud"
- Génération d'une URL de partage
- Bouton "Réinitialiser" pour effacer le cloud

#### 3.2.5 URL de Partage
**Identifiant** : REQ-FUNC-007  
**Priorité** : Moyenne  
**Description** : Génération d'un lien partageable avec le texte pré-chargé.

**Critères d'acceptation** :
- URL au format : `?url=encodedCloudUrl`
- Chargement automatique au démarrage si paramètre présent
- Bouton "Copier" pour copier l'URL dans le presse-papier
- Message de succès "✓ Copié !"

---

### 3.3 Configuration de Lecture

#### 3.3.1 Types de Lecture
**Identifiant** : REQ-FUNC-008  
**Priorité** : Critique  
**Description** : Deux types de lecture sont proposés.

**Types disponibles** :
1. **Lecture à voix haute** : Vitesses de 50 à 150 MLM (mots lus par minute)
2. **Lecture silencieuse** : Vitesses de 140 à 300 MLM

**Critères d'acceptation** :
- Sélection par boutons visuels
- Icônes représentant la vitesse (trottinette → fusée)
- Affichage du MLM au survol
- 9 vitesses par type

#### 3.3.2 Vitesses de Lecture
**Identifiant** : REQ-FUNC-009  
**Priorité** : Critique  
**Description** : Choix de la vitesse de lecture en mots par minute.

**Vitesses Lecture à Voix Haute** :
- 50 MLM (Très lent) - Trottinette
- 65 MLM (Lent) - Roller
- 80 MLM (Moyen-) - Vélo
- 95 MLM (Moyen) - Scooter
- 110 MLM (Moyen+) - Voiture
- 120 MLM (Rapide-) - Moto
- 130 MLM (Rapide) - Formule 1
- 140 MLM (Très rapide) - Avion
- 150 MLM (Ultra rapide) - Fusée

**Vitesses Lecture Silencieuse** :
- 140 à 300 MLM (même échelle avec valeurs doublées)

**Critères d'acceptation** :
- Calcul automatique du timing par caractère
- Formule : `speed = ((nbreMots / vitesse) * 60000) / nbreCaracteres - 10`
- Précision à la milliseconde
- Pas de lag perceptible

---

### 3.4 Lecture Flash

#### 3.4.1 Affichage du Texte
**Identifiant** : REQ-FUNC-010  
**Priorité** : Critique  
**Description** : Le texte s'affiche dans un cadre avec bordure avant la lecture.

**Critères d'acceptation** :
- Texte taille 2xl (24px)
- Interligne relaxed (1.625)
- Bordure grise double (2px)
- Padding 24px
- Fond blanc
- Coins arrondis (8px)

#### 3.4.2 Animation de Disparition
**Identifiant** : REQ-FUNC-011  
**Priorité** : Critique  
**Description** : Chaque mot disparaît progressivement de gauche à droite.

**Technique d'animation** :
- Création dynamique d'un `<span class="masque">`
- Animation CSS `@keyframes masquer` (transparent → blanc)
- Durée : `speed * nombre_caractères_du_mot` ms
- Timing function : linear
- Animation-fill-mode : forwards

**Critères d'acceptation** :
- Effet de "recouvrement" progressif par un masque blanc
- Pas de clignotement ou saccades
- Espaces entre mots préservés (white-space: pre-wrap)
- Respect de la vitesse choisie
- Gestion des caractères spéciaux (', «, », -, etc.)

#### 3.4.3 Gestion de la Ponctuation
**Identifiant** : REQ-FUNC-012  
**Priorité** : Moyenne  
**Description** : Les signes de ponctuation sont correctement espacés.

**Règles typographiques françaises** :
- Espaces insécables avant : `;`, `:`, `!`, `?`, `»`
- Espaces insécables après : `«`
- Remplacement des apostrophes droites par courbes
- Remplacement des tirets normaux par tirets insécables
- Remplacement tiret début de ligne par tiret cadratin

**Critères d'acceptation** :
- Application automatique des regex de nettoyage
- Pas de double espace
- Pas de retour à la ligne supprimé

#### 3.4.4 Bouton Démarrer
**Identifiant** : REQ-FUNC-013  
**Priorité** : Critique  
**Description** : Bouton pour lancer l'animation de lecture.

**Critères d'acceptation** :
- Texte : "Commencer la lecture à {vitesse} MLM"
- Icône lecture (play)
- Couleur verte (green-600)
- Disparaît une fois cliqué
- Déclenche l'animation du premier mot

#### 3.4.5 Bouton Modifier
**Identifiant** : REQ-FUNC-014  
**Priorité** : Haute  
**Description** : Bouton toujours visible pour revenir au mode SAISIE.

**Critères d'acceptation** :
- Icône crayon (edit)
- Couleur bleue (blue-600)
- Tooltip "Modifier le texte ou la vitesse de lecture"
- Arrêt immédiat de l'animation en cours
- Retour au mode SAISIE avec texte préservé

---

### 3.5 Interface Utilisateur

#### 3.5.1 Consignes d'Utilisation
**Identifiant** : REQ-FUNC-015  
**Priorité** : Moyenne  
**Description** : Affichage des instructions en mode SAISIE.

**Contenu** :
1. Importer un fichier ou copier-coller le texte
2. Possibilité d'enregistrer le texte
3. Choisir le type de lecture (voix haute/silencieuse)
4. Choisir la vitesse en MLM
5. Explication du mode lecture flash

**Critères d'acceptation** :
- Fond bleu clair (blue-50)
- Bordure gauche bleue (4px)
- Numérotation claire
- Liens vers article d'origine
- Mention @petitejulie89

#### 3.5.2 Navbar
**Identifiant** : REQ-FUNC-016  
**Priorité** : Moyenne  
**Description** : Barre de navigation fixe en haut de l'écran.

**Éléments** :
- Logo "MiCetF" (lien vers https://micetf.fr)
- Chevron SVG
- Nom de l'outil "Lecture Flash"
- Bouton PayPal (icône coeur jaune)
- Bouton Contact (icône email gris)
- Menu hamburger responsive (< 768px)

**Critères d'acceptation** :
- Position fixed top-0
- Fond gris foncé (gray-800)
- Hauteur 56px (h-14)
- Z-index 50
- Responsive mobile
- Padding-top 64px sur le contenu principal

---

## 4. Exigences Non Fonctionnelles

### 4.1 Performance

#### 4.1.1 Temps de Chargement
**Identifiant** : REQ-PERF-001  
**Priorité** : Haute  
**Description** : L'application doit se charger rapidement.

**Critères d'acceptation** :
- First Contentful Paint (FCP) < 1.5s
- Time to Interactive (TTI) < 3s
- Lighthouse Performance Score > 90

#### 4.1.2 Fluidité Animation
**Identifiant** : REQ-PERF-002  
**Priorité** : Critique  
**Description** : L'animation doit être fluide sans lag.

**Critères d'acceptation** :
- 60 FPS constant pendant l'animation
- Pas de drop de frames
- Utilisation de CSS animations (GPU accelerated)
- Pas de re-render React inutile

#### 4.1.3 Responsive
**Identifiant** : REQ-PERF-003  
**Priorité** : Haute  
**Description** : L'application doit fonctionner sur tous les écrans.

**Breakpoints Tailwind** :
- Mobile : < 640px
- Tablet : 640px - 1024px
- Desktop : > 1024px

**Critères d'acceptation** :
- Tous les éléments visibles sans scroll horizontal
- Texte lisible sur mobile (min 16px)
- Boutons cliquables (min 44x44px)
- Menu hamburger sur mobile

---

### 4.2 Compatibilité

#### 4.2.1 Navigateurs
**Identifiant** : REQ-COMPAT-001  
**Priorité** : Haute  
**Description** : Support des navigateurs modernes.

**Navigateurs supportés** :
- Chrome/Edge : 2 dernières versions
- Firefox : 2 dernières versions
- Safari : 2 dernières versions
- Safari iOS : 2 dernières versions
- Chrome Android : 2 dernières versions

**Critères d'acceptation** :
- Fonctionnalités identiques sur tous les navigateurs
- Pas de polyfills nécessaires
- ES6+ natif (pas de transpilation Babel)

#### 4.2.2 Appareils
**Identifiant** : REQ-COMPAT-002  
**Priorité** : Haute  
**Description** : L'application fonctionne sur tous types d'appareils.

**Appareils testés** :
- Ordinateurs Windows/Mac/Linux
- Tablettes iPad/Android
- Smartphones iOS/Android
- TBI/TNI (Tableau Blanc Interactif)

---

### 4.3 Accessibilité

#### 4.3.1 Standards WCAG
**Identifiant** : REQ-ACCESS-001  
**Priorité** : Moyenne  
**Description** : Conformité partielle WCAG 2.1 niveau AA.

**Critères d'acceptation** :
- Contraste texte/fond > 4.5:1
- Éléments interactifs > 44x44px
- Navigation au clavier possible
- Attributs ARIA sur éléments interactifs
- Labels sur formulaires
- Textes alternatifs sur images/icônes

#### 4.3.2 Navigation Clavier
**Identifiant** : REQ-ACCESS-002  
**Priorité** : Basse  
**Description** : Tous les éléments sont accessibles au clavier.

**Critères d'acceptation** :
- Tab pour naviguer entre éléments
- Enter pour activer boutons
- Escape pour fermer modales
- Focus visible (outline)

---

### 4.4 Sécurité

#### 4.4.1 Chargement Cloud
**Identifiant** : REQ-SEC-001  
**Priorité** : Haute  
**Description** : Sécurisation du chargement de fichiers externes.

**Critères d'acceptation** :
- Validation des URLs (protocole HTTPS uniquement)
- Timeout 10s sur les requêtes fetch
- Gestion des erreurs CORS
- Pas d'exécution de code depuis fichiers chargés
- Sanitisation du contenu (texte brut uniquement)

#### 4.4.2 XSS Protection
**Identifiant** : REQ-SEC-002  
**Priorité** : Critique  
**Description** : Protection contre les attaques XSS.

**Critères d'acceptation** :
- Utilisation de React (échappement automatique)
- Pas de dangerouslySetInnerHTML
- Pas d'eval() ou new Function()
- Content-Security-Policy si possible

---

### 4.5 Maintenabilité

#### 4.5.1 Code Quality
**Identifiant** : REQ-MAINT-001  
**Priorité** : Haute  
**Description** : Code propre et documenté.

**Critères d'acceptation** :
- JSDoc sur toutes les fonctions
- PropTypes sur tous les composants
- Noms de variables explicites en français
- Commentaires pour logique complexe
- Pas de code dupliqué
- Composants < 300 lignes

#### 4.5.2 Structure de Fichiers
**Identifiant** : REQ-MAINT-002  
**Priorité** : Haute  
**Description** : Architecture modulaire claire.

**Structure** :
```
src/
├── index.jsx
├── components/
│   ├── App.jsx
│   ├── Navbar/
│   ├── LectureFlash/
│   │   ├── index.jsx
│   │   ├── Input/
│   │   └── Flash/
│   ├── CloudUrlInput.jsx
│   └── ShareCloudLink.jsx
├── hooks/
│   └── useMarkdownFromUrl.js
└── styles/
    └── index.css
```

---

## 5. Stack Technique

### 5.1 Frontend

**Framework** : React 18.2.0
- Hooks natifs (useState, useEffect, useReducer, useRef)
- Context API si nécessaire
- Composants fonctionnels uniquement
- PropTypes pour validation

**Build Tool** : Vite 6.0.7
- Plugin React standard (pas SWC)
- Plugin SVGR pour imports SVG
- Port 9000
- Build output : /build
- Source maps activées

**Styling** : Tailwind CSS 3.4.17
- Mode JIT (Just-In-Time)
- PostCSS + Autoprefixer
- Pas de CSS-in-JS
- Classes utilitaires uniquement
- Animations CSS natives

**Package Manager** : pnpm
- Lock file : pnpm-lock.yaml
- Scripts : dev, build, preview

### 5.2 Dépendances

**Production** :
- react: ^18.2.0
- react-dom: ^18.2.0
- prop-types: ^15.8.1

**Development** :
- @vitejs/plugin-react: ^4.3.4
- vite: ^6.0.7
- vite-plugin-svgr: ^4.3.0
- tailwindcss: ^3.4.17
- postcss: ^8.4.49
- autoprefixer: ^10.4.20

**Total** : 9 packages (vs 24 avant migration)

### 5.3 Configuration

**Vite** (vite.config.js) :
- Plugins : React, SVGR
- Server : port 9000, open auto, host true
- Build : sourcemap, code splitting (react-vendor)
- Resolve : aliases @, @components, @hooks

**Tailwind** (tailwind.config.js) :
- Content : index.html, src/**/*.{js,jsx}
- Theme : extend colors primary (blue palette)
- Plugins : aucun

**PostCSS** (postcss.config.js) :
- tailwindcss
- autoprefixer

---

## 6. Contraintes

### 6.1 Contraintes Techniques
- **Pas de TypeScript** : JavaScript pur uniquement
- **Pas de state management externe** : Redux, Zustand, etc. interdits
- **Pas de CSS-in-JS** : Styled-components, Emotion interdits
- **Pas de UI libraries** : Material-UI, Ant Design interdits
- **Extensions** : Fichiers JSX doivent avoir extension .jsx

### 6.2 Contraintes Pédagogiques
- **Public primaire** : Interface adaptée aux élèves 6-11 ans
- **Usage collectif** : Doit fonctionner sur TBI/TNI
- **Simplicité** : Maximum 3 clics pour lancer une lecture
- **Visibilité** : Texte lisible à 3 mètres

### 6.3 Contraintes Métier
- **Gratuit** : Pas de paywall ou abonnement
- **Open Source** : Code accessible et modifiable
- **Offline-first** : Fonctionnement sans connexion (sauf cloud)
- **RGPD** : Pas de collecte de données personnelles

---

## 7. Tests et Validation

### 7.1 Tests Fonctionnels
- [ ] Saisie manuelle de texte
- [ ] Import fichier .txt
- [ ] Export fichier .txt
- [ ] Chargement depuis Dropbox
- [ ] Chargement depuis Nextcloud
- [ ] Chargement depuis Google Drive
- [ ] Partage d'URL
- [ ] Sélection vitesse lecture à voix haute
- [ ] Sélection vitesse lecture silencieuse
- [ ] Animation disparition progressive
- [ ] Espaces entre mots préservés
- [ ] Retour à la ligne automatique
- [ ] Gestion ponctuation française
- [ ] Bouton Démarrer/Modifier
- [ ] Réinitialisation après cloud
- [ ] Responsive mobile
- [ ] Menu hamburger

### 7.2 Tests de Performance
- [ ] Lighthouse Score > 90
- [ ] Animation 60 FPS
- [ ] Temps chargement < 3s
- [ ] Bundle size < 500 KB

### 7.3 Tests de Compatibilité
- [ ] Chrome Windows/Mac/Linux
- [ ] Firefox Windows/Mac/Linux
- [ ] Safari Mac/iOS
- [ ] Edge Windows
- [ ] Chrome Android
- [ ] TBI Promethean/Smart/Mimio

---

## 8. Livrables

### 8.1 Code Source
- Repository Git complet
- README.md avec instructions
- Documentation JSDoc
- Fichiers de configuration

### 8.2 Documentation
- SRS.md (ce document)
- CODE_REACT_COMPLET.md
- README_MIGRATION.md
- NAVBAR_EXACT_BOOTSTRAP.md

### 8.3 Assets
- Fichiers SVG (icônes)
- Animations CSS
- Texte exemple par défaut

---

## 9. Critères d'Acceptation Projet

### 9.1 Critères de Succès
✅ Migration Webpack → Vite complète
✅ Migration Bootstrap → Tailwind complète
✅ Toutes les fonctionnalités opérationnelles
✅ Aucune régression fonctionnelle
✅ Performance améliorée (build, HMR)
✅ Code documenté et maintenable
✅ Tests manuels validés

### 9.2 Métriques de Performance
- **Build time** : < 5s (vs 30s avant)
- **HMR** : < 200ms (vs 3s avant)
- **Bundle CSS** : < 30 KB (vs 200 KB avant)
- **Dependencies** : 9 packages (vs 24 avant)
- **Node modules** : ~150 MB (vs 400 MB avant)

---

## 10. Références

### 10.1 Sources Pédagogiques
- Article original : [Fluence : le texte qui s'efface](http://www.ecoledejulie.fr/fluence-le-texte-qui-s-efface-a207401800)
- Auteur : Julie Meunier (@petitejulie89)

### 10.2 Documentation Technique
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

### 10.3 Standards
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [RGPD](https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on)

---

## Glossaire

**MLM** : Mots Lus par Minute - Unité de mesure de la vitesse de lecture
**Fluence** : Capacité à lire avec aisance, rapidement et correctement
**TBI/TNI** : Tableau Blanc/Numérique Interactif
**HMR** : Hot Module Replacement - Rechargement à chaud des modules
**JIT** : Just-In-Time - Compilation à la demande (Tailwind)
**FCP** : First Contentful Paint - Première peinture de contenu
**TTI** : Time to Interactive - Temps avant interactivité

---

**Version du document** : 2.0.0  
**Date de dernière modification** : 09 février 2026  
**Statut** : ✅ Application fonctionnelle - Migration terminée
