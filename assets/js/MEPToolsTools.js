/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|               MEPToolsTools                |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script contient les fonctions usuelles de MEPTools: création de l'élément MEPTools 
// dans la barre de navigation, création de boutons, etc.

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - beaucoup de pages, cf. manifest

/*-------------------------------------------*/

//Fonction pour insérer la div MEPTools
function insertMEPToolsDiv() {

    //Récupération de la barre de navigation
    const navList = document.querySelector(".nav.flex-column.w-100.mt-sm-4.mt-md-4.mt-lg-4.mt-xl-0");

    //Création de la div MEPTools
    const MEPToolsDiv = document.createElement("div");
    MEPToolsDiv.id = "MEPTools";
    MEPToolsDiv.style.cssText = "background-color: #FFFFFF; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.35); display: flex; flex-direction: column; gap: 10px; margin-top: 10px; opacity: 0;";
    MEPToolsDiv.style.transition = "opacity 0.5s"; // Transition douce

    //Ajout de la div MEPTools à la barre de navigation
    navList.appendChild(MEPToolsDiv);

    //Ajout du titre de la div MEPTools
    const title = document.createElement("h4");
    title.innerText = "MEPTools";
    title.id = "MEPTools_title";
    title.style.cssText = "margin: 0; padding: 0; text-align: center; color: #8c185b;";
    MEPToolsDiv.appendChild(title);

    // Ajout d'un petit texte de version après que les boutons soient ajoutés
    const versionText = document.createElement("p");
    versionText.innerText = "Version 1.0.1";
    versionText.style.cssText = "text-align: center; font-style: italic; margin: 0; padding: 0; font-size: 0.8em; color: #8c185b;";
    MEPToolsDiv.appendChild(versionText);

    // Faire apparaître la div MEPTools_button
    setTimeout(() => {
        MEPToolsDiv.style.opacity = "1"; // Rendre le bouton visible
    }, 10); // Petit délai pour que la transition soit visible
}

// Fonction pour ajouter un bouton dans la div MEPTools
function createButton({
    id, 
    font_size="13px", 
    disabled=false, 
    text="default_text", 
    action=null, 
    transition = "opacity 0.5s"
}) {

    let button = document.createElement("button");

    button.id = id;
    button.style.height = "43px";
    button.style.width = "100%";
    button.style.fontSize = font_size; // Taille de la police

    button.innerHTML = text; // Texte du bouton
    button.classList.add("animated-button", "btn", "btn-block");
    button.style.backgroundColor = "#8c185b"; // Couleur de fond
    button.style.color = "#FFFFFF"; // Couleur du texte
    button.style.marginBottom = "0.1em";
    button.style.marginTop = "0.1em";
    button.style.transition = transition  // Transition douce

    if (disabled){
        button.disabled = true; // Désactiver le bouton
        button.style.backgroundColor = "#af638f"; // Couleur de fond
        button.style.cursor = "not-allowed"; // Curseur interdit
    }

    // ajout du bouton à la div MEPTools_button
    const MEPToolsDivTitle = document.getElementById("MEPTools_title");
    MEPToolsDivTitle.after(button);

    // Ajouter un événement de clic au bouton
    button.addEventListener("click", () => {
        action();
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        insertMEPToolsDiv();
    });
} else {
    insertMEPToolsDiv();
}