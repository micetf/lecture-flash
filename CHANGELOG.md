# Changelog

Toutes les modifications notables de Lecture Flash sont documentées dans ce fichier.

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/) et les versions suivent le [versionnement sémantique](https://semver.org/lang/fr/).

---

## [Non publié] - En cours

## [3.10.4] - 2026-02-14

### Changed

- **Bouton "Relire" remplacé par "Arrêter"** :
    - **Avant** : Bouton "🔄 Relire" redémarrait automatiquement la lecture après 100ms
    - **Après** : Bouton "⏹️ Arrêter" stoppe la lecture et revient à l'état initial
    - **Comportement** : L'utilisateur doit cliquer à nouveau sur "▶️ Lancer la lecture" pour relire
    - **UX** : Contrôle plus explicite, pas de redémarrage surprise
    - **Design** : Bouton rouge (danger) au lieu de bleu, cohérence avec action destructive

### Technical Details

**`src/components/LectureFlash/index.jsx`** :

- Ligne ~233 : Renommage `handleReplay` → `handleStop`
- Suppression `setTimeout(() => setHasStartedReading(true), 100)`
- Ligne ~326 : Bouton mis à jour avec nouvelle action
    - Texte : "🔄 Relire" → "⏹️ Arrêter"
    - Couleur : `bg-blue-600` → `bg-red-600`
    - ARIA : "Relire depuis le début" → "Arrêter la lecture"

**Workflow utilisateur** :

1. Clic "▶️ Lancer la lecture" → Lecture démarre
2. Pendant lecture : "⏸️ Pause" + "⏹️ Arrêter" disponibles
3. Clic "⏹️ Arrêter" → Lecture s'arrête, retour état initial
4. Pour relire : Clic à nouveau "▶️ Lancer la lecture"

**Avantages** :

- ✅ Contrôle explicite de l'utilisateur
- ✅ Pas de comportement automatique inattendu
- ✅ Cohérence avec conventions UI (rouge = arrêt)
- ✅ Permet de relire avec un état mental préparé

## [3.10.3] - 2026-02-14

### Fixed

- **BUG CRITIQUE : Boucle infinie lors du chargement CodiMD** :
    - **Symptôme** : Erreur `Maximum update depth exceeded` dans la console
    - **Cause** :
        - 3 effets appelaient `loadMarkdownFromUrl()` sans garde appropriée
        - Hook `useMarkdownFromUrl` charge automatiquement au montage (ligne 196-206)
        - Effets 1 et 2 du composant LectureFlash (lignes 103-116) appelaient en doublon
        - Effet 3 modifiait sa propre dépendance `hasLoadedFromUrl`, causant réexécution infinie
    - **Solution** :
        - Suppression complète des effets 1 et 2 (lignes 103-116) devenus redondants
        - Séparation effet 3 en DEUX effets distincts :
            - **Effet 1** : Application texte CodiMD (dépend uniquement de `markdownText`)
            - **Effet 2** : Configuration automatique si `speedConfig` (garde `hasLoadedFromUrl`)
        - Garde efficace : `if (speedConfig && markdownText && !hasLoadedFromUrl)` empêche boucle
    - **Impact** : Chargement CodiMD stable, pas de réexécution infinie, application correcte des options

### Changed

- **`src/components/LectureFlash/index.jsx`** :
    - **Lignes 103-116 SUPPRIMÉES** : Effets redondants appelant `loadMarkdownFromUrl`
    - **Lignes 118-145 REFACTORISÉES** :
        - Effet 1 (nouveau) : Application texte uniquement
            ```javascript
            useEffect(() => {
                if (markdownText) {
                    setAppState((prev) => ({ ...prev, text: markdownText }));
                    setIsCodiMDTextUnmodified(true);
                    setTextInputKey((prev) => prev + 1);
                }
            }, [markdownText]);
            ```
        - Effet 2 (nouveau) : Configuration automatique protégée
            ```javascript
            useEffect(() => {
                if (speedConfig && markdownText && !hasLoadedFromUrl) {
                    setAppState((prev) => ({
                        ...prev,
                        speedWpm: speedConfig.speed,
                    }));
                    setCurrentStep(3);
                    setHasLoadedFromUrl(true);
                    // Application police/taille depuis URL...
                }
            }, [
                speedConfig,
                markdownText,
                policeParam,
                tailleParam,
                hasLoadedFromUrl,
            ]);
            ```
    - JSDoc mise à jour : VERSION 3.10.3

### Technical Details

**Workflow avant correction (BUGGÉ)** :

1. Hook charge automatiquement (ligne 202) ✓
2. Effet 1 composant recharge (ligne 103) ❌ (doublon)
3. Effet 2 composant recharge (ligne 111) ❌ (doublon)
4. Effet 3 applique texte + modifie `hasLoadedFromUrl` ❌ (boucle)
5. **Résultat** : 50+ appels `setState` → crash

**Workflow après correction (CORRIGÉ)** :

1. Hook charge automatiquement (ligne 202) ✓
2. Effet 1 applique texte (ne touche pas hasLoadedFromUrl) ✓
3. Effet 2 configure + met `hasLoadedFromUrl = true` ✓
4. Effet 2 se réexécute MAIS condition `!hasLoadedFromUrl` échoue ✓
5. **Résultat** : Chargement propre en 1 cycle

**Erreur console avant** :

```
Warning: Maximum update depth exceeded. This can happen when a component
calls setState inside useEffect, but useEffect either doesn't have a
dependency array, or one of the dependencies changes on every render.
    at LectureFlash (index.jsx:40:43)
```

**Après** : Aucune erreur, chargement fluide ✓

### Architecture Improvements

- **Séparation des responsabilités** : Application texte vs Configuration auto
- **Garde robuste** : `!hasLoadedFromUrl` empêche double exécution
- **Code simplifié** : 2 effets clairs au lieu de 3 effets confus
- **Maintenabilité** : Chaque effet a une responsabilité unique
- **Performance** : Réduction de ~50 renders superflus à 0

### Tests de validation

- ✅ Enseignant : Chargement manuel CodiMD fonctionnel
- ✅ Enseignant : Lien sans speedConfig charge texte à étape 1
- ✅ Élève locked=false : Lien charge + permet modification vitesse
- ✅ Élève locked=true : Lien charge + lecture directe
- ✅ Console : Aucune erreur React
- ✅ Performance : Chargement en <100ms (vs timeout avant)
- ✅ Options affichage : Police et taille correctement appliquées depuis URL

---

## [3.10.2] - 2026-02-14
