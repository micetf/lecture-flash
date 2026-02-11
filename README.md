# Lecture Flash

Application web éducative pour travailler la **fluence** de lecture des élèves du primaire grâce à un texte qui disparaît progressivement mot par mot.

## 🎯 Objectif

Lecture Flash permet aux enseignants de proposer des séances de lecture chronométrées, avec disparition progressive du texte, afin d'entraîner la fluence en lecture à voix haute ou silencieuse.

## 👥 Public cible

- Enseignants du primaire (cycle 2 et 3, CP à CM2)
- Élèves en situation de lecture guidée ou autonome
- Usage en classe entière (TBI/TNI), en petits groupes ou en individuel

## ✨ Fonctionnalités principales

- Saisie ou import de texte (copier-coller, fichier `.txt`, chargement depuis le cloud)
- Deux modes de lecture : voix haute et lecture silencieuse avec vitesses adaptées
- Disparition progressive du texte, mot par mot, avec animation fluide
- Export local du texte et génération d'URL de partage préconfigurée

Pour les exigences détaillées, critères d'acceptation et priorités, voir :  
[`SRS.md`](./SRS.md).

## 🎓 Système d'aide intégré

Lecture Flash intègre un système d'aide moderne en 3 niveaux :

### 🌟 Message de bienvenue (première visite)

- Affichage automatique lors de la première utilisation
- Guide simplifié en 3 étapes
- Fermeture définitive après lecture (stockage local)

### 💡 Tooltips contextuels

- Aide discrète au survol des éléments interactifs
- Descriptions détaillées des onglets (Saisir, Fichier, Cloud)
- Recommandations pédagogiques pour chaque vitesse de lecture (30-110 MLM)
- Correspondance vitesses/niveaux scolaires conforme aux programmes Eduscol :
    - 30 MLM : CP - début CE1 (déchiffrage en cours d'acquisition)
    - 50 MLM : CE1 (lecture mot à mot)
    - 70 MLM : CE2 (lecture par groupes de mots)
    - 90 MLM : CM1-CM2 (lecture fluide)
    - 110 MLM : CM2 et + (lecture experte)

### 📖 Guide complet (modale d'aide)

- Accessible via le bouton (?) en haut à droite
- Documentation détaillée en 3 étapes avec exemples
- Correspondances vitesses MLM / niveaux scolaires
- Astuces pédagogiques pour la progression
- Attribution à @petitejulie89 pour la méthode pédagogique

**Conception pédagogique** : Ce système respecte les principes d'André Tricot sur la réduction de la charge cognitive extrinsèque et le guidage juste-à-temps. L'interface est épurée par défaut, l'aide s'affiche au moment opportun (juste-à-temps), et le guidage devient progressivement moins nécessaire à mesure que l'utilisateur gagne en autonomie.

## 🚀 Installation

### Prérequis

- Node.js (version 18+)
- pnpm (gestionnaire de paquets)

### Installation du projet

```bash
git clone https://github.com/micetf/lecture-flash.git
cd lecture-flash
pnpm install
```

### Lancement en développement

```bash
pnpm dev
```

Puis ouvrir `http://localhost:9000` dans le navigateur.

### Build pour la production

```bash
pnpm build
pnpm preview   # optionnel pour vérifier le build
```

## 🧩 Utilisation

1. Ouvrir l'application dans le navigateur.
2. Coller/saisir un texte ou l'importer (fichier `.txt` ou URL cloud).
3. Choisir la vitesse souhaitée (30-110 MLM avec correspondances niveaux scolaires).
4. Lancer la lecture : le texte s'affiche puis disparaît progressivement mot par mot.
5. À la fin de la lecture, retour automatique au mode saisie pour ajuster ou relancer.

## ⚙️ Gestion du texte

- Saisie manuelle avec compteur de caractères et nettoyage des espaces multiples.
- Import local de fichiers `.txt` (message d'erreur si format invalide).
- Export local du texte au format `.txt` en UTF-8.
- Chargement cloud : Dropbox, Nextcloud, Apps.education.fr, Google Drive (normalisation des URLs, gestion des erreurs 404/CORS/timeout).
- URL de partage avec texte pré-chargé via paramètre `?url=encodedCloudUrl`.

## 🕒 Vitesses de lecture

Deux familles de vitesses sont proposées (conforme aux programmes Eduscol) :

- **Lecture à voix haute** : 30 à 110 mots lus par minute (MLM), avec 5 paliers correspondant aux niveaux CP à CM2+
- **Lecture silencieuse** : 140 à 300 MLM (vitesses doublées pour le cycle 3)

Le timing d'animation est calculé automatiquement à partir du nombre de mots, de caractères et de la vitesse choisie.

## 🧪 Exigences fonctionnelles

Les exigences sont identifiées par des IDs (`REQ-FUNC-001`, `REQ-FUNC-002`, etc.) et regroupées par thèmes :

- Modes (SAISIE, LECTURE)
- Chargement de texte (saisie, import, export, cloud, URL de partage)
- Configuration de lecture (vitesses adaptées aux niveaux scolaires)
- Lecture flash (affichage, animation, ponctuation, etc.)
- Système d'aide contextuelle (tooltips, modale, message de bienvenue)

Détails complets dans [`SRS.md`](./SRS.md).

## Convention de nommage des composants

     - Composant simple (< 100 lignes) : `MonComposant.jsx`
     - Composant avec sous-composants : `MonComposant/index.jsx`
     - Module multi-composants : dossier avec exports nommés


## 📦 Roadmap / pistes d'évolution

- Historique de textes récents
- Export des configurations de lecture
- Statistiques simples de fluence (nombre de mots, temps, etc.)

## 📝 Changelog

Les modifications significatives sont décrites dans [`CHANGELOG.md`](./CHANGELOG.md).

## 📚 Fondements pédagogiques

L'application s'appuie sur :

- Les programmes officiels de l'Éducation Nationale (Eduscol)
- Les travaux d'André Tricot sur la charge cognitive et le numérique éducatif
- La méthode de Julie Meunier (@petitejulie89) sur la fluence

Pour plus de détails, voir la [justification pédagogique](./docs/JUSTIFICATION_PEDAGOGIQUE_AIDE.md).

## 📄 Licence

Application libre et gratuite pour l'enseignement primaire. Open Source.

**Contact** : webmaster@micetf.fr  
**Site** : https://micetf.fr
