/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|                  Organizer                 |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet d'organiser les cours et documents en les triant par ordre alphabétique.
// Il permet également de regrouper les matières par catégories.

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - mes_matieres.php
// - plannings.php
// - mes_videos_matieres.php
// - matiere.php

/*-------------------------------------------*/

// Fonction pour récupérer la valeur de tri sauvegardée dans le stockage chrome
function getStorageSortValue(callback) {
    const switchType = getSwitchType();
    chrome.storage.sync.get([switchType], function(result) {
        console.log('État du switch récupéré :', switchType, result[switchType]);
        callback(result[switchType]);
    });
}

// Fonction pour récupérer le type de switch en fonction de l'URL
function getSwitchType() {

    if (window.location.href.includes("plannings.php")) {
        return "planningsSort";
    }
    else if (window.location.href.includes("mes_matieres.php")) {
        return "subjectsSort";
    }
    else if (window.location.href.includes("matiere.php")) {
        return "documentSort";
    }
    else { 
        return "videosSort";
    }
}

// Fonction pour charger l'état actuel du switch depuis le stockage chrome
function loadSwitchState() {

    //On récupère le type de switch pour connaitre le nom de la clé dans le stockage
    const switchType = getSwitchType();

    // Utiliser chrome.storage.sync pour récupérer l'état sauvegardé du switch
    chrome.storage.sync.get([switchType], function(result) {

      const switchState = result[switchType];
      const switchInput = document.getElementById('MEP_switch_button');
      
      // Vérifier si un état est trouvé, sinon on initialise sur false
      if (switchState !== undefined) {
        if (switchState == 1) {
            switchInput.checked = true;
        } else {
            switchInput.checked = false;
        }
        console.log('État du switch chargé :', switchType, switchState);
      } else {
        switchInput.checked = false; // Valeur par défaut si aucun état sauvegardé
        console.log('État du switch initialisé :', switchType, false);
      }
    });
  }
  
// Fonction pour sauvegarder l'état actuel du switch dans le stockage
function saveSwitchState() {

    const switchInput = document.getElementById('MEP_switch_button');

    //On récupère le type de switch pour connaitre le nom de la clé dans le stockage
    const switchType = getSwitchType();

    //Transformation de la valeur du switch en 1 ou 0
    let switchValue = 0;
    if (switchInput.checked) {
        switchValue = 1;
    }

    //On sauvegarde la valeur du switch dans le stockage chrome
    chrome.storage.sync.set({[switchType]: switchValue}, function() {
        console.log('État du switch sauvegardé :',switchType, switchInput.checked);
        location.reload();
    });
}

//---------------------------------------------------//

// Fonction pour trier les matières et les vidéos (les videos sont comme les matières)
function sort_subjects() {

    // Récupérer tout les items
    const items = Array.from(document.querySelectorAll('.col-sm-6.col-xl-4.extend-xl-4.mb-4'));
    
    // Selectionner la div contenant les matières
    const matiere_1 = document.getElementById("matiere");
    
    // Supprimer tous les éléments enfants de la div semestre_1
    while (matiere_1.firstChild) {
        matiere_1.removeChild(matiere_1.firstChild);
    }

    matiere_1.id = "semestre_2";

    // Récupérer l'élément juste avant la div semestre_1
    const hr_1 = matiere_1.previousElementSibling;
    const banner_1 = hr_1.previousElementSibling;
    if (getSwitchType() == "videosSort") {
        banner_1.querySelector('.top-title').innerHTML = '<i class="fa-solid fa-circle-play mr-2"></i> Deuxième semestre';
    } else {
        banner_1.querySelector('.top-title').innerHTML = '<i class="fa-solid fa-book-open-cover mr-2"></i> Deuxième semestre';
    }

    // Copier la banner et le hr après la div semestre_1
    const banner_2 = banner_1.cloneNode(true);
    if (getSwitchType() == "videosSort") {
        banner_2.querySelector('.top-title').innerHTML = '<i class="fa-solid fa-circle-play mr-2"></i> Spés et mineures';
    } else {
        banner_2.querySelector('.top-title').innerHTML = '<i class="fa-solid fa-book-open-cover mr-2"></i> Spés et mineures';
    }
    const hr_2 = hr_1.cloneNode(true);
    matiere_1.after(banner_2);
    banner_2.after(hr_2);

    // Copier la div matiere_1 après le hr_2
    const matiere_2 = matiere_1.cloneNode(true);
    matiere_2.id = "spes_mineures";
    hr_2.after(matiere_2);

    // Copier la banner et le hr après la div semestre_2
    const banner_3 = banner_2.cloneNode(true);
    if (getSwitchType() == "videosSort") {
        banner_3.querySelector('.top-title').innerHTML = '<i class="fa-solid fa-circle-play mr-2"></i> Divers';
    } else {
        banner_3.querySelector('.top-title').innerHTML = '<i class="fa-solid fa-book-open-cover mr-2"></i> Divers';
    }
    const hr_3 = hr_2.cloneNode(true);
    matiere_2.after(banner_3);
    banner_3.after(hr_3);

    // Copier la div matiere_1 après le hr_2
    const matiere_3 = matiere_2.cloneNode(true);
    matiere_3.id = "divers";
    hr_3.after(matiere_3);

    // Copier la banner et le hr après la div semestre_3
    const banner_4 = banner_3.cloneNode(true);
    if (getSwitchType() == "videosSort") {
        banner_4.querySelector('.top-title').innerHTML = '<i class="fa-solid fa-circle-play mr-2"></i> Premier semestre';
    } else {
        banner_4.querySelector('.top-title').innerHTML = '<i class="fa-solid fa-book-open-cover mr-2"></i> Premier semestre';
    }
    const hr_4 = hr_3.cloneNode(true);
    matiere_3.after(banner_4);
    banner_4.after(hr_4);

    // Copier la div matiere_1 après le hr_2
    const matiere_4 = matiere_3.cloneNode(true);
    matiere_4.id = "semestre_1";
    hr_4.after(matiere_4);

    // Trier les éléments en fonction du texte dans leur élément mat-title
    items.sort((a, b) => {
        const titleA = a.querySelector('.mat-title') ? a.querySelector('.mat-title').innerText.trim() : '';
        const titleB = b.querySelector('.mat-title') ? b.querySelector('.mat-title').innerText.trim() : '';
        return titleA.localeCompare(titleB);
      });

    // On insère les matières dans les bonnes divs
    items.forEach(item => {
        const title = item.querySelector('.mat-title').innerText;

        // Liste des matières qui vont dans les divs spécifiques (codé en dur...)
        const list_divers = [
            "REUNIONS",
            "METHODOLOGIE",
            "Méthodologie générale",
            "COLLES DIAGNOSTIC",
            "CONCOURS BLANC"
        ]
        const list_semestre_1 = [
            "CHIMIE",
            "MORPHO-PHYSIO I",
            "BIOCHIMIE",
            "CHIMIE/BIOCHIMIE",
            "BIOPHYSIQUE",
            "BIOCELLULAIRE",
            "CHIMIE",
            "PHYSIQUE-REMEDIATION",
            "MATHS-REMEDIATION",
        ]

        if (title.includes("SPE") || title.includes("MINEURE")) {
            matiere_2.appendChild(item);
        } else if (list_divers.includes(title)) {
            matiere_3.appendChild(item);
        } else if (list_semestre_1.includes(title)) {
            matiere_4.appendChild(item);
        } else {
            matiere_1.appendChild(item);
        }
    });

}

// Fonction pour trier les plannings et les documents (les documents sont comme les plannings)
function sort_plannings() {

    // Récupérer tous les éléments avec la classe cible
    const items = Array.from(document.querySelectorAll('.link-cours'));
  
    // Trier les éléments en fonction du texte dans leur élément mat-title
    items.sort((a, b) => {
        const titleA = a.querySelector('.nom-cours') ? a.querySelector('.nom-cours').innerText.trim() : '';
        const titleB = b.querySelector('.nom-cours') ? b.querySelector('.nom-cours').innerText.trim() : '';
        return titleA.localeCompare(titleB);
    });
  
    // Réorganiser les éléments
    const parent = items[0].parentElement;
    items.forEach(item => {
        parent.appendChild(item);
    });
}

// Fonction pour trier les documents de cours
function sort_documents() {
    // Récupérer tous les éléments avec les classes row et box-filter
    const items = Array.from(document.querySelectorAll('.row.box-filter'));

    // Pour chaque élément, on trie les documents contenus
    items.forEach(item => {
        const documents = Array.from(item.querySelectorAll('.link-cours'));

        console.log(`Sorting ${documents.length} documents`);

        // Tri des documents par leur titre
        documents.sort((a, b) => {
            const titleA = a.querySelector('.nom-cours') ? a.querySelector('.nom-cours').innerText.trim().toLowerCase() : '';
            const titleB = b.querySelector('.nom-cours') ? b.querySelector('.nom-cours').innerText.trim().toLowerCase() : '';
            return titleA.localeCompare(titleB);
        });

        console.log(documents);

        // Réorganiser les documents dans leur conteneur parent
        const parent = item.querySelector('.link-cours').parentElement;
        if (parent) {
            // Vider le parent pour réinsérer les documents triés
            parent.innerHTML = '';
            documents.forEach(document => {
                parent.appendChild(document);
            });
        }
    });
}

// Fonction pour insérer la div MEPTools dans la barre de navigation
function insertButtons(){

    if (getSwitchType() == "planningsSort") {
        var switchLabel = "Trier les plannings";
    }
    else if (getSwitchType() == "subjectsSort") {
        var switchLabel = "Trier les matières";
    }
    else if (getSwitchType() == "documentSort") {
        var switchLabel = "Trier les documents";
    }
    else {
        var switchLabel = "Trier les vidéos";
    }
    
    const switchDiv = document.createElement("div");
    switchDiv.innerHTML = `
        <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="MEP_switch_button">
            <label class="custom-control-label" for="MEP_switch_button">${switchLabel}</label>
        </div>
    `;

    const switchInput = switchDiv.querySelector("input");
    switchInput.addEventListener("change", saveSwitchState);
    loadSwitchState();

    //Récupération du titre de la MEPToolsDiv
    const MEPToolsDivTitle = document.getElementById("MEPTools_title");
    MEPToolsDivTitle.after(switchDiv);
    
};

// Fonction pour appeler les fonctions une fois que le DOM est chargé
function callFunctions() {
    insertButtons();
    getStorageSortValue(function(sortValue) {
        if (sortValue == 1) {
            console.log("Sort value is true");
            if (getSwitchType() == "planningsSort") {
                sort_plannings();
            }
            else if (getSwitchType() == "documentSort") {
                sort_documents();
            }
            else {
                sort_subjects();
            }
        }
    });
}

// Vérifier si le DOM est chargé avant d'appeler les fonctions
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        callFunctions();
    });
} else {
    callFunctions();
}
