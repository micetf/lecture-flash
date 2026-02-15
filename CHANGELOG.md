# Changelog

Toutes les modifications notables de Lecture Flash sont documentées dans ce fichier.

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/) et les versions suivent le [versionnement sémantique](https://semver.org/lang/fr/).

---

## [Non publié] - En cours

## [3.12.2] - 2026-02-15

### Fixed

- **Masque d'effacement adaptatif** : Correction affichage avec polices à caractères hauts (OpenDyslexic)
    - Calcul dynamique de la hauteur réelle des mots via `getBoundingClientRect()`
    - Adaptation automatique aux accents, hampes et jambages de toutes les polices
    - Marges de sécurité adaptatives pour couverture totale
    - Fonctionne avec toutes les tailles de police (100% à 200%)

### Changed

- **`Word.jsx`** : Calcul dynamique des dimensions du masque CSS dans `startAnimation()`
- **`flash.css`** : Propriétés `height`, `top`, `bottom` du masque définies en JavaScript au lieu de CSS fixe

---

## [3.12.1] - 2026-02-15

### Fixed

- **Calcul vitesse d'effacement** : Correction majeure du calcul de vitesse pour atteindre une précision < 5%
    - Prise en compte des espaces dans le calcul (animations séquentielles mot + espace)
    - Utilisation du service `calculateAnimationSpeed()` au lieu de calcul inline
    - Formule corrigée : `(nombreMots / vitesseMLM × 60000) / nombreCaracteres` avec espaces inclus
    - Tests validés : 50 MLM et 110 MLM conformes aux repères Eduscol
- **Pause/reprise lecture** : Correction du bug empêchant la reprise après pause
    - Gestion `animation-play-state` CSS dans `Word.jsx` (paused/running)
    - Suppression effet bugué causant saut de 2 mots à la reprise
    - Prop `isPaused` transmise correctement de TextAnimation vers Word
- **Documentation `speedCalculations.js`** : Correction commentaire JSDoc (nombreCaracteres AVEC espaces, pas SANS)

### Changed

- **`TextAnimation.jsx`** : Refactorisation pour utiliser le service `calculateAnimationSpeed()`
- **`Word.jsx`** : Ajout gestion pause/reprise via `animationPlayState` CSS

---

## [3.12.0] - 2026-02-15

### Added

- **Aide contextuelle adaptative** : Refonte complète du système d'aide avec contenu différencié selon :
    - **Rôle** : Enseignant (vouvoiement, astuces pédagogiques) vs Élève (tutoiement, consignes simplifiées)
    - **Étape** : Contenu filtré pour n'afficher que les informations pertinentes (Étape 1: Import/Export, Étape 2: Vitesses MLM, Étape 3: Contrôles lecture)
    - **Droits** : Élève locked (pas de réglages) vs unlocked (modification vitesse/police autorisée)
- **`helpContent.jsx`** : Fichier de configuration centralisé avec 5 contextes d'aide prédéfinis (ENSEIGNANT_ETAPE_1/2/3, ELEVE_LOCKED, ELEVE_UNLOCKED)
- **Détection automatique du rôle** : Analyse des paramètres URL (`?speed=...&locked=...`) pour identifier un élève et adapter l'interface

### Changed

- **HelpModal intelligent** : Contenu dynamique généré via fonction `getContextualContent(context)` au lieu d'un contenu statique unique
- **Réduction charge cognitive** : Les élèves ne voient plus les explications sur CodiMD, partage, export - uniquement les consignes de lecture pertinentes
- **Ton adapté** : Vouvoiement pour enseignants, tutoiement pour élèves

### Fixed

- **Erreur JSX dans fichier .js** : Renommage `helpContext.js` → `helpContent.jsx` pour compatibilité Vite

---

## [3.11.0] - 2026-02-15

### Added

- **Modal unique d'export** : Refonte complète de l'export de textes dans l'onglet "Saisir". Un seul bouton "📥 Télécharger" ouvre une modal permettant de :
    - Saisir un titre personnalisé (obligatoire, 3-100 caractères)
    - Choisir le format : `.txt` (texte brut) ou `.md` (Markdown avec titre H1)
    - Prévisualiser le nom de fichier généré (slugification automatique)
    - Comprendre la différence entre les formats (info contextuelle pour .md)
- **Nom de fichier maîtrisé** : L'utilisateur choisit le titre qui sert de base au nom de fichier (ex: "Mon histoire" → `mon-histoire.txt`)
- **Export .txt avec titre** : Le format .txt bénéficie désormais d'un nom de fichier personnalisé (avant : `texte-2026-02-15.txt`)
- **Export .md pour CodiMD** : Format Markdown avec titre H1 (`# Titre`) en première ligne, compatible avec le filtrage lors du rechargement dans Lecture-Flash
- **Bandeau informatif CodiMD** : Affichage de la provenance du texte dans l'onglet Saisir après chargement depuis CodiMD (URL source, message explicatif)
- **`ExportModal.jsx`** : Nouveau composant modal avec validation temps réel, compteur de caractères, aperçu nom de fichier, aide contextuelle et accessibilité WCAG 2.1 AA
- **`exportText(titre, texte)`** dans `textProcessing.js` : Fonction d'export .txt avec titre personnalisé et slugification
- **`exportMarkdown(titre, texte)`** dans `textProcessing.js` : Fonction d'export Markdown avec titre H1

### Changed

- **UX cohérente** : Suppression de l'incohérence terminologique entre formats d'export. Un seul parcours utilisateur unifié pour .txt et .md
- **`TextInputManager.jsx`** : Calcul centralisé des statistiques (caractères/mots) avec `useMemo` pour optimisation performance. Passage des stats à tous les sous-composants
- **Interface épurée** : Bandeau CodiMD informatif pur (sans bouton "Recharger"). Pour recharger, l'utilisateur retourne à l'onglet CodiMD
- **Refactorisation services** : Ajout fonctions utilitaires `slugify()` et `downloadFile()` pour mutualiser la logique d'export

### Fixed

- **Props cohérentes** : Alignement du contrat entre `TextInputManager` et ses sous-composants (`ManualInputTab`, `FileUploadTab`, `CodiMDTab`)
- **Statistiques manquantes** : `charCount` et `wordCount` maintenant calculés et passés correctement à `ManualInputTab`
- **Prop `onRetourSaisie`** : Ajout de la prop manquante à `FileUploadTab` pour éviter l'erreur "onRetourSaisie is not a function"

---

## [3.11.0] - 2026-02-15

### Added

- **Modal unique d'export** : Refonte complète de l'export de textes dans l'onglet "Saisir". Un seul bouton "📥 Télécharger" ouvre une modal permettant de :
    - Saisir un titre personnalisé (obligatoire, 3-100 caractères)
    - Choisir le format : `.txt` (texte brut) ou `.md` (Markdown avec titre H1)
    - Prévisualiser le nom de fichier généré (slugification automatique)
    - Comprendre la différence entre les formats (info contextuelle pour .md)
- **Nom de fichier maîtrisé** : L'utilisateur choisit le titre qui sert de base au nom de fichier (ex: "Mon histoire" → `mon-histoire.txt`)
- **Export .txt avec titre** : Le format .txt bénéficie désormais d'un nom de fichier personnalisé (avant : `texte-2026-02-15.txt`)
- **Export .md pour CodiMD** : Format Markdown avec titre H1 (`# Titre`) en première ligne, compatible avec le filtrage lors du rechargement dans Lecture-Flash
- **Bandeau informatif CodiMD** : Affichage de la provenance du texte dans l'onglet Saisir après chargement depuis CodiMD (URL source, message explicatif)
- **`ExportModal.jsx`** : Nouveau composant modal avec validation temps réel, compteur de caractères, aperçu nom de fichier, aide contextuelle et accessibilité WCAG 2.1 AA
- **`exportText(titre, texte)`** dans `textProcessing.js` : Fonction d'export .txt avec titre personnalisé et slugification
- **`exportMarkdown(titre, texte)`** dans `textProcessing.js` : Fonction d'export Markdown avec titre H1

### Changed

- **UX cohérente** : Suppression de l'incohérence terminologique entre formats d'export. Un seul parcours utilisateur unifié pour .txt et .md
- **`TextInputManager.jsx`** : Calcul centralisé des statistiques (caractères/mots) avec `useMemo` pour optimisation performance. Passage des stats à tous les sous-composants
- **Interface épurée** : Bandeau CodiMD informatif pur (sans bouton "Recharger"). Pour recharger, l'utilisateur retourne à l'onglet CodiMD
- **Refactorisation services** : Ajout fonctions utilitaires `slugify()` et `downloadFile()` pour mutualiser la logique d'export

### Fixed

- **Props cohérentes** : Alignement du contrat entre `TextInputManager` et ses sous-composants (`ManualInputTab`, `FileUploadTab`, `CodiMDTab`)
- **Statistiques manquantes** : `charCount` et `wordCount` maintenant calculés et passés correctement à `ManualInputTab`
- **Prop `onRetourSaisie`** : Ajout de la prop manquante à `FileUploadTab` pour éviter l'erreur "onRetourSaisie is not a function"

---

## [3.10.4] - 2026-02-14

### Changed

- **Bouton "Relire" remplacé par "Arrêter"** : Stoppe la lecture sans redémarrage automatique. L'utilisateur doit recliquer "Lancer la lecture" pour relire. Contrôle plus explicite, cohérence avec conventions UI (bouton rouge).

---

## [3.10.3] - 2026-02-14

### Fixed

- **Boucle infinie chargement CodiMD** : Erreur "Maximum update depth exceeded" causée par 3 effets React redondants appelant `loadMarkdownFromUrl()`. Solution : séparation en 2 effets distincts avec garde `hasLoadedFromUrl` pour empêcher réexécution infinie.

---

## [3.10.2] - 2026-02-14

### Fixed

- **Navigation élève locked=false** : Ajout flag `hasLoadedFromUrl` permettant retour à l'étape 2 pour modifier vitesse, police et taille
- **Perte paramètres police/taille** : Ajout prop `initialOptions` dans DisplayOptions avec synchronisation parent/enfant
- **Boutons enseignant visibles pour élèves** : Masquage conditionnel boutons "Réglage personnalisé", "Partager" et "Changer texte" si `speedConfig` présent

### Changed

- Texte bouton : "← Changer la vitesse" → "← Modifier les réglages"
- Alignement bouton "Suivant" : `justify-end` quand seul visible (mode élève)

---

## [3.10.1] - 2026-02-14

### Added

- **Paramètres affichage dans liens de partage** : Police et taille incluses dans URL générée (`?police=...&taille=...`). Élève accède directement au texte avec options préréglées par l'enseignant.

### Changed

- Format URL : `?url=...&speed=...&locked=...&police=...&taille=...`
- Rétrocompatible : liens sans police/taille utilisent valeurs par défaut

---

## [3.10.0] - 2026-02-14

### Added

- **`HelpButton.jsx`** : Bouton d'aide global ("?") avec tooltip, accessibilité WCAG 2.1 AA
- **HelpModal enrichi** : Documentation complète des 3 étapes, vitesses MLM Eduscol (30-110), options d'affichage, contrôles de lecture

### Changed

- Harmonisation boutons utilitaires étape 3 : FullscreenButton + HelpButton au même niveau
- Terminologie corrigée : "Cloud" → "CodiMD", "chargez" → "téléversez/téléchargez"
- Suppression mentions fonctionnalités inexistantes (symboles vitesse, mode test)

---

## [3.9.18] - 2026-02-14

### Fixed

- **Destructuring hook corrigé** : `markdown: markdownText` au lieu de `text: markdownText`
- **Rechargement CodiMD impossible** : Ajout `reset()` après modification texte

### Changed

- Workflow chargement : utilisateur reste étape 1 avec texte chargé dans onglet "Saisir"
- Bouton plein écran repositionné en haut à droite (accessible avant/pendant lecture)

---

## [3.9.17] - 2026-02-14

### Fixed

- **Vitesse personnalisée reset à 70 MLM** : Initialisation intelligente via `useState(() => {...})` avec helper `isPredefinedSpeed()`
- **Carte vitesse perso toujours visible** : Ajout wrapper conditionnel `{isCustomSpeedSelected && (...)}`

---

## [3.9.16] - 2026-02-14

### Fixed

- **Police OpenDyslexic ne chargeait pas** : Migration CDN jsdelivr → CDNFonts (fonctionnel)
- **Guillemets cassaient attribut HTML style** : Utilisation guillemets simples dans noms de polices (`"'OpenDyslexic', sans-serif"`)
- **Comic Sans MS absente sur Linux** : Ajout webfont CDN pour compatibilité universelle

---

## [3.9.15] - 2026-02-14

### Fixed

- **Options affichage appliquées dès étape 3** : Police et taille maintenant visibles sur écran d'attente (avant clic "Lancer lecture")

---

## [3.9.14] - 2026-02-14

### Fixed

- **Vitesse animation Word** : Correction calcul `wordSpeed = charSpeed` (Word.jsx gère multiplication dans CSS)

### Added

- **`config/constants.js`** : Centralisation `FONT_FAMILIES` et `OPTIONS_POLICE`
- **`config/textStyles.js`** : Helpers `getTextStyles()`, `isValidFont()`, `isValidSize()`

### Removed

- Duplications éliminées : `FONT_FAMILIES` défini 2× → 1×, calcul styles centralisé

---

## [3.9.13] - 2026-02-14

### Fixed

- Aperçu DisplayOptions : formule fontSize corrigée (`(taille / 100) * 3rem`)
- Largeur texte lecture : max-w-4xl → max-w-6xl (meilleure lisibilité TBI/TNI)
- Suppression duplication `getEduscolZone` dans SpeedSelector

---

## [3.9.12] - 2026-02-14

### Fixed

- Chemin CSS corrigé : `src/styles/index.css`
- Map polices : correction guillemets et fallbacks
- Aperçu options temps réel dans DisplayOptions
- Sortie plein écran automatique lors navigation entre étapes
- Taille texte : text-2xl → text-3xl (base 3rem)

---

## [3.9.0 - 3.9.11] - 2026-02-13/14

### Added

- Services : `textProcessing.js`, `speedCalculations.js`, `urlGeneration.js`, `validation.js`
- Hooks : `useLocalStorage.js`, `useFullscreen.js`
- Composants Input : `ManualInputTab.jsx`, `FileUploadTab.jsx`, `CodiMDTab.jsx`
- Composants affichage : `DisplayOptions.jsx`, `FullscreenButton.jsx`, `HelpButton.jsx`

### Changed

- Conservation retours ligne et paragraphes dans animation
- TextInputManager refactorisé en orchestrateur (350 → 120 lignes)
- Intégration complète options affichage (police + taille)
- Mode plein écran accessible pendant lecture

### Fixed

- Filtrage titres H1 Markdown CodiMD
- Animation mot-à-mot refactorisée (gestion pause/progression)
- Bouton "Relire" réinitialise correctement l'animation

---

## [3.8.0 - 3.8.1] - 2026-02-13

### Refactoring

- Centralisation constantes dans `config/constants.js` et `config/initialState.js`
- Import helpers depuis `@config/constants` (single source of truth)
- Suppression `parametres.js` (migré)

---

## [3.7.0] - 2026-02-12

### Changed

- Tracking validité lien CodiMD : state `isCodiMDTextUnmodified`
- Invalidation lien si texte modifié ou remplacé
- Compteur mots ajouté (cohérent avec TextAnimation)

---

## [3.6.0] - 2026-02-11

### Changed

- **Workflow 3 étapes optimisé** :
    - `locked=true` : Skip étape 3, pas d'auto-start, pas de bouton "Changer vitesse"
    - `locked=false` : Skip étape 3, pas d'auto-start, avec bouton "Changer vitesse"
- Gestion centralisée modales (showCustomModal, showShareModal)
- Actions contextuelles dans header StepContainer (prop `renderActions`)

---

## [3.5.0] - 2026-02-12

### Changed

- **Partage discret** : Bloc vert 6 lignes → Bouton lien discret (1 ligne)
- Modale partage : Compacte (max-w-sm), ARIA compliant, focus trap
- Réduction charge cognitive de 70% (principes Tricot/Norman)

---

## [3.4.0] - 2026-02-12

### Changed

- **Workflow 4 étapes → 3 étapes** : Fusion "Partage" dans étape "Vitesse"
- Section partage intégrée à SpeedSelector (visible si texte CodiMD)
- Génération automatique lien avec copie presse-papier
- Réduction charge cognitive de 25%

---

## [3.3.0 - 3.3.1] - 2026-02-10

### Changed

- Partage simplifié : suppression re-sélection vitesse (affichage lecture seule)
- Animation mot-à-mot refactorisée (gestion `isPaused` immédiate)

---

## [2.2.0] - 2026-02-10

### Added

- **Système d'aide moderne** :
    - `Tooltip.jsx` : Tooltips contextuels React Portal
    - `HelpModal.jsx` : Guide complet 3 étapes + vitesses MLM
    - `FirstTimeMessage.jsx` : Onboarding première visite
- Conformité principes André Tricot (guidage juste-à-temps)

### Removed

- `Consignes/index.jsx` : Remplacé par système d'aide moderne

---

## [2.1.0] - 2026-02-09

### Added

- Documentation conformité programmes Eduscol
- Fondements pédagogiques (André Tricot)
- `docs/JUSTIFICATION_PEDAGOGIQUE.md`

---

## [2.0.0] - 2026-02-08

### Changed

- **Migration complète Webpack → Vite** :
    - Bundler : Vite 6.0.7
    - Styling : Tailwind CSS 3.4.17
    - Package manager : pnpm
    - 9 dépendances (vs 24 avant)

### Removed

- Webpack, Bootstrap, jQuery
- 15 dépendances obsolètes

### Performance

- Build time : 5s (vs 30s)
- HMR : 200ms (vs 3s)
- Bundle CSS : 30 KB (vs 200 KB)

---

## [1.0.0] - 2025-01-15

### Added

- Application Lecture Flash complète
- Mode SAISIE + Mode LECTURE mot-à-mot
- 5 vitesses MLM (30-110)
- Import/Export .txt
- Chargement cloud (Dropbox, Nextcloud, CodiMD)
- Partage par URL
- Interface responsive TBI/TNI
- WCAG 2.1 AA

### Technical

- React 18.2, Webpack, Bootstrap
- 24 dépendances

---

## Licence

MIT © 2024-2026 Frédéric MISERY
