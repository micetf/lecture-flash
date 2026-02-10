# SRS - Software Requirements Specification

## Application Lecture Flash

**Version** : 2.2.0  
**Date** : 10 février 2026  
**Auteur** : Frédéric MISERY (webmaster@micetf.fr)  
**Contexte** : Application éducative pour l'enseignement primaire  
**Organisme** : Éducation Nationale - Circonscription

---

## 1. Introduction

### 1.1 Objectif du Document

Ce document définit les exigences fonctionnelles et techniques de l'application **Lecture Flash**, un outil pédagogique destiné aux enseignants du primaire pour améliorer la fluence de lecture des élèves.

### 1.2 Contexte Pédagogique

L'application s'inspire de la méthode "Fluence : le texte qui s'efface" développée par Julie Meunier (@petitejulie89), adaptée pour une utilisation web interactive.

### 1.3 Fondements Pédagogiques Officiels

#### 1.3.1 Conformité aux Programmes de l'Éducation Nationale

**Cycle 2 - Apprentissages fondamentaux (CP, CE1, CE2)** :

- **Attendu de fin de cycle** : "Lire à haute voix avec fluidité" (BO spécial n°11 du 26 novembre 2015, réactualisé en 2020)
- **Objectif CP** : L'enjeu est de conduire au plus vite les élèves à une automatisation des procédures de décodage, à une lecture fluente autonome (Guide "Pour enseigner la lecture et l'écriture au CP", MEN 2018, révisé 2022)
- **Objectif CE1** : Consolider et développer les compétences en fluence de lecture (Guide "Pour enseigner la lecture et l'écriture au CE1", MEN 2019)

**Cycle 3 - Consolidation (CM1, CM2, 6e)** :

- **Attendu de fin de cycle** : "Lire avec fluidité" (BO spécial n°11 du 26 novembre 2015)
- **Objectif CM1-CM2** : Développer les mécanismes de la compréhension qui demeurent source de questionnement (Guide "Pour enseigner la compréhension au CM1 et CM2", MEN 2020)

**Programmes 2024-2025** :

- Nouveau programme de français du cycle 2 publié au BO du 31 octobre 2024, entrant en application à la rentrée 2025
- Priorité absolue : maîtrise des savoirs fondamentaux dont la lecture fluide
- Pratique quotidienne et régulière des compétences fondamentales en français

**Références officielles** :

- [Apprentissage de la lecture à l'École](https://www.education.gouv.fr/l-apprentissage-de-la-lecture-l-ecole-1028)
- [Guides fondamentaux pour l'enseignement](https://eduscol.education.fr/3107/guides-fondamentaux-pour-l-enseignement)
- [Repères annuels de progression du CP à la 3e](https://eduscol.education.fr/137/reperes-annuels-de-progression-et-attendus-de-fin-d-annee-du-cp-la-3e)
- [Pour enseigner la lecture et l'écriture au CP](https://eduscol.education.fr/media/1508/download)

#### 1.3.2 Approche Scientifique : Travaux d'André Tricot

L'application Lecture Flash s'inscrit dans une démarche fondée sur les apports de la recherche en psychologie cognitive, notamment les travaux d'**André Tricot** (Professeur des Universités, Université Paul Valéry Montpellier 3) sur le numérique et les apprentissages.

**Principes appliqués** :

1. **Conditions d'efficacité du numérique** (Tricot & Amadieu, 2020 ; Tricot & Chesné, 2020) :
    - Le numérique ne facilite pas _directement_ les apprentissages mais peut être un atout dans certaines conditions pédagogiques
    - L'efficacité d'un outil numérique dépend de son adéquation avec l'objectif pédagogique visé
    - Les apports du numérique sont différents selon la discipline et la fonction pédagogique

2. **Charge cognitive et automatisation** :
    - Lecture Flash favorise l'automatisation du décodage en imposant un rythme régulier
    - La disparition progressive réduit la charge cognitive en maintenant un focus unique sur la vitesse de lecture
    - Pas de traitement sémantique simultané : l'élève se concentre sur la fluence

3. **Motivation et apprentissage** (Tricot, 2014) :
    - Distinction entre "désir de savoir" et "désir d'apprendre"
    - Le défi du "texte qui disparaît" suscite l'intérêt mais reste subordonné à l'objectif pédagogique
    - L'outil ne remplace pas la médiation enseignante

4. **Conception pédagogique** :
    - Un outil facile à utiliser, perçu comme utile, acceptable dans le temps scolaire
    - Compatible avec les valeurs de l'École (gratuité, accessibilité, RGPD)
    - Usage collectif (TBI) ou individuel selon les besoins

**Publications de référence** :

- Amadieu, F. & Tricot, A. (2020). _Apprendre avec le numérique - Mythes et réalités_ (2e éd.). Retz.
- Tricot, A. & Chesné, J.-F. (2020). _Numérique et apprentissages scolaires_. Cnesco. [Rapport complet](https://www.cnesco.fr/numerique-et-apprentissages-scolaires/)
- Tricot, A. (2021). Le numérique permet-il des apprentissages scolaires moins contraints ? _Formation et profession_, 29(1).

**Avertissement scientifique** :
Conformément aux conclusions de Tricot, l'efficacité de Lecture Flash dépend :

- De son intégration dans une progression pédagogique cohérente
- De la formation des enseignants à son usage raisonné
- De l'accompagnement des élèves (pas d'usage autonome sans guidage)
- D'une évaluation régulière des progrès en fluence

### 1.4 Public Cible

- **Utilisateurs principaux** : Enseignants du primaire
- **Bénéficiaires** : Élèves du cycle 2 et 3 (CP à CM2)
- **Contexte d'usage** : Salle de classe, TBI/TNI, ordinateurs individuels ou collectifs

### 1.5 Portée

L'application permet l'entraînement à la fluence de lecture par disparition progressive du texte, avec plusieurs vitesses de lecture et deux modes (voix haute/silencieuse).

---

## 2. Description Générale

### 2.1 Fonctionnalités Principales

1. **Saisie de texte** : Importation, saisie manuelle ou chargement depuis cloud
2. **Configuration de lecture** : Choix du type et de la vitesse de lecture
3. **Lecture flash** : Affichage progressif avec disparition mot par mot
4. **Gestion de fichiers** : Import/Export de textes
5. **Système d'aide** : Tooltips contextuels, modale d'aide, message de bienvenue

### 2.2 Avantages Pédagogiques

#### 2.2.1 Conformité aux objectifs officiels

- **Automatisation du décodage** : Répétition espacée à vitesses progressives (30-110 MLM)
- **Fluence en lecture à voix haute** : Mode adapté aux attendus du cycle 2
- **Fluence en lecture silencieuse** : Préparation aux exigences du cycle 3
- **Différenciation pédagogique** : 5 niveaux de vitesse adaptés aux progressions scolaires

#### 2.2.2 Apports spécifiques

- Entraînement ciblé de la fluence de lecture
- Adaptation aux besoins individuels (vitesses variables)
- Suivi visuel du rythme de lecture
- Motivation par le défi du "texte qui disparaît"
- Support numérique au service d'un objectif pédagogique clairement défini
- Guidage progressif et contextuel (aide juste-à-temps)

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

#### 3.1.3 Système d'Aide Contextuelle

**Identifiant** : REQ-FUNC-003  
**Priorité** : Haute  
**Description** : Système d'aide moderne en 3 niveaux pour guider l'utilisateur sans surcharge cognitive.

**Composants** :

1. **FirstTimeMessage** (message de première visite)
    - Affichage automatique si clé localStorage `lecture-flash-first-visit` absente
    - Contenu : 3 étapes simplifiées (saisir texte, choisir vitesse, lancer lecture)
    - Fermeture définitive avec sauvegarde localStorage
    - Animation fadeIn (150ms)
    - Bannière dégradé bleu avec fond blanc

2. **Tooltips contextuels**
    - Technologie : React Portal pour éviter problèmes d'overflow
    - Position : top (onglets), right (vitesses), bottom (bouton aide)
    - Délai d'apparition : 200ms
    - Contenu : descriptions courtes (< 100 caractères)
    - Support : survol, focus, touch
    - Fond noir (`bg-gray-900`), texte blanc, `z-index: 9999`

3. **HelpModal** (guide complet)
    - Déclencheur : bouton (?) en haut à droite avec tooltip
    - Contenu : guide détaillé en 3 étapes avec exemples concrets
    - Vitesses expliquées : 30-110 MLM avec correspondances niveaux scolaires
    - Fermeture : Escape, overlay, bouton ×, bouton "J'ai compris"
    - Accessibilité : ARIA dialog, focus trap, scroll lock body
    - Attribution : @petitejulie89 pour la méthode pédagogique

**Critères d'acceptation** :

- Tooltips s'affichent au survol après 200ms
- Tooltips utilisent React Portal (pas de problème d'overflow)
- FirstTimeMessage ne s'affiche qu'une seule fois
- HelpModal accessible au clavier (Tab, Escape)
- Aucun texte obsolète ou incorrect
- Conformité WCAG 2.1 AA (contraste 4.5:1 minimum, ARIA labels)
- Animation fadeIn fluide (150ms ease-in-out)

**Justification pédagogique (André Tricot)** :

- **Charge cognitive minimale par défaut** : interface épurée, pas de "mur de texte"
- **Guidage juste-à-temps** : tooltips au moment de l'action, pas avant
- **Découverte progressive** : pas de surcharge informationnelle initiale
- **Autonomie progressive** : aide toujours disponible mais optionnelle
- **Réduction charge extrinsèque** : l'utilisateur se concentre sur la tâche, pas sur l'outil

---

### 3.2 Chargement de Texte

#### 3.2.1 Saisie Manuelle

**Identifiant** : REQ-FUNC-004  
**Priorité** : Critique  
**Description** : L'utilisateur peut saisir ou copier-coller du texte directement.

**Critères d'acceptation** :

- Textarea responsive avec bordure bleue
- Support du copier-coller (Ctrl+C / Ctrl+V)
- Pas de limite de caractères
- Nettoyage automatique des espaces multiples

#### 3.2.2 Import Local

**Identifiant** : REQ-FUNC-005  
**Priorité** : Haute  
**Description** : L'utilisateur peut importer un fichier .txt depuis son ordinateur.

**Critères d'acceptation** :

- Bouton "Importer" avec icône upload
- Filtre sur fichiers .txt uniquement
- Chargement du contenu dans la zone de texte
- Message d'erreur si format invalide

#### 3.2.3 Export Local

**Identifiant** : REQ-FUNC-006  
**Priorité** : Haute  
**Description** : L'utilisateur peut sauvegarder le texte en fichier .txt.

**Critères d'acceptation** :

- Bouton "Enregistrer" avec icône download
- Nom de fichier par défaut : "lecture-flash.txt"
- Encodage UTF-8
- Téléchargement automatique

#### 3.2.4 Chargement Cloud

**Identifiant** : REQ-FUNC-007  
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

**Identifiant** : REQ-FUNC-008  
**Priorité** : Moyenne  
**Description** : Génération d'un lien partageable avec le texte pré-chargé.

**Critères d'acceptation** :

- URL au format : `?url=encodedCloudUrl`
- Chargement automatique au démarrage si paramètre présent
- Bouton "Copier" pour copier l'URL dans le presse-papier
- Message de succès "✓ Copié !"

---

### 3.3 Configuration de Lecture

#### 3.3.1 Vitesses de Lecture

**Identifiant** : REQ-FUNC-009  
**Priorité** : Critique  
**Description** : Choix de la vitesse de lecture en mots par minute, conforme aux programmes.

**Vitesses proposées** (conforme aux repères CP-CM2) :

- 30 MLM (Très lent) - CP - début CE1 - Déchiffrage en cours d'acquisition
- 50 MLM (Lent) - CE1 - Lecture mot à mot
- 70 MLM (Moyen) - CE2 - Lecture par groupes de mots
- 90 MLM (Rapide) - CM1-CM2 - Lecture fluide
- 110 MLM (Très rapide) - CM2 et + - Lecture experte

**Critères d'acceptation** :

- Calcul automatique du timing par caractère
- Formule : `speed = ((nbreMots / vitesse) * 60000) / nbreCaracteres`
- Précision à la milliseconde
- Pas de lag perceptible
- Tooltips sur chaque vitesse avec correspondances niveaux scolaires

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
**Description** : Les signes de ponctuation sont correctement espacés selon les règles françaises.

**Règles appliquées** :

- Espace insécable avant : ; ! ? » %
- Espace insécable après : «
- Pas d'espace après : ' -

**Critères d'acceptation** :

- Remplacement automatique par `\u00a0`
- Affichage conforme aux normes typographiques françaises

---

## 4. Exigences Non Fonctionnelles

### 4.1 Performance

#### 4.1.1 Temps de Chargement

**Identifiant** : REQ-PERF-001  
**Priorité** : Haute  
**Description** : L'application doit charger rapidement.

**Critères d'acceptation** :

- First Contentful Paint (FCP) < 1,5s
- Time to Interactive (TTI) < 3s
- Lighthouse Performance Score > 90

#### 4.1.2 Fluidité Animation

**Identifiant** : REQ-PERF-002  
**Priorité** : Critique  
**Description** : L'animation de lecture doit être parfaitement fluide.

**Critères d'acceptation** :

- 60 FPS constants
- Pas de frames dropped
- CPU usage < 50% pendant lecture
- Tests sur TBI vieillissants (Promethean, Smart, Mimio)

#### 4.1.3 Build et Bundle

**Identifiant** : REQ-PERF-003  
**Priorité** : Moyenne  
**Description** : Optimisation du temps de build et de la taille des bundles.

**Critères d'acceptation** :

- Build time < 5s
- Bundle CSS < 30 KB
- Bundle JS < 200 KB
- Total bundle < 500 KB

---

### 4.2 Compatibilité

#### 4.2.1 Navigateurs

**Identifiant** : REQ-COMPAT-001  
**Priorité** : Critique  
**Description** : L'application fonctionne sur tous les navigateurs modernes.

**Navigateurs supportés** :

- Chrome 90+ (Windows, Mac, Linux, ChromeOS)
- Firefox 88+ (Windows, Mac, Linux)
- Safari 14+ (Mac, iOS)
- Edge 90+ (Windows)
- Chrome Android 90+

#### 4.2.2 Matériel TBI/TNI

**Identifiant** : REQ-COMPAT-002  
**Priorité** : Haute  
**Description** : Fonctionnement optimal sur tableaux interactifs.

**Matériel testé** :

- Promethean ActivBoard
- Smart Board
- Mimio Interactive

**Critères d'acceptation** :

- Touch/stylet fonctionnel
- Affichage lisible à 3 mètres
- Pas de lag au toucher

#### 4.2.3 Responsive Design

**Identifiant** : REQ-COMPAT-003  
**Priorité** : Haute  
**Description** : Adaptation mobile et tablette.

**Breakpoints** :

- Mobile : < 768px
- Tablette : 768px - 1024px
- Desktop : > 1024px

**Critères d'acceptation** :

- Menu hamburger mobile
- Boutons tactiles > 44x44px
- Texte lisible sans zoom

---

### 4.3 Accessibilité

#### 4.3.1 WCAG 2.1

**Identifiant** : REQ-ACCESS-001  
**Priorité** : Haute  
**Description** : Conformité aux normes d'accessibilité.

**Critères d'acceptation** :

- Contraste minimum 4.5:1 (AA)
- Taille de police ajustable
- Navigation clavier complète
- Labels ARIA sur tous les boutons
- Tooltips avec React Portal (pas de problème d'overflow)

#### 4.3.2 Navigation Clavier

**Identifiant** : REQ-ACCESS-002  
**Priorité** : Haute  
**Description** : Toutes les fonctions accessibles au clavier.

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
- Content-Security-Policy obligatoire en production

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
src/
├── index.jsx
├── components/
│ ├── App.jsx
│ ├── Tooltip/
│ │ └── index.jsx # Nouveau (v2.2.0)
│ ├── HelpModal/
│ │ └── index.jsx # Nouveau (v2.2.0)
│ ├── FirstTimeMessage/
│ │ └── index.jsx # Nouveau (v2.2.0)
│ ├── Navbar/
│ ├── LectureFlash/
│ │ ├── index.jsx
│ │ ├── Input/
│ │ │ ├── index.jsx # Modifié (v2.2.0)
│ │ │ └── TextInputManager.jsx # Modifié (v2.2.0)
│ │ └── Flash/
│ │ ├── ChoixVitesseAmeliore.jsx # Modifié (v2.2.0)
│ │ ├── FlashAmelioreTest.jsx # Modifié (v2.2.0)
│ │ └── Mot.jsx # Modifié (v2.2.0)
│ ├── CloudUrlInput.jsx
│ └── ShareCloudLink.jsx
├── hooks/
│ └── useMarkdownFromUrl.js
└── styles/
├── index.css # Modifié (v2.2.0) : animation fadeIn
└── flash.css

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
- Animations CSS natives (fadeIn pour tooltips)

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

- Content : index.html, src/\*_/_.{js,jsx}
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
- **Accompagnement enseignant** : Pas d'usage autonome sans guidage (principe Tricot)

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
- [ ] Sélection vitesse lecture
- [ ] Animation disparition progressive
- [ ] Espaces entre mots préservés
- [ ] Retour à la ligne automatique
- [ ] Gestion ponctuation française
- [ ] Bouton Démarrer/Modifier
- [ ] Réinitialisation après cloud
- [ ] Responsive mobile
- [ ] Menu hamburger
- [ ] Tooltips contextuels
- [ ] Modale d'aide
- [ ] Message première visite

### 7.2 Tests de Performance

- [ ] Lighthouse Score > 90
- [ ] Animation 60 FPS
- [ ] Temps chargement < 3s
- [ ] Bundle size < 500 KB
- [ ] Tests TBI vieillissants (Promethean, Smart, Mimio)

### 7.3 Tests de Compatibilité

- [ ] Chrome Windows/Mac/Linux
- [ ] Firefox Windows/Mac/Linux
- [ ] Safari Mac/iOS
- [ ] Edge Windows
- [ ] Chrome Android
- [ ] TBI Promethean/Smart/Mimio

### 7.4 Tests Pédagogiques

- [ ] Tests utilisateurs avec enseignants cycles 2 et 3
- [ ] Évaluation de la courbe d'apprentissage (< 2 min pour maîtrise avec nouveau système d'aide)
- [ ] Retours sur pertinence des vitesses MLM
- [ ] Observation usage en classe (collectif TBI + individuel)

### 7.5 Tests d'Accessibilité

- [ ] Navigation clavier complète (Tab, Escape, Enter)
- [ ] Tooltips accessibles (ARIA, Portal)
- [ ] Modale accessible (focus trap, ARIA dialog)
- [ ] Contraste WCAG 2.1 AA

---

## 8. Livrables

### 8.1 Code Source

- Repository Git complet
- README.md avec instructions
- Documentation JSDoc
- Fichiers de configuration

### 8.2 Documentation

- SRS.md v2.2.0 (ce document)
- CHANGELOG.md v2.2.0
- README.md enrichi
- docs/JUSTIFICATION_PEDAGOGIQUE_AIDE.md (nouveau v2.2.0)

### 8.3 Assets

- Fichiers SVG (icônes)
- Animations CSS (flash.css + fadeIn)
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
✅ Conformité programmes Eduscol
✅ Fondements scientifiques explicités
✅ Système d'aide contextuelle moderne (v2.2.0)
✅ Animation Flash fonctionnelle (v2.2.0)

### 9.2 Métriques de Performance

- **Build time** : < 5s (vs 30s avant)
- **HMR** : < 200ms (vs 3s avant)
- **Bundle CSS** : < 30 KB (vs 200 KB avant)
- **Dependencies** : 9 packages (vs 24 avant)
- **Node modules** : ~150 MB (vs 400 MB avant)

---

## 10. Références

### 10.1 Sources Pédagogiques Officielles

**Programmes de l'Éducation Nationale** :

- Ministère de l'Éducation Nationale (2024). [L'apprentissage de la lecture à l'École](https://www.education.gouv.fr/l-apprentissage-de-la-lecture-l-ecole-1028)
- Eduscol (2024). [Guides fondamentaux pour l'enseignement](https://eduscol.education.fr/3107/guides-fondamentaux-pour-l-enseignement)
- Eduscol (2024). [Repères annuels de progression et attendus de fin d'année du CP à la 3e](https://eduscol.education.fr/137/reperes-annuels-de-progression-et-attendus-de-fin-d-annee-du-cp-la-3e)
- MEN (2022). [Pour enseigner la lecture et l'écriture au CP](https://eduscol.education.fr/media/1508/download) (Guide révisé)
- MEN (2019). Pour enseigner la lecture et l'écriture au CE1
- MEN (2020). Pour enseigner la compréhension au CM1 et CM2

**Inspiration pédagogique initiale** :

- Meunier, J. (2017). [Fluence : le texte qui s'efface](http://www.ecoledejulie.fr/fluence-le-texte-qui-s-efface-a207401800). L'École de Julie.

### 10.2 Recherche en Psychologie Cognitive

**Travaux d'André Tricot** :

- Amadieu, F. & Tricot, A. (2020). _Apprendre avec le numérique - Mythes et réalités_ (2e éd.). Paris : Retz.
- Tricot, A. & Chesné, J.-F. (2020). _Numérique et apprentissages scolaires_. Rapport de synthèse pour le Cnesco. [https://www.cnesco.fr/numerique-et-apprentissages-scolaires/](https://www.cnesco.fr/numerique-et-apprentissages-scolaires/)
- Tricot, A. (2021). Le numérique permet-il des apprentissages scolaires moins contraints ? _Formation et profession_, 29(1).
- Mons, N. & Tricot, A. (2020). Dossier de synthèse : Numérique et apprentissages scolaires. Cnesco.

**Autres références scientifiques** :

- Goigoux, R. (2016). _Lire et écrire. Rapport de recherche sur l'influence des pratiques d'enseignement de la lecture et de l'écriture sur la qualité des premiers apprentissages_. IFÉ, Lyon.
- Dehaene, S. (2007). _Les Neurones de la lecture_. Paris : Odile Jacob.

### 10.3 Documentation Technique

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

### 10.4 Standards

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
**Charge cognitive** : Quantité de ressources mentales mobilisées pour une tâche (Tricot)
**Automatisation** : Acquisition d'une procédure sans effort conscient (Dehaene)
**Portal** : Technique React pour rendre un composant hors de la hiérarchie DOM (v2.2.0)

---

## Changelog

### v2.2.0 (10 février 2026)

**Ajouts majeurs** :

- Section 3.1.3 : Système d'Aide Contextuelle (REQ-FUNC-003)
- Composants : Tooltip, HelpModal, FirstTimeMessage
- Technologie : React Portal pour tooltips
- Animation : fadeIn pour éléments apparaissants

**Modifications** :

- Renumération des REQ-FUNC (004-012 → 004-012)
- Section 4.5.2 : Structure mise à jour (nouveaux composants, fichiers modifiés/supprimés)
- Section 2.1 : Ajout "Système d'aide" dans fonctionnalités principales
- Section 7.1 : Ajout tests tooltips/modale/message
- Section 7.5 : Nouveaux tests d'accessibilité (Portal, ARIA)
- Section 8.2 : JUSTIFICATION_PEDAGOGIQUE_AIDE.md dans livrables
- Glossaire : Ajout "Portal"

**Suppressions** :

- Composant Consignes (obsolète)
- Fichier App.css (obsolète)

### v2.1.0 (09 février 2026)

**Ajouts majeurs** :

- Section 1.3 : Fondements pédagogiques officiels avec références Eduscol
- Section 1.3.2 : Approche scientifique basée sur les travaux d'André Tricot
- Section 2.2 : Avantages pédagogiques détaillés avec conformité programmes
- Section 7.4 : Tests pédagogiques avec enseignants
- Section 10.1 : Références officielles MEN/Eduscol
- Section 10.2 : Recherche en psychologie cognitive (Tricot, Goigoux, Dehaene)
- Livrable 8.2 : JUSTIFICATION_PEDAGOGIQUE.md

**Modifications** :

- Critères d'acceptation 9.1 : Ajout conformité programmes et fondements scientifiques
- Contraintes 6.2 : Ajout principe d'accompagnement enseignant (Tricot)
- Glossaire : Ajout termes scientifiques (charge cognitive, automatisation)

---

**Version du document** : 2.2.0  
**Date de dernière modification** : 10 février 2026  
**Statut** : ✅ Application fonctionnelle - Système d'aide moderne intégré
