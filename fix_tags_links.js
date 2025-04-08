/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|               Fix tags links               |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet de corriger le bug/perte de fonctionnalité qui permet d'automatiquement ajouter
// les tags lors de la création d'un elearning à partir d'un cours.

// DEPRECATED: this script is not used anymore as the bug was fixed in MEP.

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - document_cours.php

/*-------------------------------------------*/

function fixTagsLinks() {

    // On récupère l'id des tags
    const link_cours = document.querySelector(".link-cours");

    let tags = [];

    //on récupère le tag principal et les tags secondaires dans le paramètre data-tags_primaires de link_cours
    if (link_cours) {
        const primaryTags = link_cours.getAttribute("data-tags_primaires");
        const secondaryTags = link_cours.getAttribute("data-tags_secondaires");

        if (primaryTags) {
            tags.push(primaryTags);
        }

        if (secondaryTags) {
            tags.push(secondaryTags);
        }
    }

    // On modifie le lien de création d'un elearning pour ajouter les tags
    const elearning_link = document.querySelector(".box-btn-e-learning-bis.reverse_colors a");

    if (elearning_link && tags.length > 0) {
        let url = new URL(elearning_link.href);
        let params = new URLSearchParams(url.search);

        let tagsArray = tags[0].split(",");
        console.log(tags);
    
        for (const tag of tagsArray) {
            params.append("tags[]", tag);
        }
    
        url.search = params.toString();
        console.log(url.toString());
        elearning_link.href = url.toString();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        fixTagsLinks();
    });
} else {
    fixTagsLinks();
}