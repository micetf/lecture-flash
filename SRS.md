# Spécification des Exigences Logicielles (SRS)

# Lecture Flash - Application Éducative de Fluence

**Version** : 3.8.0  
**Date** : 13 février 2026  
**Auteur** : Frédéric MISERY - Conseiller Pédagogique de Circonscription Numérique  
**Status** : ✅ Production

---

## Table des Matières

1. [Introduction](#1-introduction)
2. [Description Générale](#2-description-générale)
3. [Exigences Fonctionnelles](#3-exigences-fonctionnelles)
4. [Exigences Non-Fonctionnelles](#4-exigences-non-fonctionnelles)
5. [Architecture Technique](#5-architecture-technique)
6. [Contraintes](#6-contraintes)
7. [Tests](#7-tests)
8. [Références](#8-références)
9. [Glossaire](#9-glossaire)

---

## 1. Introduction

### 1.1 Objectif du Document

Ce document spécifie les exigences fonctionnelles et techniques de l'application web **Lecture Flash**, destinée à l'entraînement à la fluence de lecture pour les élèves de l'école primaire française (CP à CM2).

### 1.2 Portée du Projet

**Public cible** :

- Élèves du primaire : CP à CM2 (6-11 ans)
- Enseignants du premier degré
- Professionnels de l'éducation (RASED, CPC, etc.)

**Objectifs pédagogiques** :

- Développer la fluence de lecture (automatisation du décodage)
- Améliorer la vitesse de lecture (30 à 110+ MLM)
- Éviter les retours en arrière (obstacle principal à la fluence)
- Différencier selon les niveaux (CP à CM2)

### 1.3 Fondements Pédagogiques

#### 1.3.1 Conformité Programmes Officiels

**Base réglementaire** :

- Programmes de l'Éducation Nationale (cycles 2 et 3)
- Repères annuels de progression Eduscol
- Guides fondamentaux pour l'enseignement de la lecture

**Vitesses de référence Eduscol** :

| Niveau  | Vitesse lecture à voix haute | Type de texte                      |
| ------- | ---------------------------- | ---------------------------------- |
| CP      | 30 MLM                       | Déchiffrage en cours d'acquisition |
| CE1     | 50 MLM                       | Lecture mot à mot                  |
| CE2     | 70 MLM                       | Lecture par groupes de mots        |
| CM1-CM2 | 90-110 MLM                   | Lecture fluide                     |

**Source** : [Eduscol - Repères annuels de progression](https://eduscol.education.fr/137/reperes-annuels-de-progression-et-attendus-de-fin-d-annee-du-cp-la-3e)

#### 1.3.2 Approche Scientifique (André Tricot)

**Principes appliqués** :

1. **Charge cognitive minimale** :

    - Interface épurée (3 étapes seulement)
    - Guidage progressif (une action à la fois)
    - Pas de surcharge informationnelle

2. **Guidage juste-à-temps** :

    - Tooltips contextuels (au moment de l'action)
    - Aide disponible mais non intrusive
    - Messages de succès immédiats

3. **Différenciation pédagogique** :
    - 5 vitesses prédéfinies + personnalisation
    - Adaptation au niveau de l'élève
    - Progression individualisée

**Référence** : Tricot, A. & Chesné, J.-F. (2020). _Numérique et apprentissages scolaires_. Cnesco.

#### 1.3.3 Méthode Pédagogique (Julie Meunier)

**Principe** : Texte qui s'efface progressivement mot par mot pour :

- Forcer la lecture continue
- Éviter les retours en arrière
- Automatiser le décodage
- Améliorer la compréhension par fluidité

**Source** : Meunier, J. (2017). [Fluence : le texte qui s'efface](http://www.ecoledejulie.fr/fluence-le-texte-qui-s-efface-a207401800). L'École de Julie.

---

## 2. Description Générale

### 2.1 Perspective Produit

Application web monopage (SPA) responsive fonctionnant :

- Sur ordinateur (TBI/TNI pour projection)
- Sur tablette (usage individuel)
- Sur smartphone (usage occasionnel)
- Hors ligne (après première visite - PWA potentielle)

### 2.2 Fonctionnalités Principales

1. **Gestion du texte** (Étape 1)

    - Saisie manuelle avec compteur
    - Import fichier .txt local
    - Chargement depuis CodiMD
    - Export en .txt

2. **Configuration vitesse** (Étape 2)

    - 5 vitesses prédéfinies (30-110 MLM)
    - Vitesse personnalisée (20-200 MLM)
    - Mode test (prévisualisation 10s)
    - Tooltips pédagogiques

3. **Partage** (Conditionnel si CodiMD)

    - Génération de liens avec paramètres
    - Mode suggéré (élève peut modifier)
    - Mode imposé (lecture automatique)

4. **Lecture animée** (Étape 3)

    - Disparition progressive mot-à-mot
    - Contrôles : Pause/Reprendre/Relire
    - Barre de progression visuelle
    - Retour conditionnel (sauf si imposé)

5. **Système d'aide intégré**
    - FirstTimeMessage (onboarding)
    - Tooltips contextuels (React Portal)
    - HelpModal (guide complet)

### 2.3 Utilisateurs et Scénarios

#### Scénario 1 : Enseignant prépare un exercice TBI

1. Saisir un texte adapté au niveau
2. Tester différentes vitesses (30-70 MLM)
3. Projeter sur TBI
4. Lancer la lecture collective

#### Scénario 2 : Élève en autonomie

1. Saisir son propre texte
2. Choisir vitesse adaptée (selon niveau)
3. S'entraîner individuellement
4. Relire plusieurs fois en augmentant

#### Scénario 3 : Partage différencié

**Enseignant** :

1. Créer texte sur CodiMD
2. Charger dans Lecture Flash
3. Configurer vitesse (suggérée ou imposée)
4. Partager lien par ENT/email

**Élève** :

1. Cliquer sur lien
2. Texte et vitesse chargés automatiquement
3. Lire selon configuration enseignant

---

## 3. Exigences Fonctionnelles

### 3.1 Gestion du Texte (REQ-FUNC-001)

**Priorité** : Critique

#### 3.1.1 Saisie Manuelle

**Description** : Textarea responsive avec compteur.

**Critères d'acceptation** :

- ✅ Zone de texte multi-lignes (min 200px de hauteur)
- ✅ Placeholder explicite
- ✅ Compteur temps réel : caractères + mots
- ✅ Algorithme de comptage cohérent avec TextAnimation
- ✅ Support copier-coller (Ctrl+C/V)
- ✅ Pas de limite de caractères

**Implémentation** : `TextInputManager.jsx` onglet "Saisir"

#### 3.1.2 Import Fichier Local

**Description** : Import de fichiers .txt depuis ordinateur.

**Critères d'acceptation** :

- ✅ Filtre sur extension .txt uniquement
- ✅ Encodage UTF-8
- ✅ Bouton "Choisir un fichier" visible
- ✅ Chargement automatique dans onglet "Saisir"
- ✅ Message d'erreur si format invalide

**Implémentation** : `TextInputManager.jsx` onglet "Fichier"

#### 3.1.3 Chargement CodiMD

**Description** : Chargement depuis URLs CodiMD (apps.education.fr).

**Critères d'acceptation** :

- ✅ Validation format URL (https://codimd.apps.education.fr/s/...)
- ✅ Conversion Markdown → texte brut
- ✅ Hook personnalisé `useMarkdownFromUrl`
- ✅ Gestion états : loading, error, success
- ✅ Badge indicateur "☁️ Texte chargé depuis le cloud"
- ✅ Invalidation si texte modifié (isCodiMDTextUnmodified)
- ✅ Bouton aide avec exemples d'URLs

**Implémentation** :

- `TextInputManager.jsx` onglet "CodiMD"
- `hooks/useMarkdownFromUrl.js`

#### 3.1.4 Export .txt

**Description** : Téléchargement du texte en fichier .txt.

**Critères d'acceptation** :

- ✅ Bouton "💾 Enregistrer (.txt)"
- ✅ Nom de fichier : `lecture-flash-{timestamp}.txt`
- ✅ Encodage UTF-8
- ✅ Bouton désactivé si texte vide

**Implémentation** : `TextInputManager.jsx` onglet "Saisir"

### 3.2 Configuration de Vitesse (REQ-FUNC-002)

**Priorité** : Critique

#### 3.2.1 Vitesses Prédéfinies

**Description** : 5 vitesses conformes Eduscol.

**Critères d'acceptation** :

- ✅ Grille responsive (1-2-3 colonnes selon écran)
- ✅ Cartes cliquables avec labels clairs
- ✅ Tooltips pédagogiques au survol
- ✅ Badge "⭐ Suggérée" si lien partagé (locked=false)
- ✅ Badge "✓ Sélectionnée" si choix utilisateur
- ✅ Bouton "🧪 Tester" par vitesse
- ✅ Bouton "Choisir" avec couleur distinctive

**Vitesses** :

```javascript
SPEEDS = [
    {
        value: 30,
        label: "30 MLM",
        level: "CP - début CE1",
        tooltip:
            "Idéal pour CP - début CE1 (déchiffrage en cours d'acquisition)",
    },
    {
        value: 50,
        label: "50 MLM",
        level: "CE1",
        tooltip: "Recommandé pour CE1 (lecture mot à mot)",
    },
    {
        value: 70,
        label: "70 MLM",
        level: "CE2",
        tooltip: "Adapté au CE2 (lecture par groupes de mots)",
    },
    {
        value: 90,
        label: "90 MLM",
        level: "CM1-CM2",
        tooltip: "Pour CM1-CM2 (lecture fluide)",
    },
    {
        value: 110,
        label: "110 MLM",
        level: "CM2 et +",
        tooltip: "Pour CM2 et + (lecture experte)",
    },
];
```

**Source** : `config/constants.js`

**Implémentation** : `SpeedSelector.jsx`

#### 3.2.2 Vitesse Personnalisée

**Description** : Curseur 20-200 MLM avec aperçu temps réel.

**Critères d'acceptation** :

- ✅ Input range 20-200 MLM (pas de 5)
- ✅ Affichage valeur courante en gros (4xl)
- ✅ Zone Eduscol calculée dynamiquement (getEduscolZone)
- ✅ Boutons "🧪 Tester" et "✓ Choisir"
- ✅ Modale centrée (max-width: 384px)
- ✅ Message pédagogique (repères Eduscol)

**Implémentation** : `SpeedSelector.jsx` + modale custom

#### 3.2.3 Mode Test

**Description** : Prévisualisation vitesse pendant 10 secondes.

**Critères d'acceptation** :

- ✅ Affichage des 5 premiers mots du texte
- ✅ Animation pulse (simulate reading)
- ✅ Durée : 10 secondes
- ✅ Bouton "⏸ Arrêter le test" pour sortir avant
- ✅ Retour automatique à la sélection après 10s

**Implémentation** : `SpeedSelector.jsx` (state isTestActive)

### 3.3 Partage (REQ-FUNC-003)

**Priorité** : Haute

**Condition** : Affiché uniquement si `sourceUrl` présent (texte CodiMD).

#### 3.3.1 Génération de Lien

**Description** : Création URL avec paramètres texte + vitesse + mode.

**Format** :

```
https://lectureflash.fr/?url={sourceUrl}&speed={speedWpm}&locked={true|false}
```

**Critères d'acceptation** :

- ✅ Bouton "🔗 Partager" visible dans header étape 2 (renderActions)
- ✅ Modale compacte (max-width: 384px)
- ✅ Badge vitesse sélectionnée (lecture seule)
- ✅ Radio buttons : 💡 Suggérée / 🔒 Imposée
- ✅ Bouton "📋 Copier le lien"
- ✅ Copie automatique dans presse-papier
- ✅ Message succès (3 secondes)
- ✅ Fallback `document.execCommand` si API Clipboard indisponible
- ✅ Récapitulatif du lien généré

**Comportements** :

| Mode     | Paramètre URL  | Comportement élève                       |
| -------- | -------------- | ---------------------------------------- |
| Suggérée | `locked=false` | Vitesse pré-sélectionnée mais modifiable |
| Imposée  | `locked=true`  | Skip direct étape 3, lecture automatique |

**Implémentation** :

- Bouton : `LectureFlash/index.jsx` (renderActions)
- Modale : `SpeedSelector.jsx` (showShareModal)

### 3.4 Lecture Animée (REQ-FUNC-004)

**Priorité** : Critique

#### 3.4.1 Animation Mot-à-Mot

**Description** : Disparition progressive du texte pour forcer la lecture continue.

**Critères d'acceptation** :

- ✅ Purification du texte (espaces, caractères spéciaux)
- ✅ Calcul vitesse : `((nbreMots / vitesse) * 60000) / nbreCaracteres`
- ✅ Animation CSS `@keyframes masquer` dans flash.css
- ✅ Espaces insécables avant/après ponctuation
- ✅ Mots déjà lus : cachés (`visibility: hidden`)
- ✅ Mot actuel : en cours de disparition
- ✅ Mots futurs : visibles
- ✅ Callback `onNext` appelé après chaque mot

**Implémentation** :

- `TextAnimation.jsx` (logique)
- `Word.jsx` (animation individuelle)
- `flash.css` (keyframes)

#### 3.4.2 Barre de Progression

**Description** : Indicateur visuel de l'avancement.

**Critères d'acceptation** :

- ✅ Hauteur 8px, fond gris
- ✅ Progression bleue (`bg-blue-600`)
- ✅ Calcul : `(currentWordIndex + 1) / wordsCount * 100`
- ✅ Transition CSS fluide (300ms)
- ✅ ARIA : `role="progressbar"` avec valuenow/min/max

**Implémentation** : `TextAnimation.jsx`

#### 3.4.3 Contrôles de Lecture

**Description** : Boutons Pause/Reprendre/Relire/Retour.

**Critères d'acceptation** :

- ✅ **Pause/Reprendre** : Toggle isPaused (⏸️ / ▶️)
- ✅ **Relire** : Reset currentWordIndex + restart (🔄)
- ✅ **Retour** : Retour étape 2 (← Changer vitesse)
    - Affiché uniquement si `!speedConfig.locked`
    - Masqué si vitesse imposée

**États** :

- `isPaused` : true/false
- `hasStartedReading` : true/false
- `currentWordIndex` : 0 → wordsCount-1

**Implémentation** :

- Contrôles : `LectureFlash/index.jsx`
- Animation : `TextAnimation.jsx` (respecte isPaused)

### 3.5 Système d'Aide (REQ-FUNC-005)

**Priorité** : Moyenne

#### 3.5.1 FirstTimeMessage

**Description** : Onboarding léger première visite.

**Critères d'acceptation** :

- ✅ Détection via localStorage (`lecture-flash-first-visit`)
- ✅ Bannière dégradé bleu non-modale
- ✅ 3 étapes simplifiées (texte, vitesse, lecture)
- ✅ Bouton fermeture définitive
- ✅ Animation fadeIn (150ms)
- ✅ Ne se réaffiche JAMAIS après fermeture

**Implémentation** : `FirstTimeMessage.jsx`

#### 3.5.2 Tooltips Contextuels

**Description** : Guidage juste-à-temps au survol.

**Critères d'acceptation** :

- ✅ React Portal (échappe overflow:hidden)
- ✅ Position dynamique (top, bottom, left, right)
- ✅ Délai apparition : 200ms
- ✅ z-index : 9999
- ✅ Support : hover, focus, touch
- ✅ Animation fadeIn
- ✅ Recalcul position au scroll/resize

**Usages** :

- Onglets (Saisir, Fichier, CodiMD)
- Vitesses (30-110 MLM)
- Bouton aide (?)

**Implémentation** : `Tooltip.jsx`

#### 3.5.3 HelpModal

**Description** : Guide complet accessible via bouton `?`.

**Critères d'acceptation** :

- ✅ Bouton `?` en haut à droite (visible toujours)
- ✅ Modale plein écran (max-width: 768px)
- ✅ Contenu scrollable
- ✅ 3 étapes détaillées avec exemples
- ✅ Tableau vitesses MLM + correspondances Eduscol
- ✅ Attribution @petitejulie89
- ✅ Fermeture : Escape, clic overlay, bouton ×, bouton "J'ai compris"
- ✅ ARIA : `role="dialog"`, focus trap, scroll lock body
- ✅ Accessibilité WCAG 2.1 AA

**Implémentation** : `HelpModal.jsx`

---

## 4. Exigences Non-Fonctionnelles

### 4.1 Performance (REQ-PERF-001)

**Critères mesurables** :

| Métrique               | Objectif | Mesure actuelle |
| ---------------------- | -------- | --------------- |
| Build time             | < 10s    | ~5s ✅          |
| HMR                    | < 500ms  | ~200ms ✅       |
| Bundle CSS             | < 50 KB  | ~30 KB ✅       |
| First Contentful Paint | < 1.5s   | ~0.8s ✅        |
| Time to Interactive    | < 3s     | ~1.2s ✅        |
| Lighthouse Score       | > 90/100 | ~95/100 ✅      |
| Animation Flash        | 60 FPS   | 60 FPS ✅       |

### 4.2 Accessibilité (REQ-ACCESS-001)

**Niveau** : WCAG 2.1 AA

**Critères obligatoires** :

- ✅ Navigation clavier complète (Tab, Escape, Enter)
- ✅ Focus visible (outline bleu)
- ✅ ARIA labels sur tous les éléments interactifs
- ✅ Contraste > 4.5:1 (texte normal)
- ✅ Contraste > 3:1 (texte large)
- ✅ Lecteur d'écran compatible (annonces appropriées)
- ✅ Responsive 320px → 2560px

**Test avec** :

- NVDA (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

### 4.3 Compatibilité (REQ-COMPAT-001)

**Navigateurs supportés** :

| Navigateur | Version minimale |
| ---------- | ---------------- |
| Chrome     | 90+              |
| Firefox    | 88+              |
| Safari     | 14+              |
| Edge       | 90+              |

**Appareils** :

- Desktop : 1024px+ (optimal)
- Tablette : 768px-1023px
- Mobile : 320px-767px
- TBI/TNI : 1920px+ (projection)

### 4.4 Maintenabilité (REQ-MAINT-001)

**Standards de code** :

```javascript
/**
 * JSDoc complète en français sur toutes les fonctions
 * @param {string} text - Description du paramètre
 * @returns {number} Description du retour
 */
function maFonction(text) {
    // Commentaires pour logique complexe
    return result;
}
```

**PropTypes obligatoires** :

```javascript
MonComposant.propTypes = {
    text: PropTypes.string.isRequired,
    onTextChange: PropTypes.func.isRequired,
    speedWpm: PropTypes.number,
};
```

**Règles** :

- ✅ Composants < 300 lignes (principe responsabilité unique)
- ✅ Pas de code dupliqué
- ✅ Noms de variables explicites en français
- ✅ Pas de console.log en production
- ✅ Hooks dans l'ordre (useState, useEffect, useRef)

---

## 5. Architecture Technique

### 5.1 Stack Technologique

**Frontend** :

- React 18.2.0 (hooks natifs uniquement)
- Tailwind CSS 3.4.17 (mode JIT)
- PropTypes 15.8.1 (validation)

**Build** :

- Vite 6.0.7 (bundler)
- PostCSS 8.4.49 + Autoprefixer 10.4.20
- vite-plugin-svgr 4.3.0 (SVG → React components)

**Package Manager** : pnpm

**Dépendances totales** : 9 packages (vs 24 avant migration)

### 5.2 Structure des Fichiers

```
lecture-flash/
├── index.html                       # Point d'entrée HTML
├── package.json                     # Dépendances (9 packages)
├── vite.config.js                   # Config Vite
├── tailwind.config.js               # Config Tailwind (JIT)
├── postcss.config.js                # PostCSS + Autoprefixer
│
└── src/
    ├── index.jsx                    # Point d'entrée React
    │
    ├── config/                      # ✨ Configuration centralisée
    │   ├── constants.js             # Modes, vitesses, helpers
    │   └── initialState.js          # État initial
    │
    ├── hooks/                       # Hooks personnalisés
    │   └── useMarkdownFromUrl.js   # Chargement CodiMD
    │
    ├── components/
    │   ├── App.jsx                  # Composant racine
    │   ├── Tooltip.jsx              # Tooltip avec React Portal
    │   ├── HelpModal.jsx            # Guide complet
    │   ├── FirstTimeMessage.jsx    # Message première visite
    │   │
    │   ├── Navbar/                  # Barre navigation
    │   │   ├── index.jsx
    │   │   ├── Contact.jsx
    │   │   └── Paypal.jsx
    │   │
    │   └── LectureFlash/            # Composant principal
    │       ├── index.jsx            # Workflow 3 étapes
    │       ├── StepIndicator.jsx   # [●○○] Progression
    │       ├── StepContainer.jsx   # Wrapper étapes
    │       ├── ShareConfiguration.jsx  # Config partage (legacy)
    │       │
    │       ├── TextInput/           # Gestion texte
    │       │   └── TextInputManager.jsx  # 3 onglets
    │       │
    │       └── Flash/               # Lecture animée
    │           ├── TextAnimation.jsx    # Orchestrateur
    │           ├── SpeedSelector.jsx    # Sélection vitesse
    │           └── Word.jsx             # Animation mot
    │
    └── styles/
        ├── index.css                # Tailwind + fadeIn
        └── flash.css                # Animation masquage
```

### 5.3 Configuration Vite

```javascript
// vite.config.js
export default defineConfig({
    plugins: [react(), svgr()],
    server: { port: 9000, open: true, host: true },
    build: {
        outDir: "build",
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: { "react-vendor": ["react", "react-dom"] },
            },
        },
    },
    resolve: {
        alias: {
            "@": "/src",
            "@components": "/src/components",
            "@hooks": "/src/hooks",
            "@config": "/src/config", // ✨ v3.8.0
        },
    },
});
```

### 5.4 Configuration Tailwind

```javascript
// tailwind.config.js
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    /* Palette bleue 50-900 */
                },
            },
        },
    },
    plugins: [],
};
```

### 5.5 Flux de Données

```
User Input (Étape 1: Texte)
    ↓
TextInputManager → setAppState({ text })
    ↓
User Input (Étape 2: Vitesse)
    ↓
SpeedSelector → setAppState({ speedWpm })
    ↓
User Action (Étape 3: Lancer)
    ↓
TextAnimation (props: text, speedWpm, isPaused)
    ↓
Word (props: word, speed, onNext)
    ↓
Animation CSS (@keyframes masquer)
```

---

## 6. Contraintes

### 6.1 Contraintes Techniques

- ❌ **Pas de TypeScript** : JavaScript pur uniquement
- ❌ **Pas de state management externe** : Redux, Zustand, etc.
- ❌ **Pas de CSS-in-JS** : Tailwind uniquement
- ❌ **Pas de librairies tierces** : Animation, carousel, etc.
- ✅ **React natif** : useState, useEffect, useReducer, useRef
- ✅ **PropTypes** : Validation obligatoire

### 6.2 Contraintes Pédagogiques

- ✅ **Conformité Eduscol** : Vitesses alignées sur repères officiels
- ✅ **Principe Tricot** : Charge cognitive minimale
- ✅ **Guidage progressif** : Pas de surcharge informationnelle
- ✅ **Différenciation** : 5 niveaux + personnalisation
- ✅ **Accessibilité** : WCAG 2.1 AA obligatoire

### 6.3 Contraintes Réglementaires

- ✅ **RGPD** : Pas de collecte de données personnelles
- ✅ **Cookies** : Uniquement localStorage (pas de tracking)
- ✅ **Éducation Nationale** : Compatible avec environnement scolaire
- ✅ **Hébergement France** : Pour version déployée

---

## 7. Tests

### 7.1 Tests Fonctionnels

**Checklist Étape 1 (Texte)** :

- [ ] Saisie manuelle fonctionne
- [ ] Compteur caractères + mots s'affiche
- [ ] Import .txt fonctionne
- [ ] Export .txt fonctionne
- [ ] Chargement CodiMD fonctionne
- [ ] Badge cloud s'affiche
- [ ] Badge disparaît si texte modifié
- [ ] Validation URL CodiMD
- [ ] Messages d'erreur appropriés

**Checklist Étape 2 (Vitesse)** :

- [ ] 5 vitesses affichées avec labels corrects
- [ ] Tooltips s'affichent au survol
- [ ] Bouton "Tester" lance prévisualisation 10s
- [ ] Bouton "Choisir" sélectionne la vitesse
- [ ] Badge "Sélectionnée" s'affiche
- [ ] Curseur personnalisé 20-200 MLM fonctionne
- [ ] Zone Eduscol calculée dynamiquement
- [ ] Partage affiché si sourceUrl présent

**Checklist Partage** :

- [ ] Bouton "🔗 Partager" visible dans header
- [ ] Modale s'ouvre au clic
- [ ] Radio buttons fonctionnels
- [ ] Génération lien avec bons paramètres
- [ ] Copie dans presse-papier fonctionne
- [ ] Message succès s'affiche (3s)
- [ ] Fermeture Escape fonctionne

**Checklist Étape 3 (Lecture)** :

- [ ] Animation mot-à-mot fonctionne
- [ ] Barre de progression s'incrémente
- [ ] Bouton Pause/Reprendre fonctionne
- [ ] Bouton Relire restart correctement
- [ ] Bouton Retour (si !locked) fonctionne
- [ ] Callback onComplete appelé à la fin
- [ ] Vitesse imposée : pas de bouton Retour

### 7.2 Tests d'Accessibilité

**Navigation clavier** :

- [ ] Tab parcourt tous les éléments
- [ ] Escape ferme les modales
- [ ] Enter active les boutons
- [ ] Focus visible (outline bleu)

**ARIA** :

- [ ] role="dialog" sur modales
- [ ] aria-labelledby présent
- [ ] aria-modal="true" présent
- [ ] role="progressbar" sur barre progression

**Lecteur d'écran** :

- [ ] Annonce étape active
- [ ] Annonce changements d'étape
- [ ] Messages succès annoncés (live region)

### 7.3 Tests de Performance

**Lighthouse** :

- [ ] Performance > 90
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90

**Animation** :

- [ ] 60 FPS constant
- [ ] Pas de saccades
- [ ] Responsive sur tous appareils

### 7.4 Tests de Compatibilité

**Navigateurs** :

- [ ] Chrome (Windows/macOS)
- [ ] Firefox (Windows/macOS)
- [ ] Safari (macOS/iOS)
- [ ] Edge (Windows)

**Appareils** :

- [ ] Desktop 1920x1080
- [ ] Tablette 768x1024
- [ ] Mobile 375x667
- [ ] TBI 1920x1080 (projection)

---

## 8. Références

### 8.1 Sources Pédagogiques Officielles

**Ministère de l'Éducation Nationale** :

- [L'apprentissage de la lecture à l'École](https://www.education.gouv.fr/l-apprentissage-de-la-lecture-l-ecole-1028)
- [Guides fondamentaux pour l'enseignement](https://eduscol.education.fr/3107/guides-fondamentaux-pour-l-enseignement)
- [Repères annuels de progression CP à 3e](https://eduscol.education.fr/137/reperes-annuels-de-progression-et-attendus-de-fin-d-annee-du-cp-la-3e)

**Inspiration pédagogique** :

- Meunier, J. (2017). [Fluence : le texte qui s'efface](http://www.ecoledejulie.fr/fluence-le-texte-qui-s-efface-a207401800). L'École de Julie.

### 8.2 Recherche en Psychologie Cognitive

**André Tricot** :

- Tricot, A. & Chesné, J.-F. (2020). _Numérique et apprentissages scolaires_. Cnesco.
- Amadieu, F. & Tricot, A. (2020). _Apprendre avec le numérique - Mythes et réalités_ (2e éd.). Paris : Retz.

**Autres références** :

- Goigoux, R. (2016). _Lire et écrire. Rapport de recherche_. IFÉ, Lyon.
- Dehaene, S. (2007). _Les Neurones de la lecture_. Paris : Odile Jacob.

### 8.3 Documentation Technique

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 9. Glossaire

**MLM** : Mots Lus par Minute - Unité de mesure de la vitesse de lecture

**Fluence** : Capacité à lire avec aisance, rapidement, correctement et avec une prosodie appropriée

**TBI/TNI** : Tableau Blanc/Numérique Interactif - Écran tactile pour projection

**CodiMD** : Service de rédaction collaborative Markdown (apps.education.fr)

**HMR** : Hot Module Replacement - Rechargement à chaud des modules sans perdre l'état

**JIT** : Just-In-Time - Compilation Tailwind à la demande (génère uniquement les classes utilisées)

**Portal** : Technique React pour rendre un composant hors de la hiérarchie DOM (évite overflow:hidden)

**Charge cognitive** : Quantité de ressources mentales mobilisées pour une tâche (Tricot)

**Automatisation** : Acquisition d'une procédure sans effort conscient (Dehaene)

**Eduscol** : Portail national des professionnels de l'éducation (eduscol.education.fr)

**WCAG** : Web Content Accessibility Guidelines - Standards d'accessibilité web

**RGPD** : Règlement Général sur la Protection des Données

---

## Changelog du Document

### v3.8.0 (13 février 2026)

- Ajout section Architecture (config/ centralisé)
- Mise à jour structure fichiers (TextInput/ au lieu de Input/)
- Ajout alias @config dans Vite
- Détails constants.js et helpers

### v3.7.0 (12 février 2026)

- Ajout isCodiMDTextUnmodified
- Correction invalidation lien CodiMD
- Ajout compteur mots

### v3.6.0 (11 février 2026)

- Workflow 3 étapes finalisé
- Gestion centralisée modales
- StepContainer avec renderActions

### v2.2.0 (10 février 2026)

- Système d'aide intégré (Tooltip, HelpModal, FirstTimeMessage)
- Conformité Tricot documentée

### v2.0.0 (8 février 2026)

- Migration Webpack → Vite
- Migration Bootstrap → Tailwind
- Architecture moderne

---

**Version du document** : 3.8.0  
**Date de dernière modification** : 13 février 2026  
**Statut** : ✅ Production  
**Auteur** : Frédéric MISERY - CPC Numérique
