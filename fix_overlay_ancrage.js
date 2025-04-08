/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|            Fix Overlay Ancrage             |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet de mettre le bouton "quitter la session" au même niveau que l'indicateur de temps pour éviter
// que l'overlay soit trop grand

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - evaluations/ancrage/session/

/*-------------------------------------------*/

function fixOverlayAncrage() {

    const cardHeader = document.querySelector('.card-header.bg-primary.text-white');
    const children = Array.from(cardHeader.children).filter(child => child.tagName === 'DIV');
    const firstDiv = children[0]; // 1ère div
    const secondDiv = children[1]; // 2ème div

    if (firstDiv && secondDiv) {
        firstDiv.appendChild(secondDiv);
    } else {
        console.log("Fix Overlay Ancrage: Erreur : 1ère ou 2ème div non trouvée");
    }
    
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        fixOverlayAncrage();
    });
} else {
    fixOverlayAncrage();
}