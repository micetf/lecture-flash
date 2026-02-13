# Spécification des Exigences Logicielles (SRS)

# Lecture Flash - Application Éducative de Fluence

**Version** : 3.9.0  
**Date** : 13 février 2026  
**Auteur** : Frédéric MISERY - Conseiller Pédagogique de Circonscription Numérique  
**Status** : 🚀 En développement actif

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
10. [Roadmap et Décisions en Attente](#10-roadmap-et-décisions-en-attente)

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
    - Options affichage (police, taille) - v3.9.0
    - Tooltips pédagogiques

3. **Partage** (Conditionnel si CodiMD)

    - Génération de liens avec paramètres
    - Mode suggéré (élève peut modifier)
    - Mode imposé (lecture automatique)

4. **Lecture animée** (Étape 3)

    - Disparition progressive mot-à-mot
    - Contrôles : Pause/Reprendre/Relire/Retour
    - Barre de progression visuelle
    - Mode plein écran - v3.9.0
    - Retour conditionnel (sauf si imposé)

5. **Système d'aide intégré**
    - FirstTimeMessage (onboarding)
    - Tooltips contextuels (React Portal)
    - HelpModal (guide complet)

### 2.3 Utilisateurs et Scénarios

#### Scénario 1 : Enseignant prépare un exercice TBI

1. Saisir un texte adapté au niveau
2. Choisir vitesse appropriée (30-110 MLM)
3. Ajuster options affichage si nécessaire (TBI)
4. Projeter sur TBI
5. Lancer la lecture collective en plein écran

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

**Implémentation** : `TextInputManager.jsx` onglet "Saisir" ou `ManualInputTab.jsx` (v3.9.0)

#### 3.1.2 Import Fichier Local

**Description** : Import de fichiers .txt depuis ordinateur.

**Critères d'acceptation** :

- ✅ Filtre sur extension .txt uniquement
- ✅ Encodage UTF-8
- ✅ Bouton "Choisir un fichier" visible
- ✅ Chargement automatique dans onglet "Saisir"
- ✅ Message d'erreur si format invalide

**Implémentation** : `TextInputManager.jsx` onglet "Fichier" ou `FileUploadTab.jsx` (v3.9.0)

#### 3.1.3 Chargement CodiMD

**Description** : Chargement depuis URLs CodiMD (apps.education.fr).

**Critères d'acceptation** :

- ✅ Validation format URL (https://codimd.apps.education.fr/s/...)
- ✅ Conversion Markdown → texte brut
- ✅ Filtrage automatique titres `#` (v3.9.0)
- ✅ Hook personnalisé `useMarkdownFromUrl`
- ✅ Gestion états : loading, error, success
- ✅ Badge indicateur "☁️ Texte chargé depuis le cloud"
- ✅ Invalidation si texte modifié (isCodiMDTextUnmodified)
- ✅ Bouton aide avec exemples d'URLs

**Implémentation** :

- `TextInputManager.jsx` onglet "CodiMD" ou `CodiMDTab.jsx` (v3.9.0)
- `hooks/useMarkdownFromUrl.js`

#### 3.1.4 Export .txt

**Description** : Téléchargement du texte en fichier .txt.

**Critères d'acceptation** :

- ✅ Bouton "💾 Enregistrer (.txt)"
- ✅ Nom de fichier : `lecture-flash-{timestamp}.txt`
- ✅ Encodage UTF-8
- ✅ Bouton désactivé si texte vide

**Implémentation** : `TextInputManager.jsx` onglet "Saisir" ou `ManualInputTab.jsx` (v3.9.0)

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
- ✅ Boutons "✓ Choisir"
- ✅ Modale centrée (max-width: 384px)
- ✅ Message pédagogique (repères Eduscol)

**Implémentation** : `SpeedSelector.jsx` + modale custom ou `CustomSpeedModal.jsx` (v3.10.0)

#### 3.2.3 Mode Test

**⚠️ DÉPRÉCIÉ - Supprimé en v3.9.0**

**Justification suppression** : Le workflow de navigation Étape 2 → Étape 3 → Retour est plus efficace pour le public enseignant disposant des repères Eduscol. La prévisualisation 10 secondes sur 5 mots n'est pas représentative du texte complet.

**Remplacement fonctionnel** : Bouton "← Changer vitesse" à l'étape 3 (déjà implémenté).

~~Description : Prévisualisation vitesse pendant 10 secondes.~~

~~**Critères d'acceptation** :~~

- ~~✅ Affichage des 5 premiers mots du texte~~
- ~~✅ Animation pulse (simulate reading)~~
- ~~✅ Durée : 10 secondes~~
- ~~✅ Bouton "⏸ Arrêter le test" pour sortir avant~~
- ~~✅ Retour automatique à la sélection après 10s~~

~~**Implémentation** : `SpeedSelector.jsx` (state isTestActive)~~

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
- Modale : `SpeedSelector.jsx` (showShareModal) ou `ShareModal.jsx` (v3.10.0)
- Service : `services/urlGeneration.js` (v3.9.0)

### 3.4 Lecture Animée (REQ-FUNC-004)

**Priorité** : Critique

#### 3.4.1 Animation Mot-à-Mot

**Description** : Disparition progressive du texte pour forcer la lecture continue.

**Critères d'acceptation** :

- ✅ Purification du texte (espaces, caractères spéciaux)
- ✅ Conservation retours ligne `\n` (v3.9.0)
- ✅ Calcul vitesse : `((nbreMots / vitesse) * 60000) / nbreCaracteres`
- ✅ Animation CSS `@keyframes masquer` dans flash.css
- ✅ Espaces insécables avant/après ponctuation
- ✅ Mots déjà lus : cachés (`visibility: hidden`)
- ✅ Mot actuel : en cours de disparition
- ✅ Mots futurs : visibles
- ✅ Callback `onNext` appelé après chaque mot

**Implémentation** :

- `TextAnimation.jsx` (logique) ou `useTextAnimation.js` (v3.10.0)
- `Word.jsx` (animation individuelle)
- `flash.css` (keyframes)
- `services/textProcessing.js` (v3.9.0)

#### 3.4.2 Barre de Progression

**Description** : Indicateur visuel de l'avancement.

**Critères d'acceptation** :

- ✅ Hauteur 8px, fond gris
- ✅ Progression bleue (`bg-blue-600`)
- ✅ Calcul : `(currentWordIndex + 1) / wordsCount * 100`
- ✅ Transition CSS fluide (300ms)
- ✅ ARIA : `role="progressbar"` avec valuenow/min/max

**Implémentation** : `TextAnimation.jsx` ou composant `ProgressBar.jsx` dédié (v3.10.0)

#### 3.4.3 Contrôles de Lecture

**Description** : Boutons Pause/Reprendre/Relire/Retour/Plein écran.

**Critères d'acceptation** :

- ✅ **Pause/Reprendre** : Toggle isPaused (⏸️ / ▶️)
- ✅ **Relire** : Reset currentWordIndex + restart (🔄)
- ✅ **Retour** : Retour étape 2 (← Changer vitesse)
    - Affiché uniquement si `!speedConfig.locked`
    - Masqué si vitesse imposée
- ✅ **Plein écran** : Toggle fullscreen (⛶) - v3.9.0
    - API Fullscreen native
    - Fallback gracieux si non supporté
    - Sortie via Escape ou bouton manuel

**États** :

- `isPaused` : true/false
- `hasStartedReading` : true/false
- `currentWordIndex` : 0 → wordsCount-1

**Implémentation** :

- Contrôles : `LectureFlash/index.jsx` ou `ReadingControls.jsx` (v3.10.0)
- Animation : `TextAnimation.jsx` (respecte isPaused)
- Plein écran : `hooks/useFullscreen.js` (v3.9.0)

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

**Implémentation** : `FirstTimeMessage.jsx` + `hooks/useLocalStorage.js` (v3.9.0)

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
- Vitesses (30-110 MLM) avec mention "Vous pourrez ajuster après le lancement"
- Bouton aide (?)
- Options affichage (v3.9.0)

**Implémentation** : `Tooltip.jsx`

#### 3.5.3 HelpModal

**Description** : Guide complet accessible via bouton `?`.

**Critères d'acceptation** :

- ✅ Bouton `?` en haut à droite (visible toujours)
- ✅ Modale plein écran (max-width: 768px)
- ✅ Contenu scrollable
- ✅ 3 étapes détaillées avec exemples
- ✅ Tableau vitesses MLM + correspondances Eduscol
- ✅ Mention nouvelles fonctionnalités (plein écran, options affichage) - v3.9.0
- ✅ Attribution @petitejulie89
- ✅ Fermeture : Escape, clic overlay, bouton ×, bouton "J'ai compris"
- ✅ ARIA : `role="dialog"`, focus trap, scroll lock body
- ✅ Accessibilité WCAG 2.1 AA

**Implémentation** : `HelpModal.jsx`

### 3.6 Personnalisation Affichage (REQ-FUNC-006)

**Priorité** : Moyenne  
**Version** : 3.9.0

#### Description

Options typographiques pour améliorer accessibilité et adapter affichage (TBI/TNI, élèves à besoins particuliers).

#### Critères d'acceptation

**Section optionnelle** :

- ✅ Collapsed par défaut (préserve simplicité interface)
- ✅ Positionnée étape 2 (configuration avant lecture)
- ✅ Tooltip explicatif : "Pour adapter au TBI ou élèves à besoins particuliers"

**Sélection police** :

- ✅ Options : Défaut (sans serif), OpenDyslexic, Arial, Comic Sans MS
- ✅ Application immédiate étape 3
- ✅ Persistance localStorage

**Ajustement taille** :

- ✅ Curseur 100-200% (pas de 10%)
- ✅ Affichage valeur courante
- ✅ Application immédiate étape 3
- ✅ Persistance localStorage

**Implémentation** :

- Composant : `SpeedSelector.jsx` (section collapsed) ou `DisplayOptions.jsx` (v3.10.0)
- Props transmission : `TextAnimation.jsx`
- Persistance : `hooks/useLocalStorage.js`
- Key localStorage : `lecture-flash-font-settings`

### 3.7 Gestion Markdown CodiMD (REQ-FUNC-007)

**Priorité** : Haute (correction bug)  
**Version** : 3.9.0

#### Description

Filtrage automatique des titres Markdown lors chargement CodiMD.

#### Problème

Les documents CodiMD incluent des titres balisés `#` qui perturbent l'affichage dans Lecture Flash.

#### Critères d'acceptation

- ✅ Filtrage automatique lignes commençant par `# ` (H1 uniquement)
- ✅ Conservation sous-titres `##` si présents (optionnel)
- ✅ Transparent pour utilisateur (pas d'option)
- ✅ Compatible conversion Markdown → texte brut existante

**Implémentation** :

- Hook : `hooks/useMarkdownFromUrl.js`
- Filtre : `.filter(line => !line.trim().startsWith('# '))`

### 3.8 Conservation Retours Ligne (REQ-FUNC-008)

**Priorité** : Haute (correction bug)  
**Version** : 3.9.0

#### Description

Préservation des sauts de ligne pour respecter mise en page pédagogique (strophes, paragraphes, listes).

#### Critères d'acceptation

- ✅ Conservation `\n` comme séparateurs sémantiques
- ✅ Affichage visuel paragraphes (margin-bottom ou `<br>`)
- ✅ Algorithme comptage mots ignore lignes vides
- ✅ Compatibilité import .txt et CodiMD
- ✅ Animation mot-à-mot respecte sauts paragraphe

**Implémentation** :

- Purification : `TextAnimation.jsx` ou `services/textProcessing.js`
- Affichage : `Word.jsx` (détection fin ligne)
- Service : `services/textProcessing.parseTextWithLineBreaks()` (v3.9.0)

### 3.9 Mode Plein Écran (REQ-FUNC-009)

**Priorité** : Haute  
**Version** : 3.9.0

#### Description

Mode immersif pour étape lecture éliminant distractions visuelles.

#### Critères d'acceptation

**Bouton plein écran** :

- ✅ Icône "⛶" dans contrôles étape 3
- ✅ Toggle manuel (activation/désactivation)
- ✅ API Fullscreen native (`requestFullscreen`/`exitFullscreen`)
- ✅ Détection support API (`document.fullscreenEnabled`)

**Sortie plein écran** :

- ✅ Touche Escape (natif navigateur)
- ✅ Bouton manuel "⛿ Quitter plein écran"
- ✅ Détection changement état (`fullscreenchange` event)

**Fallback** :

- ✅ Message discret si API non supportée (Safari iOS)
- ✅ Bouton désactivé ou masqué si indisponible

**UI/UX** :

- ✅ Toast discret lors activation/désactivation
- ✅ Gestion responsive (portrait/paysage)
- ✅ Conservation état lecture (pause, progression)

**Implémentation** :

- Hook : `hooks/useFullscreen.js`
- Composant : `TextAnimation.jsx` ou `FullscreenButton.jsx` (v3.10.0)
- Events : `fullscreenchange`, `fullscreenerror`

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
- ✅ Redimensionnement texte jusqu'à 200% (v3.9.0)

**Test avec** :

- NVDA (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

### 4.3 Compatibilité (REQ-COMPAT-001)

**Navigateurs supportés** :

| Navigateur | Version minimale | Notes v3.9.0                  |
| ---------- | ---------------- | ----------------------------- |
| Chrome     | 90+              | ✅ Fullscreen API supportée   |
| Firefox    | 88+              | ✅ Fullscreen API supportée   |
| Safari     | 14+              | ⚠️ Fullscreen API limitée iOS |
| Edge       | 90+              | ✅ Fullscreen API supportée   |

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

- ✅ Composants < 200 lignes (principe responsabilité unique) - v3.9.0
- ✅ Pas de code dupliqué (services mutualisés) - v3.9.0
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
    ├── config/                      # Configuration centralisée
    │   ├── constants.js             # Modes, vitesses, helpers
    │   └── initialState.js          # État initial
    │
    ├── services/                    # 🆕 v3.9.0 - Logique métier pure
    │   ├── textProcessing.js       # Purification, comptage, parsing
    │   ├── speedCalculations.js    # Calculs MLM, temps lecture
    │   └── urlGeneration.js        # Génération liens partage
    │
    ├── utils/                       # 🆕 v3.9.0 - Utilitaires
    │   ├── validation.js           # Validation URL, fichiers
    │   └── formatters.js           # Formatage dates, durées
    │
    ├── hooks/                       # Hooks personnalisés
    │   ├── useMarkdownFromUrl.js  # Chargement CodiMD
    │   ├── useLocalStorage.js     # 🆕 v3.9.0 - Abstraction localStorage
    │   └── useFullscreen.js       # 🆕 v3.9.0 - Gestion fullscreen API
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
    │       │   ├── TextInputManager.jsx     # Orchestrateur onglets
    │       │   ├── ManualInputTab.jsx       # 🆕 v3.9.0 - Onglet "Saisir"
    │       │   ├── FileUploadTab.jsx        # 🆕 v3.9.0 - Onglet "Fichier"
    │       │   └── CodiMDTab.jsx            # 🆕 v3.9.0 - Onglet "CodiMD"
    │       │
    │       └── Flash/               # Lecture animée
    │           ├── TextAnimation.jsx    # Orchestrateur animation
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
            "@config": "/src/config",
            "@services": "/src/services", // 🆕 v3.9.0
            "@utils": "/src/utils", // 🆕 v3.9.0
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
services/textProcessing.js (comptage, validation)  // 🆕 v3.9.0
    ↓
User Input (Étape 2: Vitesse + Options affichage)
    ↓
SpeedSelector → setAppState({ speedWpm, font, fontSize })
    ↓
services/speedCalculations.js (calculs)  // 🆕 v3.9.0
    ↓
User Action (Étape 3: Lancer)
    ↓
TextAnimation (props: text, speedWpm, isPaused, font, fontSize)
    ↓
services/textProcessing.js (purification, parsing)  // 🆕 v3.9.0
    ↓
Word (props: word, speed, onNext)
    ↓
Animation CSS (@keyframes masquer)
```

---

## 6. Contraintes

### 6.1 Contraintes Techniques

- ❌ **Pas de TypeScript** : JavaScript pur uniquement
- ❌ **Pas de state management externe** : Redux, Zustand, etc. (Context React si nécessaire v4.0)
- ❌ **Pas de CSS-in-JS** : Tailwind uniquement
- ❌ **Pas de librairies tierces** : Animation, carousel, etc.
- ✅ **React natif** : useState, useEffect, useReducer, useRef
- ✅ **PropTypes** : Validation obligatoire
- ✅ **Services métier** : Séparation logique/présentation (v3.9.0)

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
- [ ] Retours ligne préservés (v3.9.0)
- [ ] Titres Markdown filtrés (v3.9.0)

**Checklist Étape 2 (Vitesse)** :

- [ ] 5 vitesses affichées avec labels corrects
- [ ] Tooltips s'affichent au survol
- [ ] Tooltips mentionnent possibilité ajustement (v3.9.0)
- [ ] Bouton "Choisir" sélectionne la vitesse
- [ ] Badge "Sélectionnée" s'affiche
- [ ] Curseur personnalisé 20-200 MLM fonctionne
- [ ] Zone Eduscol calculée dynamiquement
- [ ] Partage affiché si sourceUrl présent
- [ ] Options affichage (police/taille) fonctionnent (v3.9.0)
- [ ] Persistance localStorage options (v3.9.0)

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
- [ ] Paragraphes respectés (v3.9.0)
- [ ] Barre de progression s'incrémente
- [ ] Bouton Pause/Reprendre fonctionne
- [ ] Bouton Relire restart correctement
- [ ] Bouton Retour (si !locked) fonctionne
- [ ] Bouton Plein écran fonctionne (v3.9.0)
- [ ] Sortie plein écran via Escape (v3.9.0)
- [ ] Fallback plein écran si API non supportée (v3.9.0)
- [ ] Options affichage appliquées (police/taille) (v3.9.0)
- [ ] Callback onComplete appelé à la fin
- [ ] Vitesse imposée : pas de bouton Retour

**Checklist v3.9.0 (nouvelles fonctionnalités)** :

- [ ] Mode plein écran fonctionne (API Fullscreen)
- [ ] Sortie plein écran via Escape
- [ ] Sélecteur police applique changement
- [ ] Curseur taille 100-200% fonctionne
- [ ] Persistance localStorage police/taille
- [ ] Titres Markdown filtrés automatiquement (CodiMD)
- [ ] Retours ligne préservés (paragraphes visibles)
- [ ] Tooltips vitesses renforcés (mention ajustement possible)

### 7.2 Tests d'Accessibilité

**Navigation clavier** :

- [ ] Tab parcourt tous les éléments
- [ ] Escape ferme les modales
- [ ] Escape sort du plein écran (v3.9.0)
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
- [ ] Annonce entrée/sortie plein écran (v3.9.0)

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
- [ ] Performance maintenue en plein écran (v3.9.0)

### 7.4 Tests de Compatibilité

**Navigateurs** :

- [ ] Chrome (Windows/macOS) - Fullscreen API
- [ ] Firefox (Windows/macOS) - Fullscreen API
- [ ] Safari (macOS/iOS) - Fullscreen API limitée iOS
- [ ] Edge (Windows) - Fullscreen API

**Appareils** :

- [ ] Desktop 1920x1080
- [ ] Tablette 768x1024
- [ ] Mobile 375x667
- [ ] TBI 1920x1080 (projection)

### 7.5 Tests Unitaires (v3.9.0)

**Services** :

- [ ] `textProcessing.countWords()` - Comptage correct
- [ ] `textProcessing.purifyText()` - Purification espaces/caractères
- [ ] `textProcessing.parseTextWithLineBreaks()` - Conservation `\n`
- [ ] `speedCalculations.calculateAnimationSpeed()` - Calcul MLM
- [ ] `speedCalculations.getEduscolZone()` - Zones correctes
- [ ] `speedCalculations.estimateReadingTime()` - Temps estimé
- [ ] `urlGeneration.generateShareUrl()` - Format URL correct
- [ ] `validation.isValidCodiMDUrl()` - Validation URL
- [ ] `validation.validateTextFile()` - Validation fichier

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
- [MDN Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)

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

**SRP** : Single Responsibility Principle - 1 composant = 1 responsabilité (v3.9.0)

**ADR** : Architecture Decision Record - Documentation décisions architecturales (v3.9.0)

---

## 10. Roadmap et Décisions en Attente

### 10.1 Version 3.9.0 (En cours de spécification - Q1 2026)

#### Décisions Validées

**REQ-FUNC-006 : Mode Plein Écran (Étape 3)**

**Priorité** : Haute  
**Justification** : Renforce l'immersion et élimine les distractions visuelles, conforme au principe de charge cognitive minimale (Tricot).

**Critères d'acceptation** :

- Bouton "⛶ Plein écran" dans contrôles étape 3
- API Fullscreen native (requestFullscreen/exitFullscreen)
- Toggle manuel + détection automatique Escape
- Message toast discret lors activation/désactivation
- Fallback gracieux si API non supportée (Safari iOS)
- Responsive TBI/TNI/tablette

**Implémentation** : `TextAnimation.jsx` ou `FullscreenButton.jsx` (v3.10.0) + `hooks/useFullscreen.js`

---

**REQ-FUNC-007 : Personnalisation Affichage (Police et Taille)**

**Priorité** : Moyenne  
**Justification** : Accessibilité étendue pour élèves à besoins particuliers + adaptation TBI/TNI. Conforme WCAG 2.1 AA critère 1.4.4.

**Critères d'acceptation** :

- Section optionnelle collapsed dans SpeedSelector (étape 2)
- Sélecteur police : Défaut, OpenDyslexic, Arial, Comic Sans MS
- Curseur taille : 100-200% (pas de 10%)
- Tooltip : "Pour adapter au TBI ou élèves à besoins particuliers"
- Persistance localStorage (`lecture-flash-font-settings`)
- Application immédiate étape 3 via props

**Implémentation** : `SpeedSelector.jsx` ou `DisplayOptions.jsx` (v3.10.0) + props vers `TextAnimation.jsx` + `hooks/useLocalStorage.js`

---

**REQ-FUNC-008 : Gestion Titres Markdown CodiMD**

**Priorité** : Haute (correction bug)  
**Problème** : Les titres balisés `#` dans documents CodiMD perturbent affichage Lecture Flash.

**Critères d'acceptation** :

- Filtrage automatique lignes commençant par `# ` (titre H1 uniquement)
- Conservation sous-titres `##` si pertinence pédagogique (optionnel)
- Transparent pour utilisateur (pas d'option)
- Compatible avec conversion Markdown → texte brut existante

**Implémentation** : `hooks/useMarkdownFromUrl.js`

```javascript
// Dans la fonction de conversion Markdown
.filter(line => !line.trim().startsWith('# '))  // Supprimer titre H1 uniquement
```

---

**REQ-FUNC-009 : Conservation Retours Ligne**

**Priorité** : Haute (correction bug)  
**Problème** : Les sauts de ligne doivent être préservés pour respecter mise en page pédagogique (strophes, paragraphes).

**Critères d'acceptation** :

- Conserver `\n` comme séparateurs sémantiques
- Affichage visuel paragraphes (margin-bottom ou `<br>`)
- Algorithme comptage ignore lignes vides
- Compatibilité import .txt et CodiMD
- Animation mot-à-mot respecte sauts paragraphe

**Implémentation** :

- `services/textProcessing.js` (fonction purification + `parseTextWithLineBreaks()`)
- `Word.jsx` (détection fin de ligne)

---

**REQ-FUNC-010 : Suppression Mode Test Vitesse**

**Priorité** : Moyenne (simplification UX)  
**Justification** :

- Public cible = enseignants disposant des repères Eduscol
- Workflow Étape 2 → 3 → Retour plus efficace que test 10s
- Prévisualisation sur 5 mots non représentative du texte complet
- Suppression = 5 boutons "🧪 Tester" éliminés (charge cognitive réduite)

**Critères d'acceptation** :

- Retirer boutons "🧪 Tester" des 5 cartes vitesse
- Conserver uniquement boutons "Choisir"
- Supprimer state `isTestActive`, logique timer, fonction `handleTest()`
- Renforcer tooltips pour compenser : "Recommandé pour CE1 - Vous pourrez ajuster après le lancement"

**Implémentation** : `SpeedSelector.jsx`

**Note** : Le bouton "← Changer vitesse" existant (étape 3) remplace fonctionnellement le test.

---

**REQ-REFACTO-001 : Extraction Services et Utils (Phase 1)**

**Priorité** : Haute (dette technique)  
**Estimation** : 8h

**Objectifs** :

- Créer `services/textProcessing.js` (countWords, purifyText, parseTextWithLineBreaks)
- Créer `services/speedCalculations.js` (calculateAnimationSpeed, getEduscolZone, estimateReadingTime)
- Créer `services/urlGeneration.js` (generateShareUrl)
- Créer `utils/validation.js` (isValidCodiMDUrl, validateTextFile)
- Créer `utils/formatters.js` (formatDuration, formatDate)

**Bénéfices** :

- Logique métier testable unitairement (Jest)
- Code mutualisé (suppression duplication)
- Composants allégés (< 200 lignes)

**Implémentation** :

- Extraction fonctions pures depuis composants
- Remplacement appels dans composants existants
- Tests unitaires Jest
- Mise à jour imports (alias `@services`, `@utils`)

---

**REQ-REFACTO-002 : Décomposition TextInputManager (Phase 2)**

**Priorité** : Haute (dette technique)  
**Estimation** : 6h

**Objectifs** :

- Décomposer `TextInputManager.jsx` (350 lignes) → 4 fichiers
- Créer `ManualInputTab.jsx` (onglet "Saisir")
- Créer `FileUploadTab.jsx` (onglet "Fichier")
- Créer `CodiMDTab.jsx` (onglet "CodiMD")
- `TextInputManager.jsx` devient orchestrateur uniquement

**Bénéfices** :

- Composants < 100 lignes (lisibilité)
- Responsabilité claire par onglet
- Tests composants isolés

**Implémentation** :

- Extraction logique onglets
- Props bien définies + PropTypes
- Tests fonctionnels par onglet

---

#### Décisions Différées ou Abandonnées

**REQ-NON-IMPL-001 : Coloration Syllabes (Lire-Couleur)**

**Statut** : ❌ Non implémenté (différé v4.0 ou abandonné)

**Raisons** :

1. **Complexité technique élevée** :

    - Algorithme syllabation française complexe (exceptions nombreuses)
    - Pas de bibliothèque JavaScript fiable (Hyphen.js = 200+ Ko)
    - Refonte architecture animation (mot → caractère)
    - Impact performance (multiplication animations CSS)

2. **Cohérence pédagogique douteuse** :

    - Coloration renforce décodage syllabique
    - Lecture Flash vise automatisation/reconnaissance globale (fluence)
    - Référence Julie Meunier : disparition mot-à-mot sans segmentation
    - Risque surcharge cognitive (couleur + vitesse + disparition)

3. **Alternative existante** :
    - Enseignants disposent de Lire-Couleur (LibreOffice/Word) pour préparation
    - Lecture Flash = entraînement vitesse, pas outil de décodage

**Évolution possible** : Si implémentation future, créer mode distinct "Décodage syllabique" vs "Fluence" actuel, dans version majeure v4.0 après validation terrain.

---

### 10.2 Version 3.10.0 (Q2 2026)

**REQ-REFACTO-003 : Décomposition SpeedSelector (Phase 3)**

**Priorité** : Moyenne  
**Estimation** : 10h

**Objectifs** :

- Décomposer `SpeedSelector.jsx` (400 lignes) → 5 fichiers
- Créer `SpeedSelector/index.jsx` (orchestrateur)
- Créer `SpeedCard.jsx` (carte vitesse individuelle)
- Créer `CustomSpeedModal.jsx` (modale vitesse personnalisée)
- Créer `ShareModal.jsx` (modale partage)
- Créer `DisplayOptions.jsx` (options police/taille)

**Implémentation** : Dossier `Flash/SpeedSelector/`

---

**REQ-REFACTO-004 : Décomposition TextAnimation (Phase 4)**

**Priorité** : Moyenne  
**Estimation** : 8h

**Objectifs** :

- Créer hook `useTextAnimation.js` (logique animation pure)
- Décomposer `TextAnimation.jsx` → 4 fichiers
- Créer `AnimatedText.jsx` (affichage texte)
- Créer `ReadingControls.jsx` (boutons pause/relire/retour)
- Créer `FullscreenButton.jsx` (bouton plein écran)
- `Word.jsx` conservé

**Implémentation** : Dossier `Flash/TextAnimation/` + `hooks/useTextAnimation.js`

---

### 10.3 Version 4.0 (Q3 2026)

**REQ-REFACTO-005 : Composants Communs (Phase 5)**

**Priorité** : Basse  
**Estimation** : 12h

**Objectifs** :

- Créer bibliothèque composants génériques `components/common/`
- `Button.jsx` (variants primary/secondary/danger)
- `Modal.jsx` (base pour toutes modales)
- `Tabs.jsx` (système onglets générique)
- `Slider.jsx` (curseur générique)
- `ProgressBar.jsx` (barre progression générique)
- `Toast.jsx` (notifications)

**Bénéfices** :

- Design system cohérent
- Réutilisabilité inter-projets
- Maintenance centralisée

---

**REQ-REFACTO-006 : Context API (Phase 6)**

**Priorité** : Basse  
**Estimation** : 4h  
**Condition** : Si props drilling > 3 niveaux

**Objectifs** :

- Évaluer nécessité Context API
- Créer `context/AppContext.jsx` si nécessaire
- Migration progressive état global

**Alternative** : Conserver props drilling si < 3 niveaux (simplicité)

---

**Fonctionnalités Envisagées v4.0**

- 🔍 **Statistiques lecture** : Vitesse réelle mesurée, taux relecture
- 📊 **Historique progression** : Stockage localStorage, graphiques évolution
- 🎨 **Thèmes visuels** : Mode sombre, contraste élevé
- 🌐 **Internationalisation** : i18n (anglais, espagnol)
- 📱 **PWA complète** : Installation, notifications, offline avancé

---

### 10.4 Priorisation Développement

| Feature                               | Version cible | Priorité   | Effort dev      | Impact utilisateur      |
| ------------------------------------- | ------------- | ---------- | --------------- | ----------------------- |
| Gestion titres Markdown               | 3.9.0         | 🔴 Haute   | 🟢 Faible (2h)  | Correction bug          |
| Conservation retours ligne            | 3.9.0         | 🔴 Haute   | 🟢 Faible (4h)  | Correction bug          |
| Mode plein écran                      | 3.9.0         | 🔴 Haute   | 🟡 Moyen (6h)   | Immersion renforcée     |
| Suppression test vitesse              | 3.9.0         | 🟡 Moyenne | 🟢 Faible (2h)  | Simplification UX       |
| Police + taille                       | 3.9.0         | 🟡 Moyenne | 🟡 Moyen (8h)   | Accessibilité étendue   |
| Extraction services (Phase 1)         | 3.9.0         | 🔴 Haute   | 🟡 Moyen (8h)   | Dette technique         |
| Décomposition TextInput (Phase 2)     | 3.9.0         | 🔴 Haute   | 🟡 Moyen (6h)   | Dette technique         |
| Décomposition SpeedSelector (Phase 3) | 3.10.0        | 🟡 Moyenne | 🟡 Moyen (10h)  | Maintenabilité          |
| Décomposition TextAnimation (Phase 4) | 3.10.0        | 🟡 Moyenne | 🟡 Moyen (8h)   | Maintenabilité          |
| Composants communs (Phase 5)          | 4.0           | 🟢 Basse   | 🔴 Élevé (12h)  | Design system           |
| Context API (Phase 6)                 | 4.0           | 🟢 Basse   | 🟢 Faible (4h)  | État global             |
| Coloration syllabes                   | 4.0 (?)       | 🟢 Basse   | 🔴 Élevé (30h+) | Marginal/contradictoire |

**Estimation totale v3.9.0** : ~36h (fonctionnalités + Phase 1-2)  
**Estimation totale v3.10.0** : ~18h (Phase 3-4)  
**Estimation totale v4.0** : ~16h (Phase 5-6) + fonctionnalités envisagées

---

### 10.5 Refactorisation Architecture (Détails)

#### Contexte

L'application a évolué organiquement depuis v1.0. Plusieurs composants ont dépassé 200 lignes et cumulent plusieurs responsabilités (violation principe SRP - Single Responsibility Principle). L'architecture actuelle présente des opportunités d'amélioration pour :

- Faciliter la maintenance et l'évolution
- Améliorer la testabilité
- Respecter les bonnes pratiques React moderne
- Clarifier la séparation des responsabilités (logique métier vs présentation)

#### Problèmes Identifiés

**1. Composants trop volumineux**

| Composant                | Lignes actuelles | Responsabilités multiples                                                          |
| ------------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| `SpeedSelector.jsx`      | ~400 lignes      | Sélection vitesse + Test vitesse + Partage + Modale personnalisée + Gestion état   |
| `TextInputManager.jsx`   | ~350 lignes      | 3 onglets + Import fichier + Chargement CodiMD + Export + Validation               |
| `LectureFlash/index.jsx` | ~300 lignes      | Orchestration workflow + Gestion état global + Rendu conditionnel étapes + Actions |
| `TextAnimation.jsx`      | ~250 lignes      | Animation + Contrôles + Barre progression + Gestion pause + Calculs vitesse        |

**2. Logique métier mélangée à la présentation**

Exemples :

- Calcul vitesse animation dans `TextAnimation.jsx` (devrait être dans services)
- Validation URL CodiMD dans `TextInputManager.jsx` (devrait être dans utils)
- Génération lien partage dans `SpeedSelector.jsx` (devrait être dans services)
- Algorithme comptage mots dupliqué (`TextInputManager` + `TextAnimation`)

**3. State management dispersé**

- État global dans `LectureFlash/index.jsx`
- État local dans chaque sous-composant
- Props drilling sur 3-4 niveaux
- Pas de contexte React pour état partagé

**4. Absence de couche services**

Toute la logique métier est dans les composants :

- Conversion Markdown → texte brut
- Génération URLs partage
- Persistance localStorage (FirstTimeMessage uniquement)
- Calculs mathématiques (vitesse, progression)

#### Objectifs de Refactorisation

**Principes directeurs** :

- ✅ **Single Responsibility Principle** : 1 composant = 1 responsabilité
- ✅ **Separation of Concerns** : Logique métier séparée de la présentation
- ✅ **DRY (Don't Repeat Yourself)** : Mutualiser code dupliqué
- ✅ **Composants < 200 lignes** : Facilite lecture et maintenance
- ✅ **Testabilité** : Fonctions pures isolables

**Conformité avec contraintes projet** :

- ❌ Pas de TypeScript (JavaScript pur maintenu)
- ❌ Pas de Redux/Zustand (React Context uniquement si nécessaire)
- ✅ PropTypes obligatoires
- ✅ JSDoc français complète

#### Architecture Cible (v4.0)

```
src/
├── config/
│   ├── constants.js              # Existant - conservé
│   └── initialState.js           # Existant - conservé
│
├── hooks/                        # Hooks personnalisés
│   ├── useMarkdownFromUrl.js    # Existant - conservé
│   ├── useLocalStorage.js       # 🆕 v3.9.0 - Abstraction localStorage
│   ├── useFullscreen.js         # 🆕 v3.9.0 - Gestion fullscreen API
│   └── useTextAnimation.js      # 🆕 v3.10.0 - Logique animation (extraite de TextAnimation.jsx)
│
├── services/                     # 🆕 v3.9.0 - Logique métier pure
│   ├── textProcessing.js        # Purification, comptage mots, validation
│   ├── speedCalculations.js     # Calculs MLM, temps lecture, zone Eduscol
│   └── urlGeneration.js         # Génération liens partage
│
├── utils/                        # 🆕 v3.9.0 - Utilitaires réutilisables
│   ├── validation.js            # Validation URL CodiMD, fichiers .txt
│   └── formatters.js            # Formatage dates, nombres, durées
│
├── context/                      # 🆕 v4.0 - Context React (si nécessaire)
│   └── AppContext.jsx           # État global partagé (alternative props drilling)
│
├── components/
│   ├── App.jsx                  # Racine - conservée
│   │
│   ├── common/                  # 🆕 v4.0 - Composants réutilisables
│   │   ├── Button.jsx           # Bouton générique avec variants
│   │   ├── Modal.jsx            # Modale générique (base HelpModal)
│   │   ├── Tabs.jsx             # Système onglets générique
│   │   ├── Slider.jsx           # Curseur générique (vitesse, taille)
│   │   ├── ProgressBar.jsx      # Barre progression générique
│   │   └── Toast.jsx            # Notifications toast
│   │
│   ├── Tooltip.jsx              # Existant - conservé (Portal OK)
│   ├── HelpModal.jsx            # Refactorisé avec Modal.jsx générique (v4.0)
│   ├── FirstTimeMessage.jsx     # Refactorisé avec useLocalStorage (v3.9.0)
│   │
│   ├── Navbar/                  # Existant - conservé
│   │
│   └── LectureFlash/
│       ├── index.jsx            # ⚡ Allégé (orchestration uniquement)
│       ├── StepIndicator.jsx   # Conservé
│       ├── StepContainer.jsx   # Conservé
│       │
│       ├── TextInput/
│       │   ├── TextInputManager.jsx         # ⚡ Refactorisé v3.9.0
│       │   ├── ManualInputTab.jsx           # 🆕 v3.9.0 - Extraction onglet "Saisir"
│       │   ├── FileUploadTab.jsx            # 🆕 v3.9.0 - Extraction onglet "Fichier"
│       │   └── CodiMDTab.jsx                # 🆕 v3.9.0 - Extraction onglet "CodiMD"
│       │
│       └── Flash/
│           ├── SpeedSelector/               # 🆕 v3.10.0 - Décomposition
│           │   ├── index.jsx                # Orchestrateur sélection
│           │   ├── SpeedCard.jsx            # Carte vitesse individuelle
│           │   ├── CustomSpeedModal.jsx     # Modale vitesse personnalisée
│           │   ├── ShareModal.jsx           # Modale partage (extraction)
│           │   └── DisplayOptions.jsx       # 🆕 v3.9.0 - Options police/taille
│           │
│           ├── TextAnimation/               # 🆕 v3.10.0 - Décomposition
│           │   ├── index.jsx                # Orchestrateur animation
│           │   ├── AnimatedText.jsx         # Affichage texte animé
│           │   ├── Word.jsx                 # Conservé (animation mot)
│           │   ├── ReadingControls.jsx      # 🆕 Boutons pause/relire/retour
│           │   └── FullscreenButton.jsx     # 🆕 v3.9.0 - Bouton plein écran
│           │
│           └── ProgressBar.jsx              # Extraction (utilise common/ProgressBar v4.0)
│
└── styles/
    ├── index.css                # Existant - conservé
    └── flash.css                # Existant - conservé
```

#### Bénéfices Attendus

**Maintenabilité** :

- ✅ Composants < 200 lignes (lecture facilitée)
- ✅ Responsabilités claires (SRP respecté)
- ✅ Localisation rapide des bugs

**Testabilité** :

- ✅ Fonctions pures testables unitairement (services)
- ✅ Composants isolés testables individuellement
- ✅ Mocking facilité (dépendances injectées)

**Réutilisabilité** :

- ✅ Composants communs utilisables dans autres projets
- ✅ Services métier indépendants du framework
- ✅ Hooks personnalisés partageables

**Performance** :

- ✅ Re-renders optimisés (composants plus petits)
- ✅ Lazy loading possible (code splitting)
- ✅ Memoization ciblée (React.memo sur composants feuilles)

**Évolutivité** :

- ✅ Ajout fonctionnalités facilité (composants modulaires)
- ✅ Remplacement composants sans impact cascade
- ✅ Migration progressive vers TypeScript possible (si besoin futur)

#### Risques et Atténuations

| Risque                     | Probabilité | Impact | Atténuation                                                                   |
| -------------------------- | ----------- | ------ | ----------------------------------------------------------------------------- |
| Régression fonctionnelle   | Moyenne     | Élevé  | Tests exhaustifs après chaque phase, validation manuelle                      |
| Complexité accrue initiale | Élevée      | Moyen  | Migration progressive, documentation JSDoc, exemples                          |
| Sur-ingénierie             | Faible      | Moyen  | Respect YAGNI (You Ain't Gonna Need It), refacto uniquement si bénéfice clair |
| Temps dépassé              | Moyenne     | Moyen  | Découpage phases, priorisation Phase 1-2 en v3.9.0                            |

---

## Changelog du Document

### v3.9.0 (13 février 2026)

**Ajouts majeurs** :

- Section 10 complète : Roadmap et décisions en attente
- REQ-FUNC-006 à 010 : Nouvelles fonctionnalités v3.9.0
- REQ-REFACTO-001 à 006 : Plan refactorisation progressive
- REQ-NON-IMPL-001 : Décision coloration syllabes
- Section 10.5 : Détails architecture cible
- Mise à jour structure fichiers (services/, utils/, hooks enrichis)
- Alias Vite @services et @utils
- Tests unitaires services (section 7.5)
- Dépréciation mode test vitesse (section 3.2.3)

**Modifications** :

- Architecture technique enrichie (services, utils, hooks)
- Flux de données intégrant services
- Checklist tests étendue (v3.9.0)
- Contraintes techniques (services métier)

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

**Version du document** : 3.9.0  
**Date de dernière modification** : 13 février 2026  
**Statut** : 🚀 En développement actif  
**Auteur** : Frédéric MISERY - CPC Numérique

---

**Documentation complémentaire** :

- `ARCHITECTURE.md` : Guide architecture et bonnes pratiques
- `DECISIONS.md` : Historique décisions architecturales (ADR-001 à ADR-005)
- `README.md` : Vue d'ensemble projet et roadmap
- `CHANGELOG.md` : Historique versions détaillé
