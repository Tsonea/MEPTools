/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|             Fix View Elearning             |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet de réajuster certaines élément de la page de résultats de l'elearning
// pour éviter d'avoir un scroll vertical sur la page entière en plus du scroll vertical des qcms

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - evaluations/elearning_resultats/

/*-------------------------------------------*/

function fixViewElearning() {

    // On retire le footer inutile qui prend de la place
    const footerToRemove = document.querySelector('.main-footer');
    if (footerToRemove) {
        footerToRemove.remove();
    } else {
        console.log("Fix View Elearning: Erreur : footer non trouvé");
    }

    // On place les informations de la session à coté du h1
    const h3divm = document.createElement('div');
    h3divm.classList.add('h3divm');
    h3divm.style.display = 'flex';

    //Selectionner les 2 premiers H3 de la div id=app
    const appDiv = document.querySelector('#app');
    const h3Elements = appDiv.querySelectorAll('h3');
    
    const firstH3 = h3Elements[0];
    if (firstH3) {
        firstH3.id = "h3_1";
        firstH3.innerHTML = " | " + firstH3.innerHTML
        h3divm.appendChild(firstH3);
    } else {
        console.log("Fix View Elearning: Erreur : 1er H3 non trouvé");
    }

    const secondH3 = h3Elements[1];
    if (secondH3) {
        secondH3.id = "h3_2";
        secondH3.innerHTML = " | " + secondH3.innerHTML;
        h3divm.appendChild(secondH3);
    }
    else {
        firstH3.id = "h3_2";
    }
    
    //Selectionner le h1 de la page
    const h1Element = document.querySelector('h1');
    h1Element.style.display = 'flex';

    // Mettre la h3divm dans le h1
    h1Element.appendChild(h3divm);

    // Supprimer le 1er hr
    const firstHr = appDiv.querySelector("hr");
    if (firstHr) {
        firstHr.remove();
    } else {
        console.log("Fix View Elearning: Erreur : hr non trouvé");
    }

    //Supprimer le 2e class=divider du document
    const dividers = document.querySelectorAll('.divider');
    if (dividers.length > 1) {
        dividers[1].remove();
    } else {
        console.log("Fix View Elearning: Erreur : 2ème divider non trouvé");
    }
    
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        fixViewElearning();
    });
} else {
    fixViewElearning();
}