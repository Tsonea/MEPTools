/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|                   Zoom                     |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet d'ajouter la possibilité de zoomer sur les images des qcms en cliquant dessus.

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - evaluations/evaluations/
// - elearning/create

/*-------------------------------------------*/

// Fonction pour ajouter un zoom sur les images
function addZoom() {
    // Sélection de toutes les images dans la div avec l'id "app"
    const appDiv = document.getElementById("app");
    if (!appDiv) return;

    const images = appDiv.querySelectorAll("img");

    images.forEach((img) => {
        // Éviter d'ajouter plusieurs fois l'événement
        if (img.dataset.zoomAdded === "true") return;

        // Marquer l'image comme ayant déjà le zoom
        img.dataset.zoomAdded = "true";

        // Ajout du style de curseur "zoom-in" à chaque image
        img.style.cursor = "zoom-in";

        // Ajout du comportement au clic
        img.addEventListener("click", () => {
            // Création de l'overlay
            const overlay = document.createElement("div");
            overlay.id = "zoomOverlay";
            overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.8); z-index: 999999; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s;";

            // Ajout de l'image en grand
            const largeImg = document.createElement("img");
            largeImg.src = img.src;
            largeImg.style.cssText = "width: 90%; max-width: 90vw; max-height: 90vh; object-fit: contain; background-color: white; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); animation: imageFadeIn 0.3s; cursor: zoom-out; z-index: 999999;";
            overlay.appendChild(largeImg);

            // Fermer la pop-up au clic sur l'overlay
            overlay.addEventListener("click", () => {
                overlay.style.animation = "fadeOut 0.3s";

                // Attendre que l'animation se termine avant de retirer l'overlay
                overlay.addEventListener("animationend", () => {
                    document.getElementById("zoomOverlay").remove();
                }, { once: true });  // L'option `{ once: true }` permet de supprimer le gestionnaire après une seule exécution
            });

            document.body.appendChild(overlay);
        });
    });

    // Ajout des styles pour les animations (une seule fois)
    if (!document.getElementById("zoomStyles")) {
        const style = document.createElement("style");
        style.id = "zoomStyles";
        style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes imageFadeIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
        `;
        document.head.appendChild(style);
    }
}


if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addZoom);
} else {
    addZoom();
}
