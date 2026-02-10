#!/bin/bash

################################################################################
# Script de Nettoyage Architecture - Lecture Flash
# Version: 1.0.0
# Date: 2026-02-10
# 
# Ce script supprime les fichiers et dossiers obsolètes identifiés lors de l'audit
################################################################################

set -e  # Arrêt en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Script de Nettoyage Architecture - Lecture Flash             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

################################################################################
# 1. VÉRIFICATIONS PRÉALABLES
################################################################################

echo -e "${YELLOW}[1/5] Vérifications préalables...${NC}"

# Vérifier qu'on est bien à la racine du projet
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur : package.json non trouvé. Exécutez ce script depuis la racine du projet.${NC}"
    exit 1
fi

# Vérifier que Git est initialisé
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Erreur : Dépôt Git non trouvé. Initialisez Git avant de continuer.${NC}"
    exit 1
fi

# Vérifier l'état Git (pas de modifications non commitées)
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Attention : Vous avez des modifications non commitées.${NC}"
    read -p "Voulez-vous continuer quand même ? (o/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        echo -e "${RED}❌ Annulé par l'utilisateur${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Vérifications OK${NC}\n"

################################################################################
# 2. BACKUP
################################################################################

echo -e "${YELLOW}[2/5] Création du backup...${NC}"

# Créer une branche de backup si elle n'existe pas
BACKUP_BRANCH="backup-avant-nettoyage-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH" 2>/dev/null || true
echo -e "${GREEN}✓ Branche de backup créée : $BACKUP_BRANCH${NC}\n"

################################################################################
# 3. SUPPRESSIONS DES FICHIERS OBSOLÈTES
################################################################################

echo -e "${YELLOW}[3/5] Suppression des fichiers obsolètes...${NC}"

declare -a FILES_TO_DELETE=(
    # Composants remplacés par TextInputManager
    "src/components/CloudUrlInput.jsx"
    "src/components/ShareCloudLink.jsx"
    
    # Composants Flash obsolètes
    "src/components/LectureFlash/Flash/index.jsx"
    "src/components/LectureFlash/Flash/FlashAmeliore.jsx"
    
    # CSS inutile (Tailwind utilisé)
    "src/components/App.css"
)

for file in "${FILES_TO_DELETE[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo -e "${GREEN}✓ Supprimé : $file${NC}"
    else
        echo -e "${YELLOW}⚠ Déjà absent : $file${NC}"
    fi
done

echo ""

################################################################################
# 4. SUPPRESSIONS DES DOSSIERS OBSOLÈTES
################################################################################

echo -e "${YELLOW}[4/5] Suppression des dossiers obsolètes...${NC}"

declare -a DIRS_TO_DELETE=(
    # Dossiers obsolètes
    "src/components/LectureFlash/Input/ImportExport"
    "src/components/LectureFlash/Input/Choix/Type"
    "src/components/ReadingSpeedSelector"
    "src/components/Svg"
)

for dir in "${DIRS_TO_DELETE[@]}"; do
    if [ -d "$dir" ]; then
        rm -rf "$dir"
        echo -e "${GREEN}✓ Supprimé : $dir/${NC}"
    else
        echo -e "${YELLOW}⚠ Déjà absent : $dir/${NC}"
    fi
done

echo ""

################################################################################
# 5. NETTOYAGE DES DOSSIERS VIDES
################################################################################

echo -e "${YELLOW}[5/5] Nettoyage des dossiers vides...${NC}"

# Supprimer les dossiers vides récursivement
find src -type d -empty -delete 2>/dev/null && echo -e "${GREEN}✓ Dossiers vides supprimés${NC}" || echo -e "${YELLOW}⚠ Aucun dossier vide${NC}"

echo ""

################################################################################
# 6. RAPPORT FINAL
################################################################################

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Nettoyage Terminé !                                           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Fichiers supprimés :${NC}"
echo -e "   - CloudUrlInput.jsx"
echo -e "   - ShareCloudLink.jsx"
echo -e "   - Flash/index.jsx"
echo -e "   - Flash/FlashAmeliore.jsx"
echo -e "   - App.css"
echo ""
echo -e "${GREEN}✅ Dossiers supprimés :${NC}"
echo -e "   - Input/ImportExport/"
echo -e "   - Input/Choix/Type/"
echo -e "   - ReadingSpeedSelector/"
echo -e "   - Svg/"
echo ""
echo -e "${YELLOW}📋 ÉTAPES SUIVANTES :${NC}"
echo ""
echo -e "1. ${BLUE}Vérifier que l'application démarre :${NC}"
echo -e "   ${GREEN}pnpm dev${NC}"
echo ""
echo -e "2. ${BLUE}Tester les fonctionnalités critiques :${NC}"
echo -e "   - Mode SAISIE (TextInputManager avec 3 onglets)"
echo -e "   - Import/Export fichiers"
echo -e "   - Chargement cloud"
echo -e "   - Sélection vitesse"
echo -e "   - Mode LECTURE (FlashAmelioreTest)"
echo ""
echo -e "3. ${BLUE}Si tout fonctionne, commit les changements :${NC}"
echo -e "   ${GREEN}git add .${NC}"
echo -e "   ${GREEN}git commit -m \"♻️ Refactor: Nettoyage architecture - Suppression composants obsolètes\"${NC}"
echo ""
echo -e "4. ${BLUE}En cas de problème, restaurer depuis le backup :${NC}"
echo -e "   ${GREEN}git checkout $BACKUP_BRANCH${NC}"
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"