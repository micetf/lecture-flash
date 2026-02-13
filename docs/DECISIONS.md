# 📋 Registre des Décisions de Conception

Ce document trace les décisions importantes concernant l'architecture, les fonctionnalités et l'UX de Lecture Flash.

**Format** : Architecture Decision Record (ADR) simplifié

---

## ADR-001 : Suppression du Mode Test Vitesse

**Date** : 13 février 2026  
**Statut** : ✅ Validé  
**Version** : 3.9.0

### Contexte

Le mode test actuel permet de prévisualiser une vitesse pendant 10 secondes sur les 5 premiers mots du texte via boutons "🧪 Tester".

### Décision

**Supprimer** la fonctionnalité de test de vitesse.

### Justification

1. **Public cible = enseignants experts** : Disposent des repères Eduscol (30-110 MLM selon niveaux)
2. **Workflow plus efficace** : Navigation Étape 2 → 3 → Retour est plus rapide et basée sur texte complet (vs 5 mots)
3. **Cohérence Tricot** : Suppression = 5 boutons éliminés = charge cognitive réduite
4. **Prévisualisation non représentative** : 5 mots insuffisants pour juger vitesse adaptée

### Remplacement

Bouton "← Changer vitesse" existant à l'étape 3 (déjà implémenté).

### Conséquences

✅ Interface simplifiée (5×2 boutons → 5×1)  
✅ Code allégé (suppression state `isTestActive`, timer, logique test)  
✅ Parcours accéléré pour enseignants  
⚠️ Tooltips renforcés pour compenser : "Recommandé pour CE1 - Vous pourrez ajuster après le lancement"

### Implémentation

- Modifier : `SpeedSelector.jsx`
- Mise à jour SRS : Section 3.2.3 → marquée "DÉPRÉCIÉ"
- Tests : Checklist section 7.1

---

## ADR-002 : Personnalisation Affichage (Police et Taille) vs Coloration Syllabes

**Date** : 13 février 2026  
**Statut** : ✅ Police/taille validé | ❌ Coloration différée  
**Version** : 3.9.0 (police/taille) | 4.0 ou abandon (coloration)

### Contexte

Demande d'options typographiques style "Lire-Couleur" pour accessibilité élèves dys-.

### Décision

1. **Implémenter** : Sélection police + curseur taille (100-200%)
2. **Différer/Abandonner** : Coloration syllabes alternées

### Justification

#### Police et Taille (✅)

**Pour** :

- Accessibilité universelle (tous publics, pas seulement dys-)
- Faible complexité : CSS natif uniquement
- Conforme WCAG 2.1 AA critère 1.4.4
- Utile TBI/TNI (ajustement distance/éclairage)

**Contre** :

- Ajout options = légère complexification interface

**Atténuation** :

- Section optionnelle collapsed par défaut (préserve simplicité)
- Positionnement étape 2 (configuration groupée avant lecture)
- Tooltip : "Pour adapter au TBI ou élèves à besoins particuliers"

#### Coloration Syllabes (❌)

**Contre** :

1. **Complexité technique élevée** :

    - Syllabation française = règles complexes + exceptions
    - Pas de bibliothèque JS fiable (Hyphen.js = 200+ Ko)
    - Refonte architecture (mot → caractère)
    - Multiplication animations CSS (impact performance)

2. **Cohérence pédagogique douteuse** :

    - Coloration = renforcement décodage syllabique
    - Lecture Flash = automatisation/fluence (reconnaissance globale)
    - Julie Meunier : disparition mot-à-mot sans segmentation
    - Surcharge cognitive (couleur + vitesse + disparition)

3. **Alternative existante** :
    - Enseignants ont Lire-Couleur (LibreOffice/Word) pour préparation textes
    - Lecture Flash = entraînement vitesse, pas décodage

**Pour** :

- Aide décodage CP-CE1
- Outil reconnu RASED

### Conséquences

✅ **Police/taille** :

- Accessibilité renforcée sans complexité technique
- Maintenance faible (CSS natif)
- Persistance localStorage

❌ **Coloration syllabes** :

- Si demande terrain forte : créer mode distinct "Décodage" vs "Fluence"
- Envisager v4.0 après validation pédagogique
- Alternative : partenariat extension Lire-Couleur (API/export)

### Implémentation

**Police/taille** :

- Composant : `SpeedSelector.jsx` (section collapsed) ou `DisplayOptions.jsx`
- Props : `TextAnimation.jsx` (application style)
- Persistance : localStorage (`lecture-flash-font-settings`)

**Coloration** :

- Non implémenté (REQ-NON-IMPL-001 dans SRS)

---

## ADR-003 : Gestion Titres Markdown et Retours Ligne

**Date** : 13 février 2026  
**Statut** : ✅ Validé  
**Version** : 3.9.0

### Contexte

Deux problèmes identifiés :

1. Titres `#` des documents CodiMD perturbent affichage Lecture Flash
2. Retours ligne (`\n`) non préservés, cassent mise en page pédagogique (strophes, paragraphes)

### Décision

1. **Titres** : Filtrage automatique lignes commençant par `#` (titre H1 uniquement)
2. **Retours ligne** : Conservation `\n` comme séparateurs sémantiques + affichage visuel

### Justification

**Titres** :

- Documents CodiMD incluent titre principal inutile en Lecture Flash
- Filtrage H1 uniquement (conserver `##` si pertinence)
- Transparent utilisateur (pas d'option supplémentaire)

**Retours ligne** :

- Respect mise en page pédagogique (poésie, dialogue, listes)
- Compatible import .txt et CodiMD
- Animation respecte sauts paragraphe

### Conséquences

✅ Affichage fidèle à saisie/import  
✅ Amélioration UX documents CodiMD  
⚠️ Modification algorithme comptage mots (ignorer lignes vides)

### Implémentation

**Titres** :

- Hook : `hooks/useMarkdownFromUrl.js`
- Regex : `.filter(line => !line.trim().startsWith('# '))`

**Retours ligne** :

- Purification : `TextAnimation.jsx` (préserver `\n`)
- Affichage : `Word.jsx` (détection fin ligne + `<br>` ou margin)
- Comptage : Exclure lignes vides

---

## ADR-004 : Mode Plein Écran

**Date** : 13 février 2026  
**Statut** : ✅ Validé  
**Version** : 3.9.0

### Contexte

Demande mode immersif pour étape lecture (éliminer distractions).

### Décision

Implémenter bouton "⛶ Plein écran" dans contrôles étape 3.

### Justification

**Pour** :

- Aligne principe charge cognitive minimale (Tricot)
- Immersion renforcée pendant exercice
- Particulièrement utile TBI/TNI (projection)
- API Fullscreen native (pas de dépendance)

**Contre** :

- Compatibilité Safari iOS limitée (API non supportée)

**Atténuation** :

- Fallback gracieux si API indisponible
- Message discret "Plein écran non disponible sur cet appareil"

### Conséquences

✅ Concentration renforcée  
✅ Expérience utilisateur optimisée TBI  
⚠️ Tests Safari iOS nécessaires  
⚠️ Gestion responsive (état fullscreen + portrait/paysage)

### Implémentation

- Composant : `TextAnimation.jsx` ou `LectureFlash/index.jsx` ou `FullscreenButton.jsx` (v3.10.0)
- API : `document.documentElement.requestFullscreen()` / `document.exitFullscreen()`
- Détection : `document.fullscreenEnabled`
- Sortie : Touche Escape (natif navigateur) + bouton manuel
- UI : Toast discret activation/désactivation
- Hook : `useFullscreen.js` (extraction logique)

---

## ADR-005 : Refactorisation Architecture (Modularité et Séparation Responsabilités)

**Date** : 13 février 2026  
**Statut** : ✅ Validé (migration progressive)  
**Version** : 3.9.0 (Phase 1-2), 3.10.0 (Phase 3-4), 4.0 (Phase 5-6)

### Contexte

L'application a évolué organiquement depuis v1.0. L'ajout progressif de fonctionnalités a conduit à :

- Composants volumineux (300-400 lignes) avec responsabilités multiples
- Logique métier mélangée à la présentation
- Code dupliqué (comptage mots, validation URLs)
- Testabilité limitée (fonctions couplées aux composants)
- Dette technique croissante

### Décision

**Refactorisation progressive** sur 3 versions selon architecture cible :

**Structure proposée** :

```

src/
├── services/ # 🆕 Logique métier pure (fonctions)
├── utils/ # 🆕 Utilitaires réutilisables
├── hooks/ # Hooks personnalisés (enrichi)
├── context/ # 🆕 Context API (si nécessaire)
├── components/
│ ├── common/ # 🆕 Composants génériques
│ └── LectureFlash/ # Décomposition existants

```

**Phasage** :

- v3.9.0 : Services + TextInputManager décomposé
- v3.10.0 : SpeedSelector + TextAnimation décomposés
- v4.0 : Composants communs + Context API

### Justification

**Pour** :

1. **Maintenabilité** : Composants < 200 lignes, SRP respecté
2. **Testabilité** : Services purs testables unitairement
3. **Réutilisabilité** : Composants communs utilisables dans futurs projets
4. **Évolutivité** : Ajout fonctionnalités facilité, migration TS possible
5. **Performance** : Re-renders optimisés, code splitting envisageable

**Contre** :

1. **Temps développement** : ~48h total (étalées sur 3 versions)
2. **Complexité initiale** : Plus de fichiers, courbe apprentissage contributeurs
3. **Risque régression** : Tests exhaustifs nécessaires

**Atténuation risques** :

- Migration progressive (limiter impact)
- Tests manuels après chaque phase
- Documentation JSDoc renforcée
- Validation manuelle workflows critiques

### Principes Directeurs

**Respectés** :

- ✅ Single Responsibility Principle (SRP)
- ✅ Separation of Concerns (logique vs présentation)
- ✅ DRY (Don't Repeat Yourself)
- ✅ YAGNI (You Ain't Gonna Need It) - refacto si bénéfice clair uniquement

**Contraintes maintenues** :

- ❌ Pas de TypeScript (JavaScript pur)
- ❌ Pas de Redux/Zustand (Context React uniquement si > 3 niveaux props drilling)
- ✅ PropTypes obligatoires
- ✅ JSDoc français complète

### Conséquences

**Positives** :

- Composants lisibles (< 200 lignes)
- Tests unitaires possibles (services isolés)
- Onboarding contributeurs facilité (code clair)
- Évolution future simplifiée

**Négatives** :

- Structure plus profonde (navigation fichiers)
- Import paths plus longs (atténué par alias Vite)
- Formation nécessaire contributeurs (nouveaux patterns)

**Neutre** :

- Bundle size inchangé (même code, restructuré)
- Performance utilisateur identique (optimisations Phase 5 optionnelles)

### Implémentation

**Phase 1 (v3.9.0 - 8h)** :

- Créer `services/textProcessing.js`, `speedCalculations.js`, `urlGeneration.js`
- Créer `utils/validation.js`, `formatters.js`
- Remplacer appels dans composants
- Tests unitaires Jest (nouveaux fichiers)

**Phase 2 (v3.9.0 - 6h)** :

- Décomposer `TextInputManager` → 3 fichiers onglets (`ManualInputTab.jsx`, `FileUploadTab.jsx`, `CodiMDTab.jsx`)
- Props bien définies + PropTypes
- Tests fonctionnels onglets

**Phase 3 (v3.10.0 - 10h)** :

- Décomposer `SpeedSelector` → 5 sous-composants
- Extraction modales (`ShareModal.jsx`, `CustomSpeedModal.jsx`)
- Ajout `DisplayOptions.jsx`

**Phase 4 (v3.10.0 - 8h)** :

- Créer hook `useTextAnimation` (logique pure)
- Décomposer `TextAnimation` → 4 sous-composants (`AnimatedText.jsx`, `ReadingControls.jsx`, `FullscreenButton.jsx`)

**Phase 5 (v4.0 - 12h)** :

- Créer `common/` (Button, Modal, Tabs, Slider, ProgressBar, Toast)
- Refactoriser composants existants

**Phase 6 (v4.0 - 4h)** :

- Évaluer props drilling
- Créer AppContext si nécessaire

**Validation** :

- ✅ Tests manuels workflows (étapes 1-2-3)
- ✅ Tests accessibilité (clavier, lecteur écran)
- ✅ Tests performance (Lighthouse > 90)
- ✅ Tests compatibilité (Chrome, Firefox, Safari)

---

## Template pour Futures Décisions

```markdown
## ADR-XXX : Titre Décision

**Date** : JJ/MM/AAAA
**Statut** : 🔄 En discussion | ✅ Validé | ❌ Rejeté | ⏸️ Suspendu
**Version** : X.X.X

### Contexte

[Situation qui nécessite une décision]

### Décision

[Choix retenu]

### Justification

[Arguments pour/contre, analyse]

### Conséquences

[Impacts positifs, négatifs, risques]

### Implémentation

[Composants concernés, approche technique]
```

---

**Historique** :

- 13/02/2026 : ADR-001 à ADR-005 (roadmap v3.9.0, v3.10.0, v4.0)

---

**Dernière mise à jour** : 13 février 2026  
**Version document** : 1.0  
**Contributeurs** : Frédéric MISERY
