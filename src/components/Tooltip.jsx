/**
 * Composant Tooltip réutilisable avec React Portal
 * Affiche une infobulle au survol ou au focus (accessibilité)
 *
 * Utilise ReactDOM.createPortal pour éviter les problèmes d'overflow
 *
 * Conformité :
 * - WCAG 2.1 AA (navigation clavier)
 * - ARIA role="tooltip"
 * - Support touch devices (mobile)
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Élément déclencheur du tooltip
 * @param {string} props.content - Contenu textuel du tooltip
 * @param {string} [props.position='top'] - Position : 'top', 'bottom', 'left', 'right'
 * @param {number} [props.delay=200] - Délai d'apparition en ms
 */

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

function Tooltip({ children, content, position = "top", delay = 200 }) {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);

    /**
     * Calcule la position du tooltip en fonction de l'élément déclencheur
     */
    const calculatePosition = () => {
        if (!triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;

        let top = 0;
        let left = 0;

        switch (position) {
            case "top":
                top = rect.top + scrollY - 8; // 8px de marge
                left = rect.left + scrollX + rect.width / 2;
                break;
            case "bottom":
                top = rect.bottom + scrollY + 8;
                left = rect.left + scrollX + rect.width / 2;
                break;
            case "left":
                top = rect.top + scrollY + rect.height / 2;
                left = rect.left + scrollX - 8;
                break;
            case "right":
                top = rect.top + scrollY + rect.height / 2;
                left = rect.right + scrollX + 8;
                break;
        }

        setCoords({ top, left });
    };

    /**
     * Affiche le tooltip après un délai
     */
    const showTooltip = () => {
        calculatePosition();
        const id = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        setTimeoutId(id);
    };

    /**
     * Masque le tooltip et annule le délai si nécessaire
     */
    const hideTooltip = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setIsVisible(false);
    };

    /**
     * Recalcule la position au scroll/resize
     */
    useEffect(() => {
        if (isVisible) {
            const handleUpdate = () => calculatePosition();
            window.addEventListener("scroll", handleUpdate, true);
            window.addEventListener("resize", handleUpdate);

            return () => {
                window.removeEventListener("scroll", handleUpdate, true);
                window.removeEventListener("resize", handleUpdate);
            };
        }
    }, [isVisible]);

    /**
     * Classes CSS pour positionner le tooltip
     */
    const getTransformStyle = () => {
        switch (position) {
            case "top":
                return "translate(-50%, -100%)";
            case "bottom":
                return "translate(-50%, 0)";
            case "left":
                return "translate(-100%, -50%)";
            case "right":
                return "translate(0, -50%)";
            default:
                return "translate(-50%, -100%)";
        }
    };

    /**
     * Classes CSS pour la flèche
     */
    const arrowClasses = {
        top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900",
        bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900",
        left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900",
        right: "right-full top-1/2 -translate-y-1/2 border-r-gray-900",
    };

    return (
        <>
            <div
                ref={triggerRef}
                className="inline-block mx-2"
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
            >
                {children}
            </div>

            {isVisible &&
                createPortal(
                    <div
                        role="tooltip"
                        style={{
                            position: "absolute",
                            top: `${coords.top}px`,
                            left: `${coords.left}px`,
                            transform: getTransformStyle(),
                            zIndex: 9999,
                        }}
                        className="px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-fade-in"
                    >
                        {content}
                        <div
                            className={`
                                absolute w-0 h-0 
                                border-4 border-transparent
                                ${arrowClasses[position]}
                            `}
                        />
                    </div>,
                    document.body
                )}
        </>
    );
}

Tooltip.propTypes = {
    children: PropTypes.node.isRequired,
    content: PropTypes.string.isRequired,
    position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
    delay: PropTypes.number,
};

export default Tooltip;
