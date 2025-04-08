/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|                   AutoSet                  |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet de sauvegarder les paramètres de la page de création
// d'un elearning pour les saisir automatiquement à chaque création d'un elearning.

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - evaluations/elearning_generate

/*-------------------------------------------*/

// Fonction pour remplir automatiquement les champs de la page de création d'un elearning
function autoSetSession() {

    chrome.storage.sync.get([
        'annales', 
        'entrainements', 
        'evaluations', 
        'sliderValue', 
        'radio1', 
        'radio2', 
        'radio3', 
        'radio4', 
        'selectValue',
        'flash'
    ], function (result) {
        const defaultValue = result.defaultValue || 5; // Valeur par défaut si aucune n'est enregistrée
        const annales = result.annales || null;
        const entrainements = result.entrainements || null;
        const evaluations = result.evaluations || null;
        const sliderValue = result.sliderValue || 50; // Valeur par défaut si aucune n'est enregistrée
        const radio1 = result.radio1 || false;
        const radio2 = result.radio2 || false;
        const radio3 = result.radio3 || false;
        const radio4 = result.radio4 || false;
        const selectValue = result.selectValue || '';
        const flash = result.flash || false;
        
        // Mettre à jour le champ annales
        const annalesField = document.getElementById("type_classification1");
        if (annalesField) {
            annalesField.checked = annales;
        }

        // Mettre à jour le champ entrainements
        const entrainementsField = document.getElementById("type_classification2");
        if (entrainementsField) {
            entrainementsField.checked = entrainements;
        }

        // Mettre à jour le champ evaluations
        const evaluationsField = document.getElementById("type_classification3");
        if (evaluationsField) {
            evaluationsField.checked = evaluations;
        }

        // Mettre à jour le slider avec sliderValue
        const slider = document.getElementById("nbr_questions");
        if (slider) {
            slider.value = sliderValue;
        }

        // Mettre à jour les boutons radio
        const radioBtn1 = document.getElementById("parameters_pas_de_parametres");
        const radioBtn2 = document.getElementById("parameters_jamais_effectuees");
        const radioBtn3 = document.getElementById("parameters_non_ancrees");
        const radioBtn4 = document.getElementById("enable_unanswered_filter");

        if (radioBtn1) radioBtn1.checked = radio1;
        if (radioBtn2) radioBtn2.checked = radio2;
        if (radioBtn3) radioBtn3.checked = radio3;
        if (radioBtn4) radioBtn4.checked = radio4;

        console.log("Radio1 : " + radio1 + ", Radio2 : " + radio2 + ", Radio3 : " + radio3 + ", Radio4 : " + radio4);

        // Mettre à jour la valeur du select
        const selectField = document.getElementById("parameters_pas_repondu_depuis");
        if (selectField) {
            selectField.value = selectValue;
        }

        // Mettre à jour le champ flash pour toggle btn btn-xs btn-primary
        const flashField = document.querySelector(".toggle.btn.btn-xs.btn-light.off");
        if (flashField && flash) {
            flashField.click();
        }
    });
};

// Fonction pour sauvegarder les valeurs des champs de la page de création d'un elearning
function modifyAutoSet() {

    // Désactiver le bouton MEPTools_ModifyAutoSet
    const button = document.getElementById("MEPTools_ModifyAutoSet");
    button.disabled = true;
    button.style.backgroundColor = "#af638f"; // Couleur de fond
  
    // Récupérer les valeurs des champs
    const annales = document.getElementById("type_classification1").checked;
    const entrainements = document.getElementById("type_classification2").checked;
    const evaluations = document.getElementById("type_classification3").checked;
    const sliderValue = document.getElementById("nbr_questions").value;
    const radio1 = document.getElementById("parameters_pas_de_parametres").checked;
    const radio2 = document.getElementById("parameters_jamais_effectuees").checked;
    const radio3 = document.getElementById("parameters_non_ancrees").checked;
    const radio4 = document.getElementById("enable_unanswered_filter").checked;
    const selectValue = document.getElementById("parameters_pas_repondu_depuis").value;

    const flashField = document.querySelector(".toggle.btn.btn-xs");
    const flash = flashField.classList.contains('btn-primary');
  
    // Enregistrer les valeurs dans le stockage sync
    chrome.storage.sync.set({
        annales: annales,
        entrainements: entrainements,
        evaluations: evaluations,
        sliderValue: sliderValue,
        radio1: radio1,
        radio2: radio2,
        radio3: radio3,
        radio4: radio4,
        selectValue: selectValue,
        flash: flash
    });
  
    // Modifier le texte du bouton pour indiquer que les valeurs ont été mises à jour
    button.innerText = "Actualisé !";
  
    // Réactiver le bouton après 2 secondes
    setTimeout(() => {
        button.innerText = "Actualiser les champs";
        button.disabled = false;
        button.style.backgroundColor = "#8c185b"; // Couleur de fond
    }, 2000);

};

// Fonction pour ajouter du contenu dans la div MEPTools
function insertMEPToolsButtons(){

    createButton({
        id: "MEPTools_ModifyAutoSet",
        text: "Actualiser les champs",
        action: modifyAutoSet,
    });

    setTimeout(() => {
        autoSetSession();
    }, 1000); // Attendre 1 seconde avant d'actualiser les champs (pour s'assurer que les requêtes sont terminées)
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        insertMEPToolsButtons();
    });
} else {
    insertMEPToolsButtons();
}