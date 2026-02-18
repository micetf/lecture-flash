# 📖 Lecture Flash

Application web éducative pour l'entraînement à la fluence de lecture destinée aux élèves de l'école primaire (CP à CM2).

**Version** : 3.17.0  
**Auteur** : Frédéric MISERY - Conseiller Pédagogique de Circonscription Numérique  
**Site web** : [https://micetf.fr](https://micetf.fr)  
**Email** : webmaster@micetf.fr  
**Licence** : MIT

---

## 🎯 Objectif Pédagogique

Développer la **fluence de lecture** grâce à la technique du texte qui s'efface progressivement, basée sur la méthode de Julie Meunier (@petitejulie89).

### Conformité Programmes Officiels

- ✅ Conforme aux **programmes de l'Éducation Nationale** (cycles 2 et 3)
- ✅ Aligné sur les **repères Eduscol** pour la fluence de lecture
- ✅ Basé sur les **travaux d'André Tricot** en psychologie cognitive
- ✅ Respecte les principes d'**accessibilité** WCAG 2.1 AA

---

## ⚡ Fonctionnalités Principales

### 📝 Gestion du Texte (Étape 1)

**3 modes d'entrée via onglets** :

- **Saisir** : Zone de texte avec compteur (caractères + mots)
- **Fichier** : Import de fichiers `.txt` locaux
- **CodiMD** : Chargement depuis [codimd.apps.education.fr](https://codimd.apps.education.fr)

**Export** : Sauvegarde en fichier `.txt`

### ⚡ Configuration de Vitesse (Étape 2)

**5 vitesses prédéfinies** (conformes Eduscol) :

- 30 MLM → CP - début CE1
- 50 MLM → CE1
- 70 MLM → CE2
- 90 MLM → CM1-CM2
- 110 MLM → CM2 et +

**Vitesse personnalisée** : Curseur 20-200 MLM avec aperçu en temps réel

**Options d'affichage** (v3.9.0) :

- Choix de police (défaut, OpenDyslexic, Arial, Comic Sans MS)
- Ajustement taille (100-200%)
- _Utile pour TBI/TNI et élèves à besoins particuliers_

### 🔗 Partage par URL Encodée (v3.16.0+)

**🆕 Deux méthodes de partage complémentaires** :

#### ☁️ CodiMD (textes longs et réutilisables)

- Texte hébergé sur [codimd.apps.education.fr](https://codimd.apps.education.fr)
- Lien partagé contient uniquement l'URL du document + réglages
- Idéal pour bibliothèques de fluence et évaluations normées

#### ⚡ Direct (textes courts, partage instantané)

- Texte encodé et compressé **directement dans l'URL** (lz-string)
- **Aucun stockage externe** — conforme RGPD
- Garde-fou automatique : bouton absent si texte > 2000 caractères
- Idéal pour exercices quotidiens et devoirs maison

**Deux modes de réglages** :

- 💡 **Réglages modifiables** : L'élève peut ajuster vitesse, police et taille
- 🔒 **Réglages imposés** : Paramètres verrouillés par l'enseignant

**Paramètres partagés** : texte, vitesse (MLM), police, taille

**Format d'URL Direct** : `?s=N4Ig...` (Base64 URL-safe + LZ-String)

### 📖 Mode Lecture (Étape 3)

**Animation** : Disparition progressive mot par mot

**Contrôles** :

- ⏸️ Pause / Reprendre
- 🔄 Relire depuis le début
- ← Retour (si réglages non imposés)
- ⛶ Plein écran (v3.9.0)

**Indicateur** : Barre de progression visuelle

---

## 🎨 Système d'Aide Intégré

### 3 Niveaux Progressifs

1. **FirstTimeMessage** : Onboarding léger (première visite uniquement)
2. **Tooltips contextuels** : Guidage juste-à-temps au survol
3. **HelpModal** : Guide complet accessible via bouton `?`

**Conformité pédagogique** : Applique les principes d'André Tricot sur la charge cognitive minimale.

---

## 🏗️ Architecture Technique

### Stack

- **Framework** : React 18.2.0 (hooks natifs uniquement)
- **Build Tool** : Vite 6.0.7
- **Styling** : Tailwind CSS 3.4.17 (mode JIT)
- **Package Manager** : pnpm
- **Validation** : PropTypes
- **Compression URL** : LZ-String 1.5.0 (🆕 v3.16.0)

### Structure des Fichiers

```
lecture-flash/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
│
├── src/
│   ├── index.jsx                    # Point d'entrée + décodage URL (🆕 v3.16.1)
│   │
│   ├── config/                      # Configuration centralisée
│   │   ├── constants.js             # Modes, vitesses, helpers
│   │   ├── initialState.js          # État initial
│   │   └── helpContent.jsx          # Contenu aide (🆕 v3.16.3)
│   │
│   ├── services/                    # Logique métier pure
│   │   ├── textProcessing.js        # Comptage, purification texte
│   │   ├── speedCalculations.js     # Calculs MLM, temps lecture
│   │   ├── urlGeneration.js         # Génération liens CodiMD
│   │   └── urlSharing.js            # 🆕 v3.16.0 - Encodage/décodage URL directe
│   │
│   ├── utils/                       # Utilitaires
│   │   ├── validation.js            # Validation URL, fichiers
│   │   └── formatters.js            # Formatage dates, durées
│   │
│   ├── hooks/                       # Hooks personnalisés
│   │   ├── useMarkdownFromUrl.js    # Chargement CodiMD
│   │   ├── useLocalStorage.js
│   │   ├── useFullscreen.js
│   │   └── useInlineShareLink.js    # 🆕 v3.16.0 - Garde-fous URL directe
│   │
│   ├── components/
│   │   ├── App.jsx                  # Composant racine
│   │   ├── Tooltip.jsx              # Tooltip avec React Portal
│   │   ├── HelpModal.jsx            # Guide complet
│   │   ├── HelpButton.jsx           # Bouton aide global
│   │   ├── FirstTimeMessage.jsx     # Message première visite
│   │   │
│   │   ├── Navbar/                  # Barre de navigation
│   │   │   ├── index.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Paypal.jsx
│   │   │
│   │   └── LectureFlash/            # Composant principal
│   │       ├── index.jsx            # Workflow 3 étapes + décodage URL
│   │       ├── StepIndicator.jsx    # Indicateur progression
│   │       ├── StepContainer.jsx    # Wrapper étapes
│   │       ├── ShareConfiguration.jsx   # Configuration partage CodiMD
│   │       ├── ShareModal.jsx       # 🆕 v3.16.0 - Modale partage réutilisable
│   │       │
│   │       ├── TextInput/           # Gestion texte (3 onglets)
│   │       │   ├── TextInputManager.jsx
│   │       │   ├── ManualInputTab.jsx
│   │       │   ├── FileUploadTab.jsx
│   │       │   └── CodiMDTab.jsx
│   │       │
│   │       └── Flash/               # Lecture animée
│   │           ├── SpeedSelector.jsx        # Sélection vitesse (allégé v3.16.0)
│   │           ├── DisplayOptions.jsx       # Options police/taille
│   │           ├── FullscreenButton.jsx     # Bouton plein écran
│   │           ├── TextAnimation.jsx        # Animation mot-à-mot
│   │           └── Word.jsx                 # Animation mot
│   │
│   └── styles/
│       ├── index.css                # Tailwind + fadeIn
│       └── flash.css                # Animation masquage
│
├── docs/                            # Documentation technique
│   ├── ARCHITECTURE.md
│   ├── DECISIONS.md
│   ├── INTEGRATION_GUIDE.md
│   ├── JUSTIFICATION_PEDAGOGIQUE_AIDE.md
│   └── MIGRATION_V2.2.0_SUMMARY.md
│
└── CHANGELOG.md                     # Historique versions (🆕 v3.17.0)
```

### Dépendances (10 packages au total)

**Production** :

- `react` ^18.2.0
- `react-dom` ^18.2.0
- `prop-types` ^15.8.1
- `lz-string` ^1.5.0 _(🆕 v3.16.0 — compression URL)_

**Development** :

- `@vitejs/plugin-react` ^4.3.4
- `vite` ^6.0.7
- `vite-plugin-svgr` ^4.3.0
- `tailwindcss` ^3.4.17
- `postcss` ^8.4.49
- `autoprefixer` ^10.4.20

---

## 🚀 Installation et Démarrage

### Prérequis

- **Node.js** : v18 ou supérieur
- **pnpm** : Installé globalement (`npm install -g pnpm`)

### Installation

```bash
# Cloner le repository
git clone https://github.com/micetf/lecture-flash.git
cd lecture-flash

# Installer les dépendances
pnpm install
```

### Commandes

```bash
# Développement (port 9000)
pnpm dev

# Build production
pnpm build

# Prévisualisation build
pnpm preview
```

---

## 📖 Utilisation

### Scénario 1 : Enseignant prépare un exercice sur TBI/TNI

1. **Étape 1** : Saisir ou importer un texte
2. **Étape 2** : Tester différentes vitesses (30-110 MLM)
3. **Étape 3** : Lancer la lecture sur TBI/TNI

### Scénario 2 : Élève en autonomie

1. **Étape 1** : Saisir son propre texte
2. **Étape 2** : Choisir une vitesse adaptée à son niveau
3. **Étape 3** : S'entraîner à lire en suivant le rythme

### Scénario 3 : Partage via CodiMD ☁️

Idéal pour les textes longs et réutilisables (bibliothèques de fluence).

**Enseignant** :

1. Créer un texte sur [codimd.apps.education.fr](https://codimd.apps.education.fr)
2. Charger via l'onglet « CodiMD »
3. Configurer vitesse, police et taille
4. Choisir « 💡 Réglages modifiables » ou « 🔒 Réglages imposés »
5. Générer et partager le lien

**Élève** :

1. Cliquer sur le lien partagé
2. → Texte et réglages automatiquement chargés
3. → Mode imposé : bouton « Modifier les réglages » absent

### Scénario 4 : Partage Direct ⚡ (🆕 v3.16.0)

Idéal pour les textes courts, le partage instantané, les devoirs maison.

**Enseignant** :

1. Saisir un texte court (≤ 2000 caractères)
2. Configurer vitesse (ex. 70 MLM) + police + taille
3. Cliquer « ⚡ Direct »
4. Choisir le mode de réglages
5. Cliquer « Générer et copier le lien »
6. Partager le lien (ENT, messagerie, QR code…)

**Élève** :

1. Cliquer sur le lien
2. → Texte + réglages chargés automatiquement (< 100 ms)
3. → Passe directement à l'étape 3 (lecture)
4. → Lancer la lecture

### Cas d'Usage Pédagogiques Validés

| Situation                   | Méthode   | Mode           | Raison                                       |
| --------------------------- | --------- | -------------- | -------------------------------------------- |
| Bibliothèque de fluence CE2 | ☁️ CodiMD | 💡 Modifiables | Textes longs, réutilisables, différenciation |
| Évaluation normée CM1       | ☁️ CodiMD | 🔒 Imposés     | Conditions identiques pour tous              |
| Exercice quotidien rapide   | ⚡ Direct | 💡 Modifiables | Texte court, partage instantané              |
| Devoir maison cadré         | ⚡ Direct | 🔒 Imposés     | Exercice unique, vitesse imposée             |

---

## 🎓 Justification Pédagogique

### Conformité Programmes Eduscol

**Cycle 2 (CP-CE2)** :

- Développer la fluidité de la lecture
- Automatiser le décodage
- Améliorer la vitesse de lecture orale

**Cycle 3 (CM1-CM2)** :

- Consolider la fluence
- Développer la lecture silencieuse rapide
- Améliorer la compréhension par l'automatisation

**Repères de fluence respectés** : 30-110 MLM, adaptés aux niveaux CP-CM2.

### Fondements Scientifiques (André Tricot)

**Principes appliqués** :

1. **Charge cognitive minimale** : Interface épurée, guidage progressif
2. **Guidage juste-à-temps** : Tooltips au moment de l'action
3. **Feedback immédiat** : Barre de progression, toasts, messages clairs
4. **Différenciation** : 5 niveaux de vitesse + personnalisation (police, taille)
5. **Guidance appropriée** : L'enseignant configure, l'élève exécute

**Référence** : Tricot, A. & Chesné, J.-F. (2020). _Numérique et apprentissages scolaires_. Cnesco.

### Méthode Julie Meunier

**Principe** : Le texte s'efface progressivement pour forcer la lecture continue et éviter les retours en arrière (principal obstacle à la fluence).

**Source** : Meunier, J. (2017). [Fluence : le texte qui s'efface](http://www.ecoledejulie.fr/fluence-le-texte-qui-s-efface-a207401800). L'École de Julie.

### Accessibilité

- Police **OpenDyslexic** disponible
- Taille ajustable (100-200%)
- Contraste élevé possible
- Compatible assistive technologies

### Conformité RGPD

- **Partage CodiMD** : données hébergées sur infrastructure Éducation Nationale
- **Partage Direct** : aucune donnée transmise à un serveur externe — tout dans l'URL

---

## 🗺️ Roadmap

### v3.9.0 (✅ Terminée — 14 février 2026)

- ✅ Mode plein écran
- ✅ Personnalisation police et taille
- ✅ Gestion titres Markdown
- ✅ Conservation retours à la ligne
- ✅ Refactorisation services/utils/hooks

### v3.16.x — v3.17.0 (✅ Terminée — 18 février 2026)

**Partage par URL encodée** :

- ✅ `v3.16.0` : Génération lien encodé (ShareModal + urlSharing + useInlineShareLink)
- ✅ `v3.16.1` : Décodage automatique côté élève (useEffect + passage étape 3)
- ✅ `v3.16.2` : Corrections bugs critiques (chemin URL, `allowStudentChanges`)
- ✅ `v3.16.3` : Clarification terminologie UX (réglages modifiables/imposés)
- ✅ `v3.17.0` : Documentation finale (CHANGELOG, README, guides Git)

### v3.10.0 / v4.0 (Q2-Q3 2026)

**Refactorisation avancée** :

- 🔧 Extraction hook `useTextAnimation`
- 🔧 Décomposition `TextAnimation` → sous-composants
- 🔧 Bibliothèque composants communs → `common/`
- 🔧 Context API si nécessaire

**Fonctionnalités envisagées** :

- 🔍 Statistiques lecture (vitesse réelle, taux relecture)
- 📊 Historique progression élève (localStorage)
- 🎨 Thèmes visuels (mode sombre, contraste élevé)
- 🌐 Internationalisation (i18n)

**Fonctionnalités écartées** :

- ❌ Coloration syllabes : Complexité technique élevée, cohérence pédagogique douteuse

_Les propositions sont bienvenues via [GitHub Issues](https://github.com/micetf/lecture-flash/issues) avec le tag `enhancement`._

---

## 🏗️ Architecture et Bonnes Pratiques

### Principes de Développement

- ✅ **Single Responsibility Principle** : 1 composant = 1 responsabilité
- ✅ **Separation of Concerns** : Logique métier (services) séparée de la présentation
- ✅ **DRY** : Code mutualisé dans services, utils et hooks
- ✅ **Composants < 200 lignes** : Facilite lecture et maintenance
- ✅ **Defensive Programming** : Garde-fous, try/catch, validation systématique

**Contraintes techniques** :

- ❌ Pas de TypeScript (JavaScript pur + PropTypes)
- ❌ Pas de state management externe
- ✅ JSDoc française complète obligatoire
- ✅ PropTypes complets sur tous les composants

### Patterns Appliqués (v3.16.x)

- **Custom Hook** : `useInlineShareLink` (logique de génération + garde-fous)
- **Service Layer** : `urlSharing.js` (encodage/décodage pur, testable)
- **Component Composition** : `ShareModal` réutilisable (CodiMD + Direct)
- **Error Handling** : try/catch sur tous les décodages d'URL

### Structure Cible (v4.0)

```
src/
├── services/          # Logique métier pure (fonctions testables)
├── utils/             # Utilitaires réutilisables
├── hooks/             # Hooks personnalisés React
├── context/           # Context API (si nécessaire)
├── components/
│   ├── common/        # Composants génériques (Button, Modal, etc.)
│   └── LectureFlash/  # Composants métier décomposés
```

---

## 🧪 Tests et Qualité

### Tests Fonctionnels

✅ Import/Export fichiers .txt  
✅ Chargement CodiMD  
✅ Sélection vitesse (prédéfinie + personnalisée)  
✅ Animation lecture (pause, relire, retour)  
✅ Partage CodiMD (réglages modifiables/imposés)  
✅ Partage Direct (génération + décodage bout en bout)  
✅ URL tronquée ou corrompue → erreur gérée silencieusement  
✅ Texte > 2000 caractères → bouton Direct absent  
✅ Tooltips (Portal, overflow escape)  
✅ Modales (Escape, clic extérieur, boutons)

### Tests de Performance

✅ **Compression** : 60-70% de réduction avec lz-string  
✅ **Décodage URL** : < 100 ms  
✅ **Build time** : ~5 s  
✅ **HMR** : ~200 ms  
✅ **Bundle CSS** : ~30 KB  
✅ **Animation** : 60 FPS  
✅ **Lighthouse** : > 90/100

### Tests d'Accessibilité

✅ Navigation clavier : Tab, Escape, Enter  
✅ ARIA : Labels, roles, states  
✅ Contraste : WCAG 2.1 AA (4.5:1)  
✅ Focus visible  
✅ Lecteur d'écran : annonces appropriées

### Compatibilité

✅ Chrome, Firefox, Safari, Edge  
✅ Tablettes et smartphones  
✅ TBI/TNI

---

## 📐 Configuration

### Vite (vite.config.js)

```javascript
{
  server: { port: 9000, open: true },
  build: { outDir: "build", sourcemap: true },
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@hooks": "/src/hooks",
      "@config": "/src/config",
      "@services": "/src/services",
      "@utils": "/src/utils"
    }
  }
}
```

### Tailwind (tailwind.config.js)

```javascript
{
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { primary: { /* palette bleue */ } }
    }
  }
}
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :

1. Forker le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Committer (`git commit -m "feat: description"`)
4. Pusher (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

### Standards

- **JSDoc** : Documenter toutes les fonctions (services, utils, hooks)
- **PropTypes** : Valider toutes les props (composants)
- **Noms en français** : Variables et commentaires
- **Composants < 200 lignes** : Principe de responsabilité unique
- **Tests** : Unitaires pour services, manuels pour composants

### Convention Commits

**Format** : `type(scope): description`

**Types** : `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

**Exemples** :

```bash
git commit -m "feat(share): ajout partage URL encodée directe"
git commit -m "fix(index): correction chemin URL partage direct"
git commit -m "refactor(speed-selector): extraction ShareModal"
git commit -m "docs(readme): section partage v3.17.0"
```

---

## 📚 Documentation Complémentaire

- **SRS.md** : Spécification complète des exigences
- **ARCHITECTURE.md** : Guide architecture et bonnes pratiques
- **DECISIONS.md** : Historique décisions architecturales (ADR)
- **CHANGELOG.md** : Historique des versions (v3.16.0 → v3.17.0)
- **docs/INTEGRATION_GUIDE.md** : Guide d'intégration TextInputManager
- **docs/JUSTIFICATION_PEDAGOGIQUE_AIDE.md** : Fondements pédagogiques du système d'aide

---

## 🆘 Support

- **Issues** : [GitHub Issues](https://github.com/micetf/lecture-flash/issues)
- **Email** : webmaster@micetf.fr
- **Site** : [https://micetf.fr](https://micetf.fr)

---

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

**Copyright** © 2024-2026 Frédéric MISERY

---

## 🙏 Remerciements

- **Julie Meunier** (@petitejulie89) : Inspiration pédagogique initiale
- **André Tricot** : Fondements scientifiques
- **Ministère de l'Éducation Nationale** : Repères Eduscol
- **Communauté open source** : React, Vite, Tailwind CSS, LZ-String

---

**Dernière mise à jour** : 18 février 2026  
**Version** : 3.17.0  
**Status** : ✅ Production-ready
