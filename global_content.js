/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|               Global Content               |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet de rajouter des fonctionnalités qui sont valables sur toutes les pages de MEP

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - evaluations/elearning_resultats/

/*-------------------------------------------*/

// DEPRECATED ?
//Fonction pour retirer la bannière d'installation de l'application
function maskBanner(){

    const banner = document.querySelector('.install_app_banner');
    if (banner) {
      // Appliquer une transition pour faire glisser la bannière vers le bas
      banner.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      banner.style.transform = 'translateY(100%)';
      banner.style.opacity = '0';
      
      // Masquer complètement l'élément après la transition
      setTimeout(() => {
        banner.style.display = 'none';
      }, 500); // Correspond au temps de la transition
    }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    maskBanner();
  });
} else {
  maskBanner();
}

