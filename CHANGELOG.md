# Changelog

Toutes les modifications notables de Lecture Flash sont documentées dans ce fichier.

Le format s'inspire de « Keep a Changelog » et les versions suivent le principe de versionnement sémantique (MAJEUR.MINEUR.CORRECTIF).

---

## [2.2.0] - 2025-02-10

### Ajouté

- **Système d'aide contextuelle moderne** (remplacement du composant Consignes obsolète) :
    - Composant `Tooltip` réutilisable avec React Portal et animation fadeIn
    - Composant `HelpModal` : modale d'aide complète avec guide détaillé en 3 étapes
    - Composant `FirstTimeMessage` : message de bienvenue à la première visite (localStorage)
    - Tooltips contextuels sur les onglets de `TextInputManager` (Saisir, Fichier, Cloud)
    - Tooltips contextuels sur les vitesses de `ChoixVitesseAmeliore` avec correspondances niveaux scolaires (30-110 MLM)
    - Tooltip sur le bouton d'aide (?)
- Animation CSS `fadeIn` dans `src/styles/index.css` pour les tooltips et éléments apparaissants

### Modifié

- `TextInputManager` : ajout de tooltips sur les 3 onglets avec descriptions détaillées
- `ChoixVitesseAmeliore` : ajout de tooltips sur chaque vitesse (30-110 MLM) avec recommandations pédagogiques
- `Input/index.jsx` : intégration de `FirstTimeMessage`, `HelpModal` et bouton d'aide (?)
- `Mot.jsx` : ajout de `componentDidMount` et amélioration de `componentDidUpdate` pour déclencher correctement les animations
- `FlashAmelioreTest.jsx` : correction du calcul de vitesse (`index <= idMot` et `speed * motClean.length`)
- `src/styles/index.css` : ajout de l'animation `fadeIn` dans `@layer utilities`

### Supprimé

- **Composant `Consignes`** obsolète (`src/components/LectureFlash/Input/Consignes/index.jsx`)
    - Contenu obsolète ne correspondant plus à l'interface actuelle
    - Remplacé par le système d'aide contextuelle moderne
- `src/components/App.css` : fichier CSS obsolète non utilisé (ancienne architecture Bootstrap)

### Corrigé

- Animation Flash : le texte disparaît maintenant correctement mot par mot
- Tooltips : utilisation de React Portal pour éviter les problèmes d'overflow

### Justification pédagogique

- **Conformité André Tricot** : réduction de la charge cognitive extrinsèque
- **Guidage juste-à-temps** : tooltips au moment de l'action plutôt que consignes préalables
- **Découverte progressive** : l'utilisateur n'est pas submergé d'informations inutiles
- **Accessibilité** : WCAG 2.1 AA (ARIA, navigation clavier, focus visible, Portal pour z-index)

---

## [2.1.1] - 2026-02-10

### Refactoring

- Nettoyage architecture (9 éléments supprimés)

---

## [2.0.0] - 2026-02-09

Version correspondant au SRS v2.0.0.

### Added

- Application web Lecture Flash pour l'entraînement à la fluence de lecture.
- Mode **SAISIE** avec zone de texte multi-lignes, placeholder, compteur de caractères et sauvegarde automatique en session.
- Mode **LECTURE** avec disparition progressive du texte mot par mot et bouton pour revenir en mode SAISIE.
- Saisie manuelle avec nettoyage automatique des espaces multiples.
- Import local de fichiers `.txt` (filtrage par extension, message d'erreur si format invalide).
- Export local du texte en fichier `.txt` (nom par défaut `lecture-flash.txt`, encodage UTF-8).
- Chargement de texte depuis le cloud (Dropbox, Nextcloud, Apps.education.fr, Google Drive) avec normalisation des URLs et gestion des erreurs (404, CORS, timeout).
- Génération d'URL de partage avec texte pré-chargé via paramètre `?url=encodedCloudUrl` et bouton de copie.
- Configuration des types de lecture : voix haute et lecture silencieuse.
- Configuration des vitesses de lecture : 50–150 MLM pour la voix haute, 140–300 MLM pour la lecture silencieuse, 9 vitesses par type avec icônes et affichage du MLM.
- Calcul automatique du timing d'animation à partir du nombre de mots et de caractères.
- Affichage du texte dans un cadre dédié (taille, interligne, bordure, padding, fond, coins arrondis).
- Animation CSS de disparition mot par mot avec masque blanc progressif.

### Changed

- Ajustement de la présentation pour un confort de lecture renforcé (taille du texte, interligne, cadre visuel).

### Fixed

- Gestion des espaces insécables et de la ponctuation (guillemets, tirets, etc.) pour une lecture et une animation correctes.

---

## [1.x.x] - Historique antérieur

Versions initiales ou prototypes non spécifiés dans le SRS v2.0.0.
