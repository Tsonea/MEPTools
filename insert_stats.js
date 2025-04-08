/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|                Insert Stats                |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet d'ajouter les stats des tags
// reliés au cours et de permettre 
// l'ajout de tags pour ce cours si besoin.

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - document_cours.php

/*-------------------------------------------*/

// Fonction pour ajouter un tag à un cours
function addTag(tag, id_course, listType) {
    // Récupérer les tags existants depuis le stockage local
    chrome.storage.local.get([listType], function (result) {
        let tags = result[listType] || {}; // Charger ou initialiser la structure de stockage
        tags[id_course] = tags[id_course] || []; // Initialiser un tableau pour le cours si inexistant

        // Vérifier si le tag n'existe pas déjà pour éviter les doublons
        if (!tags[id_course].includes(tag)) {
            tags[id_course].push(tag); // Ajouter le nouveau tag au tableau

            // Sauvegarder les tags mis à jour dans le stockage
            chrome.storage.local.set({ [listType]: tags }, function () {
                console.log(`Tag "${tag}" ajouté pour le cours "${id_course}".`);
                console.log("Structure actuelle des tags :", tags);
            });
        } else {
            console.log(`Tag "${tag}" existe déjà pour le cours "${id_course}".`);
        }
    });

    // Actualiser la page pour afficher les stats du tag ajouté
    location.reload();
}

// Fonction pour supprimer un tag d'un cours
function removeTag(tag, id_course, listType) {
    // Récupérer les tags existants depuis le stockage local
    chrome.storage.local.get([listType], function (result) {

        let tags = result[listType] || {}; // Charger ou initialiser la structure de stockage
        tags[id_course] = tags[id_course] || []; // Initialiser un tableau pour le cours si inexistant

        // Vérifier si le tag existe pour éviter les erreurs
        if (tags[id_course].includes(tag)) {
            // Supprimer le tag du tableau
            tags[id_course] = tags[id_course].filter(item => item !== tag);

            // Sauvegarder les tags mis à jour dans le stockage
            chrome.storage.local.set({ [listType]: tags }, function () {
                console.log(`Tag "${tag}" supprimé pour le cours "${id_course}".`);
                console.log("Structure actuelle des tags :", tags);
            });
        } else {
            console.log(`Tag "${tag}" n'existe pas pour le cours "${id_course}".`);
        }
    });
}

// Fonction pour récupérer les tags stockés pour un cours
function getTags(id_course, listType) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([listType], function (result) {
            let tags = result[listType] || {}; // Charger ou initialiser la structure de stockage
            resolve(tags[id_course] || []); // Retourner un tableau vide si aucun tag n'existe pour ce cours
        });
    });
}

// Fonction pour faire une requête pour récupérer les stats des tags
// Pour l'instant récupère la page entière... A voir si on peut récupérer que les stats du tag avec l'API de MEP
async function requestsStats(id_matiere) {
    try {
        const response = await fetch(`https://dijon.monespaceprepa.fr/evaluations/statistiques/${id_matiere}`);
        const data = await response.text();

        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(data, "text/html");

        return htmlDocument;
    } catch (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
}

// Fonction pour déterminer si deux chaînes de caractères ont une sous-chaîne commune
function checkCorrespondance(string1, string2, length = 9) {
    // Convertir les chaînes en majuscules pour une comparaison insensible à la casse
    string1 = string1.toUpperCase();
    string2 = string2.toUpperCase();

    // Vérifier tous les sous-chaînes de 'string1' de longueur 'length'
    for (let i = 0; i <= string1.length - length; i++) {
        const substring = string1.substring(i, i + length);

        // Vérifier si 'substring' est incluse dans 'string2'
        if (string2.includes(substring)) {
            return true;
        }
    }

    // Aucun match trouvé
    return false;
}

// Fonction pour extraire les stats
async function extractStats(DOM_request) {
    // On récupère le nom du cours
    const nom_cours = document.querySelector(".top-title")?.innerText;

    // On récupère les tags et les convertit en un tableau
    let tags = Array.from(DOM_request.querySelectorAll(".onglet"));

    // On récupère l'id du cours
    const url = new URL(window.location.href);
    const id_course = url.searchParams.get("id");

    // Récupération des tags ajoutés pour ce cours
    let added_tags = [];
    const tag = await getTags(id_course, "added_tags");
    if (tag) {
        added_tags.push(tag);
    }

    // Récupération des tags supprimés pour ce cours
    let removed_tags = [];
    const tag2 = await getTags(id_course, "removed_tags");
    if (tag2) {
        removed_tags.push(tag2);
    }

    let verified_tags = [];

    // Pour l'instant on vérifie en comparant le nom du cours avec les tags car pas d'accès aux ids des tags sur la page des stats
    // Vérification des correspondances
    tags.forEach(tag => {

        if ((checkCorrespondance(tag.innerText, nom_cours) || added_tags[0].includes(tag.innerText)) && !removed_tags[0].includes(tag.innerText)) {
            verified_tags.push(tag);
        }
    });

    // Ajout des informations au DOM pour chaque tag vérifié
    verified_tags.forEach(tag => {

        tag.style.display = "flex";
        tag.style.alignItems = "center";

        // On sélectionne le parent de l'élément
        const title_section = tag.parentElement;
        title_section.style.display = "flex";
        title_section.style.justifyContent = "space-between";

        // On ajoute un bouton en forme de poubelle pour supprimer le tag
        const button = document.createElement("button");
        button.classList.add("btn", "fa-trash", "fa");
        button.style.marginLeft = "0";
        button.style.color = "white";
        button.addEventListener("click", () => {
            const url = new URL(window.location.href);
            const id_course = url.searchParams.get("id");
            removeTag(tag.innerHTML.replace('<button class="btn fa-trash fa" style="margin-left: 0px; color: white;"></button>', ''), id_course, "added_tags");
            addTag(tag.innerHTML.replace('<button class="btn fa-trash fa" style="margin-left: 0px; color: white;"></button>', ''), id_course, "removed_tags");
        });
        tag.appendChild(button);

        // On sélectionne la row juste après le titre
        const row = title_section.nextElementSibling;

        const card_header = document.createElement("div");
        card_header.classList.add("card-header");

        const card_body = document.createElement("div");
        card_body.classList.add("card-body", "mb-4");

        // Ajout du label MEPTools dans le header
        const label = document.createElement("div");
        label.classList.add("onglet");
        label.style.fontSize = "1rem";
        label.style.fontStyle = "italic";
        label.innerText = "MEPTools";
        title_section.appendChild(label);

        card_header.appendChild(title_section);
        card_body.appendChild(row);

        // On récupère la div qui contient les stats
        const statsDiv = document.querySelector("#stats-tags");

        // On insère les stats dans la div
        statsDiv.appendChild(card_header);
        statsDiv.appendChild(card_body);

    });

    insertAddTagSelect(tags, verified_tags);
}

// Fonction pour insérer le select d'ajout de tag
function insertAddTagSelect(listTags, verified_tags) {

    // On récupère la div qui contient les stats
    const statsDiv = document.querySelector("#stats-tags");

    // On créer une div pour l'ajout de tags
    const addTagDiv = document.createElement("div");

    // on créer une div card-header
    const card_header = document.createElement("div");
    card_header.classList.add("card-header");
    card_header.style.display = "flex";
    card_header.style.justifyContent = "space-between";

    // On ajoute un titre
    const title = document.createElement("div");
    title.classList.add("onglet");
    
    title.innerText = "Ajouter un tag à visualiser automatiquement";
    card_header.appendChild(title);

    // Ajout du label MEPTools dans le header
    const label = document.createElement("div");
    label.classList.add("onglet");
    label.style.fontSize = "1rem";
    label.style.fontStyle = "italic";
    label.innerText = "MEPTools";
    card_header.appendChild(label);

    // On ajoute le header à la div
    addTagDiv.appendChild(card_header);

    // On ajoute une div card-body
    const card_body = document.createElement("div");
    card_body.classList.add("card-body");

    // On créer le select
    const select = document.createElement("select");
    select.classList.add("form-select", "mb-3", 'form-control');
    select.id = "select-tags";
    select.innerHTML = "<option selected>Choisir un tag...</option>";
    // On ajoute les options
    listTags.forEach(tag => {

        if (!verified_tags.includes(tag)) {
            const option = document.createElement("option");
            option.value = tag.innerText;
            option.innerText = tag.innerText;
            select.appendChild(option);
        }
    });
    card_body.appendChild(select);

    // On créer le bouton
    const button = document.createElement("button");
    button.classList.add("btn", "btn-primary");
    button.innerText = "Ajouter";
    button.addEventListener("click", () => {
        const select = document.getElementById("select-tags");
        const tag = select.value;
        const url = new URL(window.location.href);
        const id_course = url.searchParams.get("id");
        removeTag(tag, id_course, "removed_tags");
        addTag(tag, id_course, "added_tags");
    });
    card_body.appendChild(button);

    // On ajoute le body à la div
    addTagDiv.appendChild(card_body);

    // On ajoute la div à la div des stats
    statsDiv.appendChild(addTagDiv);

}

// Fonction pour créer la div qui contiendra les stats et les boutons associés
function insertStatsDiv() {
    
    // On créer la div qui contiendra les stats
    const tag_div = document.createElement("div");
    tag_div.id = "stats-tags";
    tag_div.classList.add("col-xl-12", "mb-4", "order-3");

    // On insère la div après la div avec l'id 'box-btn-e-learning'
    const referenceDiv = document.getElementById("box-btn-e-learning");
    if (referenceDiv) {
        referenceDiv.insertAdjacentElement('afterend', tag_div);
    } else {
        console.error("La div de référence avec l'id 'box-btn-e-learning' n'a pas été trouvée.");
    }

}

// Fonction principale
async function callFunctions() {

    insertStatsDiv();

    // On récupère l'id de la matière à partir du bouton de création d'un elearning
    const elearning_link = document.querySelector(".box-btn-e-learning-bis.reverse_colors a");
    const urlParams = new URLSearchParams(elearning_link.search);
    const id_matiere = urlParams.get('matieres[]');

    if (!id_matiere) {
        console.error("ID de matière non trouvé.");
        return;
    }

    // On fait une requête pour récupérer les stats
    const DOM_request = await requestsStats(id_matiere);

    // On extrait les stats
    extractStats(DOM_request);

}

// Déclenchement du code au chargement de la page
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        callFunctions();
    });
} else {
    callFunctions();
}
