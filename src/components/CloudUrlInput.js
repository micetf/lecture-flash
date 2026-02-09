import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * Composant pour saisir et valider une URL de fichier cloud
 * @param {Object} props - Props du composant
 * @param {Function} props.onUrlSubmit - Callback appelé avec l'URL valide
 * @param {boolean} [props.loading] - État de chargement
 * @param {string} [props.error] - Message d'erreur
 */
export function CloudUrlInput({ onUrlSubmit, loading = false, error = null }) {
    const [url, setUrl] = useState("");
    const [showHelp, setShowHelp] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onUrlSubmit(url.trim());
        }
    };

    const exemples = [
        {
            service: "Dropbox",
            exemple: "https://www.dropbox.com/s/abc123/mon-texte.md?dl=0",
            icon: "📦",
        },
        {
            service: "Apps.education.fr (Nuage)",
            exemple: "https://nuage03.apps.education.fr/s/AbCd1234",
            icon: "☁️",
        },
        {
            service: "Nextcloud",
            exemple: "https://mon-nextcloud.fr/s/xyz789",
            icon: "☁️",
        },
        {
            service: "Google Drive",
            exemple: "https://drive.google.com/file/d/1a2b3c4d5e6f/view",
            icon: "📁",
        },
    ];

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">
                        Charger un texte depuis le cloud
                    </h5>
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="btn btn-sm btn-outline-primary"
                        type="button"
                    >
                        {showHelp ? "Masquer l'aide" : "Aide"}
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="cloud-url" className="form-label">
                            URL de votre fichier Markdown (.md)
                        </label>
                        <div className="input-group">
                            <input
                                id="cloud-url"
                                type="url"
                                className={`form-control ${
                                    error ? "is-invalid" : ""
                                }`}
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://www.dropbox.com/s/..."
                                disabled={loading}
                            />
                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={loading || !url.trim()}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Chargement...
                                    </>
                                ) : (
                                    "Charger"
                                )}
                            </button>
                        </div>
                        {!error && (
                            <div className="form-text">
                                Collez le lien de partage de votre fichier .md
                                depuis Dropbox, Nextcloud, Nuage...
                            </div>
                        )}
                        {error && (
                            <div className="invalid-feedback d-block">
                                <strong>Erreur :</strong> {error}
                            </div>
                        )}
                    </div>
                </form>

                {showHelp && (
                    <div className="alert alert-info mt-3">
                        <h6 className="alert-heading">
                            Comment obtenir le lien de partage ?
                        </h6>
                        <hr />
                        {exemples.map((item, index) => (
                            <div key={index} className="mb-3">
                                <strong>
                                    {item.icon} {item.service}
                                </strong>
                                <br />
                                <code className="small text-muted">
                                    {item.exemple}
                                </code>
                            </div>
                        ))}
                        <hr />
                        <h6>📝 Étapes :</h6>
                        <ol className="small mb-0">
                            <li>
                                Créez un fichier texte avec l'extension{" "}
                                <code>.md</code>
                            </li>
                            <li>
                                Déposez-le dans votre espace cloud (Dropbox,
                                Nuage, Nextcloud...)
                            </li>
                            <li>Créez un lien de partage public</li>
                            <li>Copiez ce lien et collez-le ci-dessus</li>
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
}

CloudUrlInput.propTypes = {
    onUrlSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
};
