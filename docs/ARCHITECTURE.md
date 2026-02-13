# 🏗️ Guide Architecture - Lecture Flash

Ce document détaille l'architecture de l'application et les bonnes pratiques pour les contributeurs.

**Version** : 3.9.0  
**Dernière mise à jour** : 13 février 2026

---

## Table des Matières

1. [Vision Architecture](#vision-architecture)
2. [Structure Actuelle](#structure-actuelle)
3. [Structure Cible (v4.0)](#structure-cible-v40)
4. [Conventions de Code](#conventions-de-code)
5. [Patterns Utilisés](#patterns-utilisés)
6. [Guide Contribution](#guide-contribution)

---

## Vision Architecture

### Principes Fondateurs

**1. Séparation des Responsabilités**

```

┌─────────────────────────────────────┐
│ Composants React │ ← Présentation uniquement
│ (affichage, événements utilisateur)│
└────────────┬────────────────────────┘
│
↓ appelle
┌─────────────────────────────────────┐
│ Services (logique métier) │ ← Fonctions pures
│ (calculs, transformations, etc.) │
└─────────────────────────────────────┘

```

**2. Modularité**

- 1 fichier = 1 responsabilité
- < 200 lignes par fichier
- Imports explicites (pas de barrel exports complexes)

**3. Testabilité**

- Services = fonctions pures (input → output)
- Composants = props bien définies (PropTypes)
- Hooks personnalisés = logique réutilisable isolée

---

## Structure Actuelle (v3.8.0 → v3.9.0)

### État de l'Art

```

src/
├── config/
│ ├── constants.js # Constantes globales (vitesses, modes)
│ └── initialState.js # État initial application
│
├── hooks/
│ └── useMarkdownFromUrl.js # Chargement CodiMD
│
├── components/
│ ├── LectureFlash/
│ │ ├── index.jsx # ⚠️ 300 lignes - À décomposer
│ │ ├── TextInput/
│ │ │ └── TextInputManager.jsx # ⚠️ 350 lignes - À décomposer
│ │ └── Flash/
│ │ ├── SpeedSelector.jsx # ⚠️ 400 lignes - À décomposer
│ │ ├── TextAnimation.jsx # ⚠️ 250 lignes - À décomposer
│ │ └── Word.jsx # ✅ 50 lignes - OK

```

### Dette Technique Identifiée

| Problème                       | Localisation                          | Solution v3.9.0                               |
| ------------------------------ | ------------------------------------- | --------------------------------------------- |
| Logique métier dans composants | `TextAnimation.jsx` (calculs vitesse) | Extraction → `services/speedCalculations.js`  |
| Code dupliqué                  | Comptage mots (×2 endroits)           | Mutualisation → `services/textProcessing.js`  |
| Validation dispersée           | `TextInputManager.jsx`                | Centralisation → `utils/validation.js`        |
| Composants volumineux          | `SpeedSelector.jsx` (400 lignes)      | Décomposition → `SpeedSelector/` (5 fichiers) |

---

## Structure Cible (v4.0)

### Vue d'Ensemble

```

src/
├── config/ # Configuration globale
├── services/ # 🆕 Logique métier pure
├── utils/ # 🆕 Utilitaires réutilisables
├── hooks/ # Hooks personnalisés
├── context/ # 🆕 Context API (si nécessaire)
└── components/
├── common/ # 🆕 Composants génériques
└── LectureFlash/ # Composants métier décomposés

```

### Détail par Dossier

#### `services/` - Logique Métier

**Objectif** : Fonctions pures, testables unitairement, indépendantes de React.

**Fichiers** :

```javascript
// services/textProcessing.js
export function countWords(text) {
    /* ... */
}
export function purifyText(text) {
    /* ... */
}
export function parseTextWithLineBreaks(text) {
    /* ... */
}

// services/speedCalculations.js
export function calculateAnimationSpeed(wordCount, speedWpm, charCount) {
    /* ... */
}
export function getEduscolZone(speedWpm) {
    /* ... */
}
export function estimateReadingTime(wordCount, speedWpm) {
    /* ... */
}

// services/urlGeneration.js
export function generateShareUrl(sourceUrl, speedWpm, locked) {
    /* ... */
}
```

**Convention** :

- Exports nommés (pas de default)
- JSDoc complète (paramètres, retour, exemples)
- Tests Jest dans `__tests__/services/`

#### `utils/` - Utilitaires

**Objectif** : Fonctions helpers, formatage, validation.

**Fichiers** :

```javascript
// utils/validation.js
export function isValidCodiMDUrl(url) {
    /* ... */
}
export function validateTextFile(file) {
    /* ... */
}

// utils/formatters.js
export function formatDuration(seconds) {
    /* ... */
}
export function formatDate(timestamp) {
    /* ... */
}

// utils/classNames.js
export function cn(...classes) {
    /* ... */
} // Gestion classes conditionnelles
```

#### `hooks/` - Hooks Personnalisés

**Objectif** : Logique React réutilisable (state, effects, refs).

**Fichiers** :

```javascript
// hooks/useMarkdownFromUrl.js  (existant)
export default function useMarkdownFromUrl(url) { /* ... */ }

// hooks/useLocalStorage.js  (v3.9.0)
export default function useLocalStorage(key, initialValue) { /* ... */ }

// hooks/useFullscreen.js  (v3.9.0)
export default function useFullscreen() { /* ... */ }

// hooks/useTextAnimation.js  (v3.10.0)
export default function useTextAnimation(text, speedWpm, isPaused) { /* ... */ }
```

**Convention** :

- Export default (1 hook par fichier)
- Préfixe `use` obligatoire
- Retour destructurable : `const { state, actions } = useHook()`

#### `components/common/` - Composants Génériques

**Objectif** : Composants UI réutilisables, sans logique métier.

**Fichiers** (v4.0) :

```javascript
// common/Button.jsx
export default function Button({ variant, disabled, onClick, children }) { /* ... */ }

// common/Modal.jsx
export default function Modal({ isOpen, onClose, title, children }) { /* ... */ }

// common/Tabs.jsx
export default function Tabs({ tabs, activeTab, onTabChange }) { /* ... */ }

// common/Slider.jsx
export default function Slider({ min, max, value, onChange }) { /* ... */ }

// common/ProgressBar.jsx
export default function ProgressBar({ progress, label }) { /* ... */ }

// common/Toast.jsx
export default function Toast({ message, type, duration, onClose }) { /* ... */ }
```

**Convention** :

- Props variants/tailles standardisées (primary/secondary, sm/md/lg)
- Accessibilité WCAG 2.1 AA obligatoire
- PropTypes strictes
- Storybook recommandé (documentation interactive)

#### `components/LectureFlash/` - Composants Métier

**Décomposition TextInputManager (v3.9.0)** :

```
TextInput/
├── TextInputManager.jsx       # Orchestrateur onglets
├── ManualInputTab.jsx         # Onglet "Saisir"
├── FileUploadTab.jsx          # Onglet "Fichier"
└── CodiMDTab.jsx              # Onglet "CodiMD"
```

**Décomposition SpeedSelector (v3.10.0)** :

```
Flash/SpeedSelector/
├── index.jsx                  # Orchestrateur
├── SpeedCard.jsx              # Carte vitesse individuelle
├── CustomSpeedModal.jsx       # Modale vitesse personnalisée
├── ShareModal.jsx             # Modale partage
└── DisplayOptions.jsx         # Options police/taille (v3.9.0)
```

**Décomposition TextAnimation (v3.10.0)** :

```
Flash/TextAnimation/
├── index.jsx                  # Orchestrateur
├── AnimatedText.jsx           # Affichage texte animé
├── Word.jsx                   # Animation mot individuel (existant)
├── ReadingControls.jsx        # Boutons pause/relire/retour
└── FullscreenButton.jsx       # Bouton plein écran (v3.9.0)
```

---

## Conventions de Code

### 1. Nommage

**Fichiers** :

- Composants : `PascalCase.jsx` (ex: `SpeedCard.jsx`)
- Services : `camelCase.js` (ex: `textProcessing.js`)
- Hooks : `useCamelCase.js` (ex: `useLocalStorage.js`)

**Variables/Fonctions** :

```javascript
// ✅ Bon (français, explicite)
const vitesseLecture = 70;
function calculerTempsLecture(nombreMots, vitesseMLM) {
    /* ... */
}

// ❌ Mauvais (anglais, abrégé)
const speed = 70;
function calcTime(nb, spd) {
    /* ... */
}
```

**Constantes** :

```javascript
// ✅ Bon (UPPER_SNAKE_CASE)
const MAX_SPEED_MLM = 200;
const DEFAULT_FONT_SIZE = 100;

// ❌ Mauvais
const maxSpeed = 200;
```

### 2. PropTypes

**Obligatoire** sur tous les composants :

```javascript
import PropTypes from "prop-types";

function SpeedCard({ speed, isSelected, onSelect }) {
    // ...
}

SpeedCard.propTypes = {
    speed: PropTypes.shape({
        value: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
        level: PropTypes.string.isRequired,
    }).isRequired,
    isSelected: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
};

SpeedCard.defaultProps = {
    isSelected: false,
};

export default SpeedCard;
```

### 3. JSDoc

**Obligatoire** sur toutes les fonctions (services, utils, helpers) :

```javascript
/**
 * Calcule la vitesse d'animation en millisecondes par caractère
 *
 * @param {number} nombreMots - Nombre total de mots dans le texte
 * @param {number} vitesseMLM - Vitesse de lecture en Mots Lus par Minute
 * @param {number} nombreCaracteres - Nombre total de caractères
 * @returns {number} Durée en millisecondes pour afficher un caractère
 *
 * @example
 * // Texte de 100 mots, vitesse 50 MLM, 500 caractères
 * const vitesse = calculateAnimationSpeed(100, 50, 500);
 * // Retourne : 240 (ms/caractère)
 */
export function calculateAnimationSpeed(
    nombreMots,
    vitesseMLM,
    nombreCaracteres
) {
    return ((nombreMots / vitesseMLM) * 60000) / nombreCaracteres;
}
```

### 4. Gestion Erreurs

**Services** :

```javascript
/**
 * Valide un fichier texte
 * @param {File} file - Fichier à valider
 * @returns {{valid: boolean, error?: string}} Résultat validation
 */
export function validateTextFile(file) {
    if (!file) {
        return { valid: false, error: "Aucun fichier fourni" };
    }

    if (!file.name.endsWith(".txt")) {
        return {
            valid: false,
            error: "Format invalide. Utilisez un fichier .txt",
        };
    }

    if (file.size > 1024 * 1024) {
        return { valid: false, error: "Fichier trop volumineux (max 1 MB)" };
    }

    return { valid: true };
}
```

**Composants** :

```javascript
function FileUploadTab({ onFileLoad }) {
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files;
        const validation = validateTextFile(file);

        if (!validation.valid) {
            // Afficher erreur utilisateur (Toast ou message inline)
            setError(validation.error);
            return;
        }

        // Traiter fichier valide
        setError(null);
        onFileLoad(file);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept=".txt" />
            {error && <p className="text-red-600">{error}</p>}
        </div>
    );
}
```

---

## Patterns Utilisés

### 1. Container/Presenter Pattern

**Container** (logique) :

```javascript
// SpeedSelector/index.jsx
function SpeedSelectorContainer({ onSpeedSelect }) {
    const [selectedSpeed, setSelectedSpeed] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleSelect = (speed) => {
        setSelectedSpeed(speed);
        onSpeedSelect(speed);
    };

    return (
        <SpeedSelectorPresenter
            speeds={SPEEDS}
            selectedSpeed={selectedSpeed}
            onSelect={handleSelect}
            onOpenModal={() => setShowModal(true)}
        />
    );
}
```

**Presenter** (affichage) :

```javascript
// SpeedSelector/SpeedSelectorPresenter.jsx
function SpeedSelectorPresenter({
    speeds,
    selectedSpeed,
    onSelect,
    onOpenModal,
}) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {speeds.map((speed) => (
                <SpeedCard
                    key={speed.value}
                    speed={speed}
                    isSelected={selectedSpeed?.value === speed.value}
                    onSelect={() => onSelect(speed)}
                />
            ))}
            <button onClick={onOpenModal}>Personnaliser</button>
        </div>
    );
}
```

### 2. Custom Hooks Pattern

**Extraction logique réutilisable** :

```javascript
// hooks/useTextAnimation.js
import { useState, useEffect, useRef } from "react";
import { purifyText, calculateAnimationSpeed } from "@/services/textProcessing";

export default function useTextAnimation(text, speedWpm, isPaused) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [words, setWords] = useState([]);
    const intervalRef = useRef(null);

    // Purification texte
    useEffect(() => {
        const purifiedWords = purifyText(text);
        setWords(purifiedWords);
        setCurrentWordIndex(0);
    }, [text]);

    // Animation
    useEffect(() => {
        if (isPaused || words.length === 0) return;

        const speed = calculateAnimationSpeed(
            words.length,
            speedWpm,
            text.length
        );

        intervalRef.current = setInterval(() => {
            setCurrentWordIndex((prev) => {
                if (prev >= words.length - 1) {
                    clearInterval(intervalRef.current);
                    return prev;
                }
                return prev + 1;
            });
        }, speed);

        return () => clearInterval(intervalRef.current);
    }, [words, speedWpm, isPaused, text.length]);

    const progress =
        words.length > 0 ? ((currentWordIndex + 1) / words.length) * 100 : 0;

    return {
        currentWordIndex,
        words,
        progress,
        restart: () => setCurrentWordIndex(0),
    };
}
```

**Utilisation dans composant** :

```javascript
// TextAnimation/index.jsx
import useTextAnimation from "@/hooks/useTextAnimation";

function TextAnimation({ text, speedWpm, isPaused }) {
    const { currentWordIndex, words, progress, restart } = useTextAnimation(
        text,
        speedWpm,
        isPaused
    );

    return (
        <>
            <ProgressBar progress={progress} />
            <AnimatedText words={words} currentIndex={currentWordIndex} />
            <button onClick={restart}>Relire</button>
        </>
    );
}
```

### 3. Composition Pattern

**Composants composables** :

```javascript
// Composant générique Modal
function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header>
                    <h2>{title}</h2>
                    <button onClick={onClose}>×</button>
                </header>
                <main>{children}</main>
            </div>
        </div>
    );
}

// Utilisation spécialisée
function ShareModal({ isOpen, onClose, shareUrl }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Partager">
            <div>
                <p>Lien de partage :</p>
                <input type="text" value={shareUrl} readOnly />
                <button onClick={() => navigator.clipboard.writeText(shareUrl)}>
                    Copier
                </button>
            </div>
        </Modal>
    );
}
```

---

## Guide Contribution

### 1. Avant de Coder

**Vérifier** :

- [ ] Issue GitHub existe (fonctionnalité/bug)
- [ ] Architecture cible respectée (services, utils, components)
- [ ] Aucun code dupliqué (rechercher fonction similaire)
- [ ] Composant < 200 lignes (sinon décomposer)

### 2. Pendant le Développement

**Checklist** :

- [ ] Noms français explicites (variables, fonctions)
- [ ] PropTypes sur composants React
- [ ] JSDoc sur fonctions services/utils
- [ ] Gestion erreurs (validation, try/catch si async)
- [ ] Accessibilité (ARIA labels, navigation clavier)

### 3. Avant de Commit

**Tests** :

- [ ] Fonction testée manuellement
- [ ] Tests automatisés (Jest pour services)
- [ ] Tests accessibilité (Tab, Escape, lecteur écran)
- [ ] Tests performance (Lighthouse > 90)

**Code Review** :

- [ ] Pas de console.log
- [ ] Imports triés (React, libs, @/, relatifs)
- [ ] Tailwind classes cohérentes (ordre : layout, spacing, colors, typography)

### 4. Convention Commits

**Format** : `type(scope): description`

**Types** :

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction bug
- `refactor`: Refactorisation (pas de changement fonctionnel)
- `docs`: Documentation
- `test`: Ajout/modification tests
- `chore`: Maintenance (dépendances, config)

**Exemples** :

```bash
git commit -m "feat(speed-selector): ajout options police et taille"
git commit -m "fix(text-input): correction comptage mots avec lignes vides"
git commit -m "refactor(services): extraction calculs vitesse dans speedCalculations.js"
git commit -m "docs(architecture): mise à jour guide contribution"
```

### 5. Pull Request

**Template** :

```markdown
## Description

[Description changements]

## Type de changement

- [ ] 🆕 Nouvelle fonctionnalité
- [ ] 🐛 Correction bug
- [ ] 🔧 Refactorisation
- [ ] 📚 Documentation

## Checklist

- [ ] PropTypes ajoutées/mises à jour
- [ ] JSDoc complète (si services/utils)
- [ ] Tests manuels effectués
- [ ] Tests automatisés ajoutés (si applicable)
- [ ] Accessibilité vérifiée (clavier, lecteur écran)
- [ ] Lighthouse > 90 (performance, accessibilité)

## Captures d'écran

[Si changements UI]
```

---

## Ressources

### Documentation Externe

- [React Documentation](https://react.dev/) (hooks, patterns)
- [Vite Documentation](https://vitejs.dev/) (build, config)
- [Tailwind CSS](https://tailwindcss.com/) (classes utilitaires)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) (accessibilité)

### Documentation Interne

- `SRS.md` : Spécifications fonctionnelles complètes
- `DECISIONS.md` : Historique décisions architecturales (ADR)
- `README.md` : Vue d'ensemble projet
- `CHANGELOG.md` : Historique versions

### Contact

**Questions architecture** : Ouvrir une discussion GitHub  
**Bugs/Propositions** : [GitHub Issues](https://github.com/micetf/lecture-flash/issues)  
**Email** : webmaster@micetf.fr

---

**Dernière mise à jour** : 13 février 2026  
**Version document** : 1.0  
**Contributeurs** : Frédéric MISERY

```

```
