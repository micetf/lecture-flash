# Lecture Flash

Application web éducative pour travailler la **fluence** de lecture des élèves du primaire grâce à un texte qui disparaît progressivement mot par mot.

## 🎯 Objectif

Lecture Flash permet aux enseignants de proposer des séances de lecture chronométrées, avec disparition progressive du texte, afin d’entraîner la fluence en lecture à voix haute ou silencieuse.

## 👥 Public cible

- Enseignants du primaire (cycle 2 et 3, CP à CM2)
- Élèves en situation de lecture guidée ou autonome
- Usage en classe entière (TBI/TNI), en petits groupes ou en individuel

## ✨ Fonctionnalités principales

- Saisie ou import de texte (copier-coller, fichier `.txt`, chargement depuis le cloud)
- Deux modes de lecture : voix haute et lecture silencieuse avec vitesses adaptées
- Disparition progressive du texte, mot par mot, avec animation fluide
- Export local du texte et génération d’URL de partage préconfigurée

Pour les exigences détaillées, critères d’acceptation et priorités, voir :  
[`SRS.md`](./SRS.md).

## 🚀 Installation

### Prérequis

- Node.js (version à préciser)
- npm / pnpm / yarn

### Installation du projet

```bash
git clone https://github.com/micetf/lecture-flash.git
cd lecture-flash
npm install
```

### Lancement en développement

```bash
npm run dev
```

Puis ouvrir l’URL indiquée (par exemple `http://localhost:5173` selon ton bundler).

### Build pour la production

```bash
npm run build
npm run preview   # optionnel pour vérifier le build
```

## 🧩 Utilisation

1. Ouvrir l’application dans le navigateur.
2. Coller/saisir un texte ou l’importer (fichier `.txt` ou URL cloud).
3. Choisir le type de lecture (voix haute / silencieuse) et la vitesse souhaitée.
4. Lancer la lecture : le texte s’affiche puis disparaît progressivement mot par mot.
5. À la fin de la lecture, retour automatique au mode saisie pour ajuster ou relancer.

## ⚙️ Gestion du texte

- Saisie manuelle avec compteur de caractères et nettoyage des espaces multiples.
- Import local de fichiers `.txt` (message d’erreur si format invalide).
- Export local du texte au format `.txt` en UTF-8.
- Chargement cloud : Dropbox, Nextcloud, Apps.education.fr, Google Drive (normalisation des URLs, gestion des erreurs 404/CORS/timeout).
- URL de partage avec texte pré-chargé via paramètre `?url=encodedCloudUrl`.

## 🕒 Vitesses de lecture

Deux familles de vitesses sont proposées :

- Lecture à voix haute : 50 à 150 mots lus par minute (MLM), 9 paliers avec icônes (trottinette → fusée).
- Lecture silencieuse : 140 à 300 MLM, échelle similaire avec valeurs doublées.

Le timing d’animation est calculé automatiquement à partir du nombre de mots, de caractères et de la vitesse choisie.

## 🧪 Exigences fonctionnelles

Les exigences sont identifiées par des IDs (`REQ-FUNC-001`, `REQ-FUNC-002`, etc.) et regroupées par thèmes :

- Modes (SAISIE, LECTURE)
- Chargement de texte (saisie, import, export, cloud, URL de partage)
- Configuration de lecture (types et vitesses)
- Lecture flash (affichage, animation, ponctuation, etc.).

Détails complets dans `SRS.md`.

## 📦 Roadmap / pistes d’évolution

- Historique de textes récents
- Export des configurations de lecture
- Statistiques simples de fluence (nombre de mots, temps, etc.)

_(À adapter selon ta roadmap réelle.)_

## 📝 Changelog

Les modifications significatives sont décrites dans `CHANGELOG.md`.

## 📄 Licence

_(Préciser la licence choisie, par ex. MIT, GPL, ou mention spécifique Éducation Nationale.)_
