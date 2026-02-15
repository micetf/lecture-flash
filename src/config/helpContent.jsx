/**
 * Contenu contextuel de l'aide selon le rôle et l'étape
 * @file src/config/helpContent.js
 */

/**
 * Contenu pour ENSEIGNANTS - Étape 1 : Saisir le texte
 */
export const ENSEIGNANT_ETAPE_1 = {
    title: "Étape 1 : Préparer le texte",
    sections: [
        {
            icon: "📝",
            title: "Trois façons d'ajouter un texte",
            content: (
                <>
                    <p className="mb-3">
                        Choisissez parmi <strong>3 options</strong> via les
                        onglets en haut de l'écran :
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                            <strong>Saisir</strong> : Tapez ou collez
                            directement votre texte
                        </li>
                        <li>
                            <strong>Fichier</strong> : Importez un fichier{" "}
                            <code className="bg-gray-100 px-1 py-0.5 rounded">
                                .txt
                            </code>{" "}
                            depuis votre ordinateur
                        </li>
                        <li>
                            <strong>CodiMD</strong> : Chargez un document
                            partagé depuis{" "}
                            <a
                                href="https://codimd.apps.education.fr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                codimd.apps.education.fr
                            </a>
                        </li>
                    </ul>
                </>
            ),
        },
        {
            icon: "💾",
            title: "Télécharger votre texte",
            content: (
                <>
                    <p className="mb-3">
                        Le bouton <strong>📥 Télécharger</strong> permet
                        d'enregistrer votre texte :
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                            <strong>Format .txt</strong> : Texte brut simple
                        </li>
                        <li>
                            <strong>Format .md</strong> : Markdown avec titre H1
                            (pour CodiMD)
                        </li>
                    </ul>
                    <p className="mt-3 text-sm">
                        Dans les deux cas, vous choisissez le titre qui servira
                        de nom de fichier.
                    </p>
                </>
            ),
        },
        {
            icon: "💡",
            title: "Astuce CodiMD",
            content: (
                <p>
                    Pour identifier facilement votre texte sur CodiMD, ajoutez
                    un <strong>titre en première ligne avec #</strong> (exemple
                    :{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">
                        # Lecture CE1 - Les animaux
                    </code>
                    ). Cette ligne servira de titre sur CodiMD mais ne sera{" "}
                    <strong>pas lue pendant l'exercice</strong> (filtrée
                    automatiquement).
                </p>
            ),
        },
    ],
};

/**
 * Contenu pour ENSEIGNANTS - Étape 2 : Régler la vitesse
 */
export const ENSEIGNANT_ETAPE_2 = {
    title: "Étape 2 : Régler la vitesse et l'affichage",
    sections: [
        {
            icon: "⚡",
            title: "Vitesses de lecture (MLM)",
            content: (
                <>
                    <p className="mb-3">
                        Sélectionnez une vitesse adaptée au niveau de lecture.
                        Les vitesses sont exprimées en{" "}
                        <strong>MLM (Mots Lus par Minute)</strong>.
                    </p>
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <p className="font-medium text-blue-900 mb-2">
                            🎯 Repères Eduscol (fluence)
                        </p>
                        <ul className="text-sm space-y-1 text-blue-800">
                            <li>
                                • <strong>30 MLM</strong> : CP - début CE1
                            </li>
                            <li>
                                • <strong>50 MLM</strong> : CE1
                            </li>
                            <li>
                                • <strong>70 MLM</strong> : CE2
                            </li>
                            <li>
                                • <strong>90 MLM</strong> : CM1-CM2
                            </li>
                            <li>
                                • <strong>110 MLM</strong> : CM2 et +
                            </li>
                        </ul>
                    </div>
                    <p className="text-sm">
                        💡 <strong>Vitesse personnalisée</strong> : Vous pouvez
                        également choisir une vitesse de 20 à 200 MLM avec le
                        curseur.
                    </p>
                </>
            ),
        },
        {
            icon: "🎨",
            title: "Options d'affichage",
            content: (
                <>
                    <p className="mb-3">
                        Pour adapter l'affichage au TBI/TNI ou aux élèves à
                        besoins particuliers, vous pouvez personnaliser :
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                            <strong>Police</strong> : Arial, Comic Sans MS,
                            OpenDyslexic
                        </li>
                        <li>
                            <strong>Taille</strong> : 100% à 200% (idéal pour
                            TBI/TNI)
                        </li>
                    </ul>
                </>
            ),
        },
        {
            icon: "🔗",
            title: "Partager un exercice (CodiMD uniquement)",
            content: (
                <>
                    <p className="mb-3">
                        Si votre texte provient de CodiMD, vous pouvez générer
                        un <strong>lien de partage</strong> pour vos élèves avec
                        2 modes :
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                            <strong>Vitesse suggérée</strong> : L'élève peut
                            modifier la vitesse et les options d'affichage
                        </li>
                        <li>
                            <strong>Vitesse imposée</strong> : La lecture
                            démarre automatiquement sans possibilité de
                            modification
                        </li>
                    </ul>
                </>
            ),
        },
    ],
};

/**
 * Contenu pour ENSEIGNANTS - Étape 3 : Lecture
 */
export const ENSEIGNANT_ETAPE_3 = {
    title: "Étape 3 : Lancer la lecture",
    sections: [
        {
            icon: "▶️",
            title: "Démarrage de la lecture",
            content: (
                <>
                    <p className="mb-3">
                        Cliquez sur le bouton{" "}
                        <strong>"▶️ Lancer la lecture"</strong> pour commencer.
                        Le texte s'affiche en grand et{" "}
                        <strong>s'efface progressivement</strong> mot par mot,
                        de gauche à droite, à la vitesse choisie.
                    </p>
                    <p className="mb-3">
                        Cette technique d'<strong>effacement progressif</strong>{" "}
                        oblige l'œil à suivre le rythme et développe
                        l'automatisation de la lecture (fluence).
                    </p>
                    <p className="text-sm">
                        📊 Une <strong>barre de progression</strong> en haut de
                        l'écran vous indique l'avancement de la lecture.
                    </p>
                </>
            ),
        },
        {
            icon: "🎮",
            title: "Contrôles pendant la lecture",
            content: (
                <>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                            <strong>⏸️ Pause</strong> : Met la lecture en pause
                        </li>
                        <li>
                            <strong>▶️ Reprendre</strong> : Reprend la lecture à
                            l'endroit de la pause
                        </li>
                        <li>
                            <strong>⏹️ Arrêter</strong> : Stoppe la lecture et
                            réaffiche le texte en entier
                        </li>
                        <li>
                            <strong>⛶ Plein écran</strong> : Affiche le texte en
                            mode plein écran (recommandé pour TBI/TNI)
                        </li>
                    </ul>
                </>
            ),
        },
        {
            icon: "🎓",
            title: "Astuce pédagogique",
            content: (
                <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-900">
                        <strong>Progression recommandée :</strong> Commencez par
                        une vitesse confortable où l'élève réussit à lire sans
                        stress. Puis augmentez progressivement sur plusieurs
                        séances. La répétition d'un même texte à différentes
                        vitesses est très efficace pour développer
                        l'automatisation de la lecture.
                    </p>
                </div>
            ),
        },
    ],
};

/**
 * Contenu pour ÉLÈVES - Vitesse imposée (locked=true)
 */
export const ELEVE_LOCKED = {
    title: "Comment utiliser Lecture Flash ?",
    sections: [
        {
            icon: "👋",
            title: "Bienvenue !",
            content: (
                <p>
                    Ton enseignant a préparé un texte pour t'entraîner à lire
                    plus vite. Suis les instructions ci-dessous.
                </p>
            ),
        },
        {
            icon: "▶️",
            title: "Lancer la lecture",
            content: (
                <>
                    <p className="mb-3">
                        Clique sur le bouton vert{" "}
                        <strong>"▶️ Lancer la lecture"</strong>. Le texte va
                        s'afficher en grand et s'effacer mot par mot.
                    </p>
                    <p className="text-sm">
                        💡 <strong>Ton objectif</strong> : Lire les mots avant
                        qu'ils disparaissent !
                    </p>
                </>
            ),
        },
        {
            icon: "🎮",
            title: "Contrôles",
            content: (
                <>
                    <p className="mb-2">Pendant la lecture, tu peux :</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                            <strong>⏸️ Mettre en pause</strong> si tu as besoin
                            d'une pause
                        </li>
                        <li>
                            <strong>▶️ Reprendre</strong> quand tu es prêt
                        </li>
                        <li>
                            <strong>⏹️ Arrêter</strong> pour relire le texte en
                            entier
                        </li>
                    </ul>
                </>
            ),
        },
        {
            icon: "💪",
            title: "Astuce",
            content: (
                <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-900">
                        Si c'est trop rapide, ne t'inquiète pas ! C'est normal
                        au début. Demande à ton enseignant de régler une vitesse
                        plus lente. Avec de l'entraînement, tu vas progresser !
                    </p>
                </div>
            ),
        },
    ],
};

/**
 * Contenu pour ÉLÈVES - Vitesse modifiable (locked=false)
 */
export const ELEVE_UNLOCKED = {
    title: "Comment utiliser Lecture Flash ?",
    sections: [
        {
            icon: "👋",
            title: "Bienvenue !",
            content: (
                <p>
                    Ton enseignant a préparé un texte pour t'entraîner à lire
                    plus vite. Tu peux choisir la vitesse qui te convient.
                </p>
            ),
        },
        {
            icon: "⚡",
            title: "Choisir ta vitesse",
            content: (
                <>
                    <p className="mb-3">
                        Clique sur une des cartes de vitesse ou utilise le
                        curseur pour choisir une vitesse adaptée à ton niveau.
                    </p>
                    <p className="text-sm">
                        💡 <strong>Conseil</strong> : Commence par une vitesse
                        confortable (30-50 MLM) et augmente petit à petit.
                    </p>
                </>
            ),
        },
        {
            icon: "🎨",
            title: "Personnaliser l'affichage",
            content: (
                <p>
                    Tu peux changer la <strong>police</strong> (type de lettres)
                    et la <strong>taille du texte</strong> si ça t'aide à mieux
                    lire.
                </p>
            ),
        },
        {
            icon: "▶️",
            title: "Lancer la lecture",
            content: (
                <>
                    <p className="mb-3">
                        Quand tu es prêt, clique sur{" "}
                        <strong>"▶️ Lancer la lecture"</strong>. Le texte va
                        s'effacer mot par mot à la vitesse que tu as choisie.
                    </p>
                    <p className="text-sm">
                        🎮 Tu peux mettre en <strong>⏸️ Pause</strong>,{" "}
                        <strong>▶️ Reprendre</strong> ou{" "}
                        <strong>⏹️ Arrêter</strong> quand tu veux.
                    </p>
                </>
            ),
        },
    ],
};

/**
 * Footer commun à tous les contextes
 */
export const FOOTER_CONTENT = (
    <div className="text-center text-sm text-gray-600">
        <p>
            Outil basé sur les travaux de <strong>@petitejulie89</strong> -
            Fluence : le texte qui s'efface
        </p>
    </div>
);
