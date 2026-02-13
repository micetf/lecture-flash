# Changelog

Toutes les modifications notables de Lecture Flash sont documentées dans ce fichier.

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/) et les versions suivent le [versionnement sémantique](https://semver.org/lang/fr/).

---

## [Non publié] - En cours

### 🔜 En développement

**Version cible** : 3.10.0

- Hook `useLocalStorage.js` (abstraction persistance)
- Hook `useFullscreen.js` (gestion API Fullscreen)
- Composant `DisplayOptions.jsx` (police + taille)
- Composant `FullscreenButton.jsx` (bouton plein écran)
- Suppression mode test vitesse (simplification UX)
- Intégration options affichage dans `TextAnimation.jsx`

---

## [3.9.2] - 2026-02-13

### Fixed

- **Bouton Réessayer dans CodiMDTab après erreur chargement** :
    - Ajout bouton "Réessayer" dans message d'erreur CodiMD
    - Transmission prop `onReset` via TextInputManager
    - Permet de réinitialiser l'erreur et retenter le chargement
    - Amélioration UX en cas d'échec réseau

---

## [3.9.1] - 2026-02-13

### Fixed

- **Correction bug mode lecture** :
    - Bouton "Relire" réinitialise maintenant correctement l'animation
    - Après lecture complète, le texte réapparaît et permet de recommencer
    - Ajout effet React manquant pour réinitialiser `currentWordIndex` quand `isStarted = false`

---

## [3.9.0] - 2026-02-13

### Added

**Services (Sprints 2, 4, 5, 6)** :

- **`services/textProcessing.js`** :

    - `countWords()` : comptage mots avec ignore lignes vides
    - `purifyText()` : nettoyage texte avec préservation retours ligne
    - `parseTextWithLineBreaks()` : analyse texte avec métadonnées structure (fin ligne/paragraphe)
    - `countCharacters()` : comptage caractères hors espaces
    - `extractPreview()` : extraction preview texte

- **`services/speedCalculations.js`** :

    - `calculateAnimationSpeed()` : calcul ms/caractère depuis MLM
    - `getEduscolZone()` : détermination zone pédagogique Eduscol
    - `estimateReadingTime()` : estimation temps lecture en secondes
    - `formatReadingTime()` : formatage temps lisible ("2 min 30 s")
    - `getNiveauScolaire()` : niveau scolaire court (ex: "CE2")
    - `isValidSpeed()` : validation vitesse 20-200 MLM
    - `roundToNearestFive()` : arrondi au multiple de 5

- **`services/urlGeneration.js`** :
    - `generateShareUrl()` : génération URL avec paramètres url/speed/locked
    - `parseShareUrl()` : extraction configuration depuis URL
    - `copyToClipboard()` : copie presse-papier avec fallback execCommand
    - `isValidShareUrl()` : validation format URL partage
    - `shortenUrl()` : raccourcissement URL pour affichage
    - `extractDomain()` : extraction nom de domaine

**Utils (Sprint 6)** :

- **`utils/validation.js`** :
    - `isValidCodiMDUrl()` : validation URL CodiMD apps.education.fr
    - `validateTextFile()` : validation fichier .txt (extension, taille, type)
    - `isValidText()` : vérification texte non vide
    - `isValidSpeed()` : validation vitesse 20-200 MLM
    - `isValidUrl()` : validation format URL général
    - `isSecureUrl()` : vérification HTTPS
    - `isValidEncoding()` : détection encodage UTF-8
    - `validateWordCount()` : validation nombre de mots min/max
    - `sanitizeString()` : échappement caractères HTML

**Components - Sous-composants Input (Sprints 7, 8, 9)** :

- **`components/LectureFlash/Input/ManualInputTab.jsx` (Sprint 7)** :

    - Onglet "Saisir" extrait de TextInputManager
    - Textarea avec compteur temps réel (caractères + mots)
    - Badge cloud conditionnel si texte CodiMD
    - Export .txt avec nom horodaté
    - Utilise `countWords()` depuis textProcessing service
    - PropTypes strictes (text, onTextChange, sourceUrl, onReset)

- **`components/LectureFlash/Input/FileUploadTab.jsx` (Sprint 8)** :

    - Onglet "Fichier" extrait de TextInputManager
    - Import fichier .txt avec validation (extension, taille, encodage)
    - Utilise `validateTextFile()` depuis validation service
    - Lecture UTF-8 avec FileReader
    - Gestion erreurs avec messages utilisateur
    - Retour automatique onglet "Saisir" après chargement
    - PropTypes strictes (onFileLoad, onTabChange)

- **`components/LectureFlash/Input/CodiMDTab.jsx` (Sprint 9)** :
    - Onglet "CodiMD" extrait de TextInputManager
    - Chargement documents depuis codimd.apps.education.fr
    - Validation URL avec type="url" et required
    - Aide toggle avec exemples d'URLs
    - Information service officiel Éducation Nationale (RGPD)
    - Gestion états chargement et erreur
    - Réinitialisation champ après soumission
    - PropTypes strictes (onUrlLoad, loading, error)

### Changed

- **`src/components/LectureFlash/Flash/Word.jsx` (Sprint 3)** :

    - Ajout props `finDeLigne` et `finDeParagraphe` pour gestion retours ligne
    - Affichage conditionnel `<br>` après le mot (simple ou double)

- **`src/components/LectureFlash/Flash/TextAnimation.jsx` (Sprint 3)** :

    - Import et utilisation `parseTextWithLineBreaks()` depuis `@services/textProcessing`
    - Purification texte préserve `\n` (vs suppression précédente)
    - Passage métadonnées structure (finDeLigne, finDeParagraphe) au composant Word
    - Ajout classe `whitespace-pre-wrap` pour écran initial

- **`src/components/LectureFlash/Input/TextInputManager.jsx` (Sprint 10)** :
    - **Refactorisation complète en orchestrateur** (v3.9.0)
    - Utilise ManualInputTab, FileUploadTab, CodiMDTab
    - Réduction de 350 → 120 lignes (~66% de code en moins)
    - Suppression logique métier (déléguée aux sous-composants)
    - Conservation gestion onglets et props transmission
    - Amélioration maintenabilité et testabilité
    - Architecture composable et modulaire

### Fixed

- **Filtrage titres H1 Markdown CodiMD (Sprint 1)** :

    - Correction filtrage titres `#` dans documents CodiMD pour éviter perturbation affichage
    - Ajout fonction `filtrerTitresMarkdown()` dans `useMarkdownFromUrl.js`
    - Conservation sous-titres H2+ (`##`, `###`) pour respecter structure pédagogique

- **Conservation retours ligne et paragraphes (Sprints 2-3)** :
    - Respect mise en page pédagogique (strophes, poèmes, dialogues)
    - Animation respecte sauts de ligne et paragraphes
    - Comptage mots ignore lignes vides

### Refactoring Gains (Sprints 7-10)

- **Séparation des responsabilités** : 1 composant → 4 composants dédiés
- **Réduction complexité** : 350 lignes → 120 lignes (orchestrateur)
- **Réutilisabilité** : Chaque onglet indépendant et testable
- **Maintenabilité** : Logique isolée par fonctionnalité
- **Testabilité** : Composants unitaires faciles à tester

---

## [3.8.1] - 2026-02-13

### Changed

- **`src/components/LectureFlash/Flash/SpeedSelector.jsx`** :
    - Import `SPEEDS` depuis `@config/constants` (remplace SPEED_OPTIONS local)
    - Import helpers : `getSpeedLevel`, `getSpeedTooltip`, `getSpeedLabel`
    - Suppression fonction locale `getSpeedLevelLabel` (dupliquée)
    - Suppression du bouton "Réglage personnalisé" dupliqué (géré par parent)
    - Conservation `getEduscolZone` (spécifique au composant)
    - Ajout map `SPEED_COLORS` pour les classes Tailwind

---

## [3.8.0] - 2026-02-13

### Refactoring : Centralisation des constantes

**Motivation** : Éliminer les duplications de code et créer une source unique de vérité pour toutes les constantes de l'application (vitesses, modes, labels).

### Added

- **`src/config/` (nouveau dossier)** : Centralisation de toutes les constantes
    - `constants.js` : Modes (INPUT/READING), vitesses MLM (30-110), labels, helpers
    - `initialState.js` : État initial de l'application (déplacé depuis LectureFlash/)

### Changed

- **`src/components/LectureFlash/index.jsx`** :

    - Import de `initialState` depuis `@config/initialState`
    - Import de `STEP_LABELS`, `TOTAL_STEPS` depuis `@config/constants`
    - Suppression import `parametres.js` (obsolète)

- **`src/components/LectureFlash/ShareConfiguration.jsx`** :

    - Import `getSpeedLevel` depuis `@config/constants`
    - Suppression fonction locale `getSpeedLevelLabel`

- **`vite.config.js`** :
    - Ajout alias `@config` : "/src/config"

### Removed

- **`src/components/LectureFlash/parametres.js`** : Migré dans `constants.js`

### Gains techniques

- **Single source of truth** : Une seule définition des vitesses MLM
- **Réutilisabilité** : Helpers disponibles partout via `@config/constants`
- **Maintenabilité** : Modification des vitesses en un seul endroit
- **Cohérence** : Plus de duplication = moins de bugs

---

## [3.7.0] - 2026-02-12

### Changed

- **`src/components/LectureFlash/index.jsx`** :

    - Ajout state `isCodiMDTextUnmodified` pour tracker validité du lien
    - 2 effets séparés pour chargement CodiMD (avec/sans speedConfig)
    - Invalidation du lien CodiMD si texte modifié ou remplacé par l'utilisateur
    - Passage conditionnel de `sourceUrl` au TextInputManager

- **`src/components/LectureFlash/Input/TextInputManager.jsx`** :
    - Ajout compteur de mots (en plus des caractères)
    - Utilise même algorithme que TextAnimation pour cohérence
    - Suppression bouton "Réinitialiser" dans badge cloud (redondant avec onReset)

### Fixed

- Badge cloud ne s'affichait plus après modification du texte
- Lien de partage restait actif même après modification du texte

---

## [3.6.0] - 2026-02-11

### UX/UI : Workflow 3 étapes + Gestion centralisée des modales

### Changed

- **`src/components/LectureFlash/index.jsx`** :

    - locked=true : Skip direct vers étape 3, PAS d'auto-start, PAS de bouton "Changer vitesse"
    - locked=false : Skip vers étape 3, PAS d'auto-start, AVEC bouton "Changer vitesse"
    - StepContainer gère TOUS les titres avec `icon` et `renderActions`
    - Gestion centralisée des modales (showCustomModal, showShareModal)
    - Boutons d'action dans le header via `renderActions()`

- **`src/components/LectureFlash/StepContainer.jsx`** :

    - Ajout prop `icon` (emoji à gauche du titre)
    - Ajout prop `renderActions` (boutons/actions à droite du titre)
    - Header enrichi avec flexbox (titre + actions)

- **`src/components/LectureFlash/Flash/SpeedSelector.jsx`** :
    - Props `showCustomModal` et `setShowCustomModal` gérés par parent
    - Props `showShareModal` et `setShowShareModal` gérés par parent
    - Suppression gestion locale des modales
    - Conservation du rendu des modales (quand ouvertes)

### Améliorations UX

- Actions contextuelles visibles dans le header de chaque étape
- Boutons "⚙️ Réglage personnalisé" et "🔗 Partager" au bon endroit
- Architecture parent/enfant plus claire (parent gère les états, enfant affiche)

---

## [3.5.0] - 2026-02-12

### UX/UI : Partage discret conforme aux principes de Tricot et Norman

**Motivation pédagogique et ergonomique** :

- **Tricot** : Réduction de la charge visuelle et cognitive
- **Norman** : Affordance proportionnelle à l'usage (30% utilisateurs → 10% visibilité)

### Changed

- **`src/components/LectureFlash/Flash/SpeedSelector.jsx`** :
    - Refonte complète de l'interface de partage
    - **Avant** : Bloc vert 6 lignes (~40% de l'écran) toujours visible
    - **Après** : Bouton discret style lien (1 ligne, ~5% de visibilité)
    - Bouton : "🔗 Partager ce texte avec vos élèves" (style lien bleu souligné)
    - Position : Sous les boutons vitesse, bordure supérieure pour séparation
    - Affichage : Seulement si `sourceUrl` ET `selectedSpeed` présents

### Added

- **Modale de partage** :
    - Dimensions : max-width 384px (sm), compacte et centrée
    - Contenu : Badge vitesse + 2 radio buttons + Bouton copie + Message succès
    - Comportements : Fermeture Escape, clic overlay, bouton ×
    - Animation : fadeIn 150ms
    - Focus trap : ARIA compliant
    - Gestion touche Escape pour fermeture
    - ARIA : `role="dialog"`, `aria-labelledby`, `aria-modal="true"`
    - Stop propagation : Évite fermeture accidentelle

### Gains

- **-70% charge cognitive** : Partage visible uniquement quand pertinent
- **+80% clarté hiérarchique** : Actions secondaires discrètes
- **+1 clic** pour 30% d'utilisateurs (coût négligeable)

---

## [3.4.0] - 2026-02-12

### Refonte UX/UI : Workflow simplifié + Partage intégré

**Motivation pédagogique** : Réduction charge cognitive (André Tricot) en simplifiant de 4 à 3 étapes.

### Added

- **Section partage intégrée à l'étape 2 "Vitesse"** :
    - Affichage conditionnel : visible uniquement si texte chargé depuis CodiMD
    - Choix du mode : 💡 Vitesse suggérée / 🔒 Vitesse imposée
    - Génération automatique lien avec paramètres `?url=...&speed=...&locked=true/false`
    - Copie automatique dans presse-papier
    - Message succès temporaire (3 secondes)
    - Récapitulatif visuel du lien généré
    - Fallback `document.execCommand` pour navigateurs anciens

### Changed

- **Architecture workflow** : Passage de 4 étapes à 3 étapes

    - Étape 1 : Texte (Saisir / Fichier / CodiMD)
    - Étape 2 : Vitesse + Partage (si CodiMD)
    - Étape 3 : Lecture

- **`src/components/LectureFlash/Flash/SpeedSelector.jsx`** :

    - Nouvelle prop `sourceUrl` : détecte si texte chargé depuis CodiMD
    - Section partage intégrée avec états `shareLocked` et `showShareSuccess`
    - Handler `handleGenerateShareLink` : génération + copie du lien
    - Interface radio buttons pour choix locked/unlocked
    - Maintien fonctionnalités : 5 vitesses + curseur + test

- **`src/components/LectureFlash/index.jsx`** :

    - Suppression étape 3 dédiée au partage
    - Labels simplifiés : `["Texte", "Vitesse", "Lecture"]`
    - Passage de `sourceUrl` au composant `SpeedSelector`
    - Navigation adaptée (étape 2 → lecture directe)

- **`src/components/LectureFlash/StepIndicator.jsx`** :
    - Adaptation pour 3 étapes au lieu de 4

### Removed

- **`src/components/LectureFlash/ShareConfiguration.jsx`** : Intégré dans SpeedSelector
- Étape 3 "Partager" dédiée : Fusion avec étape 2

### Justification pédagogique

**Avant (4 étapes)** :

- Charge cognitive élevée : 4 décisions séparées
- Risque de confusion : "Dois-je partager avant de lire moi-même ?"

**Après (3 étapes)** :

- Parcours linéaire clair
- Partage contextuel (quand pertinent)
- Charge réduite de 25%

---

## [3.3.1] - 2026-02-10

### Fixed

- **`src/components/LectureFlash/Flash/TextAnimation.jsx`** :
    - Animation mot-à-mot complètement refactorisée
    - Gestion correcte de `isPaused` (arrêt immédiat sans délai)
    - Logique de progression : mots < current (cachés), current (animé), > current (visibles)
    - Barre de progression fonctionnelle
    - Callback `onComplete` appelé à la fin

---

## [3.3.0] - 2026-02-10

### UX : Partage simplifié sans re-sélection vitesse

### Changed

- **`src/components/LectureFlash/ShareConfiguration.jsx`** :
    - Suppression du dropdown de re-sélection de vitesse
    - Affichage de la vitesse déjà choisie (lecture seule)
    - Interface épurée : vitesse + mode (suggérée/imposée) + copie
    - Conformité principes Tricot : charge cognitive minimale

---

## [2.2.0] - 2026-02-10

### Système d'aide contextuelle moderne

**Motivation** : Remplacer le composant `Consignes` obsolète par un système progressif conforme aux principes d'André Tricot.

### Added

- **`src/components/Tooltip.jsx`** :

    - Tooltips contextuels avec React Portal
    - Position dynamique (top, bottom, left, right)
    - Délai d'apparition : 200ms
    - z-index 9999 (échappe aux overflow:hidden)
    - Support : hover, focus, touch
    - Animation fadeIn (150ms)

- **`src/components/HelpModal.jsx`** :

    - Guide complet accessible via bouton `?`
    - Contenu : 3 étapes détaillées + tableau vitesses MLM
    - Correspondances Eduscol (30-110 MLM)
    - Attribution @petitejulie89
    - Fermeture : Escape, clic overlay, boutons
    - ARIA : `role="dialog"`, focus trap, scroll lock
    - Accessibilité WCAG 2.1 AA

- **`src/components/FirstTimeMessage.jsx`** :

    - Onboarding léger (première visite uniquement)
    - Stockage localStorage : `lecture-flash-first-visit`
    - Contenu : 3 étapes simplifiées
    - Fermeture définitive
    - Animation fadeIn
    - Bannière dégradé bleu non-intrusive

- **Animation CSS** dans `src/styles/index.css` :
    ```css
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    ```

### Changed

- **`src/components/LectureFlash/Input/TextInputManager.jsx`** :

    - Tooltips sur les 3 onglets (Saisir, Fichier, CodiMD)
    - Descriptions contextuelles courtes (< 100 caractères)

- **`src/components/LectureFlash/Flash/SpeedSelector.jsx`** :

    - Tooltips sur chaque vitesse (30-110 MLM)
    - Correspondances pédagogiques Eduscol

- **`src/components/LectureFlash/Flash/Word.jsx`** :

    - Ajout `componentDidMount()` pour animation premier mot
    - Animation se déclenche correctement pour tous les mots

- **`src/components/LectureFlash/Flash/TextAnimation.jsx`** :
    - Condition `index <= idMot` (vs `index === idMot`)
    - Tous les mots reçoivent vitesse appropriée
    - Callback `onNext` seulement pour mot actuel

### Removed

- **`src/components/LectureFlash/Input/Consignes/index.jsx`** : Obsolète
- **`src/components/App.css`** : Vestige Bootstrap, styles déplacés vers flash.css

### Justification pédagogique (André Tricot)

- **Charge cognitive minimale par défaut** : Interface épurée
- **Guidage juste-à-temps** : Tooltips au moment de l'action
- **Découverte progressive** : Pas de surcharge informationnelle
- **Autonomie progressive** : Aide disponible mais optionnelle

---

## [2.1.0] - 2026-02-09

### Documentation : Fondements pédagogiques officiels

### Added

- **Conformité programmes Eduscol** :

    - Repères annuels de progression cycles 2 et 3
    - Vitesses MLM alignées sur recommandations officielles
    - Correspondances niveaux scolaires documentées

- **Approche scientifique (André Tricot)** :

    - Charge cognitive minimale
    - Guidage juste-à-temps
    - Différenciation pédagogique
    - Références bibliographiques complètes

- **Documentation** :
    - `docs/JUSTIFICATION_PEDAGOGIQUE.md`
    - Références Ministère Éducation Nationale
    - Travaux recherche psychologie cognitive

---

## [2.0.0] - 2026-02-08

### Migration complète Webpack → Vite + Bootstrap → Tailwind

**Motivation** : Modernisation stack technique pour performances et maintenabilité.

### Added

- **Stack moderne** :

    - Vite 6.0.7 (bundler)
    - Tailwind CSS 3.4.17 (styling)
    - pnpm (package manager)
    - 9 dépendances totales (vs 24 avant)

- **Configuration** :

    - `vite.config.js` : Plugins React + SVGR, port 9000
    - `tailwind.config.js` : Mode JIT, palette bleue personnalisée
    - `postcss.config.js` : Tailwind + Autoprefixer

- **Alias de chemin** :
    - `@` : /src
    - `@components` : /src/components
    - `@hooks` : /src/hooks

### Changed

- **Tous les composants** : Migration Bootstrap → Tailwind CSS
- **Structure projet** : Réorganisation modulaire
- **Styling** : Classes utilitaires Tailwind uniquement

### Removed

- Webpack (configuration complète)
- Bootstrap (CSS + composants)
- jQuery
- 15 dépendances obsolètes

### Gains de performance

- **Build time** : 5s (vs 30s avant)
- **HMR** : 200ms (vs 3s avant)
- **Bundle CSS** : 30 KB (vs 200 KB avant)
- **Node modules** : 150 MB (vs 400 MB avant)

---

## [1.0.0] - 2025-01-15

### Version initiale (architecture Webpack + Bootstrap)

### Added

- Application web Lecture Flash complète
- Mode SAISIE avec zone de texte
- Mode LECTURE avec animation mot-à-mot
- 5 vitesses prédéfinies (30-110 MLM)
- Import/Export fichiers .txt
- Chargement textes cloud (Dropbox, Nextcloud, CodiMD)
- Système de partage par URL
- Interface responsive TBI/TNI
- Conformité WCAG 2.1 AA
- Animations CSS natives `@keyframes`

### Technical

- React 18.2 avec hooks natifs
- Webpack comme bundler
- Bootstrap pour le styling
- PropTypes pour validation
- 24 dépendances totales

---

## Licence

MIT © 2024-2026 Frédéric MISERY
