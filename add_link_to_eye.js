/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|               Add Link to Eye              |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet de rajouter un lien direct sur l l'icone d'oeil d'un document pour ouvrir directement le document dans la visionneuse PDF de l'utilisateur (téléchargement)

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - matiere.php
// - document_cours.php

/*-------------------------------------------*/

function addLinkToEye(){

    // Sélectionner tous les éléments avec la classe 'fa-duotone fa-eye' ou aussi fa-duotone fa-eye-slash
    const eyeIcons = document.querySelectorAll('.fa-duotone.fa-eye, .fa-duotone.fa-eye-slash');

    eyeIcons.forEach(icon => {
        // Trouver le parent commun qui contient 'id_document'
        const parent = icon.closest('.box-fichiers');
        if (parent) {
            // Récupérer l'attribut id_document de l'icône de favoris
            const bookmarkIcon = parent.querySelector('.add_fav_document');
            const idDocument = bookmarkIcon?.getAttribute('id_document');

            if (idDocument) {
                // Créer un lien qui envoie vers la page souhaitée
                const link = `./scripts/document_telechargement.php?id=${idDocument}`;

                // Remplacer l'icône par un lien avec l'icône à l'intérieur
                const anchor = document.createElement('a');
                anchor.style.textDecoration = 'none';
                anchor.target = '_blank';
                anchor.href = link;
                anchor.appendChild(icon.cloneNode(true)); // Clone l'icône pour la déplacer
                icon.replaceWith(anchor); // Remplace l'ancienne icône
            }
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        addLinkToEye();
    });
} else {
    addLinkToEye();
}

  