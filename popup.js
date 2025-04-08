/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|                   Popup                    |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script gère la popup de l'extension MEPTools.

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:

/*-------------------------------------------*/

// Fonction pour ouvrir les onglets
function openTab(tabName) {
    // Récupérer tous les boutons d'onglet
    const tabLinks = document.querySelectorAll('.tablinks');
    // Récupérer tous les contenus des onglets
    const tabContents = document.querySelectorAll('.tabcontent');

}

// Par défaut, ouvrir l'onglet "Pomodoro"
document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('aproposTab').addEventListener('click', function () {
        openTab('Apropos');
    });
});
