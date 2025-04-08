/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|            Download All Courses            |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet de télécharger tout les cours, documents disponibles sur la page d'une matière.

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - matiere.php

/*-------------------------------------------*/

// Fonction de téléchargement de fichier
function downloadFile(fileId) {

    const downloadUrl = `https://dijon.monespaceprepa.fr/scripts/document_telechargement.php?id=${fileId}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
}

// Télécharger les fichiers un par un avec un délai pour éviter les problèmes de serveur
async function downloadAllFiles() {

    // Sélectionner tous les éléments avec la classe "link-cours" sauf les vidéos
    const links = Array.from(document.querySelectorAll('a.link-cours:not([href*="video_affichage.php"])'));
  
    // Set increment value
    let i = 0;
  
    for (const link of links) {
  
        // Afficher l'état de progression dans le bouton id:MEPTools_downloadAll
        document.getElementById("MEPTools_downloadAll").innerText = `En cours... (${i + 1}/${links.length})`;
        
        const fileId = link.href.match(/id=(\d+)/)?.[1] || link.querySelector('.add_fav_document')?.getAttribute('id_document');
        if (fileId) {
  
            downloadFile(fileId);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Délai de 1 seconde entre chaque téléchargement
        }
  
        i++;
    }
  
    // Changer le texte du bouton après le dernier téléchargement pendant 1 seconde
    document.getElementById("MEPTools_downloadAll").innerText = "Téléchargement terminé !";
    setTimeout(() => {
        document.getElementById("MEPTools_downloadAll").innerText = "Télecharger les fichiers";
    }, 3000);
}

function countCoursParts(){
    //Si on est sur une page https://dijon.monespaceprepa.fr/matiere.php, on compte tout les liens avec la classe: link-cours de la première div id=box-livrets
  
    // Sélectionne la section contenant les fiches de cours
    const sectionCours = [...document.querySelectorAll('#box-livrets .card-header')]
    .find(header => header.textContent.trim() === "FICHES DE COURS")
    ?.parentElement?.querySelector('.card-body');
  
    // Si la section existe, compte les liens de cours
    if (sectionCours) {

      const card = document.querySelector("#MEPTools_buttons > div");
  
      const cours = sectionCours.querySelectorAll('.link-cours');
      console.log("Nombre de cours disponibles :", cours.length);
  
      const coursPartsText = document.createElement("p");
      coursPartsText.innerText = `Nombre de cours: ${cours.length}`;
      coursPartsText.style.margin = "0";
      coursPartsText.style.padding = "0";
      coursPartsText.style.fontSize = "1em";
      coursPartsText.style.color = "#8c185b";
      card.appendChild(coursPartsText);
    } else {
      console.log("Section 'FICHES DE COURS' non trouvée.");
    }
  
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        createButton({
            id: "MEPTools_downloadAll",
            text: "Télécharger les fichiers",
            action: downloadAllFiles
        });
    });
} else {
    createButton({
        id: "MEPTools_downloadAll",
        text: "Télécharger les fichiers",
        action: downloadAllFiles
    });
}