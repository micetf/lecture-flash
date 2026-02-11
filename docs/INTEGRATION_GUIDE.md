# Guide d'Intégration - TextInputManager

## 📋 Vue d'ensemble

Le composant `TextInputManager` remplace et unifie :

- `CloudUrlInput` (chargement cloud)
- `ImportExport` (import/export fichiers)
- Le textarea de saisie manuelle

**Avantages** :

- Interface unifiée avec onglets
- Meilleure clarté cognitive
- Réduction de l'espace vertical
- Expérience utilisateur fluide

---

## 🔄 Migration Progressive (Compatibilité assurée)

### Étape 1 : Ajouter le composant

Copier `TextInputManager.jsx` dans `src/components/LectureFlash/Input/`

```bash
src/components/LectureFlash/Input/
├── Choix/
├── Consignes/
├── ImportExport/          # ⚠️ Sera remplacé
├── TextInputManager.jsx   # ✅ Nouveau composant
└── index.jsx              # 🔧 À modifier
```

---

### Étape 2 : Modifier `Input/index.jsx`

Remplacer le contenu par :

```jsx
import React from "react";
import PropTypes from "prop-types";
import Consignes from "./Consignes";
import ReadingSpeedSelector from "../../ReadingSpeedSelector";
import TextInputManager from "./TextInputManager";

function Input({
    texte,
    changeTexte,
    switchMode,
    onUrlSubmit, // ✅ Nouveau prop
    loading, // ✅ Nouveau prop
    error, // ✅ Nouveau prop
    sourceUrl, // ✅ Nouveau prop
    onReset, // ✅ Nouveau prop
}) {
    const switchFlash = (vitesse) => {
        switchMode(vitesse);
    };

    return (
        <div className="form-group text-center">
            <Consignes />

            <ReadingSpeedSelector
                onSpeedChange={switchFlash}
                defaultSpeed={160}
            />

            {/* ✅ Nouveau composant unifié */}
            <TextInputManager
                texte={texte}
                onTexteChange={changeTexte}
                onUrlSubmit={onUrlSubmit}
                loading={loading}
                error={error}
                sourceUrl={sourceUrl}
                onReset={onReset}
            />
        </div>
    );
}

Input.propTypes = {
    texte: PropTypes.string.isRequired,
    changeTexte: PropTypes.func.isRequired,
    switchMode: PropTypes.func.isRequired,
    onUrlSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    sourceUrl: PropTypes.string,
    onReset: PropTypes.func,
};

export default Input;
```

---

### Étape 3 : Modifier `LectureFlash/index.jsx`

Adapter l'appel du composant `Input` :

```jsx
{
    state.mode === mode.INPUT ? (
        <>
            {/* ⚠️ SUPPRIMER ces composants, maintenant intégrés dans TextInputManager */}
            {/* <CloudUrlInput ... /> */}
            {/* <ShareCloudLink ... /> */}
            {/* Badge indicateur cloud */}

            {/* ✅ Composant Input avec les nouveaux props */}
            <Input
                texte={state.texte}
                changeTexte={changeTexte}
                switchMode={switchModeLecture}
                onUrlSubmit={loadMarkdownFromUrl}
                loading={loading}
                error={error}
                sourceUrl={sourceUrl}
                onReset={handleReset}
            />
        </>
    ) : (
        <Flash {...state} switchMode={switchModeSaisie} />
    );
}
```

---

## ✅ Checklist de migration

- [ ] Copier `TextInputManager.jsx` dans `Input/`
- [ ] Modifier `Input/index.jsx` avec les nouveaux props
- [ ] Adapter `LectureFlash/index.jsx` pour passer les props cloud
- [ ] Tester les 3 modes d'input (saisie, fichier, cloud)
- [ ] Vérifier l'export de fichier
- [ ] Tester le reset après chargement cloud
- [ ] Supprimer `CloudUrlInput.jsx` et `ShareCloudLink.jsx` (optionnel)
- [ ] Supprimer `ImportExport/` (optionnel)

---

## 🧪 Tests à effectuer

### 1. Onglet "Saisir"

- [ ] Saisie manuelle fonctionne
- [ ] Compteur de caractères s'affiche
- [ ] Export en .txt fonctionne
- [ ] Badge cloud s'affiche si texte chargé
- [ ] Bouton "Réinitialiser" fonctionne

### 2. Onglet "Fichier"

- [ ] Clic sur "Choisir un fichier" ouvre le sélecteur
- [ ] Import .txt charge le texte
- [ ] Message d'erreur si format invalide
- [ ] Retour automatique à l'onglet "Saisir"

### 3. Onglet "Cloud"

- [ ] Bouton "Aide" affiche/masque les exemples
- [ ] Formulaire se soumet correctement
- [ ] Spinner pendant le chargement
- [ ] Message d'erreur s'affiche si échec
- [ ] Retour automatique à "Saisir" si succès

### 4. Navigation entre onglets

- [ ] Changement d'onglet fluide
- [ ] État actif visible (bordure bleue + fond)
- [ ] Contenu de chaque onglet distinct

---

## 🎨 Personnalisation possible

### Modifier les couleurs

Dans `TextInputManager.jsx`, chercher :

```jsx
border-blue-600 text-blue-600 bg-blue-50
```

Remplacer par vos couleurs Tailwind préférées.

### Ajouter un 4ème onglet (exemple : Historique)

1. Ajouter dans `TAB_TYPES` :

```jsx
const TAB_TYPES = {
    MANUAL: "manual",
    FILE: "file",
    CLOUD: "cloud",
    HISTORY: "history", // ✅ Nouveau
};
```

2. Ajouter dans `TABS_CONFIG` :

```jsx
{
    id: TAB_TYPES.HISTORY,
    label: "Historique",
    icon: "🕒",
    title: "Textes récents",
}
```

3. Ajouter le contenu dans le switch :

```jsx
{
    activeTab === TAB_TYPES.HISTORY && (
        <div role="tabpanel">{/* Votre composant historique */}</div>
    );
}
```

---

## 🐛 Dépannage

### Le texte ne se charge pas depuis le cloud

➡️ Vérifier que `onUrlSubmit` est bien passé en prop  
➡️ Vérifier que `useMarkdownFromUrl` fonctionne

### L'export .txt ne fonctionne pas

➡️ Vérifier que `texte.trim()` n'est pas vide  
➡️ Vérifier la console pour d'éventuelles erreurs

### Les onglets ne changent pas

➡️ Vérifier que `useState` est bien importé  
➡️ Vérifier la console React DevTools

---

## 📞 Support

Pour toute question sur l'intégration :

- Consulter la JSDoc dans `TextInputManager.jsx`
- Vérifier PropTypes pour les props obligatoires
- Tester en environnement de développement avant production

---

## 🚀 Prochaines étapes

Une fois `TextInputManager` intégré, vous pourrez :

1. **Supprimer les anciens composants** :
    - `CloudUrlInput.jsx`
    - `ShareCloudLink.jsx`
    - `ImportExport/index.jsx`

2. **Ajouter le lien de partage** :
    - Intégrer `ShareCloudLink` dans l'onglet "Cloud"
    - Ou créer un bouton "Partager" dans l'onglet "Saisir"

3. **Passer à l'option B** :
    - Contrôles de lecture (Play/Pause, navigation)
    - Prévu dans la prochaine itération

---

**Date de création** : 2026-02-09  
**Version** : 1.0.0  
**Compatibilité** : React 18.2, Tailwind CSS 3.4.17
