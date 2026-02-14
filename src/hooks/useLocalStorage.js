/**
 * Hook personnalisé pour gérer la persistance dans localStorage
 *
 * Fonctionnalités :
 * - Synchronisation automatique entre state React et localStorage
 * - Parsing/stringification JSON automatique
 * - Gestion des erreurs (quota dépassé, JSON invalide)
 * - Valeur initiale par défaut si clé inexistante
 *
 * @module hooks/useLocalStorage
 *
 * @example
 * // Stockage d'un booléen
 * const [hasSeenMessage, setHasSeenMessage] = useLocalStorage('lecture-flash-first-visit', false);
 *
 * @example
 * // Stockage d'un objet
 * const [fontSettings, setFontSettings] = useLocalStorage('lecture-flash-font-settings', {
 *   police: 'default',
 *   taille: 100
 * });
 */

import { useState, useEffect } from "react";

/**
 * Hook pour synchroniser un état React avec localStorage
 *
 * @param {string} cle - Clé localStorage (ex: 'lecture-flash-font-settings')
 * @param {*} valeurInitiale - Valeur par défaut si clé inexistante
 * @returns {[*, Function]} Tuple [valeur, setValeur] comme useState
 */
export default function useLocalStorage(cle, valeurInitiale) {
    // État local synchronisé avec localStorage
    const [valeurStockee, setValeurStockee] = useState(() => {
        try {
            // Récupérer depuis localStorage
            const item = window.localStorage.getItem(cle);

            // Parser et retourner si trouvé
            return item ? JSON.parse(item) : valeurInitiale;
        } catch (error) {
            // En cas d'erreur (JSON invalide, quota dépassé, etc.)
            console.error(`Erreur lecture localStorage (clé: ${cle}):`, error);
            return valeurInitiale;
        }
    });

    /**
     * Fonction setter qui met à jour à la fois le state et localStorage
     *
     * @param {*} valeur - Nouvelle valeur ou fonction de mise à jour
     */
    const setValeur = (valeur) => {
        try {
            // Permettre l'usage d'une fonction comme useState
            const valeurAStockee =
                valeur instanceof Function ? valeur(valeurStockee) : valeur;

            // Mettre à jour le state React
            setValeurStockee(valeurAStockee);

            // Mettre à jour localStorage
            window.localStorage.setItem(cle, JSON.stringify(valeurAStockee));
        } catch (error) {
            // Gestion des erreurs (quota dépassé, etc.)
            console.error(`Erreur écriture localStorage (clé: ${cle}):`, error);
        }
    };

    /**
     * Synchronisation avec localStorage si modifié depuis un autre onglet
     * (Optionnel, mais utile pour consistance multi-onglets)
     */
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === cle && e.newValue !== null) {
                try {
                    setValeurStockee(JSON.parse(e.newValue));
                } catch (error) {
                    console.error(
                        `Erreur sync localStorage (clé: ${cle}):`,
                        error
                    );
                }
            }
        };

        // Écouter les changements dans d'autres onglets
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [cle]);

    return [valeurStockee, setValeur];
}
