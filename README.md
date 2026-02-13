# 📖 Lecture Flash

Application web éducative pour l'entraînement à la fluence de lecture destinée aux élèves de l'école primaire (CP à CM2).

**Version** : 3.8.0  
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

**Mode test** : Prévisualisation de la vitesse pendant 10 secondes

### 🔗 Partage (Conditionnel si CodiMD)

**Génération de liens** avec 2 modes :

- 💡 **Vitesse suggérée** : L'élève peut modifier
- 🔒 **Vitesse imposée** : Lecture automatique sans modification

**Format d'URL** : `?url=...&speed=70&locked=true`

### 📖 Mode Lecture (Étape 3)

**Animation** : Disparition progressive mot par mot
**Contrôles** :

- ⏸️ Pause / Reprendre
- 🔄 Relire depuis le début
- ← Retour (si vitesse non imposée)

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
│   ├── index.jsx                    # Point d'entrée
│   │
│   ├── config/                      # ✨ Configuration centralisée
│   │   ├── constants.js             # Modes, vitesses, helpers
│   │   └── initialState.js          # État initial
│   │
│   ├── hooks/                       # Hooks personnalisés
│   │   └── useMarkdownFromUrl.js   # Chargement CodiMD
│   │
│   ├── components/
│   │   ├── App.jsx                  # Composant racine
│   │   ├── Tooltip.jsx              # Tooltip avec React Portal
│   │   ├── HelpModal.jsx            # Guide complet
│   │   ├── FirstTimeMessage.jsx    # Message première visite
│   │   │
│   │   ├── Navbar/                  # Barre de navigation
│   │   │   ├── index.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Paypal.jsx
│   │   │
│   │   └── LectureFlash/            # Composant principal
│   │       ├── index.jsx            # Workflow 3 étapes
│   │       ├── initialState.js      # État initial
│   │       ├── parametres.js        # Modes (INPUT/READING)
│   │       ├── StepIndicator.jsx   # Indicateur progression
│   │       ├── StepContainer.jsx   # Wrapper étapes
│   │       ├── ShareConfiguration.jsx  # Configuration partage
│   │       │
│   │       ├── TextInput/           # Gestion texte (3 onglets)
│   │       │   └── TextInputManager.jsx
│   │       │
│   │       └── Flash/               # Lecture animée
│   │           ├── TextAnimation.jsx
│   │           ├── SpeedSelector.jsx
│   │           └── Word.jsx
│   │
│   └── styles/
│       ├── index.css                # Tailwind + fadeIn
│       └── flash.css                # Animation masquage
│
└── docs/                            # Documentation
    ├── INTEGRATION_GUIDE.md
    ├── JUSTIFICATION_PEDAGOGIQUE_AIDE.md
    └── MIGRATION_V2.2.0_SUMMARY.md
```

### Dépendances (9 packages au total)

**Production** :

- `react` ^18.2.0
- `react-dom` ^18.2.0
- `prop-types` ^15.8.1

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

### Scénario 1 : Enseignant prépare un exercice

1. **Étape 1** : Saisir ou importer un texte
2. **Étape 2** : Tester différentes vitesses (30-110 MLM)
3. **Étape 3** : Lancer la lecture sur TBI/TNI

### Scénario 2 : Élève en autonomie

1. **Étape 1** : Saisir son propre texte
2. **Étape 2** : Choisir une vitesse adaptée à son niveau
3. **Étape 3** : S'entraîner à lire en suivant le rythme

### Scénario 3 : Partage via CodiMD

**Enseignant** :

1. Créer un texte sur [codimd.apps.education.fr](https://codimd.apps.education.fr)
2. Charger via l'onglet "CodiMD"
3. Configurer la vitesse (suggérée ou imposée)
4. Générer et partager le lien

**Élève** :

1. Cliquer sur le lien partagé
2. → Texte et vitesse automatiquement chargés
3. → Mode imposé : Lecture démarre automatiquement

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

### Fondements Scientifiques (André Tricot)

**Principes appliqués** :

1. **Charge cognitive minimale** : Interface épurée, guidage progressif
2. **Guidage juste-à-temps** : Tooltips au moment de l'action
3. **Feedback immédiat** : Barre de progression, messages de succès
4. **Différenciation** : 5 niveaux de vitesse + personnalisation

**Référence** : Tricot, A. & Chesné, J.-F. (2020). _Numérique et apprentissages scolaires_. Cnesco.

### Méthode Julie Meunier

**Principe** : Le texte s'efface progressivement pour forcer la lecture continue et éviter les retours en arrière (principal obstacle à la fluence).

**Source** : Meunier, J. (2017). [Fluence : le texte qui s'efface](http://www.ecoledejulie.fr/fluence-le-texte-qui-s-efface-a207401800). L'École de Julie.

---

## 🧪 Tests et Qualité

### Tests Fonctionnels

✅ Import/Export fichiers .txt  
✅ Chargement CodiMD  
✅ Sélection vitesse (prédéfinie + personnalisée)  
✅ Animation lecture (pause, relire, retour)  
✅ Partage (vitesse suggérée/imposée)  
✅ Tooltips (Portal, overflow escape)  
✅ Modales (Escape, clic extérieur, boutons)

### Tests de Performance

✅ **Build time** : ~5s (vs 30s avant Vite)  
✅ **HMR** : ~200ms (vs 3s avant Vite)  
✅ **Bundle CSS** : ~30 KB (vs 200 KB Bootstrap)  
✅ **Animation** : 60 FPS  
✅ **Lighthouse** : >90/100

### Tests d'Accessibilité

✅ **Navigation clavier** : Tab, Escape, Enter  
✅ **ARIA** : Labels, roles, states  
✅ **Contraste** : WCAG 2.1 AA (4.5:1)  
✅ **Focus visible** : Outline bleu  
✅ **Lecteur d'écran** : Annonces appropriées

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
      "@config": "/src/config"  // ✨ Nouveau
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

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit (`git commit -m "feat: description"`)
4. Push (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

### Standards

- **JSDoc** : Documenter toutes les fonctions
- **PropTypes** : Valider toutes les props
- **Noms en français** : Variables et commentaires
- **Composants < 300 lignes** : Principe de responsabilité unique

---

## 📚 Documentation Complémentaire

- **SRS.md** : Spécification complète des exigences
- **CHANGELOG.md** : Historique des versions
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

**Copyright** © 2024 Frédéric MISERY

---

## 🙏 Remerciements

- **Julie Meunier** (@petitejulie89) : Inspiration pédagogique initiale
- **André Tricot** : Fondements scientifiques
- **Ministère de l'Éducation Nationale** : Repères Eduscol
- **Communauté open source** : React, Vite, Tailwind CSS

---

**Dernière mise à jour** : Février 2026  
**Version** : 3.8.0  
**Status** : ✅ Production
