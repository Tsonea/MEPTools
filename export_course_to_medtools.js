/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|         Export Course to MedTools          |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet d'ajouter la possibilité d'exporter un cours directement sur MEDTools.

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - matiere.php

/*-------------------------------------------*/

// Fonction pour extraire la date au format SQL
function extractDate(text) {
    const regex = /\b(\d{4})[- ]?(\d{2})[- ]?(\d{2})\b/;
    const match = text.match(regex);
    
    if (match) {
        // Formater la date en AAAA-MM-JJ
        const year = match[1];
        const month = match[2];
        const day = match[3];
        return `${year}-${month}-${day}`;
    }
    
    return ""; // Si aucune date n'est trouvée
}
  
// Fonction pour retrouver un chiffre seul dans le texte (numéro de partie d'un cours)
function extractSingleNumber(text) {
    const regex = /\b(\d)\b/;
    const match = text.match(regex);
    
    if (match) {
        return match[1];
    }
    
    return null; // Si aucun chiffre seul n'est trouvé
}

function extractAfterDateAndRemoveSingleNumber(text) {
    // Trouve une date au format AAAA-MM-JJ ou avec des séparateurs espaces
    const dateMatch = text.match(/\b\d{4}[- ]?\d{2}[- ]?\d{2}\b/);
    let cleanedText;
  
    if (dateMatch) {
        // Extrait la partie après la date
        const afterDate = text.slice(dateMatch.index + dateMatch[0].length).trim();
        cleanedText = afterDate;
    } else {
        // Si aucune date n'est trouvée, traite tout le texte
        cleanedText = text;
    }
  
    // Supprime les chiffres isolés
    cleanedText = cleanedText.replace(/\b\d\b/g, '').trim();
  
    // Formatage : Majuscule initiale, reste en minuscule
    return cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1).toLowerCase();
}
  

function formatName(text) {
    return text.replace(/\b(M|MME)\s+(\w+)/gi, (match, title, name) => {
        // Capitaliser le titre correctement
        const formattedTitle = title.toUpperCase() === "M" ? "M." : "Mme.";
        // Formater le nom proprement
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        return `${formattedTitle} ${formattedName}`;
    });
}

// Fonction pour ouvrir la pop-up
function openPopup(id_button) {

    // Vérifie si une pop-up est déjà ouverte
    if (document.querySelector('.overlay')) {
        return; // Si une pop-up est déjà ouverte, ne rien faire
    }
  
    // Crée le fond d'overlay (flou ou grisé) qui couvre toute la page
    const overlay = document.createElement('div');
    overlay.classList.add('overlay'); 
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '150vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '9999999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
  
    // Crée la pop-up elle-même
    const popup = document.createElement('div');
    popup.classList.add('modal', 'fade', 'd-block');  
    popup.style.zIndex = '10000000';
    popup.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    popup.style.transform = 'translateY(-50px)';
    popup.style.opacity = '0';
  
    // Récupération des informations du cours
    var subjectElement = document.querySelector('.top-title');
    var subject = subjectElement ? subjectElement.textContent : '';
    subject = subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
  
    // Récupération de l'ID du cours
    const coursLink = document.getElementById(id_button)?.closest('.box-fichiers')?.closest('a');
    const coursIdMatch = coursLink ? coursLink.getAttribute('href').match(/id=(\d+)/) : null;
    const coursId = coursIdMatch ? coursIdMatch[1] : '0';
    // Récupération du ou des noms des cours
  
    const coursElement = document.getElementById(id_button)?.closest('.box-fichiers')?.querySelector('.nom-cours');
    const coursesName = coursElement ? coursElement.textContent : '';
  
    // Extraction de la date et du numéro de partie du nom du cours
  
    let name_1 = coursesName.split('+')[0].trim();
    let name_2 = coursesName.split('+')[1]?.trim() || '';
  
    const date = extractDate(coursesName);
    const n_part_1 = extractSingleNumber(name_1);
    const n_part_2 = extractSingleNumber(name_2);
  
    console.log(name_1);
    name_1 = extractAfterDateAndRemoveSingleNumber(name_1).replace(/[()]/g, '');
    if (name_1.endsWith(' ')) {
        name_1 = name_1.slice(0, -1);
    }
    console.log(name_1);
  
    console.log(name_2);
    name_2 = extractAfterDateAndRemoveSingleNumber(name_2).replace(/[()]/g, '');
    if (name_2.endsWith(' ')) {
        name_2 = name_2.slice(0, -1);
    }
    console.log(name_2);
  
    // Sélection du professeur avec gestion d'erreur
    var professeur = "";
    try {
        const professeurExtract = document.getElementById(id_button).closest('.row.justify-content-center').previousElementSibling
        console.log(professeurExtract);
        professeur = professeurExtract ? formatName(professeurExtract.textContent) : '';
    } catch (error) {
        console.warn("Erreur lors de la récupération du professeur :", error);
        professeur = "";
    }
    
    // Contenu de la pop-up
    const popupContent = document.createElement('div');
    popupContent.classList.add('modal-dialog', 'modal-dialog-centered');
    popupContent.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ajouter ce cours sur MEDTools</h5>
          <button type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Veuillez remplir le formulaire pour ajouter ce cours sur MEDTools.</p>
          <form action="http://localhost/board.php" method="post" target="_blank">
            <div class="row">
              <div class="col-md-9">
                <div class="form-group">
                  <label for="course_name_1">Nom du cours</label>
                  <input type="text" class="form-control" id="course_name_1" name="course_name_1" value="${name_1}" placeholder="Nom du cours" required />
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <label for="n_part_1">Partie n°</label>
                  <input type="number" class="form-control" id="n_part_1" name="n_part_1" placeholder="P. n°" value="${n_part_1}" required />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-9">
                <div class="form-group">
                  <label for="course_name_2">Nom du cours 2 (Optionnel)</label>
                  <input type="text" class="form-control" id="course_name_2" name="course_name_2" value="${name_2}" placeholder="Nom du cours (optionnel)" />
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <label for="n_part_2">Partie n°</label>
                  <input type="number" class="form-control" id="n_part_2" name="n_part_2" placeholder="P. n°" value="${n_part_2}" />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="subject">Matière</label>
                  <input type="text" class="form-control" id="subject" name="subject" value="${subject}" placeholder="Matière" required />
                </div>
                <div class="form-group">
                  <label for="id_mep">Id MEP</label>
                  <input type="number" class="form-control" id="id_mep" name="id_mep" value="${coursId}" placeholder="Id MEP" required />
                </div>
                <div class="form-group">
                  <label for="difficulty">Difficulté</label>
                  <select class="form-control" id="difficulty" name="difficulty">
                      <option value="">Choisir...</option>
                      <option value="1">Facile</option>
                      <option value="2">Moyen</option>
                      <option value="3">Difficile</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="cm_date">Date du cours</label>
                  <input type="date" class="form-control" id="cm_date" name="cm_date" placeholder="Date du cours" value="${date}" required />
                </div>
                <div class="form-group">
                  <label for="teacher_name">Nom professeur</label>
                  <input type="text" class="form-control" id="teacher_name" name="teacher_name" placeholder="Nom professeur" value="${professeur}" required />
                </div>
                <div class="form-group">
                  <label for="learning_level">Niveau d'apprentissage</label>
                  <select class="form-control" id="learning_level" name="learning_level">
                    <option value="">Choisir...</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Ajouter</button>
          </form>
        </div>
      </div>
    `;
  
    // Ajoute le contenu à la pop-up
    popup.appendChild(popupContent);
  
    // Ajoute la pop-up et l'overlay à la page
    document.body.appendChild(overlay);
    overlay.appendChild(popup);
  
    // Transition d'ouverture
    setTimeout(() => {
        overlay.style.opacity = '1';
        popup.style.transform = 'translateY(0)';
        popup.style.opacity = '1';
    }, 10);
  
    // Fermeture au clic sur l'overlay
    overlay.addEventListener('click', function(event) {
        if (event.target === overlay || event.target.closest('.close')) {
            closePopup(overlay, popup);
        }
    });
}

// Fonction pour ajouter un bouton après l'icône de favoris
function addCourseButtons() {
    // Récupère tous les éléments contenant la classe 'add_fav_document'
    const elements = document.querySelectorAll('.add_fav_document');
    console.log("adding")
    var i = -1;
    elements.forEach(element => {
      
        i++;
        // Copie de l'élément <i> existant (icône +)
        const icon = element.cloneNode(true); // clone l'icône sans l'événement
        
        // Crée le bouton et insère l'icône dedans
        const button = document.createElement('button');
        button.id = `add_Course_button_${i}`; // Identifiant du bouton
        button.style.cssText = 'cursor: pointer; background-color: transparent; padding: 0; width: 35.4px; height: 32.8px; border: none; outline: none; display: flex; justify-content: center; align-items: center;';
    
        // Modifie le style de l'icône
        icon.style.cssText = 'margin: 0; padding: 5px; width: 35.4px; height: 32.8px;';
        icon.className = '';
        icon.title = 'Ajouter un cours'; // Texte au survol
        icon.zIndex = '9999';
        icon.classList.add('fa-solid', 'fa-plus');
    
        // Ajoute l'icône clonée dans le bouton
        button.appendChild(icon);
    
        // Ajoute un événement au clic du bouton
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Empêche la redirection du <a>
            openPopup(button.id); // Fonction pour ouvrir la pop-up
        });
    
        // Ajoute le bouton après l'icône existante
        element.parentNode.insertBefore(button, element.nextSibling);
    });
}

// Fonction pour fermer la pop-up avec transition
function closePopup(overlay, popup) {
    popup.style.transform = 'translateY(-50px)';
    popup.style.opacity = '0';
    overlay.style.opacity = '0';
  
    // Supprime la pop-up après la transition
    setTimeout(() => {
      overlay.remove();
    }, 300); // Délai pour laisser le temps à l'animation de se terminer
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        addCourseButtons();
    });
} else {
    addCourseButtons();
}
  
  